import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import Button from '../components/forms/Button';
import { getWorkoutById, updateWorkout } from '../api/workouts';

const WorkoutEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getWorkoutById(id);
        setWorkout(data);
      } catch (err) {
        console.error('Error loading workout for edit', err);
        setError('Failed to load workout');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleChange = (key) => (e) => {
    const val = e.target.value;
    setWorkout((w) => ({ ...w, [key]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!workout || !workout.name || !workout.name.trim()) {
      setError('Name is required');
      return;
    }

    const payload = {
      name: workout.name.trim(),
      description: workout.description || undefined,
      duration: workout.duration ? Number(workout.duration) : undefined,
      calories: workout.calories ? Number(workout.calories) : undefined,
      notes: workout.notes || undefined,
    };

    try {
      setSaving(true);
      const updated = await updateWorkout(id, payload);
      navigate(`/workouts/${id}`);
    } catch (err) {
      console.error('Update workout error', err);
      const resp = err.response?.data;
      if (resp && resp.detail) {
        if (Array.isArray(resp.detail)) {
          const msgs = resp.detail.map((d) => {
            const loc = Array.isArray(d.loc) ? d.loc.join('.') : d.loc;
            return `${loc}: ${d.msg}`;
          });
          setError(msgs.join('\n'));
        } else if (typeof resp.detail === 'string') {
          setError(resp.detail);
        } else {
          setError(JSON.stringify(resp.detail));
        }
      } else {
        setError(err.message || 'Failed to update workout');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading fullScreen message="Loading workout..." />;
  if (!workout) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-semibold text-white mb-2">Workout Not Found</h2>
        <p className="text-gray-400 mb-6">{error || 'No workout found'}</p>
        <Button variant="primary" onClick={() => navigate('/workouts')}>Back</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-white mb-4">Edit Workout</h1>
        {error && <div className="mb-4 text-red-400">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Name *</label>
            <input value={workout.name || ''} onChange={handleChange('name')}
              className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white" />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Description</label>
            <textarea value={workout.description || ''} onChange={handleChange('description')}
              className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white" rows={3} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Duration (min)</label>
              <input type="number" value={workout.duration ?? ''} onChange={handleChange('duration')}
                className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Calories</label>
              <input type="number" value={workout.calories ?? ''} onChange={handleChange('calories')}
                className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Notes</label>
            <textarea value={workout.notes || ''} onChange={handleChange('notes')}
              className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white" rows={2} />
          </div>

          <div className="flex space-x-2">
            <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            <Button type="button" variant="secondary" onClick={() => navigate(`/workouts/${id}`)}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutEdit;
