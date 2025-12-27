# app/models/trainer_attendance.py
from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.db.base import Base 

class TrainerAttendance(Base):
    __tablename__ = "trainer_attendance"

    id = Column(Integer, primary_key=True, index=True)
    trainer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    check_in = Column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
    check_out = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # relationships
    trainer = relationship("User", foreign_keys=[trainer_id])
