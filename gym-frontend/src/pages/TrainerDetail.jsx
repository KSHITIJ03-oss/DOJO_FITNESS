/**
 * Trainer detail page showing full trainer profile.
 * Allows viewing and editing trainer details using `TrainerForm`.
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTrainerById, updateTrainer, deleteTrainer } from '../api/trainers';
import Loading from '../components/Loading';
import Button from '../components/forms/Button';
import TrainerForm from '../components/forms/TrainerForm';
import { formatDate } from '../utils/formatters';

const TrainerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrainer();
  }, [id]);

  const fetchTrainer = async () => {
    try {
      setLoading(true);
      const data = await getTrainerById(id);
      setTrainer(data);
    } catch (err) {
      setError('Failed to load trainer. Please try again.');
      console.error('Error fetching trainer:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (payload) => {
    try {
      setSaving(true);
      setError('');
      const updated = await updateTrainer(id, payload);
      setTrainer(updated);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update trainer.');
      console.error('Error updating trainer:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this trainer? This action cannot be undone.')) return;
    try {
      setDeleting(true);
      await deleteTrainer(id);
      navigate('/trainers');
    } catch (err) {
      setError('Failed to delete trainer. Please try again.');
      console.error('Error deleting trainer:', err);
      setDeleting(false);
    }
  };

  if (loading) return <Loading fullScreen message="Loading trainer..." />;

  if (error && !trainer) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-semibold text-white mb-2">Trainer Not Found</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link to="/trainers">
            <Button variant="primary">Back to Trainers</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/trainers" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
          <span className="mr-2">←</span>
          Back to Trainers
        </Link>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{editing ? 'Edit Trainer' : trainer?.user_name || trainer?.name || 'Trainer Details'}</h1>
              {trainer?.id && <p className="text-gray-400">Trainer ID: #{trainer.id}</p>}
            </div>
            <div className="flex space-x-2">
              {!editing ? (
                <>
                  <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleting} loading={deleting}>Delete</Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" size="sm" onClick={() => setEditing(false)} disabled={saving}>Cancel</Button>
                  <Button variant="primary" size="sm" onClick={() => {}} loading={saving} disabled={saving}>Save</Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          {!editing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trainer?.user_email && (<div><label className="block text-sm font-medium text-gray-300 mb-1">Email</label><p className="text-gray-100">{trainer.user_email}</p></div>)}
              {trainer?.phone && (<div><label className="block text-sm font-medium text-gray-300 mb-1">Phone</label><p className="text-gray-100">{trainer.phone}</p></div>)}
              {trainer?.specialization && (<div><label className="block text-sm font-medium text-gray-300 mb-1">Specialization</label><p className="text-gray-100">{trainer.specialization}</p></div>)}
              {trainer?.experience_years !== undefined && trainer?.experience_years !== null && (<div><label className="block text-sm font-medium text-gray-300 mb-1">Experience</label><p className="text-gray-100">{trainer.experience_years} years</p></div>)}
              {trainer?.certifications && (<div className="md:col-span-2"><label className="block text-sm font-medium text-gray-300 mb-1">Certifications</label><p className="text-gray-100 truncate">{trainer.certifications}</p></div>)}
              {trainer?.bio && (<div className="md:col-span-2"><label className="block text-sm font-medium text-gray-300 mb-1">Bio</label><p className="text-gray-100">{trainer.bio}</p></div>)}
            </div>
          ) : (
            <TrainerForm trainer={trainer} onSubmit={handleSave} onCancel={() => setEditing(false)} loading={saving} />
          )}

          {trainer?.created_at && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-400">Trainer since: {formatDate(trainer.created_at)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerDetail;
