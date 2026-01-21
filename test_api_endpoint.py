#!/usr/bin/env python3
"""
Test the FastAPI endpoint directly to verify it returns the calculated dates.
"""

import sys
import os
import asyncio
from datetime import datetime

# Add the app directory to the path
sys.path.insert(0, os.path.dirname(__file__))

from fastapi.testclient import TestClient
from app.main import app
from app.db.database import SessionLocal
from app.models.members import Member
from app.auth.jwt_handler import create_access_token

def test_members_endpoint():
    """Test the GET /members endpoint to verify it returns calculated dates."""
    
    print("=" * 70)
    print("TESTING API ENDPOINT: GET /members")
    print("=" * 70)
    
    # Create a test client
    client = TestClient(app)
    
    # Create a valid JWT token with admin role
    token = create_access_token(
        subject="test_admin",
        data={"role": "admin"}
    )
    
    print(f"\n🔑 Using admin token: {token[:20]}...")
    print("\nCalling: GET /members")
    
    # Make the request
    response = client.get(
        "/members",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        members = response.json()
        print(f"✅ Got {len(members)} members\n")
        
        print("Members with fitness checkup dates:\n")
        
        found_due = False
        for member in members[:5]:  # Show first 5
            checkup_date = member.get('next_fitness_checkup_date')
            print(f"  • {member.get('name')}: next_fitness_checkup_date = {checkup_date}")
            if checkup_date:
                found_due = True
        
        if found_due:
            print("\n✨ SUCCESS! API is returning fitness checkup dates!")
            print("The frontend badge SHOULD now display correctly.")
        else:
            print("\n⚠️  No fitness checkup dates found in API response")
        
        return True
    else:
        print(f"\n❌ Error: {response.status_code}")
        print(f"Response: {response.text}")
        return False

if __name__ == "__main__":
    try:
        test_members_endpoint()
    except Exception as e:
        print(f"\n❌ Exception: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
