SCENARIOS = {
    "cazador": {
        "role": "Cazador-recolector",
        "emoji": "🏹",
        "tagline": "Sobrevivir en la banda",
        "intro": (
            "Vives hace 40.000 años en una banda de 30 personas. No hay dinero, "
            "no hay Estado, no hay dioses escritos. Solo el grupo, la confianza "
            "y la supervivencia."
        ),
        "steps": [
            {"step": 1, "question": "Has cazado un ciervo tú solo. El grupo tiene hambre.",
             "options": [
                 {"label": "Compartir la carne con todos", "value": "compartir", "category": "cooperativo"},
                 {"label": "Guardarla para ti y tu familia", "value": "guardar", "category": "individualista"}]},
            {"step": 2, "question": "Un miembro se rompe la pierna y no puede caminar.",
             "options": [
                 {"label": "Quedarte a cuidarlo hasta que sane", "value": "cuidar", "category": "empatico"},
                 {"label": "Seguir con la banda, es la ley del más fuerte", "value": "abandonar", "category": "individualista"}]},
            {"step": 3, "question": "El chamán anuncia espíritus en el bosque del norte.",
             "options": [
                 {"label": "Creer al chamán y evitar el bosque", "value": "creer", "category": "tradicional"},
                 {"label": "Explorar el bosque tú mismo", "value": "explorar", "category": "curioso"}]},
            {"step": 4, "question": "El líder anciano ya no puede cazar. El grupo duda.",
             "options": [
                 {"label": "Mantener al anciano por respeto", "value": "anciano", "category": "leal"},
                 {"label": "Proponer un nuevo líder más joven", "value": "nuevo", "category": "rebelde"}]},
            {"step": 5, "question": "Las aves migran hacia el sur. El cielo se ve extraño.",
             "options": [
                 {"label": "Seguir la migración de las aves", "value": "migrar", "category": "intuitivo"},
                 {"label": "Quedarse donde hay agua conocida", "value": "quedarse", "category": "seguridad"}]},
        ],
    },

    "agricultor": {
        "role": "Súbdito agrícola",
        "emoji": "🌾",
        "tagline": "Vivir bajo el rey y los dioses",
        "intro": (
            "Año 3.000 a.C. en Mesopotamia. Has dejado de ser nómada. Ahora "
            "dependes de la cosecha, del templo y del rey. Por primera vez en la "
            "historia, alguien puede mandar sobre ti sin verte."
        ),
        "steps": [
            {"step": 1, "question": "El rey exige el 30% de tu cosecha como tributo.",
             "options": [
                 {"label": "Pagar el tributo completo", "value": "pagar", "category": "institucional"},
                 {"label": "Esconder parte de la cosecha", "value": "esconder", "category": "rebelde"}]},
            {"step": 2, "question": "Hay sequía. El templo dice que hay que rezar más.",
             "options": [
                 {"label": "Rezar al dios de la lluvia", "value": "rezar", "category": "tradicional"},
                 {"label": "Probar un nuevo sistema de riego", "value": "innovar", "category": "innovador"}]},
            {"step": 3, "question": "Un grupo de campesinos planea una revuelta contra el rey.",
             "options": [
                 {"label": "Unirte a la revuelta", "value": "rebelarse", "category": "rebelde"},
                 {"label": "Mantenerte leal al rey", "value": "leal", "category": "leal"}]},
            {"step": 4, "question": "Un escriba te ofrece aprender a leer y escribir.",
             "options": [
                 {"label": "Aprender, aunque el cambio asuste", "value": "aprender", "category": "innovador"},
                 {"label": "Seguir con la tradición oral del pueblo", "value": "oral", "category": "tradicional"}]},
            {"step": 5, "question": "Podrías intentar ascender a escriba del templo, pero es riesgoso.",
             "options": [
                 {"label": "Aceptar tu lugar en la aldea", "value": "aceptar", "category": "conformista"},
                 {"label": "Intentar el ascenso aunque falle", "value": "ascender", "category": "competitivo"}]},
        ],
    },

    "consumidor": {
        "role": "Consumidor moderno",
        "emoji": "🛍️",
        "tagline": "Navegar el mercado y las marcas",
        "intro": (
            "Año 2026. Vives en una ciudad. Casi todas tus decisiones están "
            "mediadas por dinero, marcas y algoritmos. Las 'ficciones' que te "
            "rodean ya no son dioses, son marcas."
        ),
        "steps": [
            {"step": 1, "question": "Dos camisetas idénticas: una de marca (80€) y otra sin marca (15€).",
             "options": [
                 {"label": "Comprar la de marca", "value": "marca", "category": "status"},
                 {"label": "Comprar la barata", "value": "barata", "category": "pragmatico"}]},
            {"step": 2, "question": "Un contrato de 5 páginas para un servicio digital.",
             "options": [
                 {"label": "Aceptar sin leer (como el 99%)", "value": "aceptar", "category": "automatico"},
                 {"label": "Leerlo entero antes de firmar", "value": "leer", "category": "reflexivo"}]},
            {"step": 3, "question": "Tienes 1.000€ ahorrados.",
             "options": [
                 {"label": "Invertir en criptomonedas", "value": "cripto", "category": "riesgo"},
                 {"label": "Dejarlos en una cuenta de ahorro", "value": "ahorro", "category": "seguridad"}]},
            {"step": 4, "question": "Ves algo que quieres mucho en una oferta que acaba en 2 horas.",
             "options": [
                 {"label": "Comprarlo ya, no sea que se acabe", "value": "ya", "category": "impulsivo"},
                 {"label": "Esperar 24h y ver si sigues queriéndolo", "value": "esperar", "category": "disciplinado"}]},
            {"step": 5, "question": "En una discusión en redes, alguien insulta a un amigo.",
             "options": [
                 {"label": "Responder públicamente para defenderlo", "value": "responder", "category": "status"},
                 {"label": "Ignorar y hablarlo en privado", "value": "ignorar", "category": "estoico"}]},
        ],
    },

    "emprendedor": {
        "role": "Emprendedor digital",
        "emoji": "🚀",
        "tagline": "Construir algo desde cero",
        "intro": (
            "Año 2026. Tienes 28 años y una idea. Tienes algo de dinero ahorrado "
            "y 18 meses de pista antes de necesitar ingresos. Cada decisión que "
            "tomes ahora definirá si la historia termina en éxito, fracaso o algo "
            "intermedio."
        ),
        "steps": [
            {"step": 1, "question": "Un amigo quiere ser cofundador al 50%. Tú ya empezaste solo.",
             "options": [
                 {"label": "Aceptar al 50% y compartir el riesgo", "value": "socio", "category": "cooperativo"},
                 {"label": "Seguir solo y ofrecerle solo un 10%", "value": "solo", "category": "individualista"}]},
            {"step": 2, "question": "El producto lleva 8 meses y los usuarios no crecen.",
             "options": [
                 {"label": "Pivotar hacia lo que los usuarios piden", "value": "pivotar", "category": "estratega"},
                 {"label": "Insistir en la visión original", "value": "insistir", "category": "disciplinado"}]},
            {"step": 3, "question": "Necesitas 200.000€ para escalar. Tienes 30.000€ ahorrados.",
             "options": [
                 {"label": "Invertir tus ahorros", "value": "ahorros", "category": "riesgo"},
                 {"label": "Buscar inversores externos (perder control)", "value": "externos", "category": "seguridad"}]},
            {"step": 4, "question": "Puedes contratar a un senior caro o a dos juniors baratos.",
             "options": [
                 {"label": "Senior, con experiencia", "value": "senior", "category": "estratega"},
                 {"label": "Dos juniors, más manos", "value": "juniors", "category": "pragmatico"}]},
            {"step": 5, "question": "Un competidor grande te ofrece comprarte por 2M€ ahora.",
             "options": [
                 {"label": "Vender y asegurar el dinero", "value": "vender", "category": "seguridad"},
                 {"label": "Rechazar y seguir construyendo", "value": "seguir", "category": "impulsivo"}]},
        ],
    },

    "soldado": {
        "role": "Soldado",
        "emoji": "⚔️",
        "tagline": "Obediencia, lealtad y duda",
        "intro": (
            "Estás en una trinchera. Llevas 14 meses en el frente. El mando "
            "ordena un ataque que, según tu intuición, matará a la mitad de tu "
            "pelotón. La obediencia es una virtud… hasta que deja de serlo."
        ),
        "steps": [
            {"step": 1, "question": "Recibes una orden que crees tácticamente errónea.",
             "options": [
                 {"label": "Obedecer sin cuestionar", "value": "obedecer", "category": "institucional"},
                 {"label": "Cuestionarla ante el oficial", "value": "cuestionar", "category": "rebelde"}]},
            {"step": 2, "question": "Un compañero herido te pide que lo saques del fuego.",
             "options": [
                 {"label": "Volver a buscarlo", "value": "volver", "category": "leal"},
                 {"label": "Cumplir la misión y dejarlo", "value": "dejar", "category": "estratega"}]},
            {"step": 3, "question": "Descubres que un compañero desertó anoche.",
             "options": [
                 {"label": "Delatarlo al mando", "value": "delatar", "category": "institucional"},
                 {"label": "Callar y cubrirlo", "value": "callar", "category": "empatico"}]},
            {"step": 4, "question": "Tienes 4 horas libres. Podrías estudiar o entrenar.",
             "options": [
                 {"label": "Estudiar estrategia y táctica", "value": "estudiar", "category": "disciplinado"},
                 {"label": "Entrenar el cuerpo hasta el agotamiento", "value": "entrenar", "category": "intuitivo"}]},
            {"step": 5, "question": "Se termina tu turno y puedes volver a casa o reengancharte.",
             "options": [
                 {"label": "Volver a casa, ya diste suficiente", "value": "casa", "category": "libre"},
                 {"label": "Reengancharte por tus compañeros", "value": "reengancharse", "category": "leal"}]},
        ],
    },

    "monje": {
        "role": "Monje",
        "emoji": "🧘",
        "tagline": "Silencio, disciplina y trascendencia",
        "intro": (
            "Vives en un monasterio en el siglo XII. Has renunciado a tu familia, "
            "a la riqueza y a tu nombre. Pero el silencio también hace preguntas, "
            "y no todas tienen respuesta."
        ),
        "steps": [
            {"step": 1, "question": "Es día de ayuno estricto. Tu cuerpo protesta.",
             "options": [
                 {"label": "Respetar el ayuno completo", "value": "ayuno", "category": "disciplinado"},
                 {"label": "Comer a escondidas un poco de pan", "value": "comer", "category": "hedonista"}]},
            {"step": 2, "question": "Te ofrecen ser maestro de novicios, pero eso rompe tu voto de silencio.",
             "options": [
                 {"label": "Mantener el silencio y rechazar", "value": "silencio", "category": "estoico"},
                 {"label": "Aceptar y enseñar con palabras", "value": "ensenar", "category": "empatico"}]},
            {"step": 3, "question": "Un peregrino rico te ofrece un donativo generoso por tus enseñanzas.",
             "options": [
                 {"label": "Aceptar el donativo para el monasterio", "value": "aceptar", "category": "pragmatico"},
                 {"label": "Rechazarlo y seguir en pobreza", "value": "rechazar", "category": "altruista"}]},
            {"step": 4, "question": "Puedes dormir 4 horas (canon monástico) o 7 (más descanso).",
             "options": [
                 {"label": "Dormir 4 horas, como manda la regla", "value": "poco", "category": "disciplinado"},
                 {"label": "Dormir 7 horas para servir mejor", "value": "mucho", "category": "pragmatico"}]},
            {"step": 5, "question": "A los 30 años, puedes quedarte para siempre o volver al mundo.",
             "options": [
                 {"label": "Quedarte y hacer votos perpetuos", "value": "quedarse", "category": "estoico"},
                 {"label": "Volver al mundo, a vivir lo humano", "value": "volver", "category": "hedonista"}]},
        ],
    },
}