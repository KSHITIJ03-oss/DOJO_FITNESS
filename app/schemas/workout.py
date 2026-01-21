from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel

class WorkoutBase(BaseModel):
    name: str
    description: Optional[str] = None
    date: Optional[date] = None
    duration: Optional[int] = None
    calories: Optional[int] = None
    notes: Optional[str] = None


class WorkoutCreate(WorkoutBase):
    pass


class WorkoutUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    date: Optional[date] = None
    duration: Optional[int] = None
    calories: Optional[int] = None
    notes: Optional[str] = None


class WorkoutOut(WorkoutBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
