from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime


class QueryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    mobile: str = Field(..., min_length=8, max_length=15)
    email: Optional[EmailStr] = None
    message: Optional[str] = Field(None, max_length=500)

class QueryResponse(BaseModel):
    id: int
    name: str
    mobile: str
    email: Optional[str]
    message: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
