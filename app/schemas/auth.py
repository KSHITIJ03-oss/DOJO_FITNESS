# This file (schemas/auth.py) defines Pydantic models for authentication-related API functionalities in the application.
# Pydantic is used in this file for type validation, serialization, and documentation of data structures for requests and responses.
# 
# Breakdown of classes in this file:
#
# - RegisterIn: Model for validating user input when registering a new account. Expects `name` (str), `email` (validated as an email string), and `password` (str).
# - TokenOut: Model for formatting the authentication token response returned after a successful login or registration. Contains `access_token` (str) and `token_type` (str, defaulting to "bearer").
# - LoginIn: Model for validating user input during login. Requires `email` (EmailStr) and `password` (str).
# - UserOut: Model for serializing public user data when returning user information after actions like login or registration. Contains user id, name, email, role, and status. Uses `orm_mode = True` in Config so it can work seamlessly with ORM models.
from pydantic import BaseModel, EmailStr

class RegisterIn(BaseModel):
    name: str
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    status: str
    class Config:
        orm_mode = True

