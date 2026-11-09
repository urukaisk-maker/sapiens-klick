from typing import Optional, List
from datetime import datetime, date
from collections import Counter

from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy import func, text
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import User, Decision, CardUnlock, UserProfile, Favorite
from scenarios import SCENARIOS
from cards import CARDS, LEGENDARY_RULES
from narratives import build_insight
from variants import VARIANTS
from achievements import compute_achievements
from leagues import compute_league
from stats import stats_router


app = FastAPI(title="Urukais Klick API")
app.include_router(stats_router)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(64)"))


# ---------- Helper: cartas legendarias ----------
def _check_legendary_cards(name: str, db: Session):
    """Evalúa las reglas de cartas legendarias y desbloquea las que apliquen."""
    users = db.query(User).filter(User.name == name).all()
    if not users:
        return
    user_ids = [u.id for u in users]

    all_decisions = (db.query(Decision.category, Decision.choice, User.role)
                     .join(User, User.id == Decision.user_id)
                     .filter(Decision.user_id.in_(user_ids)).all())

    cats = [d[0] for d in all_decisions]
    choices_by_role = {}
    for cat, choice, role in all_decisions:
        choices_by_role.setdefault(role, set()).add(choice)

    aggressive_total = sum(1 for c in cats if c in ("agresivo", "traicion", "ambicion"))
    ambicion_total = sum(1 for c in cats if c == "ambicion")

    stats = {
        "aggressive_total": aggressive_total,
        "ambicion_total": ambicion_total,
        "distinct_roles": len({u.role for u in users}),
        "chaman_played": 1 if "chaman" in choices_by_role else 0,
        "nigromante_played": 1 if "nigromante" in choices_by_role else 0,
    }

    unlocked = set()
    for c in db.query(CardUnlock).filter(CardUnlock.user_id.in_(user_ids)).all():
        unlocked.add(c.card_key)

    for key, rule in LEGENDARY_RULES.items():
        if key in unlocked:
            continue
        try:
            if rule["check"](stats):
                db.add(CardUnlock(user_id=users[0].id, card_key=key))
        except Exception:
            continue
    db.commit()


# ---------- Schemas ----------
class SessionResponse(BaseModel):
    user_id: int
    role: str


class DecisionRequest(BaseModel):
    user_id: int
    step: int
    choice: str
    category: str


class ProfileResponse(BaseModel):
    user_id: int
    role: str
    total_decisions: int
    categories: dict
    dominant: str
    card_unlocked: Optional[str] = None
    insight: Optional[str] = None


class HistoryRequest(BaseModel):
    user_ids: List[int]


class CardsBatchRequest(BaseModel):
    user_ids: List[int]


class BioUpdate(BaseModel):
    bio: str


# ---------- Base ----------
# ---------- Desafío diario ----------
def _get_daily_role_key() -> str:
    """Determina el rol del día de forma determinista (igual para todos)."""
    today = date.today().isoformat()
    keys = list(SCENARIOS.keys())
    h = sum(ord(c) * (i + 1) for i, c in enumerate(today))
    return keys[h % len(keys)]


def _get_daily_decision_threshold() -> int:
    """Número de decisiones necesarias para completar el desafío (5 normalmente)."""
    key = _get_daily_role_key()
    return len(SCENARIOS[key]["steps"])


# ---------- Base ----------
@app.get("/")
def read_root():
    return {"status": "ok", "message": "Bienvenido a Urukais Klick"}


@app.get("/api/health")


@app.get("/api/health")
def health():
    return {"status": "healthy", "service": "urukais-klick-backend"}


@app.get("/api/roles")
def list_roles():
    return [
        {"key": k, "role": v["role"], "emoji": v.get("emoji", "🎭"),
         "tagline": v.get("tagline", "")}
        for k, v in SCENARIOS.items()
    ]


@app.get("/api/stats/global")
def global_stats(db: Session = Depends(get_db)):
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_decisions = db.query(func.count(Decision.id)).scalar() or 0
    total_cards = db.query(func.count(CardUnlock.id)).scalar() or 0
    return {
        "total_users": total_users,
        "total_decisions": total_decisions,
        "total_cards": total_cards,
    }


@app.get("/api/stats/roles")
def stats_roles(db: Session = Depends(get_db)):
    rows = (db.query(
                User.role,
                func.count(func.distinct(User.id)),
                func.count(Decision.id))
            .outerjoin(Decision, Decision.user_id == User.id)
            .group_by(User.role).all())
    return [{"role": r[0], "sessions": r[1], "decisions": r[2]} for r in rows]


