from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.workout import Workout
from app.schemas.workout import WorkoutCreate, WorkoutUpdate, WorkoutOut
from app.api.deps import get_current_user
from app.models.user import User

security = HTTPBearer()
router = APIRouter(
    prefix="/workouts",
    tags=["workouts"],
    dependencies=[Depends(security)]
)

@router.get("/", response_model=list[WorkoutOut])
def get_workouts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return (
        db.query(Workout)
        .filter(Workout.user_id == current_user.id)
        .order_by(Workout.created_at.desc())
        .all()
    )

@router.get("/{workout_id}", response_model=WorkoutOut)
def get_workout_by_id(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()

    if not workout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout not found"
        )

    return workout

@router.post("/", response_model=WorkoutOut, status_code=status.HTTP_201_CREATED)
def create_workout(
    data: WorkoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    workout = Workout(
        **data.model_dump(),
        user_id=current_user.id
    )

    db.add(workout)
    db.commit()
    db.refresh(workout)

    return workout

@router.put("/{workout_id}", response_model=WorkoutOut)
def update_workout(
    workout_id: int,
    data: WorkoutUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()

    if not workout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout not found"
        )

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(workout, key, value)

    db.commit()
    db.refresh(workout)

    return workout

@router.delete("/{workout_id}")
def delete_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()

    if not workout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout not found"
        )

    db.delete(workout)
    db.commit()

    return {"message": "Workout deleted successfully"}
