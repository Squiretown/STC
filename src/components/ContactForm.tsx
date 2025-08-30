// src/components/ContactForm.tsx
import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase'; // removed `type Lead` to avoid type mismatch during rollout

interface ContactFormProps {
  className?: string;
  title?: string;
  subtitle?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  className = '',
  title = 'Ready to Get Started?',
  subtitle = "Let's discuss how we can help transform your business."
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',          // NEW
    company: '',
    service: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFormSubmission();
  };

  const handleFormSubmission = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // lightweight phone clean-up; store raw if not provided
      const phoneClean = formData.phone.trim() || null;

      // Build payload (no type coupling while we roll out the new column)
      const leadData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: phoneClean,                          // NEW
        company: formData.company.trim() || null,
        service: formData.service || null,
        message: formData.message.trim()
      };

      // Insert lead into Supabase — NO .select() (avoids SELECT RLS requirement)
      const { error: supabaseError } = await supabase
        .from('leads')
        .insert([leadData])
        .select('id'); // Only select id to minimize return data

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        throw new Error(supabaseError.message || 'Failed to submit your message. Please try again.');
      }

      // Reset form and show success message
      setFormData({
        name: '',
        email: '',
        phone: '',            // NEW
        company: '',
        service: '',
        message: ''
      });

      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-xl p-8 text-center ${className}`}>
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-800 mb-2">Thank You!</h3>
        <p className="text-green-700">
          Your message has been received successfully. We&apos;ll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg p-8 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">{title}</h2>
        <p className="text-xl text-slate-600">{subtitle}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="John Smith"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="john@company.com"
            />
          </div>
        </div>

        {/* NEW: Phone field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
            Phone
           </label>
          <input
           type="tel"
           id="phone"
           name="phone"
           inputMode="tel"
           pattern="[0-9()+.\\s-]{7,20}"
           title="Phone number, 7–20 chars; digits, spaces, +, -, . allowed"
           value={formData.phone}
           onChange={handleChange}
           className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
           placeholder="+1 631 555 1234"
          />
          {/* If you later standardize to E.164 (+15551234567), we can tighten this. */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Your Company"
            />
          </div>

          <div>
            <label htmlFor="service" className="block text-sm font-medium text-slate-700 mb-2">
              Service Interest
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select a service</option>
              <option value="brand-marketing">Brand Awareness & Marketing</option>
              <option value="ai-technology">AI Technology Stack Building</option>
              <option value="business-funding">Business Funding</option>
              <option value="title-services">Real Estate Title Services</option>
              <option value="multiple">Multiple Services</option>
              <option value="consultation">General Consultation</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Tell us about your project and how we can help..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 group"
        >
          <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
          {!isSubmitting && (
            <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
