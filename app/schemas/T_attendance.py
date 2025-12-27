# app/schemas/trainer_attendance.py
from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional

class TrainerAttendanceCreate(BaseModel):
    # trainer_id is optional if the current user is a trainer (they can omit it)
    trainer_id: Optional[int] = None
    # Optional: allow start date/time override only if admin/receptionist (we'll accept date; backend uses now if not provided)
    # For simplicity we'll not accept custom times. Use server time.

class TrainerAttendanceOut(BaseModel):
    id: int
    trainer_id: int
    check_in: datetime
    check_out: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True
