/**
 * Workouts list page showing all user workouts.
 * Supports creating, editing, and deleting workouts with card-based UI.
 */
import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { getWorkouts, deleteWorkout, createWorkout } from '../api/workouts';
import Loading from '../components/Loading';
import Button from '../components/forms/Button';
import { formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const showCreateForm = searchParams.get('action') === 'create';

  const navigate = useNavigate();

  // get auth state
  const { loading: authLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    // Wait for auth initialization; only fetch when user is authenticated
    if (!authLoading && isAuthenticated()) {
      fetchWorkouts();
    } else if (!authLoading && !isAuthenticated()) {
      // No authenticated user — stop loading and show empty state
      setLoading(false);
    }
  }, [authLoading]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const data = await getWorkouts();
      setWorkouts(data || []);
    } catch (error) {
      setError('Failed to load workouts. Please try again.');
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  /* CreateWorkoutForm component (inline) */
  const CreateWorkoutForm = ({ onCancel, onCreated }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [calories, setCalories] = useState('');
    const [notes, setNotes] = useState('');
    const [creating, setCreating] = useState(false);
    const [formError, setFormError] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormError('');
      if (!name.trim()) {
        setFormError('Name is required');
        return;
      }

      const payload = {
        name: name.trim(),
        description: description || undefined,
        duration: duration ? Number(duration) : undefined,
        calories: calories ? Number(calories) : undefined,
        notes: notes || undefined,
      };

      try {
        setCreating(true);
        const created = await createWorkout(payload);
        if (onCreated) onCreated(created);
      } catch (err) {
        console.error('Create workout error:', err);
        const resp = err.response?.data;
        if (resp && resp.detail) {
          // FastAPI validation errors are an array of { loc, msg, type }
          if (Array.isArray(resp.detail)) {
            const msgs = resp.detail.map((d) => {
              const loc = Array.isArray(d.loc) ? d.loc.join('.') : d.loc;
              return `${loc}: ${d.msg}`;
            });
            setFormError(msgs.join(' \n'));
          } else if (typeof resp.detail === 'string') {
            setFormError(resp.detail);
          } else {
            setFormError(JSON.stringify(resp.detail));
          }
        } else {
          setFormError(err.message || 'Failed to create workout');
        }
      } finally {
        setCreating(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {formError && <div className="text-sm text-red-400">{formError}</div>}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
            placeholder="e.g., Upper Body Strength"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
            rows={3}
            placeholder="Optional description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Duration (min)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Calories</label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
              min={0}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
            rows={2}
            placeholder="Optional notes"
          />
        </div>

        <div className="flex space-x-2">
          <Button variant="primary" size="md" type="submit" disabled={creating}>
            {creating ? 'Creating...' : 'Create'}
          </Button>
          <Button variant="secondary" size="md" type="button" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) {
      return;
    }

    try {
      setDeleting(id);
      await deleteWorkout(id);
      setWorkouts(workouts.filter((w) => w.id !== id));
    } catch (error) {
      setError('Failed to delete workout. Please try again.');
      console.error('Error deleting workout:', error);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading workouts..." />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Workouts</h1>
            <p className="text-gray-400">
              Manage your workout routines and track your progress
            </p>
          </div>
          <Link to="/workouts?action=create">
            <Button variant="primary" size="md">
              + New Workout
            </Button>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              Create New Workout
            </h2>
            <p className="text-gray-400 mb-4">
              Fill the form below to create a new workout.
            </p>

            <CreateWorkoutForm
              onCancel={() => navigate('/workouts')}
              onCreated={(newWorkout) => {
                // Prepend created workout and navigate back to list
                setWorkouts((prev) => [newWorkout, ...(prev || [])]);
                navigate('/workouts');
              }}
            />
          </div>
        )}

        {/* Workouts Grid */}
        {workouts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-primary-500 transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {workout.name || `Workout #${workout.id}`}
                    </h3>
                    {workout.description && (
                      <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                        {workout.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {workout.date && (
                    <div className="flex items-center text-sm text-gray-400">
                      <span className="mr-2">📅</span>
                      {formatDate(workout.date)}
                    </div>
                  )}
                  {workout.duration && (
                    <div className="flex items-center text-sm text-gray-400">
                      <span className="mr-2">⏱️</span>
                      {workout.duration} minutes
                    </div>
                  )}
                  {workout.calories && (
                    <div className="flex items-center text-sm text-gray-400">
                      <span className="mr-2">🔥</span>
                      {workout.calories} calories
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 mt-4">
                  <Link
                    to={`/workouts/${workout.id}`}
                    className="flex-1 text-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(workout.id)}
                    disabled={deleting === workout.id}
                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deleting === workout.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
            <div className="text-6xl mb-4">🏋️</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No workouts yet
            </h3>
            <p className="text-gray-400 mb-6">
              Create your first workout to start tracking your fitness journey!
            </p>
            <Link to="/workouts?action=create">
              <Button variant="primary" size="lg">
                Create Your First Workout
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workouts;

