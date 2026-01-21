/**
 * Members page displaying all gym members.
 * Supports searching by name, creating, editing, and deleting members.
 * Includes membership status tracking (active, expiring_soon, expired).
 * Includes fitness checkup reminders.
 */
import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { deleteMember, createMember } from "../api/members";
import { useAuth } from "../hooks/useAuth";
import { useMembersWithStatus } from "../hooks/useMembersWithStatus";
import { useFitnessCheckups } from "../hooks/useFitnessCheckups";
import {
  getStatusBadgeStyles,
  formatStatusLabel,
} from "../utils/membershipStatus";
import Loading from "../components/Loading";
import Button from "../components/forms/Button";
import MemberForm from "../components/forms/MemberForm";
import { formatDate } from "../utils/formatters";

const Members = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const showCreateForm = searchParams.get("action") === "create";
  const editId = searchParams.get("edit");

  // Use the custom hook for members with status
  const {
    members,
    loading,
    error: fetchError,
    fetchMembers,
    statusFilter,
    setStatusFilter,
    getFilteredMembers,
    statusCounts,
  } = useMembersWithStatus();

  // Use the fitness checkups hook
  const { isCheckupDueSoon, getCheckupStatus } = useFitnessCheckups();

  useEffect(() => {
    if (editId) {
      navigate(`/members/${editId}`);
    }
  }, [editId, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) {
      return;
    }

    try {
      setDeleting(id);
      await deleteMember(id);
      // Refetch members after deletion
      await fetchMembers();
      setSuccess("Member deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to delete member. Please try again.");
      console.error("Error deleting member:", error);
    } finally {
      setDeleting(null);
    }
  };

  const handleCreate = async (data) => {
    try {
      setCreating(true);
      setError("");
      const newMember = await createMember(data);
      // Refetch members to include the new member with proper status
      await fetchMembers();
      setSuccess("Member created successfully!");
      setTimeout(() => {
        setSuccess("");
        navigate("/members");
      }, 2000);
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Failed to create member. Please try again.",
      );
      console.error("Error creating member:", error);
    } finally {
      setCreating(false);
    }
  };

  // Get filtered members based on current search and status filter
  const filteredMembers = getFilteredMembers(searchTerm);

  // Check if user has permission to see filter controls (admin or receptionist)
  const canViewFilters =
    user?.role === "admin" || user?.role === "receptionist";

  if (loading) {
    return <Loading fullScreen message="Loading members..." />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Members</h1>
            <p className="text-gray-400">
              Manage gym members and their information
            </p>
          </div>
          <Link to="/members?action=create">
            <Button variant="primary" size="md">
              + Add Member
            </Button>
          </Link>
        </div>

        {/* Error Message */}
        {(error || fetchError) && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400">{error || fetchError}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
            <p className="text-green-400">{success}</p>
          </div>
        )}

        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              Add New Member
            </h2>
            <MemberForm
              onSubmit={handleCreate}
              onCancel={() => navigate("/members")}
              loading={creating}
            />
          </div>
        )}

        {/* Search and Status Filter */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search Members
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, phone, or email..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Status Filter - only show for admin and receptionist */}
            {canViewFilters && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Filter by Membership Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="expiring_soon">Expiring Soon</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            )}
          </div>

          {/* Status Legend - only show for admin and receptionist */}
          {canViewFilters && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-xs font-medium text-gray-400 mb-2">
                Status Legend:
              </p>
              <div className="flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  <span className="text-gray-300">Active</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                  <span className="text-gray-300">Expiring Soon (7 days)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  <span className="text-gray-300">Expired</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count and Refresh Button */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-400">
            Showing {filteredMembers.length} member
            {filteredMembers.length !== 1 ? "s" : ""}
            {canViewFilters && statusFilter !== "all" && (
              <span className="text-gray-500 ml-2">
                ({statusCounts[statusFilter]}{" "}
                {statusFilter === "expiring_soon"
                  ? "expiring soon"
                  : statusFilter}
                )
              </span>
            )}
          </p>
          <Button variant="secondary" size="sm" onClick={fetchMembers}>
            Refresh
          </Button>
        </div>

        {/* Members Grid */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => {
              const isDodoMember = member.membership_type === "Dojo Membership";
              return (
                <div
                  key={member.id}
                  className={`rounded-xl p-6 transition-all duration-200 ${
                    isDodoMember
                      ? "bg-gradient-to-br from-gray-800 to-gray-800/80 border-2 border-yellow-500/60 shadow-lg shadow-yellow-500/20 hover:border-yellow-400 hover:shadow-yellow-500/40"
                      : "bg-gray-800 border border-gray-700 hover:border-primary-500"
                  }`}
                >
                  {/* <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-semibold text-white">
                        {member.name}
                      </h3>
                      {isDodoMember && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full">
                          <span className="text-sm">🥋</span>
                          <span className="text-xs font-semibold text-yellow-300">DOJO</span>
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">ID: #{member.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    
                    {member.membershipStatus && (
                      <div
                        className={`px-2 py-1 text-xs rounded border inline-flex items-center gap-1 ${getStatusBadgeStyles(member.membershipStatus).bg} ${getStatusBadgeStyles(member.membershipStatus).text} ${getStatusBadgeStyles(member.membershipStatus).border}`}
                        title={formatStatusLabel(member.membershipStatus)}
                        aria-label={`Membership status: ${formatStatusLabel(member.membershipStatus)}`}
                      >
                        <span>{getStatusBadgeStyles(member.membershipStatus).icon}</span>
                        {formatStatusLabel(member.membershipStatus)}
                      </div>
                    )}
                    
                    {member.membership_type && (
                      <span className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded whitespace-nowrap">
                        {member.membership_type}
                      </span>
                    )}
                  </div>
                </div> */}
                  <div className="mb-4">
                    {/* Row 1: Name + Dojo */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-xl font-semibold text-white">
                        {member.name}
                      </h3>

                      {isDodoMember && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 
        bg-yellow-500/20 border border-yellow-500/50 
        rounded-full whitespace-nowrap"
                        >
                          <span className="text-sm">🥋</span>
                          <span className="text-xs font-semibold text-yellow-300">
                            DOJO
                          </span>
                        </span>
                      )}
                    </div>

                    <p className="text-gray-400 text-sm mb-2">
                      ID: #{member.id}
                    </p>

                    {/* Row 2: Status + Membership + Fitness Checkup */}
                    <div className="flex flex-wrap gap-2">
                      {member.membershipStatus && (
                        <div
                          className={`px-2 py-1 text-xs rounded border inline-flex items-center gap-1 
        ${getStatusBadgeStyles(member.membershipStatus).bg} 
        ${getStatusBadgeStyles(member.membershipStatus).text} 
        ${getStatusBadgeStyles(member.membershipStatus).border}`}
                        >
                          <span>
                            {getStatusBadgeStyles(member.membershipStatus).icon}
                          </span>
                          {formatStatusLabel(member.membershipStatus)}
                        </div>
                      )}

                      {member.membership_type && (
                        <span
                          className="px-2 py-1 bg-primary-500/20 text-primary-400 
        text-xs rounded whitespace-nowrap"
                        >
                          {member.membership_type}
                        </span>
                      )}

                      {/* Fitness Checkup Badge */}
                      {isCheckupDueSoon(member.next_fitness_checkup_date) && (
                        <span
                          className="px-3 py-1 bg-orange-500/20 border border-orange-500/60 
        text-orange-300 text-xs font-semibold rounded-lg whitespace-nowrap
        inline-flex items-center gap-1 animate-pulse"
                          title={`Fitness checkup due on ${formatDate(
                            member.next_fitness_checkup_date
                          )}`}
                        >
                          <span>🏋️</span>
                          {getCheckupStatus(
                            member.next_fitness_checkup_date
                          ) === "due_today"
                            ? "Fitness Checkup Due"
                            : getCheckupStatus(
                                member.next_fitness_checkup_date
                              ) === "due_tomorrow"
                              ? "Fitness Checkup Tomorrow"
                              : "Fitness Checkup Soon"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {member.phone && (
                      <div className="flex items-center text-sm text-gray-300">
                        <span className="mr-2">📞</span>
                        {member.phone}
                      </div>
                    )}
                    {member.age && (
                      <div className="flex items-center text-sm text-gray-300">
                        <span className="mr-2">👤</span>
                        Age: {member.age}
                      </div>
                    )}
                    {member.gender && (
                      <div className="flex items-center text-sm text-gray-300">
                        <span className="mr-2">⚧️</span>
                        {member.gender}
                      </div>
                    )}
                    {member.address && (
                      <div className="flex items-center text-sm text-gray-300">
                        <span className="mr-2">📍</span>
                        <span className="truncate">{member.address}</span>
                      </div>
                    )}
                    {member.membership_start && (
                      <div className="flex items-center text-sm text-gray-300">
                        <span className="mr-2">📅</span>
                        Start: {formatDate(member.membership_start)}
                      </div>
                    )}
                    {member.membership_end && (
                      <div className="flex items-center text-sm text-gray-300">
                        <span className="mr-2">📅</span>
                        End: {formatDate(member.membership_end)}
                      </div>
                    )}
                    {member.created_at && (
                      <div className="flex items-center text-sm text-gray-400">
                        <span className="mr-2">🕒</span>
                        Joined: {formatDate(member.created_at)}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-700">
                    <Link
                      to={`/members/${member.id}`}
                      className="flex-1 text-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                    >
                      View
                    </Link>
                    <Link
                      to={`/members?edit=${member.id}`}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(member.id)}
                      disabled={deleting === member.id}
                      className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      {deleting === member.id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm ? "No members found" : "No members yet"}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm
                ? "Try adjusting your search term"
                : "Add your first member to get started!"}
            </p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm("")}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
              >
                Clear Search
              </button>
            ) : (
              <Link to="/members?action=create">
                <Button variant="primary" size="lg">
                  Add First Member
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;
