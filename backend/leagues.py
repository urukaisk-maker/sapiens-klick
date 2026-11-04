LEAGUES = [
    {"key": "bronce",   "name": "Bronce",   "emoji": "🥉", "min_decisions": 0,   "color": "#cd7f32"},
    {"key": "plata",    "name": "Plata",    "emoji": "🥈", "min_decisions": 25,  "color": "#c0c0c0"},
    {"key": "oro",      "name": "Oro",      "emoji": "🥇", "min_decisions": 75,  "color": "#ffd700"},
    {"key": "diamante", "name": "Diamante", "emoji": "💎", "min_decisions": 150, "color": "#b9f2ff"},
]


def compute_league(decisions_count: int) -> dict:
    """Devuelve la liga actual, la siguiente y el progreso entre ambas."""
    current = LEAGUES[0]
    for league in LEAGUES:
        if decisions_count >= league["min_decisions"]:
            current = league
        else:
            break

    idx = LEAGUES.index(current)
    next_league = LEAGUES[idx + 1] if idx + 1 < len(LEAGUES) else None

    if next_league:
        span = next_league["min_decisions"] - current["min_decisions"]
        progress = decisions_count - current["min_decisions"]
        pct = min(100, round(100 * progress / span)) if span else 100
    else:
        pct = 100

    return {
        "current": current,
        "next": next_league,
        "decisions_count": decisions_count,
        "progress_pct": pct,
        "to_next": (next_league["min_decisions"] - decisions_count) if next_league else 0,
    }