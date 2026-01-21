# app/api/trainer_attendance.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.db.database import get_db
from app.models.T_attendance import TrainerAttendance
from app.models.user import User
from app.api.deps import require_roles
from app.schemas.T_attendance import TrainerAttendanceCreate, TrainerAttendanceOut

security = HTTPBearer()
router = APIRouter(prefix="/trainer-attendance", tags=["trainer-attendance"],dependencies=[Depends(security)])


# Helper: check if user exists and is a trainer
def _get_trainer_or_404(db: Session, trainer_id: int) -> User:
    user = db.query(User).filter(User.id == trainer_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Trainer user not found")
    if getattr(user, "role", None) != "trainer":
        raise HTTPException(status_code=400, detail="User is not a trainer")
    return user


# ------------------ CHECK-IN ------------------
@router.post("/checkin", response_model=TrainerAttendanceOut,
             dependencies=[Depends(require_roles(["trainer", "receptionist", "admin"]))])
def checkin(payload: TrainerAttendanceCreate, current_user = Depends(require_roles(["trainer", "receptionist", "admin"])),
            db: Session = Depends(get_db)):
    """
    Trainer check-in.
    - If current_user.role == 'trainer' and payload.trainer_id is None: they check themselves in.
    - If current_user is receptionist/admin, they may pass trainer_id to check a trainer in.
    """

    # decide trainer_id
    if getattr(current_user, "role", None) == "trainer":
        trainer_id = current_user.id
        # trainers cannot check in other trainers
        if payload.trainer_id and int(payload.trainer_id) != trainer_id:
            raise HTTPException(status_code=403, detail="Trainers cannot check in other trainers")
    else:
        if not payload.trainer_id:
            raise HTTPException(status_code=400, detail="trainer_id is required for receptionist/admin actions")
        trainer_id = payload.trainer_id

    # ensure trainer exists and is role=trainer
    _get_trainer_or_404(db, trainer_id)

    # prevent duplicate open session
    open_session = db.query(TrainerAttendance).filter(
        TrainerAttendance.trainer_id == trainer_id,
        TrainerAttendance.check_out.is_(None)
    ).first()
    if open_session:
        raise HTTPException(status_code=400, detail="Trainer already has an open session (checked in but not checked out)")

    now = datetime.now(timezone.utc)
    attendance = TrainerAttendance(
        trainer_id=trainer_id,
        check_in=now,
        created_at=now
    )
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return attendance


# ------------------ CHECK-OUT ------------------
@router.post("/checkout", response_model=TrainerAttendanceOut,
             dependencies=[Depends(require_roles(["trainer", "receptionist", "admin"]))])
def checkout(payload: TrainerAttendanceCreate, current_user = Depends(require_roles(["trainer", "receptionist", "admin"])),
             db: Session = Depends(get_db)):
    """
    Trainer check-out.
    - If trainer has an open session, set check_out to now.
    - Trainer may omit trainer_id to checkout themselves (if role trainer).
    - receptionist/admin must provide trainer_id.
    """

    # decide trainer_id
    if getattr(current_user, "role", None) == "trainer":
        trainer_id = current_user.id
        if payload.trainer_id and int(payload.trainer_id) != trainer_id:
            raise HTTPException(status_code=403, detail="Trainers cannot checkout other trainers")
    else:
        if not payload.trainer_id:
            raise HTTPException(status_code=400, detail="trainer_id is required for receptionist/admin actions")
        trainer_id = payload.trainer_id

    _get_trainer_or_404(db, trainer_id)

    # find latest open session
    open_session = db.query(TrainerAttendance).filter(
        TrainerAttendance.trainer_id == trainer_id,
        TrainerAttendance.check_out.is_(None)
    ).order_by(TrainerAttendance.check_in.desc()).first()

    if not open_session:
        raise HTTPException(status_code=400, detail="No open session found for trainer")

    now = datetime.now(timezone.utc)
    open_session.check_out = now
    db.commit()
    db.refresh(open_session)
    return open_session


# ------------------ LIST / QUERY ------------------
@router.get("/", response_model=list[TrainerAttendanceOut],
            dependencies=[Depends(require_roles(["admin", "receptionist"]))])
def list_attendance(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    List trainer attendance records. Admin/Receptionist only.
    """
    rows = db.query(TrainerAttendance).order_by(TrainerAttendance.check_in.desc()).offset(skip).limit(limit).all()
    return rows


@router.get("/me", response_model=list[TrainerAttendanceOut],
            dependencies=[Depends(require_roles(["admin", "trainer"]))])
def my_attendance(current_user = Depends(require_roles(["trainer"])), db: Session = Depends(get_db)):
    """
    Trainer can view their own attendance history.
    """
    rows = db.query(TrainerAttendance).filter(TrainerAttendance.trainer_id == current_user.id).order_by(TrainerAttendance.check_in.desc()).all()
    return rows


@router.get("/today", response_model=list[TrainerAttendanceOut],
            dependencies=[Depends(require_roles(["admin", "receptionist"]))])
def today_attendance(db: Session = Depends(get_db)):
    """
    Get today's attendance records (UTC day). Admin/Receptionist only.
    """
    from datetime import datetime, timezone, timedelta, date
    now = datetime.now(timezone.utc)
    start_of_day = datetime(now.year, now.month, now.day, tzinfo=timezone.utc)
    rows = db.query(TrainerAttendance).filter(
        TrainerAttendance.check_in >= start_of_day
    ).order_by(TrainerAttendance.check_in.desc()).all()
    return rows

from datetime import datetime, date, timezone

@router.get(
    "/by-trainer",
    response_model=list[TrainerAttendanceOut],
    dependencies=[Depends(require_roles(["admin", "receptionist"]))],
)
def get_attendance_by_trainer(
    trainer_id: int,
    start_date: date,
    end_date: date,
    db: Session = Depends(get_db),
):
    """
    Get attendance of a specific trainer within a date range.
    Useful for monthly, weekly, or payroll attendance.
    """

    # Convert dates to full UTC datetime range
    start_dt = datetime.combine(start_date, datetime.min.time(), tzinfo=timezone.utc)
    end_dt = datetime.combine(end_date, datetime.max.time(), tzinfo=timezone.utc)

    rows = (
        db.query(TrainerAttendance)
        .filter(
            TrainerAttendance.trainer_id == trainer_id,
            TrainerAttendance.check_in >= start_dt,
            TrainerAttendance.check_in <= end_dt,
        )
        .order_by(TrainerAttendance.check_in.asc())
        .all()
    )

    return rows
