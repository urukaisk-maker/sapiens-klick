from io import StringIO
import csv

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy import func
from sqlalchemy.orm import Session

from database import get_db
from models import User, Decision, CardUnlock
from cards import CARDS

stats_router = APIRouter(prefix="/api", tags=["stats"])


# ---------- Export CSV ----------
@stats_router.get("/export/decisions.csv")
def export_decisions(db: Session = Depends(get_db)):
    rows = (db.query(Decision, User.role)
            .join(User, User.id == Decision.user_id)
            .order_by(Decision.id).all())

    def gen():
        buf = StringIO()
        w = csv.writer(buf)
        w.writerow(["decision_id", "user_id", "role", "step", "choice", "category", "created_at"])
        yield buf.getvalue()
        buf.seek(0); buf.truncate(0)
        for d, role in rows:
            w.writerow([d.id, d.user_id, role, d.step, d.choice, d.category,
                        d.created_at.isoformat()])
            yield buf.getvalue()
            buf.seek(0); buf.truncate(0)

    return StreamingResponse(
        gen(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=decisions.csv"},
    )


@stats_router.get("/export/users.csv")
def export_users(db: Session = Depends(get_db)):
    rows = (db.query(
                User.id, User.name, User.role, User.created_at,
                func.count(Decision.id).label("decisions"))
            .outerjoin(Decision, Decision.user_id == User.id)
            .group_by(User.id)
            .order_by(User.id).all())

    def gen():
        buf = StringIO()
        w = csv.writer(buf)
        w.writerow(["user_id", "name", "role", "created_at", "decisions"])
        yield buf.getvalue()
        buf.seek(0); buf.truncate(0)
        for r in rows:
            w.writerow([r[0], r[1] or "", r[2], r[3].isoformat(), r[4]])
            yield buf.getvalue()
            buf.seek(0); buf.truncate(0)

    return StreamingResponse(
        gen(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=users.csv"},
    )


# ---------- Stats globales ----------
@stats_router.get("/stats/global-categories")
def global_categories(db: Session = Depends(get_db)):
    rows = (db.query(Decision.category, func.count(Decision.id))
            .group_by(Decision.category)
            .order_by(func.count(Decision.id).desc()).all())
    total = sum(c for _, c in rows) or 1
    return [{"category": cat, "count": c, "pct": round(100 * c / total)}
            for cat, c in rows]


@stats_router.get("/stats/role-categories")
def role_categories(db: Session = Depends(get_db)):
    rows = (db.query(User.role, Decision.category, func.count(Decision.id))
            .join(Decision, Decision.user_id == User.id)
            .group_by(User.role, Decision.category).all())

    grouped = {}
    for role, cat, count in rows:
        grouped.setdefault(role, {})[cat] = count

    result = []
    for role, cats in grouped.items():
        total = sum(cats.values()) or 1
        result.append({
            "role": role,
            "total": total,
            "categories": {c: round(100 * n / total) for c, n in cats.items()},
        })
    result.sort(key=lambda x: x["role"])
    return result


@stats_router.get("/stats/top-cards")
def top_cards(db: Session = Depends(get_db)):
    rows = (db.query(CardUnlock.card_key, func.count(CardUnlock.id))
            .group_by(CardUnlock.card_key)
            .order_by(func.count(CardUnlock.id).desc())
            .limit(10).all())
    result = []
    for key, count in rows:
        c = CARDS.get(key, {})
        result.append({
            "card_key": key,
            "count": count,
            "title": c.get("title", key),
            "emoji": c.get("emoji", "🃏"),
        })
    return result