import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Forzamos el driver psycopg2 explícitamente para que SQLAlchemy no intente
# cargar 'psycopg' (v3), que no está instalado.
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://sapiens:sapiens_pass@db:5432/sapiens_klick",
).replace("postgresql://", "postgresql+psycopg2://")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()