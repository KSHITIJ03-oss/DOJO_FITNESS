# app/api/trainer_profiles.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.db.database import get_db
from app.models.trainers_profile import TrainerProfile
from app.models.user import User, role as RoleEnum
from app.schemas.trainers_profile import (
    TrainerProfileCreate,
    TrainerProfileCreateForExistingUser,
    TrainerProfileUpdate,
    TrainerProfileOut
)
from app.auth.hashing import hash_password
from app.api.deps import require_roles
from typing import List

security = HTTPBearer()
router = APIRouter(prefix="/trainers", tags=["trainers"],dependencies=[Depends(security)])

# Create user + trainer profile in one transactional operation (admin only)
@router.post("/", response_model=TrainerProfileOut, dependencies=[Depends(require_roles(["admin"]))])
def create_trainer_full(payload: TrainerProfileCreate, db: Session = Depends(get_db)):
    # 1) create user
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # This code block creates a new instance of the User SQLAlchemy ORM model.
    # Here's what happens:
    # - name: Sets the user's name with the value provided in the API payload.
    # - email: Sets the user's email from the same payload.
    # - password_hash: The plaintext password from the payload is securely hashed using the hash_password function before storing,
    #   which means the actual password is never stored directly (important for security).
    # - role: Sets the role of the new user to "trainer" using the defined RoleEnum.
    # - status: Explicitly marks the new trainer's account as "approved" rather than "pending,"
    #   because an admin is doing the creation (bypassing any other approval workflow).
    # This initialization prepares the user object to be added to the database.
    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=RoleEnum.trainer,
        status="approved"   # assuming admin-created trainer is approved by default
    )

    try:
        db.add(user)
        db.flush()  # get user.id without committing

        profile = TrainerProfile(
            user_id=user.id,
            name=user.name,
            specialization=payload.specialization,
            bio=payload.bio,
            experience_years=payload.experience_years,
            phone=payload.phone,
            certifications=payload.certifications
        )

        db.add(profile)
        db.commit()
        db.refresh(profile)

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Could not create trainer")

    # build out response fields (user info included)
    return TrainerProfileOut(
        id=profile.id,
        user_id=user.id,
        user_email=user.email,
        user_name=user.name,
        specialization=profile.specialization,
        bio=profile.bio,
        experience_years=profile.experience_years,
        phone=profile.phone,
        certifications=profile.certifications,
        created_at=profile.created_at,
        updated_at=profile.updated_at
    )

# Create profile for an existing user and mark role -> trainer (admin only)
@router.post("/attach", response_model=TrainerProfileOut, dependencies=[Depends(require_roles(["admin"]))])
def attach_trainer_to_user(payload: TrainerProfileCreateForExistingUser, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if getattr(user, "role", None) != "trainer":
        user.role = RoleEnum.trainer

    # set approved if previously pending
    user.status = "approved"

    profile = TrainerProfile(
        user_id=user.id,
        name=user.name,
        specialization=payload.specialization,
        bio=payload.bio,
        experience_years=payload.experience_years,
        phone=payload.phone,
        certifications=payload.certifications
    )

    try:
        db.add(profile)
        db.commit()
        db.refresh(profile)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Trainer profile already exists")

    return TrainerProfileOut(
        id=profile.id,
        user_id=user.id,
        user_email=user.email,
        user_name=user.name,
        specialization=profile.specialization,
        bio=profile.bio,
        experience_years=profile.experience_years,
        phone=profile.phone,
        certifications=profile.certifications,
        created_at=profile.created_at,
        updated_at=profile.updated_at
    )

# List trainers (admin + receptionist + trainer)
@router.get("/", response_model=List[TrainerProfileOut], dependencies=[Depends(require_roles(["admin","receptionist","trainer"]))])
def list_trainers(db: Session = Depends(get_db)):
    rows = db.query(TrainerProfile).join(User).all()
    out = []
    for p in rows:
        out.append(TrainerProfileOut(
            id=p.id,
            user_id=p.user_id,
            user_email=p.user.email,
            user_name=p.user.name,
            specialization=p.specialization,
            bio=p.bio,
            experience_years=p.experience_years,
            phone=p.phone,
            certifications=p.certifications,
            created_at=p.created_at,
            updated_at=p.updated_at
        ))
    return out

# Get single trainer profile
@router.get("/{trainer_id}", response_model=TrainerProfileOut, dependencies=[Depends(require_roles(["admin","receptionist","trainer"]))])
def get_trainer(trainer_id: int, db: Session = Depends(get_db)):
    p = db.query(TrainerProfile).filter(TrainerProfile.id == trainer_id).join(User).first()
    if not p:
        raise HTTPException(status_code=404, detail="Trainer not found")
    return TrainerProfileOut(
        id=p.id,
        user_id=p.user_id,
        user_email=p.user.email,
        user_name=p.user.name,
        specialization=p.specialization,
        bio=p.bio,
        experience_years=p.experience_years,
        phone=p.phone,
        certifications=p.certifications,
        created_at=p.created_at,
        updated_at=p.updated_at
    )

# Update trainer profile
@router.put("/{trainer_id}", response_model=TrainerProfileOut, dependencies=[Depends(require_roles(["admin","receptionist"]))])
def update_trainer(trainer_id: int, data: TrainerProfileUpdate, db: Session = Depends(get_db)):
    p = db.query(TrainerProfile).filter(TrainerProfile.id == trainer_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Trainer not found")
    
    updates = data.model_dump(exclude_unset=True)
    for k, v in updates.items():
        setattr(p, k, v)

    db.commit()
    db.refresh(p)
    return TrainerProfileOut(
        id=p.id,
        user_id=p.user_id,
        user_email=p.user.email,
        user_name=p.user.name,
        specialization=p.specialization,
        bio=p.bio,
        experience_years=p.experience_years,
        phone=p.phone,
        certifications=p.certifications,
        created_at=p.created_at,
        updated_at=p.updated_at
    )

# Delete trainer profile (and optionally demote user)
@router.delete("/{trainer_id}", dependencies=[Depends(require_roles(["admin"]))])
def delete_trainer(trainer_id: int, demote_user: bool = True, db: Session = Depends(get_db)):
    p = db.query(TrainerProfile).filter(TrainerProfile.id == trainer_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Trainer not found")

    user = db.query(User).filter(User.id == p.user_id).first()
    db.delete(p)
    if demote_user and user:
        user.role = "member"
    db.commit()
    return {"message": "Trainer removed", "demoted_user": demote_user}
