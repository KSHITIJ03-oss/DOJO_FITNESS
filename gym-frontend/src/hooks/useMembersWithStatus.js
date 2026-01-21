/**
 * Custom hook for managing members with membership status
 * Handles fetching, status computation, and filtering
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getMembers } from '../api/members';
import { getPlanStatus } from '../utils/membershipStatus';

/**
 * Hook that provides members with computed status and filtering helpers
 * @returns {object} - Members data, loading state, error, filtering functions, and utilities
 */
export const useMembersWithStatus = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch members from API
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMembers();
      setMembers(data || []);
    } catch (err) {
      setError('Failed to load members. Please try again.');
      console.error('Error fetching members:', err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Compute status for each member
  const membersWithStatus = useMemo(() => {
    return members.map((member) => ({
      ...member,
      membershipStatus: getPlanStatus(member.membership_end),
    }));
  }, [members]);

  // Get status counts for UI display
  const statusCounts = useMemo(() => {
    const counts = {
      all: membersWithStatus.length,
      active: 0,
      expiring_soon: 0,
      expired: 0,
    };

    membersWithStatus.forEach((member) => {
      counts[member.membershipStatus]++;
    });

    return counts;
  }, [membersWithStatus]);

  // Filter members based on status and search term
  const filterMembers = useCallback(
    (searchTerm = '', filter = 'all') => {
      return membersWithStatus.filter((member) => {
        // Apply search filter
        const matchesSearch =
          !searchTerm ||
          member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.phone?.includes(searchTerm) ||
          member.email?.toLowerCase().includes(searchTerm.toLowerCase());

        // Apply status filter
        const matchesStatus = filter === 'all' || member.membershipStatus === filter;

        return matchesSearch && matchesStatus;
      });
    },
    [membersWithStatus]
  );

  // Get filtered members based on current filters
  const getFilteredMembers = useCallback(
    (searchTerm = '') => {
      return filterMembers(searchTerm, statusFilter);
    },
    [filterMembers, statusFilter]
  );

  return {
    members: membersWithStatus,
    loading,
    error,
    fetchMembers,
    statusFilter,
    setStatusFilter,
    filterMembers,
    getFilteredMembers,
    statusCounts,
  };
};
