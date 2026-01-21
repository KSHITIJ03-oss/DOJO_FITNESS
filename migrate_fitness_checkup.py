#!/usr/bin/env python3
"""
Database migration script to add fitness checkup columns to members table.
Run this once to create the missing columns in the existing MySQL database.
"""

import sys
import os

# Add the app directory to the path so we can import app modules
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import text, inspect
from app.db.database import engine
from app.core.config import DATABASE_URL

def check_columns_exist():
    """Check if the fitness checkup columns already exist in the members table."""
    inspector = inspect(engine)
    columns = [col['name'] for col in inspector.get_columns('members')]
    
    has_last_checkup = 'last_fitness_checkup_date' in columns
    has_next_checkup = 'next_fitness_checkup_date' in columns
    
    return has_last_checkup, has_next_checkup

def migrate():
    """Add the fitness checkup columns to the members table."""
    try:
        print("🔍 Checking current database schema...")
        has_last, has_next = check_columns_exist()
        
        if has_last and has_next:
            print("✅ Both fitness checkup columns already exist! No migration needed.")
            return True
        
        print("\n📝 Starting migration...")
        print(f"   - last_fitness_checkup_date exists: {has_last}")
        print(f"   - next_fitness_checkup_date exists: {has_next}")
        
        with engine.connect() as connection:
            # Add last_fitness_checkup_date if it doesn't exist
            if not has_last:
                print("\n   Adding last_fitness_checkup_date column...")
                connection.execute(text(
                    "ALTER TABLE members ADD COLUMN last_fitness_checkup_date DATE NULL"
                ))
                print("   ✅ last_fitness_checkup_date added")
            
            # Add next_fitness_checkup_date if it doesn't exist
            if not has_next:
                print("   Adding next_fitness_checkup_date column...")
                connection.execute(text(
                    "ALTER TABLE members ADD COLUMN next_fitness_checkup_date DATE NULL"
                ))
                print("   ✅ next_fitness_checkup_date added")
            
            connection.commit()
            print("\n✨ Migration completed successfully!")
        
        # Verify columns were created
        print("\n🔍 Verifying migration...")
        has_last, has_next = check_columns_exist()
        if has_last and has_next:
            print("✅ All columns verified!")
            return True
        else:
            print("❌ Verification failed - columns not found")
            return False
            
    except Exception as e:
        print(f"\n❌ Migration failed with error:")
        print(f"   {type(e).__name__}: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("DOJO Fitness - Database Migration")
    print("Adding fitness checkup tracking columns")
    print("=" * 60)
    print(f"\nDatabase: {DATABASE_URL.split('@')[1]}")
    
    success = migrate()
    
    if success:
        print("\n🎉 Ready to test! Your database now supports fitness checkups.")
        print("\n📝 Next steps:")
        print("   1. Restart your FastAPI server (uvicorn)")
        print("   2. Create or update a member")
        print("   3. Check the Members page for the orange badge")
        sys.exit(0)
    else:
        print("\n⚠️  Migration incomplete. Check the errors above.")
        sys.exit(1)
