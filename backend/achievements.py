from datetime import datetime, timedelta
from sqlalchemy import func
from sqlalchemy.orm import Session
from models import User, Decision, CardUnlock


ACHIEVEMENTS = [
    {"key": "primera_partida", "title": "Primera partida", "emoji": "🎬",
     "desc": "Completa tu primera partida", "target": 1, "metric": "sessions"},
    {"key": "veterano", "title": "Veterano", "emoji": "🎖️",
     "desc": "Completa 10 partidas", "target": 10, "metric": "sessions"},
    {"key": "leyenda", "title": "Leyenda", "emoji": "👑",
     "desc": "Completa 25 partidas", "target": 25, "metric": "sessions"},
    {"key": "explorador", "title": "Explorador", "emoji": "🧭",
     "desc": "Juega 3 roles distintos", "target": 3, "metric": "distinct_roles"},
    {"key": "viajero", "title": "Viajero", "emoji": "🌍",
     "desc": "Juega 5 roles distintos", "target": 5, "metric": "distinct_roles"},
    {"key": "maestro_roles", "title": "Maestro de roles", "emoji": "🎭",
     "desc": "Juega los 8 roles", "target": 8, "metric": "distinct_roles"},
    {"key": "coleccionista", "title": "Coleccionista", "emoji": "🃏",
     "desc": "Desbloquea 10 cartas", "target": 10, "metric": "cards"},
    {"key": "bibliotecario", "title": "Bibliotecario", "emoji": "📚",
     "desc": "Desbloquea 20 cartas", "target": 20, "metric": "cards"},
    {"key": "archivero", "title": "Archivero", "emoji": "🗃️",
     "desc": "Desbloquea 30 cartas", "target": 30, "metric": "cards"},
    {"key": "decidido", "title": "Decidido", "emoji": "⚡",
     "desc": "Acumula 100 decisiones", "target": 100, "metric": "decisions"},
    {"key": "racha_3", "title": "Racha x3", "emoji": "🔥",
     "desc": "Juega 3 días seguidos", "target": 3, "metric": "streak"},
    {"key": "racha_7", "title": "Racha x7", "emoji": "🌟",
     "desc": "Juega 7 días seguidos", "target": 7, "metric": "streak"},
]


def compute_streak(dates):
    """Cuenta días consecutivos con al menos una sesión, contando desde el más reciente."""
    if not dates:
        return 0
    today = datetime.utcnow().date()
    dates_set = set(dates)
    most_recent = max(dates_set)
    if (today - most_recent).days > 1:
        return 0
    streak = 0
    current = most_recent
    while current in dates_set:
        streak += 1
        current = current - timedelta(days=1)
    return streak


def compute_achievements(name: str, db: Session):
    """Calcula logros y métricas agregadas para un nombre de usuario."""
    users = db.query(User).filter(User.name == name).all()
    if not users:
        return {"metrics": {}, "achievements": [], "streak": 0, "last_played": None}

    user_ids = [u.id for u in users]
    sessions_count = len(users)
    distinct_roles = len({u.role for u in users})
    decisions_count = (db.query(func.count(Decision.id))
                       .filter(Decision.user_id.in_(user_ids)).scalar() or 0)
    cards_count = (db.query(func.count(func.distinct(CardUnlock.card_key)))
                   .filter(CardUnlock.user_id.in_(user_ids)).scalar() or 0)

    dates = [u.created_at.date() for u in users]
    streak = compute_streak(dates)
    last_played = max(u.created_at for u in users).isoformat()

    metrics = {
        "sessions": sessions_count,
        "distinct_roles": distinct_roles,
        "cards": cards_count,
        "decisions": decisions_count,
        "streak": streak,
    }

    result = []
    for a in ACHIEVEMENTS:
        current = metrics.get(a["metric"], 0)
        unlocked = current >= a["target"]
        result.append({
            "key": a["key"],
            "title": a["title"],
            "emoji": a["emoji"],
            "desc": a["desc"],
            "target": a["target"],
            "current": min(current, a["target"]),
            "unlocked": unlocked,
            "pct": min(100, round(100 * current / a["target"])),
        })

    return {
        "metrics": metrics,
        "achievements": result,
        "streak": streak,
        "last_played": last_played,
    }