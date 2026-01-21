/**
 * Trainer form component for creating and editing trainers.
 */
import { useState, useEffect } from 'react';
import Input from './Input';
import Button from './Button';

const TrainerForm = ({ trainer = null, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialization: '',
    experience_years: '',
    certifications: '',
    bio: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (trainer) {
      setFormData({
        name: trainer.user_name || trainer.name || '',
        email: trainer.user_email || '',
        password: '',
        phone: trainer.phone || '',
        specialization: trainer.specialization || '',
        experience_years: trainer.experience_years || '',
        certifications: trainer.certifications || '',
        bio: trainer.bio || '',
      });
    }
  }, [trainer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!trainer && !formData.email.trim()) newErrors.email = 'Email is required';
    if (!trainer && !formData.password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData = {
      name: formData.name.trim(),
      email: formData.email.trim() || undefined,
      password: formData.password || undefined,
      phone: formData.phone || undefined,
      specialization: formData.specialization || undefined,
      experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined,
      certifications: formData.certifications || undefined,
      bio: formData.bio || undefined,
    };

    console.log('TrainerForm: submit', submitData);
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Jane Doe"
          error={errors.name}
          required
          disabled={loading}
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="trainer@example.com"
          error={errors.email}
          required={!trainer}
          disabled={loading || !!trainer}
        />

        {!trainer && (
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Leave blank to auto-generate"
            disabled={loading}
          />
        )}

        <Input
          label="Phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1234567890"
          disabled={loading}
        />

        <Input
          label="Specialization"
          type="text"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          placeholder="e.g. Strength, Cardio, Yoga"
          disabled={loading}
        />

        <Input
          label="Experience (years)"
          type="number"
          name="experience_years"
          value={formData.experience_years}
          onChange={handleChange}
          placeholder="3"
          disabled={loading}
        />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Certifications</label>
          <textarea
            name="certifications"
            value={formData.certifications}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="List certifications, separated by commas"
            rows={3}
          />
        </div>

        <div className="md:col-span-2">
          <Input
            label="Short Bio"
            type="text"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="A short bio for the trainer"
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="submit" variant="primary" size="md" loading={loading} disabled={loading}>
          {trainer ? 'Update Trainer' : 'Create Trainer'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" size="md" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default TrainerForm;
