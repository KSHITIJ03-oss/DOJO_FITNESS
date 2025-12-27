from pydantic import BaseModel
from datetime import date, datetime

class MemberBase(BaseModel):
    name: str
    phone: str
    age: int | None = None
    gender: str | None = None
    address: str | None = None
    membership_type: str | None = None
    membership_start: date | None = None
    membership_end: date | None = None


class MemberCreate(MemberBase):
    pass


class MemberUpdate(MemberBase):
    # all fields optional so patching works
    name: str | None = None
    phone: str | None = None


class MemberOut(MemberBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
