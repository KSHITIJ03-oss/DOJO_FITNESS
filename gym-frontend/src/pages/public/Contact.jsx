/**
 * Contact page - Gym contact information and contact form.
 */
import { useState } from 'react';
import { submitContactRequest } from '../../api/leads';
import SectionWrapper from '../../components/public/SectionWrapper';
import InputField from '../../components/public/InputField';
import CTAButton from '../../components/public/CTAButton';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', mobile: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Phone number is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
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
      await submitContactRequest(formData);
      setSuccess(true);
      setFormData({ name: '', mobile: '', email: '', message: '' });
    } catch (error) {
      setErrors({ submit: error.response?.data?.detail || 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920')] bg-cover bg-center opacity-20"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            GET IN <span className="text-primary-400">TOUCH</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">Have questions? We're here to help.</p>
        </div>
      </section>

      <SectionWrapper bgColor="dark" padding="py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Contact Information</h2>
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="text-primary-400 text-2xl mr-4">📍</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Address</h3>
                  <p className="text-gray-400">123 Fitness Street<br />City, State 12345<br />United States</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-primary-400 text-2xl mr-4">📞</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Phone</h3>
                  <p className="text-gray-400">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-primary-400 text-2xl mr-4">✉️</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Email</h3>
                  <p className="text-gray-400">info@dojofitness.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-primary-400 text-2xl mr-4">🕒</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Hours</h3>
                  <p className="text-gray-400">Mon-Fri: 5:00 AM - 11:00 PM<br />Sat-Sun: 6:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg h-64 border border-gray-700 flex items-center justify-center">
              <p className="text-gray-500">Map Placeholder</p>
            </div>
          </div>

          <div>
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-400 mb-6">We'll get back to you as soon as possible.</p>
                  <CTAButton onClick={() => setSuccess(false)} variant="primary" size="md">Send Another Message</CTAButton>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
                  {errors.submit && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                      <p className="text-red-400 text-sm">{errors.submit}</p>
                    </div>
                  )}
                  <InputField label="Full Name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" error={errors.name} required disabled={loading} />
                  <InputField label="Phone Number" type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="+1 (555) 123-4567" error={errors.mobile} required disabled={loading} />
                  <InputField label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" error={errors.email} disabled={loading} />
                  <InputField label="Message" type="textarea" name="message" value={formData.message} onChange={handleChange} placeholder="How can we help you?" error={errors.message} required disabled={loading} rows={5} />
                  <CTAButton type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Message'}
                  </CTAButton>
                </form>
              )}
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default Contact;

