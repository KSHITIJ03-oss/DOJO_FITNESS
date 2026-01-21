/**
 * Membership status computation utility
 * Determines if a membership is active, expiring soon, or expired
 */

// Configurable constant: number of days to consider as "expiring soon"
export const EXPIRING_SOON_DAYS = 7;

/**
 * Computes the membership status based on end date
 * @param {string|Date} endDate - ISO date string or Date object for membership end
 * @param {Date} now - Current date (defaults to today)
 * @returns {string} - 'expired', 'expiring_soon', or 'active'
 */
export const getPlanStatus = (endDate, now = new Date()) => {
  if (!endDate) {
    return 'active'; // If no end date, assume active indefinitely
  }

  // Parse the end date safely
  const end = new Date(endDate);
  const today = new Date(now);

  // Normalize dates to midnight for comparison (ignore time component)
  end.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  // Check if expired (end date is in the past)
  if (end < today) {
    return 'expired';
  }

  // Calculate days until expiration
  const daysUntilExpiration = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

  // Check if expiring soon (within the next N days)
  if (daysUntilExpiration <= EXPIRING_SOON_DAYS) {
    return 'expiring_soon';
  }

  return 'active';
};

/**
 * Get status badge color and styling
 * @param {string} status - Status from getPlanStatus
 * @returns {object} - Object with Tailwind classes for badge styling
 */
export const getStatusBadgeStyles = (status) => {
  const styles = {
    expired: {
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      border: 'border-red-500/50',
      icon: '●',
      label: 'Expired',
    },
    expiring_soon: {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      border: 'border-yellow-500/50',
      icon: '⚠',
      label: 'Expiring Soon',
    },
    active: {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      border: 'border-green-500/50',
      icon: '✓',
      label: 'Active',
    },
  };

  return styles[status] || styles.active;
};

/**
 * Format status for display
 * @param {string} status - Status from getPlanStatus
 * @returns {string} - Formatted human-readable status
 */
export const formatStatusLabel = (status) => {
  const labels = {
    expired: 'Expired',
    expiring_soon: 'Expiring Soon',
    active: 'Active',
  };

  return labels[status] || 'Unknown';
};
