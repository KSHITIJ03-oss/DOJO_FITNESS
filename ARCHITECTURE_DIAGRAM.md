# Fitness Checkup System - Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      REACT FRONTEND                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Members.jsx (Member List Page)                         │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  • Displays member cards                                │   │
│  │  • Shows fitness checkup badge when due                │   │
│  │  • Uses useFitnessCheckups hook                         │   │
│  │  • Badge: "Fitness Checkup Due/Tomorrow/Soon"          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                             ▲                                     │
│                             │ calls                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  useFitnessCheckups Hook (Custom Hook)                 │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  • Manages fitness checkup state                        │   │
│  │  • Exports: getCheckupStatus(), isCheckupDueSoon()    │   │
│  │  • Calls API functions                                  │   │
│  │  • Handles loading/error states                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                             ▲                                     │
│                             │ calls                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  fitnessCheckups API Client (src/api/)                │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  • getFitnesCheckupsDue()                               │   │
│  │  • markFitnessCheckupDone(memberId)                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                             ▲                                     │
│                             │ HTTP requests                      │
└─────────────────────────────┼─────────────────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    │                    │
              ┌─────▼──────┐      ┌──────▼─────┐
              │   GET       │      │   POST      │
              └─────┬──────┘      └──────┬─────┘
                    │                    │
                    │                    │
        ┌───────────┴──────────┬─────────┴────────────┐
        │                      │                      │
        │                      │                      │
        │  FASTAPI BACKEND     │  FASTAPI BACKEND     │
        │  ┌────────────────┐  │  ┌────────────────┐  │
        │  │ GET             │  │  │ POST            │  │
        │  │ /fitness-       │  │  │ /fitness-       │  │
        │  │ checkups/due    │  │  │ checkups/       │  │
        │  │                 │  │  │ {id}/mark-      │  │
        │  │ (Admin/         │  │  │ done            │  │
        │  │  Receptionist)  │  │  │                 │  │
        │  │                 │  │  │ (Admin/         │  │
        │  └────────┬────────┘  │  │  Receptionist)  │  │
        │           │           │  │                 │  │
        │           │           │  └────────┬────────┘  │
        │           │           │           │           │
        └───────────┼───────────┼───────────┼───────────┘
                    │           │           │
              ┌─────▼───────────▼──────────▼──────┐
              │                                     │
              │  fitness_checkups.py (Router)     │
              │                                     │
              │  • calculate_next_date()            │
              │  • mark_checkup_done()              │
              │                                     │
              └──────────────────┬──────────────────┘
                                 │
                                 │ calls
                                 │
              ┌──────────────────▼──────────────────┐
              │                                     │
              │  fitness_checkup.py (Utils)        │
              │                                     │
              │  ✓ calculate_next_fitness_         │
              │    checkup_date()                  │
              │  ✓ is_checkup_due_soon()           │
              │  ✓ get_checkup_status()            │
              │                                     │
              └──────────────────┬──────────────────┘
                                 │
                                 │ uses
                                 │
              ┌──────────────────▼──────────────────┐
              │                                     │
              │  SQLAlchemy ORM                    │
              │                                     │
              └──────────────────┬──────────────────┘
                                 │
                                 │ query/update
                                 │
              ┌──────────────────▼──────────────────┐
              │                                     │
              │  Database (SQLite/PostgreSQL)      │
              │                                     │
              │  members table:                    │
              │  - id (PK)                         │
              │  - name                            │
              │  - membership_start (Date)         │
              │  - last_fitness_checkup_date (NEW) │
              │  - next_fitness_checkup_date (NEW) │
              │  - ...                             │
              │                                     │
              └─────────────────────────────────────┘
```

---

## Data Flow Diagram

### 1. Create Member Flow

```
USER submits "Create Member" form
    ↓
MemberForm component (frontend)
    ↓
POST /members with membership_start
    ↓
create_member() in members.py (backend)
    ↓
Call: calculate_next_fitness_checkup_date()
    ↓
    ├─ IF membership_start exists:
    │    base_date = membership_start
    │  ELSE:
    │    base_date = created_at
    │
    └─ Calculate first date >= today in 21-day cycle
    │
    └─ Set: next_fitness_checkup_date = calculated_date
    │
    └─ Set: last_fitness_checkup_date = NULL
    ↓
Save member to database with calculated dates
    ↓
Return member object with dates
    ↓
Frontend displays member card
    ↓
IF next_fitness_checkup_date <= today + 2 days:
    Show orange badge "Fitness Checkup Soon/Tomorrow/Due"
ELSE:
    No badge
```

### 2. Display Members with Badges Flow

```
USER navigates to /members
    ↓
Members.jsx loads
    ↓
