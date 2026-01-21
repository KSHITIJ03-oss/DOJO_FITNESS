/**
 * Try Us page - Free trial booking form.
 * Public page - no authentication required.
 */
import { useState } from 'react';
import { submitTrialRequest } from '../../api/leads';
import SectionWrapper from '../../components/public/SectionWrapper';
import InputField from '../../components/public/InputField';
import CTAButton from '../../components/public/CTAButton';

const TryUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    preferred_time_slot: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Phone number is required';
    else if (formData.mobile.length < 8) newErrors.mobile = 'Please enter a valid phone number';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    if (!validate()) return;

    try {
      setLoading(true);
      const result = await submitTrialRequest(formData);
      console.log('Form submitted successfully:', result);
      setSuccess(true);
      setFormData({ name: '', mobile: '', email: '', preferred_time_slot: '', message: '' });
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to submit request. Please try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920')] bg-cover bg-center opacity-20"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            TRY US <span className="text-primary-400">FREE</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience DOJO Fitness with a complimentary trial. No commitment. Just results.
          </p>
        </div>
      </section>

      <SectionWrapper bgColor="dark" padding="py-20">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900 rounded-2xl p-8 md:p-12 border border-gray-800 shadow-2xl">
            {success ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Request Submitted!</h2>
                <p className="text-gray-400 mb-8">
                  Thank you! We'll contact you shortly to schedule your free trial.
                </p>
                <CTAButton onClick={() => setSuccess(false)} variant="primary" size="md">
                  Submit Another Request
                </CTAButton>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold text-white mb-8">Book Your Free Trial</h2>

                {errors.submit && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                    <p className="text-red-400 text-sm">{errors.submit}</p>
                  </div>
                )}

                <InputField label="Full Name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" error={errors.name} required disabled={loading} />
                <InputField label="Phone Number" type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="+1 (555) 123-4567" error={errors.mobile} required disabled={loading} />
                <InputField label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" error={errors.email} disabled={loading} />

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Preferred Time Slot</label>
                  <select name="preferred_time_slot" value={formData.preferred_time_slot} onChange={handleChange} disabled={loading} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50">
                    <option value="">Select a time</option>
                    <option value="Morning (6 AM - 10 AM)">Morning (6 AM - 10 AM)</option>
                    <option value="Afternoon (10 AM - 2 PM)">Afternoon (10 AM - 2 PM)</option>
                    <option value="Evening (2 PM - 6 PM)">Evening (2 PM - 6 PM)</option>
                    <option value="Night (6 PM - 10 PM)">Night (6 PM - 10 PM)</option>
                  </select>
                </div>

                <InputField label="Message (Optional)" type="textarea" name="message" value={formData.message} onChange={handleChange} placeholder="Tell us about your fitness goals..." disabled={loading} rows={4} />

                <CTAButton type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
                  {loading ? 'Submitting...' : 'Book Free Trial'}
                </CTAButton>
              </form>
            )}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default TryUs;

