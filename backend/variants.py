# Variantes contextuales de la pregunta del paso 2 según lo elegido en el paso 1.
# Estructura: VARIANTS[role][step_num][category] = "texto contextualizado"

VARIANTS = {
    "cazador": {
        2: {
            "cooperativo": "Después de compartir la carne, el grupo confía en ti. Un miembro se rompe la pierna y no puede caminar.",
            "individualista": "Desde que guardaste la carne, hay tensión en el grupo. Un miembro se rompe la pierna y no puede caminar.",
        }
    },
    "agricultor": {
        2: {
            "institucional": "Has pagado el tributo. El templo te respeta. Ahora, una sequía amenaza la cosecha y el templo dice que hay que rezar más.",
            "rebelde": "Has escondido grano. Vives con miedo a ser descubierto. Ahora, una sequía amenaza la cosecha y el templo dice que hay que rezar más.",
        }
    },
    "consumidor": {
        2: {
            "status": "Compraste la camiseta de marca; te sientes bien. Ahora, un contrato de 5 páginas para un servicio digital.",
            "pragmatico": "Elegiste lo práctico y barato. Ahora, un contrato de 5 páginas para un servicio digital.",
        }
    },
    "emprendedor": {
        2: {
            "cooperativo": "Tu socio y tú estáis al 50%. Han pasado 8 meses y los usuarios no crecen.",
            "individualista": "Tu socio tiene solo el 10%. Han pasado 8 meses y los usuarios no crecen.",
        }
    },
    "soldado": {
        2: {
            "institucional": "Obedeciste la orden sin cuestionar. Ahora un compañero herido te pide que lo saques del fuego.",
            "rebelde": "Cuestionaste al oficial delante de todos. Ahora un compañero herido te pide que lo saques del fuego.",
        }
    },
    "monje": {
        2: {
            "disciplinado": "Respetaste el ayuno completo. Ahora te ofrecen ser maestro de novicios, pero eso rompería tu voto de silencio.",
            "hedonista": "Comiste a escondidas un poco de pan. Ahora te ofrecen ser maestro de novicios, pero eso rompería tu voto de silencio.",
        }
    },
    "politico": {
        2: {
            "competitivo": "Publicaste la exclusiva que hundió a tu rival. Ahora tu partido te pide votar una ley en la que no crees.",
            "estoico": "Rechazaste la exclusiva; tu rival sigue en pie. Ahora tu partido te pide votar una ley en la que no crees.",
        }
    },
    "artista": {
        2: {
            "pragmatico": "Aceptaste el patrocinio de la marca. Ahora un crítico influyente destroza tu última exposición.",
            "libre": "Rechazaste el patrocinio; sigues sin dinero. Ahora un crítico influyente destroza tu última exposición.",
        }
    },
}