@app.get("/api/leaderboard")
def leaderboard(db: Session = Depends(get_db)):
    rows = (db.query(
                User.name,
                func.count(func.distinct(User.id)).label("sessions"),
                func.count(Decision.id).label("decisions"))
            .outerjoin(Decision, Decision.user_id == User.id)
            .filter(User.name.isnot(None))
            .group_by(User.name)
            .order_by(func.count(Decision.id).desc())
            .limit(10).all())
    return [{"name": r[0], "sessions": r[1], "decisions": r[2]} for r in rows]


# ---------- Sesiones ----------
@app.post("/api/session/{role}", response_model=SessionResponse)
def create_session(role: str, name: Optional[str] = None,
                   db: Session = Depends(get_db)):
    if role not in SCENARIOS:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    clean = name.strip()[:64] if name else None
    if clean == "":
        clean = None
    user = User(role=role, name=clean)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"user_id": user.id, "role": role}


@app.get("/api/scenario/{role}")
def get_scenario(role: str):
    if role not in SCENARIOS:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return SCENARIOS[role]


@app.post("/api/decision")
def post_decision(payload: DecisionRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    decision = Decision(
        user_id=payload.user_id, step=payload.step,
        choice=payload.choice, category=payload.category,
    )
    db.add(decision)
    db.commit()
    db.refresh(decision)

    # Comprobar cartas legendarias tras la decisión
    if user.name:
        _check_legendary_cards(user.name, db)

    scenario = SCENARIOS.get(user.role)
    if not scenario:
        return {"ok": True, "decision_id": decision.id, "next_step": None}

    steps = scenario["steps"]
    next_step_num = payload.step + 1
    next_step = next((s for s in steps if s["step"] == next_step_num), None)
    if not next_step:
        return {"ok": True, "decision_id": decision.id, "next_step": None}

    role_variants = VARIANTS.get(user.role, {})
    step_variants = role_variants.get(next_step_num, {})
    resolved = dict(next_step)
    if payload.category in step_variants:
        resolved["question"] = step_variants[payload.category]
    resolved.pop("variants", None)

    return {"ok": True, "decision_id": decision.id, "next_step": resolved}


def _unlock_card(user_id: int, category: str, db: Session) -> Optional[str]:
    if category not in CARDS:
        return None
    exists = (db.query(CardUnlock)
              .filter(CardUnlock.user_id == user_id, CardUnlock.card_key == category).first())
    if not exists:
        db.add(CardUnlock(user_id=user_id, card_key=category))
        db.commit()
    return category


# ---------- Perfil ----------
@app.get("/api/profile/{user_id}", response_model=ProfileResponse)
def get_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    decisions = db.query(Decision).filter(Decision.user_id == user_id).all()
    categories = Counter(d.category for d in decisions).most_common()
    dominant = categories[0][0] if categories else "indefinido"
    unlocked = _unlock_card(user_id, dominant, db) if categories else None
    insight = build_insight(user.role, dominant)["narrative"] if categories else None
    return {
        "user_id": user.id, "role": user.role,
        "total_decisions": len(decisions), "categories": dict(categories),
        "dominant": dominant, "card_unlocked": unlocked, "insight": insight,
    }


@app.get("/api/user/{name}")
def user_by_name(name: str, db: Session = Depends(get_db)):
    users = db.query(User).filter(User.name == name).all()
    if not users:
        raise HTTPException(status_code=404, detail="Nombre no encontrado")
    user_ids = [u.id for u in users]
    decisions_count = (db.query(func.count(Decision.id))
                       .filter(Decision.user_id.in_(user_ids)).scalar() or 0)
    card_rows = (db.query(CardUnlock.card_key)
                 .filter(CardUnlock.user_id.in_(user_ids)).distinct().all())
    cards_set = sorted({c[0] for c in card_rows})
    sessions = [{
        "user_id": u.id, "role": u.role,
        "created_at": u.created_at.isoformat(),
        "decisions": db.query(func.count(Decision.id))
                    .filter(Decision.user_id == u.id).scalar() or 0,
    } for u in users]
    sessions.sort(key=lambda x: x["created_at"], reverse=True)
    return {
        "name": name,
        "sessions_count": len(users),
        "decisions_count": decisions_count,
        "cards_unlocked": cards_set,
        "sessions": sessions,
    }


@app.get("/api/stats/compare/{user_id}")
def compare(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    my_decisions = db.query(Decision).filter(Decision.user_id == user_id).all()
    my_counter = Counter(d.category for d in my_decisions)
    my_total = sum(my_counter.values()) or 1
    your_pct = {c: round(100 * n / my_total) for c, n in my_counter.items()}

    rows = (db.query(Decision.category, func.count(Decision.id))
            .join(User, User.id == Decision.user_id)
            .filter(User.role == user.role)
            .group_by(Decision.category).all())
    agg_total = sum(count for _, count in rows) or 1
    agg_pct = {c: round(100 * n / agg_total) for c, n in rows}

    return {"role": user.role, "sample_size": agg_total,
            "your_pct": your_pct, "aggregate_pct": agg_pct}


# ---------- Cartas ----------
@app.get("/api/cards")
def list_cards():
    return [
        {"key": k, "emoji": v["emoji"], "title": v["title"], "body": v["body"],
         "legendary": v.get("legendary", False)}
        for k, v in CARDS.items()
    ]


@app.get("/api/cards/{user_id}")
def user_cards(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    unlocked = {c.card_key for c in db.query(CardUnlock).filter(CardUnlock.user_id == user_id)}
    return {"user_id": user_id, "unlocked": list(unlocked), "total": len(CARDS)}


@app.post("/api/cards/batch")
def cards_batch(payload: CardsBatchRequest, db: Session = Depends(get_db)):
    unlocked = set()
    for uid in payload.user_ids:
        for c in db.query(CardUnlock).filter(CardUnlock.user_id == uid):
            unlocked.add(c.card_key)
    return {"unlocked": list(unlocked), "total": len(CARDS)}


@app.post("/api/cards/check-legendary/{name}")
def check_legendary(name: str, db: Session = Depends(get_db)):
    _check_legendary_cards(name, db)
    users = db.query(User).filter(User.name == name).all()
    if not users:
        raise HTTPException(status_code=404, detail="Nombre no encontrado")
    user_ids = [u.id for u in users]
    unlocked = [c.card_key for c in db.query(CardUnlock)
                .filter(CardUnlock.user_id.in_(user_ids))
                .filter(CardUnlock.card_key.like("legendary_%")).all()]
    return {"unlocked": unlocked, "total": len(LEGENDARY_RULES)}


@app.post("/api/history")
def get_history(payload: HistoryRequest, db: Session = Depends(get_db)):
    results = []
    for uid in payload.user_ids:
        user = db.query(User).filter(User.id == uid).first()
        if not user:
            continue
        decisions = db.query(func.count(Decision.id)).filter(Decision.user_id == uid).scalar() or 0
        cards = db.query(func.count(CardUnlock.id)).filter(CardUnlock.user_id == uid).scalar() or 0
        results.append({
            "user_id": user.id, "role": user.role,
            "created_at": user.created_at.isoformat(),
            "decisions": decisions, "cards_unlocked": cards,
        })
    return results


# ---------- Logros y liga ----------
@app.get("/api/achievements/{name}")
def get_achievements(name: str, db: Session = Depends(get_db)):
    return compute_achievements(name, db)


@app.get("/api/league/{name}")
def get_league(name: str, db: Session = Depends(get_db)):
    users = db.query(User).filter(User.name == name).all()
    if not users:
        raise HTTPException(status_code=404, detail="Nombre no encontrado")
    user_ids = [u.id for u in users]
    decisions_count = (db.query(func.count(Decision.id))
                       .filter(Decision.user_id.in_(user_ids)).scalar() or 0)
    return compute_league(decisions_count)


# ---------- Bio ----------
@app.get("/api/profile/{name}/bio")
def get_bio(name: str, db: Session = Depends(get_db)):
    prof = db.query(UserProfile).filter(UserProfile.name == name).first()
    return {"name": name, "bio": prof.bio if prof else None}


@app.put("/api/profile/{name}/bio")
def put_bio(name: str, payload: BioUpdate, db: Session = Depends(get_db)):
    if not db.query(User).filter(User.name == name).first():
        raise HTTPException(status_code=404, detail="Nombre no encontrado")
    clean = (payload.bio or "").strip()[:280]
    prof = db.query(UserProfile).filter(UserProfile.name == name).first()
    if not prof:
        db.add(UserProfile(name=name, bio=clean or None))
    else:
        prof.bio = clean or None
    db.commit()
    return {"name": name, "bio": clean or None}


# ---------- Favoritos ----------
@app.get("/api/favorites/{name}")
def list_favorites(name: str, db: Session = Depends(get_db)):
    rows = (db.query(Favorite)
            .filter(Favorite.name == name)
            .order_by(Favorite.created_at).all())
    return {"name": name, "favorites": [r.card_key for r in rows]}


@app.post("/api/favorites/{name}/{card_key}")
def add_favorite(name: str, card_key: str, db: Session = Depends(get_db)):
    exists = (db.query(Favorite)
              .filter(Favorite.name == name, Favorite.card_key == card_key).first())
    if not exists:
        db.add(Favorite(name=name, card_key=card_key))
        db.commit()
    return {"ok": True, "favorited": True}


@app.delete("/api/favorites/{name}/{card_key}")
def remove_favorite(name: str, card_key: str, db: Session = Depends(get_db)):
    (db.query(Favorite)
     .filter(Favorite.name == name, Favorite.card_key == card_key)
     .delete())
    db.commit()
    return {"ok": True, "favorited": False}


# ---------- RGPD: exportar mis datos ----------
@app.get("/api/export/my-data/{name}")
def export_my_data(name: str, db: Session = Depends(get_db)):
    from fastapi.responses import JSONResponse

    users = db.query(User).filter(User.name == name).all()
    if not users:
        raise HTTPException(status_code=404, detail="Nombre no encontrado")

    user_ids = [u.id for u in users]

    prof = db.query(UserProfile).filter(UserProfile.name == name).first()
    bio = prof.bio if prof else None

    favorites = [f.card_key for f in db.query(Favorite).filter(Favorite.name == name).all()]

    sessions = []
    for u in users:
        decisions = (db.query(Decision)
                     .filter(Decision.user_id == u.id)
                     .order_by(Decision.id).all())
        sessions.append({
            "user_id": u.id,
            "role": u.role,
            "created_at": u.created_at.isoformat(),
            "decisions": [
                {"step": d.step, "choice": d.choice, "category": d.category}
                for d in decisions
            ],
        })

    cards = sorted({c.card_key for c in db.query(CardUnlock)
                    .filter(CardUnlock.user_id.in_(user_ids)).all()})

    data = {
        "exported_at": datetime.utcnow().isoformat() + "Z",
        "name": name,
        "bio": bio,
        "stats": {
            "sessions": len(sessions),
            "decisions": sum(len(s["decisions"]) for s in sessions),
            "cards_unlocked": len(cards),
            "favorites": len(favorites),
        },
        "sessions": sessions,
        "cards_unlocked": cards,
        "favorites": favorites,
    }

    return JSONResponse(
        content=data,
        headers={"Content-Disposition": f"attachment; filename=urukais-{name}.json"},
    )



# ---------- Desafío diario: endpoints ----------
@app.get("/api/daily-challenge")
def get_daily_challenge(db: Session = Depends(get_db)):
    key = _get_daily_role_key()
    role = SCENARIOS[key]
    today_iso = date.today().isoformat()

    # Contar participantes únicos que hoy han jugado ese rol
    rows = (db.query(func.count(func.distinct(Decision.user_id)))
            .join(User, User.id == Decision.user_id)
            .filter(User.role == key)
            .filter(func.date(Decision.created_at) == today_iso)
            .scalar() or 0)

    # Cuántas personas lo han completado (>= 5 decisiones)
    from sqlalchemy import select
    subq = (select(Decision.user_id, func.count(Decision.id).label("c"))
            .join(User, User.id == Decision.user_id)
            .where(User.role == key)
            .where(func.date(Decision.created_at) == today_iso)
            .group_by(Decision.user_id)
            .subquery())
    completed_count = db.execute(
        select(func.count()).select_from(subq).where(subq.c.c >= _get_daily_decision_threshold())
    ).scalar() or 0

    return {
        "date": today_iso,
        "role_key": key,
        "role": role["role"],
        "emoji": role.get("emoji", "🎭"),
        "tagline": role.get("tagline", ""),
        "intro": role.get("intro", ""),
        "threshold": _get_daily_decision_threshold(),
        "participants": rows,
        "completed_count": completed_count,
    }


@app.get("/api/daily-status/{name}")
def get_daily_status(name: str, db: Session = Depends(get_db)):
    key = _get_daily_role_key()
    today_iso = date.today().isoformat()
    threshold = _get_daily_decision_threshold()

    count = (db.query(func.count(Decision.id))
             .join(User, User.id == Decision.user_id)
             .filter(User.name == name)
             .filter(User.role == key)
             .filter(func.date(Decision.created_at) == today_iso)
             .scalar() or 0)

    return {
        "date": today_iso,
        "role_key": key,
        "completed": count >= threshold,
        "decisions_today": count,
        "threshold": threshold,
    }


@app.get("/api/daily-leaderboard")
def get_daily_leaderboard(db: Session = Depends(get_db)):
    key = _get_daily_role_key()
    today_iso = date.today().isoformat()

    rows = (db.query(
                User.name,
                func.count(Decision.id).label("decisions"),
                func.max(Decision.created_at).label("finished_at"))
            .join(Decision, Decision.user_id == User.id)
            .filter(User.role == key)
            .filter(func.date(Decision.created_at) == today_iso)
            .filter(User.name.isnot(None))
            .group_by(User.name)
            .order_by(func.count(Decision.id).desc(), func.max(Decision.created_at).asc())
            .limit(10).all())

    return {
        "date": today_iso,
        "role_key": key,
        "entries": [
            {
                "name": r[0],
                "decisions": r[1],
                "finished_at": r[2].isoformat() if r[2] else None,
            }
            for r in rows
        ],
    }