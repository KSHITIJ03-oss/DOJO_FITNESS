# Explanation of app/auth/jwt_handler.py
#
# This file provides utility functions for creating and decoding JSON Web Tokens (JWT)
# as part of an authentication system in a backend application, often with FastAPI or similar frameworks.
# JWTs are used to securely transmit information, like the identity of a user, between parties as a JSON object.
#
# Main Functions:
#
# 1. create_access_token(subject: str | int, data: dict | None = None, expires_minutes: int | None = None) -> str
#    - Purpose: Generates a JWT for a given user or subject.
#    - Arguments:
#        - subject: Identifier for the subject of the token, typically a user id or username.
#        - data: Additional custom data to include in the payload of the token, if needed.
#        - expires_minutes: Custom expiration time in minutes. If not provided, a default value is used from the configuration.
#    - How it works:
#        - Makes a copy of the provided data dictionary or creates an empty payload.
#        - Adds the "sub" (subject) field, which stores the unique identifier for the token recipient.
#        - Sets an "exp" (expiration) claim by adding 'expires_minutes' to the current UTC time. This specifies when the token becomes invalid.
#        - Encodes all data into a JWT using a secret and specified algorithm via jose.jwt.encode, which cryptographically signs the token.
#    - Usage:
#        - Called whenever a new valid access token is needed for a user, e.g., after a successful login.
#
# 2. decode_access_token(token: str) -> Optional[dict]
#    - Purpose: Validates and decodes a JWT, returning its contents if valid.
#    - Arguments:
#        - token: The JWT string to decode and validate.
#    - How it works:
#        - Attempts to decode the token using jose.jwt.decode, with the secret and algorithm for verification.
#        - If successful, returns the payload (claims) contained in the JWT.
#        - If the token is invalid or tampered with (wrong signature, expired, etc.), catches the JWTError and returns None.
#    - Usage:
#        - Called during protected route access to extract user or session information from the token, ensuring the token is trustworthy.
#
# Methods and libraries in use:
# - datetime, timedelta, timezone: Used to create timestamp fields in UTC and handle expiration times.
# - jose.jwt.encode: Serializes and signs the JWT payload, producing a secure token.
# - jose.jwt.decode: Deserializes and verifies the token, ensuring its integrity and authenticity.
# - JWTError: Catches exceptions related to invalid or expired tokens.
#
# Overall, this file plays a critical role in secure authentication, enabling stateless user sessions and user identity claims via secure tokens.

from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from typing import Optional
from app.core.config import JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES


def create_access_token(subject: str | int, data: dict | None = None, expires_minutes: int | None = None) -> str:
    payload = {} if data is None else data.copy()
    payload.update({"sub": str(subject)})
    expire = datetime.now(timezone.utc) + timedelta(minutes=(expires_minutes or ACCESS_TOKEN_EXPIRE_MINUTES))
    payload.update({"exp": expire})
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_access_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except JWTError:
        return None
