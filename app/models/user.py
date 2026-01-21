from sqlalchemy import Column, Integer, String, DateTime, Enum
from datetime import datetime, timezone
from app.db.base import Base
import enum
from sqlalchemy.orm import relationship

class role(str, enum.Enum):
    admin = "admin"
    trainer = "trainer"
    receptionist = "receptionist"
    member = "member"


class status(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(role), default=role.member)
    status = Column(Enum(status), default=status.pending)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), onupdate=lambda: datetime.now(timezone.utc))

    workouts = relationship("Workout", back_populates="user", cascade="all, delete-orphan")
