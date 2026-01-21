"""
Fitness Checkup utility functions.

Calculates next fitness checkup date based on member's joining date.
Each member gets a reminder every 21 days from their membership_start date.
"""

from datetime import date, timedelta, datetime, timezone
from typing import Optional


def calculate_next_fitness_checkup_date(
    membership_start: Optional[date],
    created_at: Optional[datetime] = None,
    last_checkup_date: Optional[date] = None,
    checkpoint_interval_days: int = 21,
) -> Optional[date]:
    """
    Calculate the next fitness checkup date for a member.

    Algorithm:
    1. Use membership_start as base date, or created_at if not provided
    2. If last_checkup_date exists, next date = last_checkup_date + interval
    3. Otherwise, find the first date >= today that is (base_date + N * interval_days)

    Args:
        membership_start: Member's membership start date
        created_at: Member's account creation datetime (fallback)
        last_checkup_date: When the last checkup was completed (nullable)
        checkpoint_interval_days: Days between checkups (default: 21)

    Returns:
        Next fitness checkup date, or None if base date unavailable
    """
    # Determine base date: use membership_start or created_at
    if membership_start:
        base_date = membership_start
    elif created_at:
        base_date = created_at.date() if isinstance(created_at, datetime) else created_at
    else:
        return None

    today = date.today()

    # If last checkup was completed, next is simple: last_checkup + interval
    if last_checkup_date:
        return last_checkup_date + timedelta(days=checkpoint_interval_days)

    # Otherwise, find first date >= today in the 21-day cycle from base_date
    days_since_base = (today - base_date).days

    if days_since_base < 0:
        # Base date is in future (edge case), next checkup is at base_date + interval
        return base_date + timedelta(days=checkpoint_interval_days)

    # How many complete intervals have passed?
    complete_intervals = days_since_base // checkpoint_interval_days

    # Next checkup is after the next interval boundary
    next_checkup = base_date + timedelta(
        days=(complete_intervals + 1) * checkpoint_interval_days
    )

    return next_checkup


def is_checkup_due_soon(
    next_checkup_date: Optional[date],
    days_ahead: int = 2,
) -> bool:
    """
    Check if a fitness checkup is due soon (within the next N days).

    Args:
        next_checkup_date: The next scheduled checkup date
        days_ahead: How many days ahead to consider as "due soon" (default: 2)

    Returns:
        True if checkup is due today or within days_ahead
    """
    if not next_checkup_date:
        return False

    today = date.today()
    days_until = (next_checkup_date - today).days

    return 0 <= days_until <= days_ahead


def get_checkup_status(next_checkup_date: Optional[date]) -> str:
    """
    Get a human-readable status for the fitness checkup.

    Args:
        next_checkup_date: The next scheduled checkup date

    Returns:
        Status string: "due_today", "due_tomorrow", "due_soon", or "upcoming"
    """
    if not next_checkup_date:
        return "no_scheduled"

    today = date.today()
    days_until = (next_checkup_date - today).days

    if days_until < 0:
        return "overdue"
    elif days_until == 0:
        return "due_today"
    elif days_until == 1:
        return "due_tomorrow"
    elif days_until <= 2:
        return "due_soon"
    else:
        return "upcoming"
