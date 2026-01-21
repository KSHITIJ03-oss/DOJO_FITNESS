#!/usr/bin/env python3
"""
Quick test to verify that the updated get_members endpoint calculates dates.
This script will:
1. Query the database directly
2. Show member data with calculated dates
3. Verify the isCheckupDueSoon logic
"""

import sys
import os
from datetime import datetime, date, timedelta

# Add the app directory to the path
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine
from app.models.members import Member
from app.utils.fitness_checkup import calculate_next_fitness_checkup_date, is_checkup_due_soon

def test_fitness_checkup_dates():
    """Test the fitness checkup date calculation on existing members."""
    
    db = SessionLocal()
    try:
        members = db.query(Member).limit(5).all()
        
        if not members:
            print("❌ No members found in database")
            return False
        
        print("=" * 70)
        print("TESTING FITNESS CHECKUP DATE CALCULATION")
        print("=" * 70)
        print(f"\nToday's date: {date.today()}")
        print(f"Testing with {len(members)} members:\n")
        
        has_valid_dates = False
        
        for member in members:
            print(f"Member: {member.name} (ID: {member.id})")
            print(f"  Membership start: {member.membership_start}")
            print(f"  Created at: {member.created_at}")
            print(f"  Last checkup: {member.last_fitness_checkup_date}")
            
            # Calculate the date
            next_date = calculate_next_fitness_checkup_date(
                membership_start=member.membership_start,
                created_at=member.created_at,
                last_checkup_date=member.last_fitness_checkup_date,
                checkpoint_interval_days=21,
            )
            
            print(f"  ➜ Next checkup: {next_date}")
            
            if next_date:
                is_due = is_checkup_due_soon(next_date)
                status = "✅ BADGE WILL SHOW" if is_due else "❌ No badge (future date)"
                print(f"  {status}")
                if is_due:
                    has_valid_dates = True
            else:
                print(f"  ❌ Failed to calculate next date")
            
            print()
        
        print("=" * 70)
        if has_valid_dates:
            print("✨ SUCCESS! At least one member has a date due soon.")
            print("The badge SHOULD appear on the Members page.")
        else:
            print("⚠️  All calculated dates are in the future.")
            print("The badge won't show for these members yet.")
            print("\nTip: Try creating a member with a membership_start date from ~20 days ago")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    test_fitness_checkup_dates()
