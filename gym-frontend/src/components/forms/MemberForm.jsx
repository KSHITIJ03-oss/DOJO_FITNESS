/**
 * Member form component for creating and editing members.
 * Reusable form that can be used in both create and edit modes.
 */
import { useState, useEffect } from 'react';
import Input from './Input';
import Button from './Button';

const MemberForm = ({ member = null, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: '',
    address: '',
    membership_type: '',
    membership_start: '',
    membership_end: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        phone: member.phone || '',
        age: member.age || '',
        gender: member.gender || '',
        address: member.address || '',
        membership_type: member.membership_type || '',
        membership_start: member.membership_start || '',
        membership_end: member.membership_end || '',
      });
    }
  }, [member]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    // Prepare data for API
    const submitData = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      age: formData.age ? parseInt(formData.age) : null,
      gender: formData.gender || null,
      address: formData.address || null,
      membership_type: formData.membership_type || null,
      membership_start: formData.membership_start || null,
      membership_end: formData.membership_end || null,
    };

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
          placeholder="John Doe"
          error={errors.name}
          required
          disabled={loading}
        />

        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1234567890"
          error={errors.phone}
          required
          disabled={loading}
        />

        <Input
          label="Age"
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="25"
          disabled={loading}
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <Input
            label="Address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main St, City, State"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Membership Type
          </label>
          <select
            name="membership_type"
            value={formData.membership_type}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          > 
            <option value="">Select Membership</option>
            <option value="Monthly">Monthly</option>
            <option value="Annual">Annual</option>            
            <option value="Dojo Membership">Dojo Membership</option>
            {/* <option value="Premium">Premium</option>
            <option value="VIP">VIP</option> */}
          </select>
        </div>

        <Input
          label="Membership Start Date"
          type="date"
          name="membership_start"
          value={formData.membership_start}
          onChange={handleChange}
          disabled={loading}
        />

        <Input
          label="Membership End Date"
          type="date"
          name="membership_end"
          value={formData.membership_end}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          disabled={loading}
        >
          {member ? 'Update Member' : 'Create Member'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default MemberForm;


