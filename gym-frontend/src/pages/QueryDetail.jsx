/**
 * Query detail page showing full query information.
 * Allows viewing details and updating status.
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getQueryById, deleteQuery, updateQueryStatus } from '../api/queries';
import Loading from '../components/Loading';
import Button from '../components/forms/Button';
import { formatDate, formatDateTime } from '../utils/formatters';

const QueryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuery();
  }, [id]);

  const fetchQuery = async () => {
    try {
      setLoading(true);
      const data = await getQueryById(id);
      if (!data) {
        setError('Query not found');
      } else {
        setQuery(data);
        setNewStatus(data.status || 'new');
      }
    } catch (error) {
      setError('Failed to load query. Please try again.');
      console.error('Error fetching query:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      await updateQueryStatus(id, newStatus);
      await fetchQuery(); // Refresh query data
    } catch (error) {
      setError('Failed to update status. Please try again.');
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this query? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      await deleteQuery(id);
      navigate('/queries');
    } catch (error) {
      setError('Failed to delete query. Please try again.');
      console.error('Error deleting query:', error);
      setDeleting(false);
    }
  };

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
    return <Loading fullScreen message="Loading query..." />;
  }

  if (error && !query) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-semibold text-white mb-2">Query Not Found</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link to="/queries">
            <Button variant="primary">Back to Queries</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/queries"
          className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <span className="mr-2">←</span>
          Back to Queries
        </Link>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Query Header */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Query #{query?.id}
              </h1>
              <p className="text-gray-400">Customer Inquiry Details</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
                loading={deleting}
              >
                Delete
              </Button>
            </div>
          </div>

          {/* Current Status */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Current Status</p>
                <span className={`inline-block px-3 py-1 rounded border ${getStatusColor(query?.status)}`}>
                  {query?.status || 'new'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Query Details */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Customer Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Full Name</p>
              <p className="text-white font-medium">{query?.name || 'N/A'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">Phone Number</p>
              <p className="text-white font-medium">{query?.mobile || 'N/A'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">Email Address</p>
              <p className="text-white font-medium">{query?.email || 'N/A'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">Submitted</p>
              <p className="text-white font-medium">
                {query?.created_at ? formatDateTime(query.created_at) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Message */}
        {query?.message && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Message</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{query.message}</p>
          </div>
        )}

        {/* Status Update Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Update Status</h2>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                disabled={updating}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={handleStatusUpdate}
              loading={updating}
              disabled={updating || newStatus === query?.status}
            >
              Update Status
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryDetail;

