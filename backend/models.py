from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(64), nullable=True, index=True)  # NEW
    role = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    decisions = relationship("Decision", back_populates="user")
    cards = relationship("CardUnlock", back_populates="user")


class Decision(Base):
    __tablename__ = "decisions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    step = Column(Integer, nullable=False)
    choice = Column(String, nullable=False)
    category = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="decisions")


class CardUnlock(Base):
    __tablename__ = "cards_unlocked"
    __table_args__ = (UniqueConstraint("user_id", "card_key", name="uq_user_card"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    card_key = Column(String, nullable=False)
    unlocked_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="cards")