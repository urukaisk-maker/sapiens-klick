# 🧠 Sapiens Klick

> Simulador interactivo de las "ficciones colectivas" que nos gobiernan.
> Inspirado en *Sapiens: De animales a dioses* de Yuval Noah Harari.

**Demo online**: [silly-boba-dc057e.netlify.app](https://silly-boba-dc057e.netlify.app/)

---

**Sapiens Klick** sumerge al usuario en distintos arquetipos históricos y modernos para explorar cómo las narrativas compartidas (dinero, dioses, marcas, Estado) moldean nuestras decisiones.

## 🎭 Arquetipos

| Rol | Emoji | Contexto |
|---|---|---|
| Cazador-recolector | 🏹 | Bandas de 30 personas, sin Estado ni dinero |
| Súbdito agrícola | 🌾 | Mesopotamia, tributos y templos |
| Consumidor moderno | 🛍️ | Marcas, algoritmos y contratos |
| Emprendedor digital | 🚀 | Startups, riesgo y control |
| Soldado | ⚔️ | Obediencia, lealtad y duda |
| Monje | 🧘 | Silencio, disciplina y trascendencia |

Cada partida tiene 5 decisiones. Al final obtienes **perfil conductual**, **comparativa** con otros del mismo rol, **insight narrativo** y **carta de conocimiento** desbloqueable (25 en total).

## 🏗️ Stack

- **Backend**: Python 3.12 + FastAPI + SQLAlchemy
- **Frontend**: React 18 + Vite + Nginx
- **Base de datos**: PostgreSQL 16
- **Cache/Cola**: Redis 7
- **Orquestación**: Docker Compose

## 🚀 Arrancar en local

```bash
git clone https://github.com/urukaisk-maker/sapiens-klick.git
cd sapiens-klick
cp .env.example .env
docker compose up -d --build