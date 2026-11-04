from typing import Optional, List
from collections import Counter

from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy import func, text
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import User, Decision, CardUnlock
from scenarios import SCENARIOS
from cards import CARDS
from narratives import build_insight
from variants import VARIANTS
from achievements import compute_achievements
from leagues import compute_league
from stats import stats_router


app = FastAPI(title="Sapiens Klick API")

app.include_router(stats_router)
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(64)"))


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


@app.get("/")
def read_root():
    return {"status": "ok", "message": "Bienvenido a Sapiens Klick"}


@app.get("/api/health")
def health():
    return {"status": "healthy", "service": "sapiens-klick-backend"}


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

    # Calcular el siguiente paso (con variante contextual si aplica)
    scenario = SCENARIOS.get(user.role)
    if not scenario:
        return {"ok": True, "decision_id": decision.id, "next_step": None}

    steps = scenario["steps"]
    next_step_num = payload.step + 1
    next_step = next((s for s in steps if s["step"] == next_step_num), None)
    if not next_step:
        return {"ok": True, "decision_id": decision.id, "next_step": None}

    # Aplicar variante si el paso siguiente tiene una para la categoría elegida
    role_variants = VARIANTS.get(user.role, {})
    step_variants = role_variants.get(next_step_num, {})
    resolved = dict(next_step)
    if payload.category in step_variants:
        resolved["question"] = step_variants[payload.category]
    resolved.pop("variants", None)

    return {"ok": True, "decision_id": decision.id, "next_step": resolved}

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
    return {"ok": True, "decision_id": decision.id}


def _unlock_card(user_id: int, category: str, db: Session) -> Optional[str]:
    if category not in CARDS:
        return None
    exists = (db.query(CardUnlock)
              .filter(CardUnlock.user_id == user_id, CardUnlock.card_key == category).first())
    if not exists:
        db.add(CardUnlock(user_id=user_id, card_key=category))
        db.commit()
    return category


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


@app.get("/api/cards")
def list_cards():
    return [{"key": k, "emoji": v["emoji"], "title": v["title"], "body": v["body"]}
            for k, v in CARDS.items()]


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