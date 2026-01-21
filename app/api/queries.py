from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.query import Query
from app.schemas.query import QueryCreate, QueryResponse
from typing import List

router = APIRouter(prefix="/queries", tags=["Queries"])

@router.post("/", response_model=QueryResponse, status_code=status.HTTP_201_CREATED)
def create_query(payload: QueryCreate, db: Session = Depends(get_db)):
    new_query = Query(
        name=payload.name,
        mobile=payload.mobile,
        email=payload.email,
        message=payload.message
    )
    db.add(new_query)
    db.commit()
    db.refresh(new_query)
    return new_query

@router.get("/", response_model=List[QueryResponse])
def get_all_queries(db: Session = Depends(get_db)):
    return db.query(Query).order_by(Query.created_at.desc()).all()

@router.patch("/{query_id}/status")
def update_query_status(query_id: int, status: str, db: Session = Depends(get_db)):
    query = db.query(Query).filter(Query.id == query_id).first()
    if not query:
        raise HTTPException(status_code=404, detail="Query not found")

    query.status = status
    db.commit()
    return {"message": "Status updated"}

@router.delete("/{query_id}")
def delete_query(query_id: int, db: Session = Depends(get_db)):
    query = db.query(Query).filter(Query.id == query_id).first()
    if not query:
        raise HTTPException(status_code=404, detail="Query not found")

    db.delete(query)
    db.commit()
    return {"message": "Query deleted"}
