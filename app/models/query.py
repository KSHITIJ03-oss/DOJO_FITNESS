from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.db.database import Base

class Query(Base):
    __tablename__ = "queries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    mobile = Column(String(15), nullable=False)
    email = Column(String(100), nullable=True)
    message = Column(Text, nullable=True)
    status = Column(String(20), default="new")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
