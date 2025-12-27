# app/db/base.py serves as the foundational declaration for the application's SQLAlchemy models.
#
# Purpose of this file in the project:
# - This file defines and exposes the SQLAlchemy Base class through which all ORM models in the project inherit
#   their metadata and ORM capabilities.
# - Having a dedicated Base class instance allows for a consistent metadata collection from all models,
#   which is critical for reflective database operations (like migrations and table creation).
# - By centralizing the Base class in this file, other modules avoid circular imports and ensure a single
#   source of truth for ORM base functionality.

# Usage of imported function/class:
# - from sqlalchemy.orm import DeclarativeBase
#   - DeclarativeBase is provided by SQLAlchemy as a base class for all declarative ORM models.
#   - It is used to dynamically create a base class which stores model metadata and provides the
#     underlying machinery required for SQLAlchemy's object-relational mapping.
#   - When you subclass DeclarativeBase, you get a Base class to be used as the parent for all models.
#   - The Base class includes important methods and attributes (notably Base.metadata) used across
#     SQLAlchemy for managing schema and reflecting on the database.

from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass
