"""
Fitness Checkup API endpoints.

Provides:
- GET /fitness-checkups/due - Get members with fitness checkups due
- POST /fitness-checkups/{member_id}/mark-done - Mark checkup as completed
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, datetime, timezone
from typing import List

from app.db.database import get_db
from app.models.members import Member
from app.schemas.members import MemberOut
from app.api.deps import require_roles
from app.utils.fitness_checkup import (
    calculate_next_fitness_checkup_date,
    is_checkup_due_soon,
)
from fastapi.security import HTTPBearer

security = HTTPBearer()
router = APIRouter(
    prefix="/fitness-checkups",
    tags=["fitness-checkups"],
    dependencies=[Depends(security)],
)


@router.get(
    "/due",
    response_model=List[MemberOut],
    dependencies=[Depends(require_roles(["admin", "receptionist"]))],
)
def get_members_with_due_checkups(db: Session = Depends(get_db)):
    """
    Get all members whose fitness checkup is due within the next 2 days.

    This endpoint returns members where:
    - next_fitness_checkup_date is <= today + 2 days
    - next_fitness_checkup_date is not null

    Only accessible to admin and receptionist roles.

    Returns:
        List of members with due fitness checkups, ordered by urgency
    """
    today = date.today()

    # Query members with checkups due within next 2 days
    members_due = (
        db.query(Member)
        .filter(
            Member.next_fitness_checkup_date.isnot(None),
            Member.next_fitness_checkup_date <= today + \
            _timedelta_like(days=2),
        )
        .order_by(Member.next_fitness_checkup_date.asc())
        .all()
    )

    return members_due


@router.post(
    "/{member_id}/mark-done",
    response_model=MemberOut,
    dependencies=[Depends(require_roles(["admin", "receptionist"]))],
)
def mark_fitness_checkup_done(
    member_id: int, db: Session = Depends(get_db)
):
    """
    Mark a fitness checkup as completed for a member.

    Updates:
    - last_fitness_checkup_date = today
    - next_fitness_checkup_date = today + 21 days

    Only accessible to admin and receptionist roles.

    Args:
        member_id: The member's ID

    Returns:
        Updated member object with recalculated checkup dates

    Raises:
        404: Member not found
    """
    member = db.query(Member).filter(Member.id == member_id).first()

    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    today = date.today()

    # Mark the checkup as done
    member.last_fitness_checkup_date = today

    # Recalculate next checkup: 21 days from today
    member.next_fitness_checkup_date = calculate_next_fitness_checkup_date(
        membership_start=member.membership_start,
        created_at=member.created_at,
        last_checkup_date=today,
        checkpoint_interval_days=21,
    )

    db.commit()
    db.refresh(member)

    return member


def _timedelta_like(days: int):
    """Helper to add days to today's date."""
    from datetime import timedelta

    return date.today() + timedelta(days=days)
