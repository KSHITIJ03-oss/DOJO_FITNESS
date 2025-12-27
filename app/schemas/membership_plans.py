from datetime import datetime
from pydantic import BaseModel, Field

class PlanBase(BaseModel):
    name: str = Field(..., max_length=50)
    description: str | None = None
    price: float
    discount: float = 0.0
    duration_days: int

class PlanCreate(PlanBase):
    pass

class PlanUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = None
    discount: float | None = None
    duration_days: int | None = None
    is_active: bool | None = None

class PlanOut(PlanBase):
    id: int
    final_price: float
    is_active: bool
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True

    # created_at: str
    # updated_at: str | None