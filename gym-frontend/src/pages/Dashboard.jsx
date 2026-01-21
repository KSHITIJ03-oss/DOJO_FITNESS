/**
 * Dashboard page showing user overview, statistics, and activity charts.
 * Displays workout stats, progress visualization, and quick navigation.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getWorkouts } from '../api/workouts';
import StatCard from '../components/StatCard';
import Loading from '../components/Loading';
// Icon components (simple SVG icons)
const ChartBarIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const FireIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const TrophyIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    activePlans: 0,
    caloriesBurned: 0,
    sessionsThisWeek: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWorkouts();
        setWorkouts(data || []);

        // Calculate stats from workouts
        // Note: These are placeholder calculations since workout structure is unknown
        setStats({
          totalWorkouts: data?.length || 0,
          activePlans: data?.filter((w) => w.status === 'active').length || 0,
          caloriesBurned: data?.reduce((sum, w) => sum + (w.calories || 0), 0) || 0,
          sessionsThisWeek: data?.filter((w) => {
            const workoutDate = new Date(w.date || w.created_at);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return workoutDate >= weekAgo;
          }).length || 0,
        });
      } catch (error) {
        console.error('Failed to fetch workouts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate weekly activity data (placeholder)
  const weeklyActivity = [
    { day: 'Mon', workouts: 2, calories: 450 },
    { day: 'Tue', workouts: 1, calories: 320 },
    { day: 'Wed', workouts: 3, calories: 680 },
    { day: 'Thu', workouts: 2, calories: 520 },
    { day: 'Fri', workouts: 1, calories: 380 },
    { day: 'Sat', workouts: 2, calories: 490 },
    { day: 'Sun', workouts: 0, calories: 0 },
  ];

  if (loading) {
    return <Loading fullScreen message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name || 'Athlete'}! 💪
          </h1>
          <p className="text-gray-400">
            Here's your fitness overview for today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Workouts"
            value={stats.totalWorkouts}
            icon={ChartBarIcon}
            subtitle="All time"
          />
          <StatCard
            title="Active Plans"
            value={stats.activePlans}
            icon={CalendarIcon}
            subtitle="Currently active"
          />
          <StatCard
            title="Calories Burned"
            value={stats.caloriesBurned.toLocaleString()}
            icon={FireIcon}
            subtitle="Total calories"
          />
          <StatCard
            title="This Week"
            value={stats.sessionsThisWeek}
            icon={TrophyIcon}
            subtitle="Workout sessions"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Activity Chart */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              Weekly Activity
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="workouts"
                  stroke="#0EA5E9"
                  strokeWidth={2}
                  name="Workouts"
                />
                <Line
                  type="monotone"
                  dataKey="calories"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  name="Calories"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Workout Distribution */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              Workout Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="workouts" fill="#0EA5E9" name="Workouts" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/workouts"
              className="p-4 bg-primary-600/10 hover:bg-primary-600/20 border border-primary-500/50 rounded-lg transition-all duration-200 text-center"
            >
              <div className="text-primary-400 text-2xl mb-2">🏋️</div>
              <div className="text-white font-medium">View Workouts</div>
            </Link>
            <Link
              to="/workouts?action=create"
              className="p-4 bg-green-600/10 hover:bg-green-600/20 border border-green-500/50 rounded-lg transition-all duration-200 text-center"
            >
              <div className="text-green-400 text-2xl mb-2">➕</div>
              <div className="text-white font-medium">New Workout</div>
            </Link>
            {/* Exercises feature removed */}
            <Link
              to="/profile"
              className="p-4 bg-yellow-600/10 hover:bg-yellow-600/20 border border-yellow-500/50 rounded-lg transition-all duration-200 text-center"
            >
              <div className="text-yellow-400 text-2xl mb-2">👤</div>
              <div className="text-white font-medium">My Profile</div>
            </Link>
          </div>
        </div>

        {/* Recent Workouts */}
        {workouts.length > 0 && (
          <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Recent Workouts
              </h2>
              <Link
                to="/workouts"
                className="text-primary-400 hover:text-primary-300 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {workouts.slice(0, 5).map((workout) => (
                <div
                  key={workout.id}
                  className="p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-medium">
                        {workout.name || `Workout #${workout.id}`}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {workout.date
                          ? new Date(workout.date).toLocaleDateString()
                          : 'No date'}
                      </p>
                    </div>
                    <Link
                      to={`/workouts/${workout.id}`}
                      className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {workouts.length === 0 && (
          <div className="mt-8 bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
            <div className="text-6xl mb-4">🏋️</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No workouts yet
            </h3>
            <p className="text-gray-400 mb-6">
              Start your fitness journey by creating your first workout!
            </p>
            <Link
              to="/workouts?action=create"
              className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
            >
              Create Workout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