useMembersWithStatus() fetches all members
    ↓
useFitnessCheckups() hook provides utilities
    ↓
FOR EACH member:
    ├─ Get: member.next_fitness_checkup_date
    ├─ Call: isCheckupDueSoon(next_fitness_checkup_date)
    ├─ IF true:
    │   ├─ Call: getCheckupStatus(date)
    │   ├─ Render badge with appropriate text
    │   └─ Add orange styling and pulse animation
    │
    └─ ELSE:
        No badge shown
```

### 3. Mark Checkup as Done Flow

```
ADMIN/RECEPTIONIST clicks "Mark Fitness Checkup Done" button
    ↓
MemberDetail.jsx calls: markFitnessCheckupDone(memberId)
    ↓
POST /fitness-checkups/{memberId}/mark-done
    ↓
mark_fitness_checkup_done() in fitness_checkups.py
    ↓
Get member by ID from database
    ↓
Set: last_fitness_checkup_date = TODAY
    ↓
Call: calculate_next_fitness_checkup_date(
    membership_start,
    created_at,
    last_checkup_date = TODAY,  ← KEY DIFFERENCE
    checkpoint_interval_days=21
)
    ↓
Since last_checkup_date exists:
    next_date = TODAY + 21 days
    ↓
Set: next_fitness_checkup_date = next_date
    ↓
Save updated member to database
    ↓
Return updated member
    ↓
Frontend updates member state
    ↓
Badge disappears (next checkup not due soon)
```

### 4. View Due Checkups Flow

```
DASHBOARD loads (admin/receptionist)
    ↓
FitnessCheckupReminder component mounts
    ↓
useFitnessCheckups() calls: fetchDueCheckups()
    ↓
GET /fitness-checkups/due
    ↓
get_members_with_due_checkups() in fitness_checkups.py
    ↓
Query members WHERE:
    next_fitness_checkup_date IS NOT NULL
    AND next_fitness_checkup_date <= TODAY + 2 days
ORDER BY next_fitness_checkup_date ASC
    ↓
Return array of members with due checkups
    ↓
Frontend displays widget showing count
    ↓
Widget shows: "🏋️ Fitness Checkups Due: {count} members"
    ↓
Link to: "/members" to view list
```

---

## Date Calculation Algorithm

### Pseudocode

```
FUNCTION calculate_next_fitness_checkup_date(
    membership_start,
    created_at,
    last_checkup_date,
    checkpoint_interval_days = 21
):
    // Step 1: Determine base date
    IF membership_start is not NULL:
        base_date = membership_start
    ELSE IF created_at is not NULL:
        base_date = created_at.date()
    ELSE:
        RETURN NULL
    
    // Step 2: Handle if last checkup was completed
    IF last_checkup_date is not NULL:
        next_date = last_checkup_date + checkpoint_interval_days
        RETURN next_date
    
    // Step 3: Calculate next date in 21-day cycle
    today = CURRENT_DATE
    days_since_base = (today - base_date).days
    
    IF days_since_base < 0:
        // Base date is in future (shouldn't happen)
        RETURN base_date + checkpoint_interval_days
    
    // Find which cycle we're in
    complete_intervals = days_since_base / checkpoint_interval_days
    
    // Next checkup is after next interval boundary
    next_checkup = base_date + ((complete_intervals + 1) * checkpoint_interval_days)
    
    RETURN next_checkup
END FUNCTION
```

### Example Calculation

**Member Profile**:
- Joined: Dec 1, 2025
- Today: Jan 25, 2026
- Days elapsed: 56 days

**Calculation**:
```
base_date = Dec 1, 2025
today = Jan 25, 2026
days_since = 56

complete_intervals = 56 / 21 = 2 (integer division)

next_checkup = Dec 1 + ((2 + 1) * 21)
             = Dec 1 + 63 days
             = Jan 3, 2026

STATUS: next_checkup (Jan 3) is in the past!
        This means member is OVERDUE

Actually, let's recalculate to find when they WERE due:
- Cycle 1: Dec 1 + 21 = Dec 22 (1st checkup)
- Cycle 2: Dec 1 + 42 = Jan 12 (2nd checkup)
- Cycle 3: Dec 1 + 63 = Feb 2 (3rd checkup)

So on Jan 25:
- Last due: Jan 12 (overdue by 13 days)
- Next due: Feb 2 (not due yet)

