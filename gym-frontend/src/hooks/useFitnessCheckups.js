/**
 * useFitnessCheckups - Custom hook for fitness checkup state management
 *
 * Handles:
 * - Fetching members with due fitness checkups
 * - Marking checkups as completed
 * - Calculating checkup status for display
 * - Managing loading and error states
 */

import { useState, useCallback } from "react";
import {
  getFitnesCheckupsDue,
  markFitnessCheckupDone,
} from "../api/fitnessCheckups";

/**
 * Get a human-readable status for a checkup date
 *
 * @param {string|null} nextCheckupDate - ISO date string of next checkup
 * @returns {string} Status: "due_today", "due_tomorrow", "due_soon", or "upcoming"
 */
const getCheckupStatus = (nextCheckupDate) => {
  if (!nextCheckupDate) return "no_scheduled";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const checkupDate = new Date(nextCheckupDate);
  checkupDate.setHours(0, 0, 0, 0);

  const daysUntil = Math.floor(
    (checkupDate - today) / (1000 * 60 * 60 * 24)
  );

  if (daysUntil < 0) return "overdue";
  if (daysUntil === 0) return "due_today";
  if (daysUntil === 1) return "due_tomorrow";
  if (daysUntil <= 2) return "due_soon";

  return "upcoming";
};

/**
 * Check if a checkup is considered "due soon" (within next 2 days)
 *
 * @param {string|null} nextCheckupDate - ISO date string of next checkup
 * @returns {boolean} True if due today or within next 2 days
 */
const isCheckupDueSoon = (nextCheckupDate) => {
  const status = getCheckupStatus(nextCheckupDate);
  return ["due_today", "due_tomorrow", "due_soon", "overdue"].includes(
    status
  );
};

export const useFitnessCheckups = () => {
  const [membersDue, setMembersDue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [marking, setMarking] = useState(null); // Track which member is being marked

  /**
   * Fetch members with fitness checkups due
   */
  const fetchDueCheckups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFitnesCheckupsDue();
      setMembersDue(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to fetch fitness checkups. Please try again."
      );
      console.error("Error fetching fitness checkups:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Mark a fitness checkup as completed
   *
   * @param {number} memberId - The member's ID
   * @returns {Promise<Object>} Updated member object
   */
  const markCheckupDone = useCallback(async (memberId) => {
    setMarking(memberId);
    try {
      const updatedMember = await markFitnessCheckupDone(memberId);

      // Remove from due list or refresh
      setMembersDue((prev) =>
        prev.filter((m) => m.id !== memberId)
      );

      return updatedMember;
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to mark checkup. Please try again."
      );
      console.error("Error marking checkup:", err);
      throw err;
    } finally {
      setMarking(null);
    }
  }, []);

  /**
   * Get count of members with due checkups
   *
   * @returns {number} Count of members with due checkups
   */
  const getDueCount = useCallback(() => {
    return membersDue.length;
  }, [membersDue]);

  return {
    membersDue,
    loading,
    error,
    marking,
    fetchDueCheckups,
    markCheckupDone,
    getDueCount,
    getCheckupStatus,
    isCheckupDueSoon,
  };
};
