from sqlalchemy import Integer,String,Column,DateTime
from datetime import datetime,timezone
from sqlalchemy import Date  # Needed for membership_start and membership_end columns
from app.db.base import Base

class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    phone = Column(String(15), unique=True, nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String(10), nullable=True)
    address = Column(String(255), nullable=True)

    membership_type = Column(String(50), nullable=True)   # monthly / quarterly / yearly / Custom
    membership_start = Column(Date, nullable=True)
    membership_end = Column(Date, nullable=True)

    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

