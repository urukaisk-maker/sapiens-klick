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


# Logros secretos: no aparecen en la API hasta que se desbloquean.
SECRET_ACHIEVEMENTS = [
    {"key": "noche", "title": "Ave nocturna", "emoji": "🌙",
     "desc": "Juega una partida después de medianoche", "target": 1, "metric": "night_played"},
    {"key": "politico_rebelde", "title": "Rompefilas", "emoji": "✊",
     "desc": "Elige 'romper la disciplina' como político", "target": 1, "metric": "politico_romper"},
    {"key": "monje_retorno", "title": "Vuelta al mundo", "emoji": "🌍",
     "desc": "Un monje que vuelve al mundo al final", "target": 1, "metric": "monje_volver"},
    {"key": "soldado_empatico", "title": "El que vuelve", "emoji": "🪖",
     "desc": "Vuelve a buscar al herido como soldado", "target": 1, "metric": "soldado_volver"},
    {"key": "cazador_curioso", "title": "Explorador innato", "emoji": "🧭",
     "desc": "Explora el bosque del chamán", "target": 1, "metric": "cazador_explorar"},
    {"key": "artista_libre", "title": "Indomable", "emoji": "🎨",
     "desc": "Rechaza el patrocinio como artista", "target": 1, "metric": "artista_rechazar"},
    {"key": "emprendedor_solo", "title": "Lobo solitario", "emoji": "🐺",
     "desc": "Sigue solo como emprendedor", "target": 1, "metric": "emprendedor_solo"},
    {"key": "consumidor_reflexivo", "title": "Lo leo todo", "emoji": "📖",
     "desc": "Lee el contrato entero antes de firmar", "target": 1, "metric": "consumidor_leer"},
    {"key": "agricultor_rebelde", "title": "Revuelta", "emoji": "🔥",
     "desc": "Únete a la revuelta como agricultor", "target": 1, "metric": "agricultor_rebelarse"},
    {"key": "todos_roles", "title": "Antropólogo", "emoji": "🧑‍🔬",
     "desc": "Completa al menos una partida con cada uno de los 8 roles",
     "target": 8, "metric": "distinct_roles_all"},
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
    """Calcula logros, secretos y métricas agregadas para un nombre de usuario."""
    users = db.query(User).filter(User.name == name).all()
    if not users:
        return {
            "metrics": {},
            "achievements": [],
            "streak": 0,
            "last_played": None,
            "secret_unlocked": [],
        }

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

    # --- Métricas para logros secretos ---
    has_night = any(u.created_at.hour < 5 for u in users)

    choices_by_role = {}
    for u in users:
        rows = db.query(Decision.choice).filter(Decision.user_id == u.id).all()
        choices_by_role.setdefault(u.role, set()).update(r[0] for r in rows)

    secret_metrics = {
        "night_played": 1 if has_night else 0,
        "politico_romper": 1 if "romper" in choices_by_role.get("politico", set()) else 0,
        "monje_volver": 1 if "volver" in choices_by_role.get("monje", set()) else 0,
        "soldado_volver": 1 if "volver" in choices_by_role.get("soldado", set()) else 0,
        "cazador_explorar": 1 if "explorar" in choices_by_role.get("cazador", set()) else 0,
        "artista_rechazar": 1 if "rechazar" in choices_by_role.get("artista", set()) else 0,
        "emprendedor_solo": 1 if "solo" in choices_by_role.get("emprendedor", set()) else 0,
        "consumidor_leer": 1 if "leer" in choices_by_role.get("consumidor", set()) else 0,
        "agricultor_rebelarse": 1 if "rebelarse" in choices_by_role.get("agricultor", set()) else 0,
        "distinct_roles_all": distinct_roles,
    }

    metrics = {
        "sessions": sessions_count,
        "distinct_roles": distinct_roles,
        "cards": cards_count,
        "decisions": decisions_count,
        "streak": streak,
    }

    # --- Logros visibles ---
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
            "secret": False,
        })

    # --- Logros secretos: solo aparecen si están desbloqueados ---
    secret_unlocked_keys = []
    for a in SECRET_ACHIEVEMENTS:
        current = secret_metrics.get(a["metric"], 0)
        if current >= a["target"]:
            secret_unlocked_keys.append(a["key"])
            result.append({
                "key": a["key"],
                "title": a["title"],
                "emoji": a["emoji"],
                "desc": a["desc"],
                "target": a["target"],
                "current": a["target"],
                "unlocked": True,
                "pct": 100,
                "secret": True,
            })

    return {
        "metrics": metrics,
        "achievements": result,
        "streak": streak,
        "last_played": last_played,
        "secret_unlocked": secret_unlocked_keys,
    }