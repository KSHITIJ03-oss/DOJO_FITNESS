from sqlalchemy import create_engine, text
from urllib.parse import urlparse
from app.core.config import DATABASE_URL


def create_database_if_not_exists():
    """Create the database if it doesn't exist."""
    # Parse the DATABASE_URL to extract components
    parsed = urlparse(DATABASE_URL.replace("mysql+pymysql://", "mysql://"))
    
    # Extract database name (last part of path)
    database_name = parsed.path.lstrip('/')
    
    # Create a connection URL without the database name
    # Reconstruct the base connection URL
    base_url = f"mysql+pymysql://{parsed.netloc}/"
    
    # Create engine without database
    engine = create_engine(base_url, echo=False)
    
    # Create database if it doesn't exist
    with engine.connect() as conn:
        # Use raw SQL to create database if not exists
        # DDL statements in SQLAlchemy 2.0 need autocommit
        conn.execute(text(f"CREATE DATABASE IF NOT EXISTS `{database_name}`"))
        conn.commit()
    
    engine.dispose()

