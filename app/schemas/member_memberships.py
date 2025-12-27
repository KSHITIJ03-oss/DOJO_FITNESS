from pydantic import BaseModel
from datetime import date

# ---------------- PREVIEW REQUEST ----------------
class MembershipPreviewRequest(BaseModel):
    member_id: int
    plan_id: int
    start_date: date

# ---------------- PREVIEW RESPONSE ----------------
class MembershipPreviewResponse(BaseModel):
    member_id: int
    member_name: str
    plan_id: int
    plan_name: str
    duration_days: int
    start_date: date
    end_date: date

# ---------------- CONFIRMATION REQUEST ----------------
class MembershipAssignRequest(BaseModel):
    member_id: int
    plan_id: int
    start_date: date

# ---------------- FINAL OUTPUT ----------------
class MembershipOut(BaseModel):
    id: int
    member_id: int
    plan_id: int
    start_date: date
    end_date: date

    class Config:
        orm_mode = True
