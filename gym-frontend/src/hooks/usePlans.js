import { useState, useEffect, useCallback } from 'react';
import { getPlans, createPlan as apiCreatePlan, updatePlan as apiUpdatePlan, deletePlan as apiDeletePlan } from '../api/plans';

export default function usePlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPlans();
      setPlans(data || []);
    } catch (err) {
      console.error('Failed to fetch plans', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPlan = async (payload) => {
    const res = await apiCreatePlan(payload);
    setPlans((p) => [...p, res]);
    return res;
  };

  const updatePlan = async (id, payload) => {
    const res = await apiUpdatePlan(id, payload);
    setPlans((p) => p.map((pl) => (pl.id === id ? res : pl)));
    return res;
  };

  const deletePlan = async (id) => {
    const res = await apiDeletePlan(id);
    setPlans((p) => p.filter((pl) => pl.id !== id));
    return res;
  };

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return {
    plans,
    loading,
    error,
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
  };
}
