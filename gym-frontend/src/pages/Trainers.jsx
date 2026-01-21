/**
 * Trainers page — manage trainers (list, search, create, delete)
 */
import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { getTrainers, deleteTrainer, createTrainer } from '../api/trainers';
import Loading from '../components/Loading';
import Button from '../components/forms/Button';
import TrainerForm from '../components/forms/TrainerForm';
import { formatDate } from '../utils/formatters';

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showCreateForm = searchParams.get('action') === 'create';

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const data = await getTrainers();
      setTrainers(data || []);
    } catch (err) {
      setError('Failed to load trainers. Please try again.');
      console.error('Error fetching trainers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trainer?')) return;
    try {
      setDeleting(id);
      await deleteTrainer(id);
      setTrainers(trainers.filter((t) => t.id !== id));
      setSuccess('Trainer deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete trainer.');
      console.error('Error deleting trainer:', err);
    } finally {
      setDeleting(null);
    }
  };

  const handleCreate = async (data) => {
    console.log('Trainers.handleCreate called', data);
    try {
      setCreating(true);
      setError('');
      const newTrainer = await createTrainer(data);
      console.log('Trainers.handleCreate: created', newTrainer);
      // Refresh full list to ensure state matches server
      await fetchTrainers();
      setSuccess('Trainer created successfully!');
      setTimeout(() => {
        setSuccess('');
        navigate('/trainers');
      }, 1500);
    } catch (err) {
      console.error('Error creating trainer:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to create trainer.');
    } finally {
      setCreating(false);
    }
  };

  const filtered = trainers.filter((t) => {
    const q = searchTerm.toLowerCase();
    return (
      !q ||
      (t.user_name || t.name || '').toLowerCase().includes(q) ||
      (t.user_email || '').toLowerCase().includes(q) ||
      (t.specialization || '').toLowerCase().includes(q) ||
      (t.phone || '').includes(q)
    );
  });

  if (loading) return <Loading fullScreen message="Loading trainers..." />;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Trainers</h1>
            <p className="text-gray-400">Manage gym trainers and their profiles</p>
          </div>
          <Link to="/trainers?action=create">
            <Button variant="primary" size="md">+ Add Trainer</Button>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
            <p className="text-green-400">{success}</p>
          </div>
        )}

        {showCreateForm && (
          <div className="mb-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Add New Trainer</h2>
            <TrainerForm onSubmit={handleCreate} onCancel={() => navigate('/trainers')} loading={creating} />
          </div>
        )}

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-300 mb-2">Search Trainers</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, specialization, or phone..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-400">Showing {filtered.length} trainer{filtered.length !== 1 ? 's' : ''}</p>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t) => (
              <div key={t.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-primary-500 transition-all duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1">{t.user_name || t.name}</h3>
                    <p className="text-gray-400 text-sm">ID: #{t.id}</p>
                  </div>
                  {t.specialization && (
                    <span className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded whitespace-nowrap">{t.specialization}</span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  {t.user_email && (<div className="flex items-center text-sm text-gray-300"><span className="mr-2">✉️</span>{t.user_email}</div>)}
                  {t.phone && (<div className="flex items-center text-sm text-gray-300"><span className="mr-2">📞</span>{t.phone}</div>)}
                  {t.experience_years !== undefined && t.experience_years !== null && (<div className="flex items-center text-sm text-gray-300"><span className="mr-2">🏆</span>{t.experience_years} years</div>)}
                  {t.certifications && (<div className="flex items-center text-sm text-gray-300"><span className="mr-2">🎖️</span><span className="truncate">{t.certifications}</span></div>)}
                  {t.created_at && (<div className="flex items-center text-sm text-gray-400"><span className="mr-2">🕒</span>Joined: {formatDate(t.created_at)}</div>)}
                </div>

                <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-700">
                  <Link to={`/trainers/${t.id}`} className="flex-1 text-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">View</Link>
                  <Link to={`/trainers?edit=${t.id}`} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors">Edit</Link>
                  <button onClick={() => handleDelete(t.id)} disabled={deleting === t.id} className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-medium rounded-lg transition-colors disabled:opacity-50">{deleting === t.id ? '...' : 'Delete'}</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
            <div className="text-6xl mb-4">🏋️‍♂️</div>
            <h3 className="text-xl font-semibold text-white mb-2">{searchTerm ? 'No trainers found' : 'No trainers yet'}</h3>
            <p className="text-gray-400 mb-6">{searchTerm ? 'Try adjusting your search term' : 'Add your first trainer to get started!'}</p>
            {searchTerm ? (
              <button onClick={() => setSearchTerm('')} className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">Clear Search</button>
            ) : (
              <Link to="/trainers?action=create"><Button variant="primary" size="lg">Add First Trainer</Button></Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trainers;
