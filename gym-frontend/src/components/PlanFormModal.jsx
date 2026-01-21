import React, { useState, useEffect } from 'react';

const PlanFormModal = ({ open, onClose, onSubmit, initialData = {}, loading }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    duration_days: 30,
    price: 0,
    discount: 0,
    is_active: true,
    image_url: '',
    featuresText: '',
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        duration_days: initialData.duration_days || 30,
        price: initialData.price ?? initialData.final_price ?? 0,
        discount: initialData.discount ?? 0,
        is_active: initialData.is_active ?? true,
        image_url: initialData.image_url || '',
        featuresText: (initialData.features || []).join(', '),
      });
    } else {
      setForm((f) => ({ ...f, name: '', description: '' }));
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((s) => ({ ...s, [k]: val }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      duration_days: Number(form.duration_days),
      price: Number(form.price),
      discount: Number(form.discount),
      is_active: !!form.is_active,
      image_url: form.image_url || undefined,
      features: form.featuresText ? form.featuresText.split(',').map((s) => s.trim()) : [],
    };

    await onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <form onSubmit={submit} className="relative z-10 w-full max-w-2xl bg-gray-900 rounded-lg p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">{initialData.id ? 'Edit Plan' : 'Add Plan'}</h3>
          <button type="button" onClick={onClose} className="text-gray-400">✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-300">Name</label>
            <input value={form.name} onChange={handleChange('name')} className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded text-white" />
          </div>
          <div>
            <label className="text-sm text-gray-300">Duration (days)</label>
            <input type="number" value={form.duration_days} onChange={handleChange('duration_days')} className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded text-white" />
          </div>
          <div>
            <label className="text-sm text-gray-300">Price</label>
            <input type="number" value={form.price} onChange={handleChange('price')} className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded text-white" />
          </div>
          <div>
            <label className="text-sm text-gray-300">Discount (%)</label>
            <input type="number" value={form.discount} onChange={handleChange('discount')} className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded text-white" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-300">Description</label>
            <textarea value={form.description} onChange={handleChange('description')} rows={3} className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded text-white" />
          </div>

          {/* <div>
            <label className="text-sm text-gray-300">Image URL</label>
            <input value={form.image_url} onChange={handleChange('image_url')} className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded text-white" />
          </div>
          <div>
            <label className="text-sm text-gray-300">Features (comma separated)</label>
            <input value={form.featuresText} onChange={handleChange('featuresText')} className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded text-white" />
          </div> */}

          <div className="flex items-center space-x-2">
            <input id="is_active" type="checkbox" checked={form.is_active} onChange={handleChange('is_active')} />
            <label htmlFor="is_active" className="text-sm text-gray-300">Active</label>
          </div>
        </div>

        <div className="mt-5 flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-700 text-white rounded">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded">{loading ? '...' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
};

export default PlanFormModal;
