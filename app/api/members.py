# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from app.db.database import get_db
# from app.models.members import Member
# from app.schemas.members import MemberCreate, MemberUpdate, MemberOut
# from app.api.deps import require_roles

# router = APIRouter(prefix="/members", tags=["members"])

# @router.post("/", response_model=MemberOut,
#              dependencies=[Depends(require_roles(["admin", "receptionist"]))])
# def create_member(member: MemberCreate, db: Session = Depends(get_db)):

#     existing = db.query(Member).filter(Member.phone == member.phone).first()
#     if existing:
#         raise HTTPException(status_code=400, detail="Phone number already registered")

#     new_member = Member(**member.model_dump())
#     db.add(new_member)
#     db.commit()
#     db.refresh(new_member)
#     return new_member
# # eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJzdWIiOiIzIiwiZXhwIjoxNzY1NDQzMjU2fQ.Gteo-BviOnqs9qLDRKEgzikiQLXi9EIkwfi-a_wqA6Y
# @router.get("/", response_model=list[MemberOut],
#             dependencies=[Depends(require_roles(["admin", "receptionist"]))])
# def get_members(db: Session = Depends(get_db)):
#     return db.query(Member).all()

# @router.get("/{member_id}", response_model=MemberOut,
#             dependencies=[Depends(require_roles(["admin", "receptionist"]))])
# def get_member_by_id(member_id: int, db: Session = Depends(get_db)):
#     member = db.query(Member).filter(Member.id == member_id).first()
#     if not member:
#         raise HTTPException(status_code=404, detail="Member not found")
#     return member

# # to update member
# @router.put("/{member_id}", response_model=MemberOut,
#             dependencies=[Depends(require_roles(["admin", "receptionist"]))])
# def update_member(member_id: int, data: MemberUpdate, db: Session = Depends(get_db)):
#     member = db.query(Member).filter(Member.id == member_id).first()
#     if not member:
#         raise HTTPException(status_code=404, detail="Member not found")

#     for key, value in data.model_dump().items():
#         setattr(member, key, value)

#     db.commit()
#     db.refresh(member)
#     return member

# @router.delete("/{member_id}",
#                dependencies=[Depends(require_roles(["admin"]))])
# def delete_member(member_id: int, db: Session = Depends(get_db)):
#     member = db.query(Member).filter(Member.id == member_id).first()
#     if not member:
#         raise HTTPException(status_code=404, detail="Member not found")

#     db.delete(member)
#     db.commit()
#     return {"message": "Member deleted"}

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.members import Member
from app.schemas.members import MemberCreate, MemberUpdate, MemberOut
from app.api.deps import require_roles
from app.utils.fitness_checkup import calculate_next_fitness_checkup_date
from fastapi.security import HTTPBearer
import os
from pathlib import Path
from fastapi import UploadFile, File
import shutil

security = HTTPBearer()
router = APIRouter(prefix="/members", tags=["members"],dependencies=[Depends(security)])


# -------------------- CREATE MEMBER --------------------
@router.post("/", response_model=MemberOut,
             dependencies=[Depends(require_roles(["admin", "receptionist"]))])
def create_member(member: MemberCreate, db: Session = Depends(get_db)):

    existing = db.query(Member).filter(Member.phone == member.phone).first()
    if existing:
        raise HTTPException(status_code=400, detail="Phone already registered")

    new_member = Member(**member.model_dump())
    
    # Calculate next fitness checkup date on creation
    new_member.next_fitness_checkup_date = calculate_next_fitness_checkup_date(
        membership_start=new_member.membership_start,
        created_at=new_member.created_at,
        last_checkup_date=None,
        checkpoint_interval_days=21,
    )
    
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member


# -------------------- GET ALL MEMBERS --------------------
@router.get("/", response_model=list[MemberOut],
            dependencies=[Depends(require_roles(["admin", "receptionist"]))])
def get_members(db: Session = Depends(get_db)):
    members = db.query(Member).all()
    
    # Calculate next_fitness_checkup_date for all members (for display purposes)
    # This ensures the date is always available even if not stored in DB yet
    for member in members:
        if member.next_fitness_checkup_date is None:
            member.next_fitness_checkup_date = calculate_next_fitness_checkup_date(
                membership_start=member.membership_start,
                created_at=member.created_at,
                last_checkup_date=member.last_fitness_checkup_date,
                checkpoint_interval_days=21,
            )
    
    return members


# -------------------- GET MEMBER BY ID --------------------
@router.get("/{member_id}", response_model=MemberOut,
            dependencies=[Depends(require_roles(["admin", "receptionist"]))])
def get_member_by_id(member_id: int, db: Session = Depends(get_db)):
    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    # Calculate next_fitness_checkup_date if not already set
    if member.next_fitness_checkup_date is None:
        member.next_fitness_checkup_date = calculate_next_fitness_checkup_date(
            membership_start=member.membership_start,
            created_at=member.created_at,
            last_checkup_date=member.last_fitness_checkup_date,
            checkpoint_interval_days=21,
        )
    
    return member


# -------------------- UPDATE MEMBER --------------------
@router.put("/{member_id}", response_model=MemberOut,
            dependencies=[Depends(require_roles(["admin", "receptionist"]))])
def update_member(member_id: int, data: MemberUpdate, db: Session = Depends(get_db)):
    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    updates = data.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(member, key, value)

    db.commit()
    db.refresh(member)
    return member


# -------------------- DELETE MEMBER --------------------
@router.delete("/{member_id}",
               dependencies=[Depends(require_roles(["admin"]))])
def delete_member(member_id: int, db: Session = Depends(get_db)):
    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    db.delete(member)
    db.commit()
    return {"message": "Member deleted successfully"}


# -------------------- UPLOAD MEMBER IMAGE --------------------
@router.post("/{member_id}/image", response_model=MemberOut,
             dependencies=[Depends(require_roles(["admin", "receptionist"]))])
def upload_member_image(member_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload or replace member profile image"""
    
    # Check if member exists
    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    # Validate file type
    allowed_extensions = {"jpg", "jpeg", "png"}
    file_ext = file.filename.split(".")[-1].lower() if file.filename else ""
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type. Allowed: {', '.join(allowed_extensions)}"
        )
    
    # Create uploads directory if not exists
    uploads_dir = Path("uploads/members")
    uploads_dir.mkdir(parents=True, exist_ok=True)
    
    # Delete old image if exists
    if member.image_url:
        old_image_path = Path(member.image_url)
        if old_image_path.exists():
            try:
                old_image_path.unlink()
            except Exception as e:
                print(f"Failed to delete old image: {e}")
    
    # Save new image with member_id as filename
    image_filename = f"member_{member_id}.{file_ext}"
    image_path = uploads_dir / image_filename
    relative_path = f"uploads/members/{image_filename}"
    
    try:
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save image: {str(e)}")
    finally:
        file.file.close()
    
    # Update member record with image path
    member.image_url = relative_path
    db.commit()
    db.refresh(member)
    
    return member


# -------------------- DELETE MEMBER IMAGE --------------------
@router.delete("/{member_id}/image", response_model=MemberOut,
               dependencies=[Depends(require_roles(["admin", "receptionist"]))])
def delete_member_image(member_id: int, db: Session = Depends(get_db)):
    """Delete member profile image"""
    
    # Check if member exists
    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    # Delete image file if exists
    if member.image_url:
        image_path = Path(member.image_url)
        if image_path.exists():
            try:
                image_path.unlink()
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to delete image: {str(e)}")
    
    # Clear image_url from database
    member.image_url = None
    db.commit()
    db.refresh(member)
    
    return member
