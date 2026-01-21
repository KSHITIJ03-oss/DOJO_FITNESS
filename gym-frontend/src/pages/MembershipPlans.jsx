/**
 * MembershipPlans page
 *
 * Backend API endpoints used (from app/api/membership_plans.py):
 * POST   /plans/         (admin) -> create_plan
 * GET    /plans/                 -> get_plans
 * GET    /plans/{id}             -> get_plan
 * PUT    /plans/{id}     (admin) -> update_plan
 * DELETE /plans/{id}     (admin) -> delete_plan
 */

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import usePlans from '../hooks/usePlans';
import PlanCard from '../components/PlanCard';
import PlanFormModal from '../components/PlanFormModal';
import Loading from '../components/Loading';
import Button from '../components/forms/Button';

const MembershipPlans = () => {
  const { user } = useAuth();
  const role = user?.role || (user?.role === undefined && JSON.parse(localStorage.getItem('user') || '{}')?.role) || 'member';

  const { plans, loading, error, createPlan, updatePlan, deletePlan } = usePlans();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (plan) => {
    setEditing(plan);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this plan?')) return;
    try {
      setActionLoading(true);
      await deletePlan(id);
      setMessage('Plan deleted');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setErrMsg('Failed to delete plan');
      setTimeout(() => setErrMsg(''), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (payload) => {
    try {
      setActionLoading(true);
      if (editing && editing.id) {
        await updatePlan(editing.id, payload);
        setMessage('Plan updated');
      } else {
        await createPlan(payload);
        setMessage('Plan created');
      }
      setModalOpen(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setErrMsg(err.response?.data?.detail || 'Failed to save plan');
      setTimeout(() => setErrMsg(''), 4000);
    } finally {
      setActionLoading(false);
    }
  };

  const activePlans = (plans || []).filter((p) => p.is_active !== false);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Membership Plans</h1>
            <p className="text-gray-400">Browse available membership packages</p>
          </div>

          {role === 'admin' && (
            // <button onClick={handleAdd} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded">
            // </button>
            <Button onClick={handleAdd} variant='primary' size='md'>
              + Add Plan
            </Button>
          )}
        </div>

        {message && <div className="mb-4 p-3 bg-green-600/10 border border-green-600/30 rounded text-green-300">{message}</div>}
        {errMsg && <div className="mb-4 p-3 bg-red-600/10 border border-red-600/30 rounded text-red-300">{errMsg}</div>}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map((i) => (
              <div key={i} className="h-56 bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : activePlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onEdit={handleEdit} onDelete={handleDelete} role={role} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-xl font-semibold text-white mb-2">No plans available</h3>
            <p className="text-gray-400 mb-6">There are no membership plans at the moment.</p>
            {role === 'admin' && (
              <button onClick={handleAdd} className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg">Add Plan</button>
            )}
          </div>
        )}

        <PlanFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          initialData={editing || {}}
          loading={actionLoading}
        />
      </div>
    </div>
  );
};

export default MembershipPlans;
