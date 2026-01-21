/**
 * Workout detail page showing full workout information.
 * Displays exercises, sets, reps, weights, and allows editing/deleting.
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getWorkoutById, deleteWorkout } from '../api/workouts';
import Loading from '../components/Loading';
import Button from '../components/forms/Button';
import { formatDate, formatDateTime } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const { loading: authLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated()) {
      fetchWorkout();
    } else if (!authLoading && !isAuthenticated()) {
      setLoading(false);
      setError('Not authenticated');
    }
  }, [id, authLoading]);

  const fetchWorkout = async () => {
    try {
      setLoading(true);
      const data = await getWorkoutById(id);
      if (!data) {
        setError('Workout not found');
      } else {
        setWorkout(data);
      }
    } catch (error) {
      setError('Failed to load workout. Please try again.');
      console.error('Error fetching workout:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this workout? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      await deleteWorkout(id);
      navigate('/workouts');
    } catch (error) {
      setError('Failed to delete workout. Please try again.');
      console.error('Error deleting workout:', error);
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading workout..." />;
  }

  if (error && !workout) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-semibold text-white mb-2">Workout Not Found</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link to="/workouts">
            <Button variant="primary">Back to Workouts</Button>
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
          to="/workouts"
          className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <span className="mr-2">←</span>
          Back to Workouts
        </Link>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Workout Header */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {workout?.name || `Workout #${workout?.id}`}
              </h1>
              {workout?.description && (
                <p className="text-gray-400">{workout.description}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/workouts/${id}/edit`)}
              >
                Edit
              </Button>
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

          {/* Workout Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700">
            {workout?.date && (
              <div>
                <p className="text-sm text-gray-400 mb-1">Date</p>
                <p className="text-white font-medium">{formatDate(workout.date)}</p>
              </div>
            )}
            {workout?.duration && (
              <div>
                <p className="text-sm text-gray-400 mb-1">Duration</p>
                <p className="text-white font-medium">{workout.duration} min</p>
              </div>
            )}
            {workout?.calories && (
              <div>
                <p className="text-sm text-gray-400 mb-1">Calories</p>
                <p className="text-white font-medium">{workout.calories} kcal</p>
              </div>
            )}
            {workout?.created_at && (
              <div>
                <p className="text-sm text-gray-400 mb-1">Created</p>
                <p className="text-white font-medium text-sm">
                  {formatDateTime(workout.created_at)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Exercises removed from UI */}

        {/* Notes Section */}
        {workout?.notes && (
          <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-2">Notes</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{workout.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutDetail;

