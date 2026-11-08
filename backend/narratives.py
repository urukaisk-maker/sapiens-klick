CATEGORY_GROUPS = {
    "cooperativo": "prosocial", "empatico": "prosocial",
    "altruista": "prosocial", "leal": "prosocial",
    "individualista": "self", "hedonista": "self",
    "impulsivo": "self", "pragmatico": "self",
    "reflexivo": "cognitive", "curioso": "cognitive",
    "estratega": "cognitive", "intuitivo": "cognitive",
    "automatico": "cognitive",
    "disciplinado": "discipline", "estoico": "discipline",
    "seguridad": "discipline",
    "status": "power", "competitivo": "power", "rebelde": "power",
    "tradicional": "tradition", "institucional": "tradition",
    "conformista": "tradition",
    "riesgo": "change", "innovador": "change", "libre": "change",
    "agresivo": "aggressive", "traicion": "aggressive", "ambicion": "aggressive",
    "liderazgo": "leader", "autenticidad": "leader",
    "sintesis": "leader", "poder": "leader",
    "narrador": "storyteller", "silencio": "storyteller",
    "belleza": "storyteller", "legado": "storyteller",
}

GROUP_INSIGHTS = {
    "prosocial": (
        "elegiste como un orco que cree en la horda. La fuerza del clan está en "
        "el vínculo entre sus miembros. Los lobos solitarios mueren; las manadas "
        "sobreviven. Pero la lealtad también se paga con sangre."
    ),
    "self": (
        "elegiste como un orco que solo responde ante sí mismo. En las Tierras "
        "Oscuras, el interés propio no es cinismo: es instinto. Pero el orco que "
        "nunca comparte, muere rodeado de cadáveres que él mismo creó."
    ),
    "cognitive": (
        "elegiste como un orco que piensa antes de golpear. La mente afilada vale "
        "más que cualquier hacha. Pero el exceso de cálculo también mata: hay "
        "momentos en que solo la furia decide."
    ),
    "discipline": (
        "elegiste como un orco que se controla. En un mundo de impulsos, la "
        "disciplina es poder. El herrero que golpea mil veces el mismo punto es "
        "más temido que el que grita y ataca sin pensar."
    ),
    "power": (
        "elegiste como un orco que busca el trono. El poder no se hereda: se "
        "arranca. Cada guerrero ambicioso mira al capitán con hambre. Pero el "
        "trono tiene filos por todos lados."
    ),
    "tradition": (
        "elegiste como un orco que respeta la ley del clan. Las tradiciones no son "
        "cadenas: son el recuerdo de los errores de otros. Pero cuando la tradición "
        "deja de servir al clan, se convierte en veneno."
    ),
    "change": (
        "elegiste como un orco que rompe las reglas. Los que innovan ganan "
        "batallas que nadie creía posibles. Pero los innovadores también son los "
        "primeros en morir cuando fallan."
    ),
    "aggressive": (
        "elegiste como un orco que no duda en derramar sangre. La agresividad no "
        "es locura: es un idioma que las Tierras Oscuras entienden. Pero el orco "
        "que solo sabe matar, termina matándose a sí mismo."
    ),
    "leader": (
        "elegiste como un orco destinado a mandar. Los capitanes legendarios no "
        "son los más fuertes: son los que saben cuándo golpear y cuándo esperar. "
        "El liderazgo es el arte de hacer que otros mueran por ti."
    ),
    "storyteller": (
        "elegiste como un orco que deja huella. Las crónicas del clan no las "
        "escriben los escribas: las escriben los guerreros que sobreviven para "
        "contarlas. Tu historia aún no está terminada."
    ),
}

ROLE_TWISTS = {
    "guerrero": "Como guerrero del clan Urukais Klick, tus decisiones hablan de cómo un orco entiende la fuerza, la gloria y el derramamiento de sangre.",
    "rastreador": "Como rastreador, tus elecciones revelan qué tipo de orco eres cuando nadie te ve: el que avisa al clan o el que persigue su propio prestigio.",
    "herrero": "Como herrero de guerra, tus decisiones muestran qué forjas con tu vida: armas para el clan, poder para ti, o algo más oscuro.",
    "chaman": "Como chamán oscuro, tus elecciones revelan cuánto estás dispuesto a cederle a la Oscuridad para obtener poder.",
    "domador": "Como domador de wargos, tus decisiones hablan de cómo tratas a las bestias: con mano firme, con paciencia o con crueldad.",
    "capitan": "Como capitán de la horda, tus elecciones dibujan el tipo de líder que serías: el que inspira o el que solo inspira miedo.",
    "esclavista": "Como esclavista del clan, tus decisiones revelan qué tipo de orco eres cuando tienes poder sobre la carne débil.",
    "asesino": "Como asesino del clan, tus elecciones muestran qué queda de ti cuando el filo ya no distingue entre enemigos y aliados.",
    "nigromante": "Como nigromante, tus elecciones revelan cuánto estás dispuesto a sacrificar para doblegar a la muerte.",
    
}


ROLE_HOOKS = {
    "guerrero": "Los guerreros del clan susurrarían tu nombre con respeto.",
    "rastreador": "El capitán te daría las misiones más peligrosas.",
    "herrero": "Tu yunque sonaría durante generaciones en la Montaña Oscura.",
    "chaman": "La Oscuridad misma tomaría nota de tu nombre.",
    "domador": "Los wargos te reconocerían como uno de los suyos.",
    "capitan": "La horda entera temblaría cuando entraras en la sala del trono.",
    "esclavista": "Los prisioneros te temerían más que a la muerte.",
    "asesino": "Ningún enemigo del clan dormiría tranquilo mientras vivieras.",
        "berserker": "Los enemigos del clan susurrarían tu nombre como se susurra una tormenta.",
    "nigromante": "Los muertos te reconocerían como señor y los vivos te temerían como a la peste.",
}


def build_insight(role: str, dominant_category: str) -> dict:
    group = CATEGORY_GROUPS.get(dominant_category)
    if not group:
        return {"narrative": "", "group": None}

    twist = ROLE_TWISTS.get(role, "")
    insight = GROUP_INSIGHTS.get(group, "")
    hook = ROLE_HOOKS.get(role, "")

    narrative = f"{twist} En esta partida {insight} {hook}"

    return {
        "narrative": narrative,
        "group": group,
        "dominant_category": dominant_category,
    }