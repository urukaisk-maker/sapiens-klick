# 🪓 Urukais Klick

> Simulador de decisiones en las Tierras Oscuras de Mordor.
> Encarna a un orco del clan **Urukais Klick** y descubre qué tipo de guerrero eres.

**Demo**: [silly-boba-dc057e.netlify.app](https://silly-boba-dc057e.netlify.app/) · **Repo**: [github.com/urukaisk-maker/sapiens-klick](https://github.com/urukaisk-maker/sapiens-klick)

---

Juego interactivo inspirado en *El Señor de los Anillos* de J.R.R. Tolkien. No hay dioses, no hay moral, no hay segundas oportunidades: solo el filo de tu espada, la fuerza de tu brazo y la mirada del capitán.

Cada partida son 5 decisiones. Al final obtienes **perfil de guerra**, **comparativa** con otros orcos, **insight narrativo** y una **carta de conocimiento** desbloqueable (35 en total).

## 🎭 Arquetipos

🪓 Guerrero orco · 🏹 Rastreador · ⚒️ Herrero de guerra · 🩸 Chamán oscuro · 🐺 Domador de wargos · 👑 Capitán de la horda · 🔗 Esclavista · 🗡️ Asesino del clan

## 🏗️ Stack

Python 3.12 · FastAPI · SQLAlchemy · PostgreSQL 16 · Redis 7 · React 18 · Vite · Nginx · Docker Compose

## 🚀 Arrancar en local

```bash
git clone https://github.com/urukaisk-maker/sapiens-klick.git
cd sapiens-klick
cp .env.example .env
docker compose up -d --build