from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User, role, status as user_status
from app.api.deps import require_roles


router = APIRouter(prefix="/admin", tags=["admin"])


# List all pending accounts
@router.get("/users/pending", dependencies=[Depends(require_roles(["admin"]))])
def get_pending_users(db: Session = Depends(get_db)):
    return db.query(User).filter(User.status == user_status.pending).all()


# Approve a user
@router.put("/users/{user_id}/approve", dependencies=[Depends(require_roles(["admin"]))])
def approve_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.status = user_status.approved
    db.commit()
    db.refresh(user)

    return {"message": f"User {user.name} approved successfully!"}


# Change user role
@router.put("/users/{user_id}/role", dependencies=[Depends(require_roles(["admin"]))])
def update_role(user_id: int, new_role: role, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.role = new_role
    db.commit()
    db.refresh(user)

    return {"message": f"Role updated to {new_role} for user {user.name}"}


# reject a user
@router.delete("/users/{user_id}", dependencies=[Depends(require_roles(["admin"]))])
def reject_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": f"User {user.name} rejected successfully!"}
