# Agrupación de categorías en "modos de decidir"
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
}

# Cómo se interpreta cada modo de decidir (concepto de Sapiens)
GROUP_INSIGHTS = {
    "prosocial": (
        "priorizaste al grupo sobre ti mismo. La cooperación es el mecanismo "
        "que permitió a Sapiens superar a especies más fuertes, pero también "
        "es frágil: requiere confianza, y la confianza se agota."
    ),
    "self": (
        "priorizaste tu propio interés. No es cinismo — es la lógica que la "
        "evolución implantó en nosotros. Pero un mundo de solo intereses "
        "individuales se vuelve invivible, y por eso los sapiens inventaron "
        "las normas."
    ),
    "cognitive": (
        "priorizaste pensar antes de actuar. La reflexión es costosa: consume "
        "energía y tiempo. Los sapiens la usan con moderación, y justo por "
        "eso quien la usa bien obtiene ventaja."
    ),
    "discipline": (
        "priorizaste el autocontrol. La disciplina es una ficción que nos "
        "contamos para domesticar al animal que llevamos dentro — y funciona, "
        "aunque nunca del todo."
    ),
    "power": (
        "priorizaste el estatus, la influencia o la confrontación. El estatus "
        "es una de las ficciones más antiguas: existe solo porque todos lo "
        "reconocen. Cambian sus símbolos (coronas → seguidores), pero no su "
        "lógica."
    ),
    "tradition": (
        "priorizaste lo establecido. La tradición no es simple inercia: es un "
        "ahorro cognitivo. Cuando no puedes saberlo todo, confiar en lo que "
        "funcionó antes es una estrategia racional — hasta que deja de serlo."
    ),
    "change": (
        "priorizaste lo nuevo. La innovación no siempre gana, pero sin ella "
        "no habría sapiens. Es la fuerza que rompe los órdenes imaginados "
        "cuando ya no sirven."
    ),
}

# Cómo cada rol contextualiza la decisión
ROLE_TWISTS = {
    "cazador": (
        "Desde la banda de cazadores-recolectores, tus decisiones reflejan "
        "cómo un grupo pequeño gestiona la confianza sin Estado ni dinero."
    ),
    "agricultor": (
        "Como súbdito agrícola bajo el rey y los dioses, tus elecciones "
        "revelan cómo se negocia la obediencia cuando por primera vez existe "
        "un poder que no puedes ver."
    ),
    "consumidor": (
        "Como consumidor moderno, tus decisiones hablan de cómo navegas un "
        "mundo donde las ficciones ya no son dioses, sino marcas y algoritmos."
    ),
    "emprendedor": (
        "En tu papel de emprendedor digital, tus elecciones dibujan el tipo "
        "de apuesta que estás dispuesto a hacer con tu tiempo, tu dinero y "
        "tu control."
    ),
    "soldado": (
        "En la trinchera, tus decisiones revelan qué queda de la obediencia "
        "cuando ya no estás seguro de que la orden tenga sentido."
    ),
    "monje": (
        "Desde el monasterio, tus elecciones apuntan hacia qué tipo de "
        "trascendencia buscas: la del silencio, la del servicio o la del "
        "retorno al mundo."
    ),
}

# Cierre según el rol
ROLE_HOOKS = {
    "cazador": "La banda te habría reconocido como uno de los suyos.",
    "agricultor": "El templo habría anotado tu nombre en tablillas de barro.",
    "consumidor": "El algoritmo ya tiene tu perfil.",
    "emprendedor": "En el ecosistema startup, encajarías en una de las narrativas que los inversores adoran.",
    "soldado": "Tus compañeros lo recordarían cuando termine la guerra.",
    "monje": "El abad habría tomado nota en el libro de capítulos.",
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