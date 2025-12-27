# This file, app/auth/hashing.py, provides functionality for securely hashing and verifying user passwords
# using the bcrypt algorithm. Password hashing is a critical part of any authentication system as it ensures
# that user passwords are not stored in plaintext and are protected even if the data store is compromised.

# Explanation of the library used:
# - bcrypt: This is a popular password-hashing library that implements the bcrypt algorithm. It is designed to be slow and computationally expensive,
#   making brute-force attacks more difficult. bcrypt also handles "salting," where random data is added to the password before hashing to defend against
#   attacks using precomputed hash tables.

import bcrypt

# Function: hash_password(password: str) -> str
# Description:
#   This function takes a plaintext password as input and returns a securely hashed version of the password.
#   - First, the password is encoded as UTF-8 bytes.
#   - bcrypt has a hard limit of 72 bytes for passwords, so the function truncates the byte string to 72 bytes if needed.
#   - A cryptographically secure salt is generated automatically with bcrypt.gensalt().
#   - The actual password hashing is performed using bcrypt.hashpw(), which combines the password and the salt.
#   - The resulting hashed password (in bytes) is decoded to a UTF-8 string for storage (e.g., in a database).

# Method used:
#   - bcrypt.gensalt(): Generates a random salt fitting for bcrypt.
#   - bcrypt.hashpw(password, salt): Returns the bcrypt hash of the given password and salt.


# Function: verify_password(plain_password: str, hashed_password: str) -> bool
# Description:
#   This function verifies if a given plaintext password matches the hashed password.
#   - The plain password is encoded as UTF-8 bytes and truncated if longer than 72 bytes.
#   - The hashed password (retrieved, for example, from the database) is also encoded into bytes.
#   - bcrypt.checkpw() checks if the provided plain password, when hashed, matches the existing hashed password.
#   - Returns True if the password is correct, False otherwise.

# Method used:
#   - bcrypt.checkpw(password, hashed): Verifies that the provided password corresponds to the supplied hash.

# Security Note:
#   All handling of passwords is done in byte strings, and a truncation is applied at 72 bytes due to bcrypt's algorithmic constraints.

def hash_password(password: str) -> str:
    # Convert password to bytes and hash it
    # bcrypt has a 72-byte limit, so we'll truncate if necessary
    password_bytes = password.encode('utf-8') # This line converts the input password string into bytes using UTF-8 encoding, which is necessary because the bcrypt library operates on byte strings rather than regular Python (Unicode) strings.
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Convert to bytes and verify
    password_bytes = plain_password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)
