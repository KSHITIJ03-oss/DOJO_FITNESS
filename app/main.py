# import sys
# from pathlib import Path
# from contextlib import asynccontextmanager
# from fastapi import FastAPI
# from app.db.database import Base, engine
# from app.api import auth  # import the router
# from app.api import admin

# from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# from fastapi import Depends

# app = FastAPI()


# security = HTTPBearer()

# # Add project root to Python path
# project_root = Path(__file__).parent.parent
# if str(project_root) not in sys.path:
#     sys.path.insert(0, str(project_root))


# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     print("🚀 Starting API — creating tables if not exists…")
#     Base.metadata.create_all(bind=engine)  # <-- THIS IS NOW THE DB CREATOR
#     yield
#     print("🛑 Shutting down API…")


# app = FastAPI(title="Dojo Fitness API", lifespan=lifespan,swagger_ui_parameters={"persistAuthorization": True})

# # a function that just extracts the token (Swagger needs this to detect auth)
# def get_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
#     return credentials.credentials


# # Register routers
# app.include_router(admin.router)
# app.include_router(auth.router)


# @app.get("/")
# def greet():
#     return {"message": "Dojo Fitness API running 🚀"}

import sys
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.db.database import Base, engine
from app.models import members  # ensure models are registered before create_all
from app.api import auth
from app.api import admin
from app.api import members
from app.api import membership_plans
from app.api import member_memberships
from app.api import T_attendance
from app.api import trainers_profile

# ---------- AUTH TOKEN SCHEME FOR SWAGGER ----------
security = HTTPBearer()

def get_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Extract JWT token in Swagger UI"""
    return credentials.credentials


# ---------- FIX PYTHON PATH ----------
project_root = Path(__file__).parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))


# ---------- LIFECYCLE ----------
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting API — creating tables if not exists…")
    Base.metadata.create_all(bind=engine)
    yield
    print("🛑 Shutting down API…")


# ---------- CREATE APP ----------
app = FastAPI(
    title="Dojo Fitness API",
    lifespan=lifespan,
    swagger_ui_parameters={"persistAuthorization": True}
)


# ---------- ROUTES ----------
# Secure admin routes by default using token
app.include_router(
    admin.router,
    dependencies=[Depends(get_token)]  # <--- This enables Bearer token input in Swagger
)

# Public login/register routes
app.include_router(auth.router)

# member's crud routes
app.include_router(members.router)

# membership_plan crud routes
app.include_router(membership_plans.router)

# assigning the membership to a particular member and its routes
app.include_router(member_memberships.router)

# trainer's attendence route
app.include_router(T_attendance.router)

# Trainer's profile route
app.include_router(trainers_profile.router)


# ---------- TEST ROUTE ----------
@app.get("/")
def greet():
    return {"message": "Dojo Fitness API running 🚀"}
