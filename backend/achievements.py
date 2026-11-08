from datetime import datetime, timedelta
from sqlalchemy import func
from sqlalchemy.orm import Session
from models import User, Decision, CardUnlock


ACHIEVEMENTS = [
    {"key": "primera_partida", "title": "Primer saqueo", "emoji": "🪓",
     "desc": "Completa tu primera batalla en la horda", "target": 1, "metric": "sessions"},
    {"key": "veterano", "title": "Veterano de la horda", "emoji": "🎖️",
     "desc": "Completa 10 batallas", "target": 10, "metric": "sessions"},
    {"key": "leyenda", "title": "Leyenda de Mordor", "emoji": "👑",
     "desc": "Completa 25 batallas", "target": 25, "metric": "sessions"},
    {"key": "explorador", "title": "Ojo en la oscuridad", "emoji": "🧭",
     "desc": "Juega 3 arquetipos distintos", "target": 3, "metric": "distinct_roles"},
    {"key": "viajero", "title": "Errante de las Tierras Oscuras", "emoji": "🌍",
     "desc": "Juega 5 arquetipos distintos", "target": 5, "metric": "distinct_roles"},
    {"key": "maestro_roles", "title": "Señor de las ocho sendas", "emoji": "🎭",
     "desc": "Juega los 8 arquetipos", "target": 8, "metric": "distinct_roles"},
    {"key": "coleccionista", "title": "Coleccionista de botín", "emoji": "🃏",
     "desc": "Desbloquea 10 cartas", "target": 10, "metric": "cards"},
    {"key": "bibliotecario", "title": "Guardián de reliquias", "emoji": "📚",
     "desc": "Desbloquea 20 cartas", "target": 20, "metric": "cards"},
    {"key": "archivero", "title": "Cronista de la horda", "emoji": "🗃️",
     "desc": "Desbloquea 30 cartas", "target": 30, "metric": "cards"},
    {"key": "decidido", "title": "El que no duda", "emoji": "⚡",
     "desc": "Acumula 100 decisiones", "target": 100, "metric": "decisions"},
    {"key": "racha_3", "title": "Tres lunas de sangre", "emoji": "🔥",
     "desc": "Juega 3 días seguidos", "target": 3, "metric": "streak"},
    {"key": "racha_7", "title": "Siete lunas de sangre", "emoji": "🌟",
     "desc": "Juega 7 días seguidos", "target": 7, "metric": "streak"},
         {"key": "berserker_furia", "title": "Furia desatada", "emoji": "🐗",
     "desc": "Completa una partida como berserker", "target": 1, "metric": "berserker_played"},
    {"key": "nigromante_pacto", "title": "Pacto con la muerte", "emoji": "💀",
     "desc": "Completa una partida como nigromante", "target": 1, "metric": "nigromante_played"},
    {"key": "legendarias", "title": "Coleccionista legendario", "emoji": "🏆",
     "desc": "Desbloquea las 5 cartas legendarias", "target": 5, "metric": "legendary_cards"},
    {"key": "todos_arquetipos", "title": "Señor de las diez sendas", "emoji": "🎭",
     "desc": "Juega los 10 arquetipos", "target": 10, "metric": "distinct_roles"},
]


# Logros secretos: solo aparecen en la API cuando se desbloquean.
SECRET_ACHIEVEMENTS = [
    {"key": "noche", "title": "Cazador nocturno", "emoji": "🌙",
     "desc": "Lucha en una batalla después de medianoche", "target": 1, "metric": "night_played"},
    {"key": "capitan_desafiar", "title": "El que desafió al capitán", "emoji": "✊",
     "desc": "Desafía una orden suicida como capitán", "target": 1, "metric": "capitan_desafiar"},
    {"key": "chaman_rechazar", "title": "El que rechazó a la Oscuridad", "emoji": "🩸",
     "desc": "Rechaza el pacto de la Oscuridad como chamán", "target": 1, "metric": "chaman_rechazar"},
    {"key": "asesino_perdonar", "title": "El filo que no cortó", "emoji": "🗡️",
     "desc": "Perdona al niño élfico como asesino", "target": 1, "metric": "asesino_perdonar"},
    {"key": "rastreador_cueva", "title": "El que miró la Oscuridad", "emoji": "🕳️",
     "desc": "Refúgiate en la cueva desconocida como rastreador", "target": 1, "metric": "rastreador_cueva"},
    {"key": "esclavista_liberar", "title": "El que rompió cadenas", "emoji": "🔗",
     "desc": "Libera esclavos en secreto como esclavista", "target": 1, "metric": "esclavista_liberar"},
    {"key": "herrero_ensenar", "title": "Maestro del yunque", "emoji": "⚒️",
     "desc": "Enseña tus secretos al aprendiz como herrero", "target": 1, "metric": "herrero_ensenar"},
    {"key": "guerrero_compartir", "title": "El que repartió el botín", "emoji": "🤝",
     "desc": "Comparte el botín con la horda como guerrero", "target": 1, "metric": "guerrero_compartir"},
    {"key": "domador_paciencia", "title": "El que domó con paciencia", "emoji": "🐺",
     "desc": "Domestica al cachorro con paciencia como domador", "target": 1, "metric": "domador_paciencia"},
    {"key": "todos_roles", "title": "Cronista de las ocho sendas", "emoji": "📖",
     "desc": "Completa al menos una partida con cada uno de los 8 arquetipos",
     "target": 8, "metric": "distinct_roles_all"},
         {"key": "berserker_capitan", "title": "El que mató al capitán", "emoji": "🗡️",
     "desc": "Mata al capitán como berserker", "target": 1, "metric": "berserker_matar_capitan"},
    {"key": "nigromante_nombre", "title": "El nombre entregado", "emoji": "🌀",
     "desc": "Entrega tu nombre a la Oscuridad como nigromante", "target": 1, "metric": "nigromante_entregar_nombre"},
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

    # Métricas para logros secretos
    has_night = any(u.created_at.hour < 5 for u in users)

    choices_by_role = {}
    for u in users:
        rows = db.query(Decision.choice).filter(Decision.user_id == u.id).all()
        choices_by_role.setdefault(u.role, set()).update(r[0] for r in rows)

    secret_metrics = {
        "night_played": 1 if has_night else 0,
        "capitan_desafiar": 1 if "desafiar" in choices_by_role.get("capitan", set()) else 0,
        "chaman_rechazar": 1 if "rechazar_pacto" in choices_by_role.get("chaman", set()) else 0,
        "asesino_perdonar": 1 if "perdonar_elfo" in choices_by_role.get("asesino", set()) else 0,
        "rastreador_cueva": 1 if "cueva" in choices_by_role.get("rastreador", set()) else 0,
        "esclavista_liberar": 1 if "liberar" in choices_by_role.get("esclavista", set()) else 0,
        "herrero_ensenar": 1 if "ensenar" in choices_by_role.get("herrero", set()) else 0,
        "guerrero_compartir": 1 if "compartir" in choices_by_role.get("guerrero", set()) else 0,
        "domador_paciencia": 1 if "paciencia" in choices_by_role.get("domador", set()) else 0,
        "distinct_roles_all": distinct_roles,
    }

    metrics = {
        "sessions": sessions_count,
        "distinct_roles": distinct_roles,
        "cards": cards_count,
        "decisions": decisions_count,
        "streak": streak,
    }

    # Logros visibles
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

    # Logros secretos: solo aparecen si están desbloqueados
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