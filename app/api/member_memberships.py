from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from datetime import timedelta

from app.db.database import get_db
from app.api.deps import require_roles

from app.models.members import Member
from app.models.membership_plans import MembershipPlan
from app.models.member_memberships import MemberMembership

from app.schemas.member_memberships import (
    MembershipPreviewRequest,
    MembershipPreviewResponse,
    MembershipAssignRequest,
    MembershipOut,
)

security = HTTPBearer()
router = APIRouter(prefix="/member-memberships", tags=["member-memberships"],dependencies=[Depends(security)])

# ------------------ PREVIEW ------------------
@router.post("/preview", response_model=MembershipPreviewResponse,
             dependencies=[Depends(require_roles(["admin", "receptionist"]))])
def preview_assignment(data: MembershipPreviewRequest, db: Session = Depends(get_db)):

    member = db.query(Member).filter(Member.id == data.member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    plan = db.query(MembershipPlan).filter(MembershipPlan.id == data.plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    end_date = data.start_date + timedelta(days=plan.duration_days)

    return MembershipPreviewResponse(
        member_id=member.id,
        member_name=member.name,
        plan_id=plan.id,
        plan_name=plan.name,
        duration_days=plan.duration_days,
        start_date=data.start_date,
        end_date=end_date
    )

# ------------------ CONFIRM ------------------
@router.post("/assign", response_model=MembershipOut,
             dependencies=[Depends(require_roles(["admin", "receptionist"]))])
def assign_plan(data: MembershipAssignRequest, db: Session = Depends(get_db)):

    member = db.query(Member).filter(Member.id == data.member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    plan = db.query(MembershipPlan).filter(MembershipPlan.id == data.plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    end_date = data.start_date + timedelta(days=plan.duration_days)

    new_assign = MemberMembership(
        member_id=data.member_id,
        plan_id=data.plan_id,
        start_date=data.start_date,
        end_date=end_date
    )

    db.add(new_assign)
    db.commit()
    db.refresh(new_assign)

    return new_assign