But our formula shows:
next_checkup = Dec 1 + 63 = Feb 2 ✓ CORRECT
```

---

## Component Integration Map

```
┌──────────────────────────────────────────────────────┐
│ Dashboard.jsx                                        │
│ ┌────────────────────────────────────────────────┐  │
│ │ <FitnessCheckupReminder />                     │  │
│ │ ├─ useFitnessCheckups()                        │  │
│ │ │  ├─ fetchDueCheckups()                       │  │
│ │ │  └─ getDueCount()                            │  │
│ │ ├─ Shows count of due checkups                 │  │
│ │ └─ Link to /members                            │  │
│ └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────┐
│ Members.jsx                                          │
│ ┌────────────────────────────────────────────────┐  │
│ │ useMembersWithStatus() - Get all members       │  │
│ │ useFitnessCheckups() - Fitness utilities       │  │
│ │                                                 │  │
│ │ FOR EACH member:                              │  │
│ │  <MemberCard>                                  │  │
│ │  ├─ Member info                                │  │
│ │  ├─ Status badges                              │  │
│ │  ├─ IF isCheckupDueSoon():                     │  │
│ │  │   <FitnessCheckupBadge />                   │  │
│ │  │   ├─ Text from getCheckupStatus()           │  │
│ │  │   ├─ Orange styling                         │  │
│ │  │   └─ Pulse animation                        │  │
│ │  └─ Action buttons                             │  │
│ └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────┐
│ MemberDetail.jsx                                     │
│ ┌────────────────────────────────────────────────┐  │
│ │ Display full member details                    │  │
│ │ ├─ IF next_fitness_checkup_date is due:       │  │
│ │ │   ├─ Show: "Mark Fitness Checkup Done"      │  │
│ │ │   └─ Button calls markCheckupDone()          │  │
│ │ └─ Update UI after API response               │  │
│ └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

---

## State Management Flow

### useFitnessCheckups Hook State

```
┌─────────────────────────────────────────────────────────┐
│ useFitnessCheckups Hook State                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ membersDue: Member[]           // Members with due      │
│                                 // checkups            │
│                                                          │
│ loading: boolean               // Fetching due          │
│                                 // checkups            │
│                                                          │
│ error: string | null           // Error message         │
│                                                          │
│ marking: number | null         // Member ID being       │
│                                 // marked              │
│                                                          │
│ Functions:                                             │
│ ├─ fetchDueCheckups()          // GET /due             │
│ ├─ markCheckupDone(id)         // POST /mark-done      │
│ ├─ getDueCount()               // Count of due         │
│ ├─ getCheckupStatus(date)      // Status string        │
│ └─ isCheckupDueSoon(date)      // Boolean check        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
Frontend API Call
    ↓
    ├─ SUCCESS (200)
    │   └─ Update state with response data
    │
    ├─ UNAUTHORIZED (401)
    │   ├─ Invalid/expired token
    │   └─ Redirect to login
    │
    ├─ FORBIDDEN (403)
    │   ├─ User role insufficient
    │   └─ Show error: "You don't have permission"
    │
    ├─ NOT FOUND (404)
    │   ├─ Member doesn't exist
    │   └─ Show error: "Member not found"
    │
    └─ SERVER ERROR (500)
        ├─ Unexpected error
        └─ Show error: "Failed to process request"

Backend Validation
    ↓
    ├─ Check role (admin/receptionist)
    │
    ├─ Check member exists
    │
    ├─ Validate input data
    │
    ├─ Execute operation (mark done)
    │
    └─ Return result or error
```

---

## Performance Characteristics

| Operation | Complexity | Time | Notes |
|-----------|-----------|------|-------|
| Calculate next date | O(1) | <1ms | Pure math, no DB |
| Fetch due checkups | O(n) | DB time | Single query + sort |
| Mark checkup done | O(1) | DB time | Single update + recalc |
| Badge display check | O(1) | <1ms | Frontend calculation |
| Batch mark (100 members) | O(100) | ~100ms | Sequential API calls |

---

## Security Architecture

```
┌─────────────────────────────────────────────────┐
│ User Request                                    │
├─────────────────────────────────────────────────┤
│                                                  │
│ → HTTP Bearer Token Authorization              │
│   └─ JWT token verified at entry               │
│                                                  │
│ → Role-based Access Control (RBAC)             │
│   ├─ GET /fitness-checkups/due                 │
│   │  └─ Requires: admin OR receptionist       │
│   │                                             │
│   └─ POST /fitness-checkups/{id}/mark-done    │
│      └─ Requires: admin OR receptionist       │
│                                                  │
│ → Member ID Validation                         │
│   └─ Verify member exists before processing    │
│                                                  │
│ → SQL Injection Prevention                      │
│   └─ ORM (SQLAlchemy) parameterized queries   │
│                                                  │
└─────────────────────────────────────────────────┘
```

This architecture ensures:
- Only authenticated users can access endpoints
- Only authorized roles can perform actions
- No cross-member data access
- Type-safe database operations
