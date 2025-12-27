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
from fastapi.security import HTTPBearer

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
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member


# -------------------- GET ALL MEMBERS --------------------
@router.get("/", response_model=list[MemberOut],
            dependencies=[Depends(require_roles(["admin", "receptionist"]))])
def get_members(db: Session = Depends(get_db)):
    return db.query(Member).all()


# -------------------- GET MEMBER BY ID --------------------
@router.get("/{member_id}", response_model=MemberOut,
            dependencies=[Depends(require_roles(["admin", "receptionist"]))])
def get_member_by_id(member_id: int, db: Session = Depends(get_db)):
    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
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
