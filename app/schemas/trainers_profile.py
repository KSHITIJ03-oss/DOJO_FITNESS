# app/schemas/trainer_profile.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class TrainerProfileCreate(BaseModel):
    # if creating a new user+trainer in one call:
    email: EmailStr
    name: str
    password: str  # hashed server-side
    specialization: Optional[str] = None
    bio: Optional[str] = None
    experience_years: Optional[int] = None
    phone: Optional[str] = None
    certifications: Optional[str] = None

class TrainerProfileCreateForExistingUser(BaseModel):
    user_email: EmailStr
    specialization: Optional[str] = None
    bio: Optional[str] = None
    experience_years: Optional[int] = None
    phone: Optional[str] = None
    certifications: Optional[str] = None

class TrainerProfileUpdate(BaseModel):
    specialization: Optional[str] = None
    bio: Optional[str] = None
    experience_years: Optional[int] = None
    phone: Optional[str] = None
    certifications: Optional[str] = None

class TrainerProfileOut(BaseModel):
    id: int
    user_id: int
    user_email: str
    user_name: str
    specialization: Optional[str]
    bio: Optional[str]
    experience_years: Optional[int]
    phone: Optional[str]
    certifications: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
