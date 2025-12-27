
from session import engine
from app.db.create_db import create_database_if_not_exists

def init_db():
    # Create database if it doesn't exist
    create_database_if_not_exists()
    
    # Import Base and models inside function to avoid circular import issues
    from app.db.base import Base
    # from app.models.user import User  # noqa: F401
    
    Base.metadata.create_all(bind=engine)