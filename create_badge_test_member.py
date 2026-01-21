#!/usr/bin/env python3
"""
Create a test member with a membership start date that will trigger the badge.
This will help verify the feature is working correctly.
"""

import sys
import os
from datetime import datetime, date, timedelta

sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.members import Member
from app.utils.fitness_checkup import calculate_next_fitness_checkup_date, is_checkup_due_soon

def create_test_member_for_badge():
    """Create a member that will have a fitness checkup due soon."""
    
    db = SessionLocal()
    try:
        # Create a member with membership_start ~20 days ago
        # This will trigger a checkup date due in the next 2 days
        membership_start = date.today() - timedelta(days=20)
        
        # Check if test member already exists
        existing = db.query(Member).filter(Member.phone == "9999999999").first()
        if existing:
            print("✅ Test member 'Badge Test' already exists!")
            print(f"   Name: {existing.name}")
            print(f"   Membership Start: {existing.membership_start}")
            
            next_date = calculate_next_fitness_checkup_date(
                membership_start=existing.membership_start,
                created_at=existing.created_at,
                last_checkup_date=existing.last_fitness_checkup_date,
                checkpoint_interval_days=21,
            )
            
            is_due = is_checkup_due_soon(next_date) if next_date else False
            print(f"   Next Checkup: {next_date}")
            print(f"   Badge Status: {'🟠 WILL SHOW' if is_due else '⚪ No badge (future)'}")
            return
        
        print("=" * 70)
        print("CREATING TEST MEMBER FOR BADGE VERIFICATION")
        print("=" * 70)
        print(f"\nToday: {date.today()}")
        print(f"Creating member with membership_start: {membership_start}")
        print("(This will have a checkup due in ~1 day)\n")
        
        # Create new member
        new_member = Member(
            name="Badge Test",
            phone="9999999999",
            age=25,
            gender="M",
            address="Test Address",
            membership_type="monthly",
            membership_start=membership_start,
        )
        
        # Calculate next checkup date
        new_member.next_fitness_checkup_date = calculate_next_fitness_checkup_date(
            membership_start=new_member.membership_start,
            created_at=new_member.created_at,
            last_checkup_date=None,
            checkpoint_interval_days=21,
        )
        
        db.add(new_member)
        db.commit()
        db.refresh(new_member)
        
        print("✅ Member created successfully!")
        print(f"   Name: {new_member.name}")
        print(f"   Phone: {new_member.phone}")
        print(f"   Membership Start: {new_member.membership_start}")
        print(f"   Next Checkup: {new_member.next_fitness_checkup_date}")
        
        is_due = is_checkup_due_soon(new_member.next_fitness_checkup_date)
        print(f"\n   🟠 This member SHOULD show the orange badge on the Members page!")
        
    except Exception as e:
        print(f"\n❌ Error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_member_for_badge()
