# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, declarative_base
# from app.core.config import DATABASE_URL

# engine = create_engine(
#     DATABASE_URL,
#     echo=True,  # optional: show SQL logs
#     future=True
# )

# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)

# # This line creates a new declarative base class for SQLAlchemy ORM models.
# Base = declarative_base()

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import DATABASE_URL
from app.db.base import Base  # single shared Base for all models

__all__ = ["engine", "SessionLocal", "Base", "get_db"]

# Engine used across the app
engine = create_engine(
    DATABASE_URL,
    echo=True,   # show SQL emitted; set False to silence
    future=True
)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    future=True
)

def get_db():
    """Provide a scoped Session dependency."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()