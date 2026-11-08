SCENARIOS = {
    "guerrero": {
        "role": "Guerrero orco",
        "emoji": "🪓",
        "tagline": "Sangre, hierro y gloria",
        "intro": (
            "Sirves al clan Urukais Klick en las Tierras Oscuras. Aquí no hay dioses "
            "que te salven: solo el filo de tu espada, la fuerza de tu brazo y la "
            "mirada del capitán. Cada invierno mueren los débiles. Cada verano, los "
            "fuertes se reparten la carne."
        ),
        "steps": [
            {"step": 1, "question": "Tras un saqueo, has conseguido más botín que nadie.",
             "options": [
                 {"label": "Compartir el botín con la horda", "value": "compartir", "category": "cooperativo"},
                 {"label": "Quedártelo todo para ti", "value": "acaparar", "category": "individualista"}]},
            {"step": 2, "question": "Un guerrero rival te desafía a muerte por tu puesto.",
             "options": [
                 {"label": "Aceptar el duelo y matarlo", "value": "matar", "category": "agresivo"},
                 {"label": "Ignorarlo y esperar a que se debilite", "value": "esperar", "category": "estratega"}]},
            {"step": 3, "question": "El capitán ordena atacar un poblado élfico al amanecer.",
             "options": [
                 {"label": "Obedecer sin dudar", "value": "obedecer", "category": "leal"},
                 {"label": "Desafiar la orden, es un suicidio", "value": "desafiar", "category": "rebelde"}]},
            {"step": 4, "question": "Capturas a un humano que podría tener información.",
             "options": [
                 {"label": "Torturarlo hasta que hable", "value": "torturar", "category": "agresivo"},
                 {"label": "Interrogarlo con astucia", "value": "astucia", "category": "estratega"}]},
            {"step": 5, "question": "La horda pasa hambre. Hay prisioneros débiles en las jaulas.",
             "options": [
                 {"label": "Sacrificarlos para alimentar al clan", "value": "sacrificar", "category": "pragmatico"},
                 {"label": "Dejarlos vivir, quizá sirvan de esclavos", "value": "conservar", "category": "estratega"}]},
        ],
    },

    "rastreador": {
        "role": "Rastreador",
        "emoji": "🏹",
        "tagline": "Acechar en las sombras",
        "intro": (
            "Tus ojos ven en la oscuridad lo que otros ni imaginan. Rastreas presas "
            "durante días sin dormir, y vuelves con la información que decide batallas. "
            "El clan depende de tu olfato. Pero los rastreadores que fallan no vuelven."
        ),
        "steps": [
            {"step": 1, "question": "Encuentras huellas de un grupo élfico cerca del campamento.",
             "options": [
                 {"label": "Volver a avisar al capitán", "value": "avisar", "category": "leal"},
                 {"label": "Seguirlos solo para ganar prestigio", "value": "seguir", "category": "individualista"}]},
            {"step": 2, "question": "Debes cruzar un río helado. Un compañero herido no puede nadar.",
             "options": [
                 {"label": "Cargarlo tú mismo al otro lado", "value": "cargar", "category": "empatico"},
                 {"label": "Dejarlo, la misión es lo primero", "value": "dejar", "category": "pragmatico"}]},
            {"step": 3, "question": "Encuentras un cofre antiguo con un objeto brillante.",
             "options": [
                 {"label": "Cogerlo, es un botín valioso", "value": "coger", "category": "impulsivo"},
                 {"label": "Dejarlo, podría estar maldito", "value": "dejar_cofre", "category": "reflexivo"}]},
            {"step": 4, "question": "El capitán te pregunta si viste algo sospechoso en el bosque.",
             "options": [
                 {"label": "Contarle todo lo que sabes", "value": "contar", "category": "leal"},
                 {"label": "Ocultar los detalles importantes", "value": "ocultar", "category": "estratega"}]},
            {"step": 5, "question": "Una tormenta te sorprende lejos del campamento.",
             "options": [
                 {"label": "Refugiarte en una cueva desconocida", "value": "cueva", "category": "curioso"},
                 {"label": "Volver corriendo al campamento conocido", "value": "volver", "category": "seguridad"}]},
        ],
    },

    "herrero": {
        "role": "Herrero de guerra",
        "emoji": "⚒️",
        "tagline": "Forjar lo que mata",
        "intro": (
            "Tu yunque suena día y noche bajo la Montaña Oscura. Sin tus armas, la "
            "horda no sería más que bestias con palos. Los guerreros te respetan porque "
            "saben que su vida depende de tu martillo. Pero el fuego también consume."
        ),
        "steps": [
            {"step": 1, "question": "Un guerrero te pide forjarle una espada especial, fuera de turno.",
             "options": [
                 {"label": "Forjarla y cobrarle el doble", "value": "cobrar", "category": "pragmatico"},
                 {"label": "Rechazarlo, todos esperan su turno", "value": "rechazar", "category": "disciplinado"}]},
            {"step": 2, "question": "Encuentras mineral enano de altísima calidad en una mina derrumbada.",
             "options": [
                 {"label": "Bajar a por él arriesgando tu vida", "value": "bajar", "category": "riesgo"},
                 {"label": "Marcar la mina y volver con refuerzos", "value": "refuerzos", "category": "estratega"}]},
            {"step": 3, "question": "Un joven orco quiere ser tu aprendiz.",
             "options": [
                 {"label": "Enseñarle todo lo que sabes", "value": "ensenar", "category": "altruista"},
                 {"label": "Mantener tus secretos, el conocimiento es poder", "value": "secretos", "category": "status"}]},
            {"step": 4, "question": "El capitán te pide forjar un arma para él, pero maldices el metal.",
             "options": [
                 {"label": "Forjarla perfecta, es el capitán", "value": "perfecta", "category": "leal"},
                 {"label": "Sabotearla en secreto", "value": "sabotear", "category": "rebelde"}]},
            {"step": 5, "question": "Tu horno se apaga y no hay carbón suficiente.",
             "options": [
                 {"label": "Quemar tu propia casa para seguir forjando", "value": "quemar", "category": "disciplinado"},
                 {"label": "Esperar a que llegue el próximo cargamento", "value": "esperar_carbon", "category": "reflexivo"}]},
        ],
    },

    "chaman": {
        "role": "Chamán oscuro",
        "emoji": "🩸",
        "tagline": "Susurrar a la Oscuridad",
        "intro": (
            "No sirves a dioses ni a señores. Sirves a la Oscuridad misma, que habla "
            "en sueños y exige sangre. Los orcos te temen más que al capitán. Pero "
            "quien escucha a la Oscuridad, tarde o temprano, es devorado por ella."
        ),
        "steps": [
            {"step": 1, "question": "La Oscuridad te pide el sacrificio de un guerrero leal.",
             "options": [
                 {"label": "Sacrificarlo en secreto", "value": "sacrificar_guerrero", "category": "institucional"},
                 {"label": "Rechazar la petición y desafiar a la Oscuridad", "value": "rechazar_oscuridad", "category": "rebelde"}]},
            {"step": 2, "question": "Un joven orco enfermo te pide curación.",
             "options": [
                 {"label": "Curarlo con rituales prohibidos", "value": "curar", "category": "empatico"},
                 {"label": "Dejarlo morir, la debilidad no debe sobrevivir", "value": "dejar_morir", "category": "pragmatico"}]},
            {"step": 3, "question": "En un trance, ves el futuro: la horda será aniquilada.",
             "options": [
                 {"label": "Advertir al capitán aunque no te crea", "value": "advertir", "category": "leal"},
                 {"label": "Callar y preparar tu propia huida", "value": "callar", "category": "individualista"}]},
            {"step": 4, "question": "Encuentras un grimorio antiguo con magia olvidada.",
             "options": [
                 {"label": "Estudiarlo a fondo, sin miedo", "value": "estudiar", "category": "curioso"},
                 {"label": "Quemarlo, hay conocimientos que no deben existir", "value": "quemar_grimorio", "category": "reflexivo"}]},
            {"step": 5, "question": "La Oscuridad te ofrece poder inmenso a cambio de tu alma.",
             "options": [
                 {"label": "Aceptar el pacto", "value": "aceptar_pacto", "category": "ambicion"},
                 {"label": "Rechazarlo, tu alma aún es tuya", "value": "rechazar_pacto", "category": "estoico"}]},
        ],
    },

    "domador": {
        "role": "Domador de wargos",
        "emoji": "🐺",
        "tagline": "Bestias que obedecen",
        "intro": (
            "Los wargos no son perros. Son muerte con colmillos. Solo tú puedes "
            "montarlos sin que te arranquen el brazo. La horda te necesita para sus "
            "cargas de caballería. Pero las bestias siempre recuerdan quién manda."
        ),
        "steps": [
            {"step": 1, "question": "Un cachorro de wargo rechaza el alimento de tu mano.",
             "options": [
                 {"label": "Forzarlo con violencia hasta que obedezca", "value": "forzar", "category": "agresivo"},
                 {"label": "Tener paciencia hasta ganarte su confianza", "value": "paciencia", "category": "empatico"}]},
            {"step": 2, "question": "Un wargo mata a un guerrero del clan por error.",
             "options": [
                 {"label": "Sacrificar al wargo ante la horda", "value": "sacrificar_wargo", "category": "institucional"},
                 {"label": "Defenderlo, fue culpa del guerrero", "value": "defender", "category": "leal"}]},
            {"step": 3, "question": "Encuentras una camada de wargos blancos, más grandes y feroces.",
             "options": [
                 {"label": "Intentar domarlos, sería un gran poder", "value": "domar_blancos", "category": "riesgo"},
                 {"label": "Matarlos, son demasiado peligrosos", "value": "matar_blancos", "category": "seguridad"}]},
            {"step": 4, "question": "El capitán quiere tu wargo principal para su montura personal.",
             "options": [
                 {"label": "Cederlo, es una orden", "value": "ceder", "category": "leal"},
                 {"label": "Negarte, tu vínculo es más fuerte", "value": "negar", "category": "rebelde"}]},
            {"step": 5, "question": "Tu wargo está herido de muerte tras una batalla.",
             "options": [
                 {"label": "Matarlo tú mismo, es una muerte digna", "value": "matar_misericordia", "category": "estoico"},
                 {"label": "Intentar salvarlo con rituales oscuros", "value": "salvar", "category": "altruista"}]},
        ],
    },

    "capitan": {
        "role": "Capitán de la horda",
        "emoji": "👑",
        "tagline": "Liderar o morir",
        "intro": (
            "El capitán anterior murió con tu cuchillo en la espalda. Ahora todos te "
            "miran esperando que falles. La horda obedece, pero solo mientras seas "
            "fuerte. Un líder débil se convierte en cadáver antes del próximo invierno."
        ),
        "steps": [
            {"step": 1, "question": "Un guerrero veterano desafía tu autoridad en público.",
             "options": [
                 {"label": "Matarlo delante de todos para dar ejemplo", "value": "matar_publico", "category": "agresivo"},
                 {"label": "Darle un puesto de honor, ganártelo", "value": "honor", "category": "estratega"}]},
            {"step": 2, "question": "La horda pasa hambre. Debes decidir quién come primero.",
             "options": [
                 {"label": "Los guerreros fuertes primero", "value": "fuertes", "category": "pragmatico"},
                 {"label": "Repartir por igual entre todos", "value": "repartir", "category": "cooperativo"}]},
            {"step": 3, "question": "Un clan vecino te propone una alianza contra un enemigo común.",
             "options": [
                 {"label": "Aceptar la alianza, aunque sea temporal", "value": "alianza", "category": "estratega"},
                 {"label": "Rechazarla, los orcos no se alían", "value": "rechazar_alianza", "category": "tradicional"}]},
            {"step": 4, "question": "Tu hermano de sangre comete un error que cuesta vidas.",
             "options": [
                 {"label": "Castigarlo como a cualquier otro", "value": "castigar", "category": "disciplinado"},
                 {"label": "Perdonarlo, la sangre pesa más", "value": "perdonar", "category": "leal"}]},
            {"step": 5, "question": "Un joven orco te salva la vida en batalla.",
             "options": [
                 {"label": "Nombrarlo tu segundo al mando", "value": "nombrar", "category": "altruista"},
                 {"label": "Mantenerlo cerca, pero sin poder real", "value": "cerca", "category": "individualista"}]},
        ],
    },

    "esclavista": {
        "role": "Esclavista",
        "emoji": "🔗",
        "tagline": "Gestionar la carne débil",
        "intro": (
            "Tú decides quién vive y quién muere entre los prisioneros. Los esclavos "
            "construyen, minan, cocinan y sangran por el clan. Sin ti, la horda "
            "colapsaría. Pero los débiles también muerden cuando menos lo esperas."
        ),
        "steps": [
            {"step": 1, "question": "Un esclavo humano intenta escapar pero es capturado.",
             "options": [
                 {"label": "Ejecutarlo públicamente como escarmiento", "value": "ejecutar", "category": "agresivo"},
                 {"label": "Azotarlo y devolverlo al trabajo", "value": "azotar", "category": "pragmatico"}]},
            {"step": 2, "question": "Una esclava élfica te suplica por la vida de su hijo.",
             "options": [
                 {"label": "Perdonar al niño, no es una amenaza", "value": "perdonar_nino", "category": "empatico"},
                 {"label": "Venderlos a ambos a otro clan", "value": "vender", "category": "individualista"}]},
            {"step": 3, "question": "Los esclavos están débiles y ya no rinden.",
             "options": [
                 {"label": "Alimentarlos mejor para que trabajen más", "value": "alimentar", "category": "estratega"},
                 {"label": "Reemplazarlos por nuevos prisioneros", "value": "reemplazar", "category": "pragmatico"}]},
            {"step": 4, "question": "Un esclavo te ofrece información valiosa a cambio de libertad.",
             "options": [
                 {"label": "Aceptar el trato", "value": "aceptar_trato", "category": "estratega"},
                 {"label": "Sacarle la información y luego matarlo", "value": "traicionar", "category": "traicion"}]},
            {"step": 5, "question": "El capitán te ordena matar a todos los esclavos antes de huir.",
             "options": [
                 {"label": "Obedecer sin dudar", "value": "obedecer_matar", "category": "leal"},
                 {"label": "Liberar a algunos en secreto", "value": "liberar", "category": "rebelde"}]},
        ],
    },

    "asesino": {
        "role": "Asesino del clan",
        "emoji": "🗡️",
        "tagline": "La traición como oficio",
        "intro": (
            "Nadie sabe tu nombre, y si lo supieran, estarías muerto. Eliminas a los "
            "enemigos del capitán en la oscuridad: elfos, hombres, otros orcos. Vives "
            "en sombras y mueres en sombras. Pero el filo también corta al que lo empuña."
        ),
        "steps": [
            {"step": 1, "question": "El capitán te ordena matar a un orco del clan sin explicar por qué.",
             "options": [
                 {"label": "Obedecer sin preguntar", "value": "obedecer_sin", "category": "leal"},
                 {"label": "Exigir una explicación antes de actuar", "value": "exigir", "category": "rebelde"}]},
            {"step": 2, "question": "Tu objetivo es un niño élfico que podría ser el próximo líder enemigo.",
             "options": [
                 {"label": "Matarlo, mañana será una amenaza", "value": "matar_nino", "category": "estratega"},
                 {"label": "Perdonarlo, tu cuchillo no corta niños", "value": "perdonar_elfo", "category": "empatico"}]},
            {"step": 3, "question": "Descubres que el capitán te mintió sobre tu última misión.",
             "options": [
                 {"label": "Confrontarlo directamente", "value": "confrontar", "category": "rebelde"},
                 {"label": "Callar y guardar la información para el futuro", "value": "guardar_info", "category": "estratega"}]},
            {"step": 4, "question": "Un rival asesino del clan te ofrece colaborar para eliminar al capitán.",
             "options": [
                 {"label": "Aceptar y planear el golpe juntos", "value": "colaborar", "category": "cooperativo"},
                 {"label": "Matarlo ahí mismo, es un traidor", "value": "matar_rival", "category": "leal"}]},
            {"step": 5, "question": "Tienes la oportunidad de huir y vivir libre, lejos de todo.",
             "options": [
                 {"label": "Huir, ya has derramado suficiente sangre", "value": "huir", "category": "libre"},
                 {"label": "Quedarte, tu lugar es la horda", "value": "quedarte", "category": "leal"}]},
        ],
    },


    "berserker": {
        "role": "Berserker",
        "emoji": "🐗",
        "tagline": "Furia sin control",
        "intro": (
            "No piensas. No dudas. No temes. Cuando la sangre se calienta, tu mente "
            "se apaga y tu cuerpo se convierte en un solo instinto: matar. Los capitanes "
            "te temen tanto como te usan. Pero la furia también consume al que la lleva."
        ),
        "steps": [
            {"step": 1, "question": "En plena batalla, el capitán ordena retroceder. Tú quieres seguir matando.",
             "options": [
                 {"label": "Obedecer y retroceder (con rabia contenida)", "value": "obedecer", "category": "disciplinado"},
                 {"label": "Ignorar la orden y cargar solo", "value": "cargar", "category": "agresivo"}]},
            {"step": 2, "question": "Un enemigo herido te suplica que lo mates rápido.",
             "options": [
                 {"label": "Matarlo de un golpe limpio", "value": "matar_limpio", "category": "pragmatico"},
                 {"label": "Torturarlo despacio, la furia exige sangre", "value": "torturar", "category": "agresivo"}]},
            {"step": 3, "question": "Tu furia te ha hecho herir a un compañero del clan por error.",
             "options": [
                 {"label": "Pedir perdón al clan y aceptar el castigo", "value": "pedir_perdon", "category": "leal"},
                 {"label": "Culpar al herido por ponerse en medio", "value": "culpar", "category": "individualista"}]},
            {"step": 4, "question": "El chamán te ofrece un brebaje para controlar la furia.",
             "options": [
                 {"label": "Bebérlo y perder parte de tu fuerza", "value": "beber", "category": "reflexivo"},
                 {"label": "Rechazarlo, tu furia es tu poder", "value": "rechazar_brebaje", "category": "libre"}]},
            {"step": 5, "question": "En el fragor del combate ves al capitán acorralado.",
             "options": [
                 {"label": "Salvarlo aunque te cueste la vida", "value": "salvar_capitan", "category": "altruista"},
                 {"label": "Aprovechar para matarlo tú y ocupar su puesto", "value": "matar_capitan", "category": "ambicion"}]},
        ],
    },

    "nigromante": {
        "role": "Nigromante",
        "emoji": "💀",
        "tagline": "Pactos con la muerte",
        "intro": (
            "Mientras otros orcos empuñan espadas, tú empuñas nombres. Los muertos "
            "te obedecen. Pero cada vez que devuelves a alguien de la Oscuridad, algo "
            "en ti se apaga. La nigromancia no perdona: siempre cobra."
        ),
        "steps": [
            {"step": 1, "question": "Uno de tus guerreros favoritos muere en batalla.",
             "options": [
                 {"label": "Resucitarlo con magia prohibida", "value": "resucitar", "category": "ambicion"},
                 {"label": "Dejarlo morir, la muerte es sagrada", "value": "dejar_morir", "category": "tradicional"}]},
            {"step": 2, "question": "Un espíritu antiguo te ofrece conocimiento a cambio de un recuerdo.",
             "options": [
                 {"label": "Aceptar el trato, el conocimiento vale más", "value": "aceptar_espiritu", "category": "curioso"},
                 {"label": "Rechazarlo, tus recuerdos son tuyos", "value": "rechazar_espiritu", "category": "estoico"}]},
            {"step": 3, "question": "El capitán descubre tus prácticas y te amenaza con ejecutarte.",
             "options": [
                 {"label": "Ofrecerle poder a cambio de tu vida", "value": "pactar_capitan", "category": "estratega"},
                 {"label": "Huir del clan y seguir solo", "value": "huir", "category": "libre"}]},
            {"step": 4, "question": "Puedes levantar un ejército de muertos, pero matará a todos los vivos cercanos.",
             "options": [
                 {"label": "Levantarlo, la victoria lo justifica", "value": "levantar", "category": "ambicion"},
                 {"label": "Rechazarlo, no quieres ser un carnicero de vivos", "value": "rechazar_ejercito", "category": "empatico"}]},
            {"step": 5, "question": "Al final del ritual, la Oscuridad te pide tu propio nombre.",
             "options": [
                 {"label": "Entregarlo y convertirte en leyenda", "value": "entregar_nombre", "category": "poder"},
                 {"label": "Romper el ritual y conservar tu identidad", "value": "romper", "category": "autenticidad"}]},
        ],
    },
}

