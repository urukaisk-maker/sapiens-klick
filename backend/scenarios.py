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

    "politico": {
        "role": "Político",
        "emoji": "🏛️",
        "tagline": "Poder, promesas y traiciones",
        "intro": (
            "Año 2026. Eres diputado en un parlamento polarizado. Tienes 4 años "
            "de mandato y una reelección por delante. Cada decisión que tomes "
            "ahora será usada en tu contra — o a tu favor — dentro de 4 años."
        ),
        "steps": [
            {"step": 1, "question": "Un periodista te ofrece publicar una exclusiva que hundiría a tu rival.",
             "options": [
                 {"label": "Publicarla, la política es así", "value": "publicar", "category": "competitivo"},
                 {"label": "Rechazarla, no todo vale", "value": "rechazar", "category": "estoico"}]},
            {"step": 2, "question": "Tu partido te pide votar una ley en la que no crees.",
             "options": [
                 {"label": "Votar con el partido (disciplina)", "value": "disciplina", "category": "institucional"},
                 {"label": "Romper la disciplina y votar según tu conciencia", "value": "romper", "category": "rebelde"}]},
            {"step": 3, "question": "Una encuesta dice que tu electorado quiere medidas más duras con inmigrantes.",
             "options": [
                 {"label": "Adoptar el discurso duro para ganar votos", "value": "duro", "category": "estratega"},
                 {"label": "Mantener tu posición humanitaria", "value": "humanitario", "category": "empatico"}]},
            {"step": 4, "question": "Un empresario te ofrece financiar tu campaña a cambio de favores futuros.",
             "options": [
                 {"label": "Aceptar el dinero y el pacto", "value": "aceptar", "category": "pragmatico"},
                 {"label": "Rechazarlo y financiarte con pequeños donantes", "value": "rechazar", "category": "altruista"}]},
            {"step": 5, "question": "En el último año, puedes impulsar una reforma impopular pero necesaria.",
             "options": [
                 {"label": "Impulsarla y arriesgar la reelección", "value": "impulsar", "category": "libre"},
                 {"label": "Aplazarla y asegurar tu escaño", "value": "aplazar", "category": "seguridad"}]},
        ],
    },

    "artista": {
        "role": "Artista",
        "emoji": "🎨",
        "tagline": "Crear entre la libertad y el mercado",
        "intro": (
            "Año 2026. Llevas 10 años creando. Tienes una pequeña comunidad que "
            "te sigue, pero el dinero no llega. El mercado te tienta; tu voz "
            "interior te dice otra cosa. Cada decisión definirá qué tipo de "
            "artista serás cuando mires atrás."
        ),
        "steps": [
            {"step": 1, "question": "Una marca importante quiere patrocinar tu próxima obra.",
             "options": [
                 {"label": "Aceptar el patrocinio y adaptarte a su brief", "value": "aceptar", "category": "pragmatico"},
                 {"label": "Rechazarlo y mantener tu libertad creativa", "value": "rechazar", "category": "libre"}]},
            {"step": 2, "question": "Un crítico influyente destroza tu última exposición.",
             "options": [
                 {"label": "Responder públicamente", "value": "responder", "category": "status"},
                 {"label": "Ignorarlo y seguir trabajando", "value": "ignorar", "category": "estoico"}]},
            {"step": 3, "question": "Puedes dedicar 6 meses a una obra personal o a 6 encargos rentables.",
             "options": [
                 {"label": "Obra personal (sin ingresos)", "value": "personal", "category": "libre"},
                 {"label": "Encargos rentables (con dinero)", "value": "encargos", "category": "seguridad"}]},
            {"step": 4, "question": "Te ofrecen una residencia en el extranjero, lejos de tu comunidad.",
             "options": [
                 {"label": "Irte y crecer fuera", "value": "irte", "category": "curioso"},
                 {"label": "Quedarte con tu gente", "value": "quedarte", "category": "leal"}]},
            {"step": 5, "question": "Al final del año, decides qué tipo de artista quieres ser.",
             "options": [
                 {"label": "Artista de masas (éxito y visibilidad)", "value": "masas", "category": "status"},
                 {"label": "Artista de culto (pocos, pero fieles)", "value": "culto", "category": "altruista"}]},
        ],
    },
}