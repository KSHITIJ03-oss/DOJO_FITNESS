from sqlalchemy import Column, Integer, Date, ForeignKey, DateTime
from datetime import datetime
from sqlalchemy.orm import relationship
from app.db.base import Base

class MemberMembership(Base):
    __tablename__ = "member_memberships"

    id = Column(Integer, primary_key=True, index=True)

    member_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    plan_id = Column(Integer, ForeignKey("membership_plans.id"), nullable=False)

    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    member = relationship("Member")
    plan = relationship("MembershipPlan")
