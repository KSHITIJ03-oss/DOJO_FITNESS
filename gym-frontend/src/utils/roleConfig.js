// Centralized role and navigation access configuration
export const ROLES = {
  ADMIN: 'admin',
  RECEPTIONIST: 'receptionist',
  TRAINER: 'trainer',
  MEMBER: 'member',
};

// Navigation items with allowed roles — used by Header and route guards
export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', allowed: [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.TRAINER, ROLES.MEMBER] },
  { label: 'Workouts', path: '/workouts', allowed: [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.TRAINER, ROLES.MEMBER] },
  // Members/Trainers/Queries are management sections — members must not see them
  { label: 'Members', path: '/members', allowed: [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.TRAINER] },
  { label: 'Trainers', path: '/trainers', allowed: [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.TRAINER] },
  { label: 'Plans', path: '/plans', allowed: [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.TRAINER, ROLES.MEMBER] },
  { label: 'Queries', path: '/queries', allowed: [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.TRAINER] },
  { label: 'Profile', path: '/profile', allowed: [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.TRAINER, ROLES.MEMBER] },
];

export function isRoleAllowed(userRole, allowedRoles) {
  if (!userRole) return false;
  return allowedRoles.map((r) => r.toLowerCase()).includes(userRole.toLowerCase());
}

export default {
  ROLES,
  NAV_ITEMS,
  isRoleAllowed,
};
