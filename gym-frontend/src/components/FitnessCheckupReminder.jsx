/**
 * FitnessCheckupReminder Component
 *
 * Dashboard widget showing fitness checkups due today or soon.
 * Admin and Receptionist can click to navigate to filtered members list.
 */

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useFitnessCheckups } from "../hooks/useFitnessCheckups";
import { useAuth } from "../hooks/useAuth";
import Button from "./forms/Button";

const FitnessCheckupReminder = () => {
  const { user } = useAuth();
  const { membersDue, loading, fetchDueCheckups, getDueCount } =
    useFitnessCheckups();

  // Only show for admin and receptionist
  if (!user || !["admin", "receptionist"].includes(user.role)) {
    return null;
  }

  useEffect(() => {
    fetchDueCheckups();
  }, [fetchDueCheckups]);

  const dueCount = getDueCount();

  if (loading || dueCount === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border-l-4 border-orange-500 rounded-lg p-4 mb-6 shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🏋️</div>
          <div>
            <h3 className="font-semibold text-orange-300 text-lg">
              Fitness Checkups Due
            </h3>
            <p className="text-orange-200 text-sm">
              {dueCount} member{dueCount !== 1 ? "s" : ""} need{
                dueCount === 1 ? "s" : ""
              } fitness checkup today or soon
            </p>
          </div>
        </div>
        <Link to="/members">
          <Button variant="primary" size="sm">
            View Members
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FitnessCheckupReminder;
