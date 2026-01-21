/**
 * Queries page displaying all customer queries.
 * Supports searching, filtering by status, and managing queries.
 * Similar interface to Members and Exercises pages.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getQueries, deleteQuery, updateQueryStatus } from '../api/queries';
import Loading from '../components/Loading';
import Button from '../components/forms/Button';
import { formatDate, formatDateTime } from '../utils/formatters';

const Queries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleting, setDeleting] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const data = await getQueries();
      setQueries(data || []);
    } catch (error) {
      setError('Failed to load queries. Please try again.');
      console.error('Error fetching queries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this query?')) {
      return;
    }

    try {
      setDeleting(id);
      await deleteQuery(id);
      setQueries(queries.filter((q) => q.id !== id));
    } catch (error) {
      setError('Failed to delete query. Please try again.');
      console.error('Error deleting query:', error);
    } finally {
      setDeleting(null);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setUpdating(id);
      await updateQueryStatus(id, newStatus);
      // Refresh queries to get updated status
      await fetchQueries();
    } catch (error) {
      setError('Failed to update status. Please try again.');
      console.error('Error updating status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const filteredQueries = queries.filter((query) => {
    const matchesSearch =
      !searchTerm ||
      query.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.mobile?.includes(searchTerm) ||
      query.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.message?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || query.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'new':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'contacted':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'converted':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading queries..." />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Customer Queries</h1>
          <p className="text-gray-400">
            Manage trial requests, membership inquiries, and contact form submissions
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search Queries
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, phone, email, or message..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-400">
            Showing {filteredQueries.length} query{filteredQueries.length !== 1 ? 'ies' : ''}
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchQueries}
          >
            Refresh
          </Button>
        </div>

        {/* Queries Grid */}
        {filteredQueries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQueries.map((query) => (
              <div
                key={query.id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-primary-500 transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {query.name}
                    </h3>
                    <p className="text-gray-400 text-sm">ID: #{query.id}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded border ${getStatusColor(query.status)}`}>
                    {query.status || 'new'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {query.mobile && (
                    <div className="flex items-center text-sm text-gray-300">
                      <span className="mr-2">📞</span>
                      {query.mobile}
                    </div>
                  )}
                  {query.email && (
                    <div className="flex items-center text-sm text-gray-300">
                      <span className="mr-2">✉️</span>
                      {query.email}
                    </div>
                  )}
                  {query.message && (
                    <div className="text-sm text-gray-400 line-clamp-2">
                      {query.message}
                    </div>
                  )}
                  {query.created_at && (
                    <div className="flex items-center text-sm text-gray-400">
                      <span className="mr-2">🕒</span>
                      {formatDateTime(query.created_at)}
                    </div>
                  )}
                </div>

                {/* Status Update Dropdown */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Update Status
                  </label>
                  <select
                    value={query.status || 'new'}
                    onChange={(e) => handleStatusUpdate(query.id, e.target.value)}
                    disabled={updating === query.id}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-700">
                  <Link
                    to={`/queries/${query.id}`}
                    className="flex-1 text-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(query.id)}
                    disabled={deleting === query.id}
                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deleting === query.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No queries found' : 'No queries yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Customer queries will appear here when submitted from the public website'}
            </p>
            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Queries;

