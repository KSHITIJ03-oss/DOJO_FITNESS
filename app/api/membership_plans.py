from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.membership_plans import MembershipPlan
from app.schemas.membership_plans import PlanCreate, PlanUpdate, PlanOut
from app.api.deps import require_roles

security = HTTPBearer()
router = APIRouter(prefix="/plans", tags=["membership-plans"],dependencies=[Depends(security)])


def calculate_final(price: float, discount: float):
    return price * (1 - (discount / 100))


@router.post("/", response_model=PlanOut,
             dependencies=[Depends(require_roles(["admin"]))])
def create_plan(data: PlanCreate, db: Session = Depends(get_db)):
    final_price = calculate_final(data.price, data.discount)

    plan = MembershipPlan(
        **data.model_dump(),
        final_price=final_price
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


@router.get("/", response_model=list[PlanOut])
def get_plans(db: Session = Depends(get_db)):
    return db.query(MembershipPlan).all()


@router.get("/{plan_id}", response_model=PlanOut)
def get_plan(plan_id: int, db: Session = Depends(get_db)):
    plan = db.query(MembershipPlan).filter(MembershipPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return plan


@router.put("/{plan_id}", response_model=PlanOut,
            dependencies=[Depends(require_roles(["admin"]))])
def update_plan(plan_id: int, data: PlanUpdate, db: Session = Depends(get_db)):
    plan = db.query(MembershipPlan).filter(MembershipPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(plan, key, value)

    # recalculate final price if price or discount changed
    if data.price is not None or data.discount is not None:
        plan.final_price = calculate_final(
            data.price or plan.price,
            data.discount or plan.discount
        )

    db.commit()
    db.refresh(plan)
    return plan


@router.delete("/{plan_id}", dependencies=[Depends(require_roles(["admin"]))])
def delete_plan(plan_id: int, db: Session = Depends(get_db)):
    plan = db.query(MembershipPlan).filter(MembershipPlan.id == plan_id).first()

    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    db.delete(plan)
    db.commit()
    return {"message": "Plan deleted"}
