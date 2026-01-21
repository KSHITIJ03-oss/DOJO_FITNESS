# app/core/config.py
#
# This file serves as the central configuration module for the project. Its primary responsibility is
# to define and expose global configuration settings that are used throughout the application.
# By managing configuration values in one place, the codebase becomes more maintainable and secure.
# 
# The main usage of this file is to provide standardized and environment-dependent settings such as:
# - Database connection details (e.g., connection URL for MySQL)
# - JWT (JSON Web Token) secret and algorithm for authentication
# - Token expiration timing for access tokens
#
# How it is used in the project:
# - Other modules, such as authentication handlers or database initializers, import these constants to
#   access configuration settings without duplicating sensitive or environment-specific values.
#   For example, the authentication module will use JWT_SECRET and JWT_ALGORITHM to encode/decode JWT tokens.
#
# Explanation of code in this file:
#
# 1. import os
#    - The os module is imported to interface with the system’s environment variables. This allows for secure,
#      dynamic configuration, favoring environment variables over hard-coded credentials or secrets.
#      The main method used is os.getenv(), which retrieves the value of an environment variable or
#      returns a default value if it is not set.
#
# Environment variable retrieval and defaulting (explained but outside the selection):
# - DATABASE_URL: Retrieved with os.getenv to allow flexible database connections for different environments.
# - JWT_SECRET: Critical for the cryptographic security of tokens. Pulled from environment to avoid exposing secrets in source code.
# - JWT_ALGORITHM: Specifies the cryptographic algorithm for JWT signing. Not fetched from environment to enforce a safe, explicit algorithm.
# - ACCESS_TOKEN_EXPIRE_MINUTES: Controls session longevity; can be adjusted via environment variable for different deployment scenarios.
# 
# In summary, this file forms the foundation of application configuration. By using os and environment variables,
# it supports secure, adaptable, and maintainable project setup across development, testing, and production environments.
import os

DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:kshitij123@localhost:3306/dojo_fitness")
JWT_SECRET = os.getenv("JWT_SECRET", "yeah@boii")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))