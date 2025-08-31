import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import { useCMS } from '../hooks/useCMS'; // Fixed import path

const Contact: React.FC = () => {
  const { getContent, getSetting, loading, error } = useCMS();

  // Show loading state while CMS data is being fetched
  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading contact information...</p>
        </div>
      </div>
    );
  }

  // Show error state if Supabase connection fails
  if (error) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 mb-4">
            <Mail className="h-12 w-12 mx-auto mb-2" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Configuration Required</h2>
          <p className="text-slate-600 mb-4 whitespace-pre-line">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-8">
              {getContent('contact', 'hero_title', 'Let\'s Start a Conversation')}
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto">
              {getContent('contact', 'hero_subtitle', 'Ready to transform your business? We\'re here to help you navigate the complexities of brand development, AI implementation, and business funding.')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Contact Information */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-slate-800 mb-8">Get in Touch</h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Email Us</h3>
                    {/* Display primary email */}
                    {getSetting('company_email') && (
                      <p className="text-slate-600">
                        <a href={`mailto:${getSetting('company_email')}`} className="hover:text-blue-600">
                          {getSetting('company_email')}
                        </a>
                      </p>
                    )}
                    {/* Display secondary email if it exists */}
                    {getSetting('contact_email_secondary') && (
                      <p className="text-slate-600">
                        <a href={`mailto:${getSetting('contact_email_secondary')}`} className="hover:text-blue-600">
                          {getSetting('contact_email_secondary')}
                        </a>
                      </p>
                    )}
                    {/* Fallback if no emails are set */}
                    {!getSetting('company_email') && !getSetting('contact_email_secondary') && (
                      <p className="text-slate-500 italic">Email not configured in CMS</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Call Us</h3>
                    {getSetting('company_phone') && (
                      <p className="text-slate-600">
                        Main: <a href={`tel:${getSetting('company_phone')}`} className="hover:text-blue-600">
                          {getSetting('company_phone')}
                        </a>
                      </p>
                    )}
                    {getSetting('company_phone_direct') && (
                      <p className="text-slate-600">
                        Direct: <a href={`tel:${getSetting('company_phone_direct')}`} className="hover:text-blue-600">
                          {getSetting('company_phone_direct')}
                        </a>
                      </p>
                    )}
                    {!getSetting('company_phone') && !getSetting('company_phone_direct') && (
                      <p className="text-slate-500 italic">Phone numbers not configured in CMS</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Mail</h3>
                    {getSetting('company_address') ? (
                      <p className="text-slate-600 whitespace-pre-line">{getSetting('company_address')}</p>
                    ) : (
                      <p className="text-slate-500 italic">Address not configured in CMS</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Business Hours</h3>
                    {getSetting('business_hours') ? (
                      <p className="text-slate-600 whitespace-pre-line">{getSetting('business_hours')}</p>
                    ) : (
                      <p className="text-slate-500 italic">Business hours not configured in CMS</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="mt-12 bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Response Time</h3>
                <p className="text-blue-700">
                  {getSetting('response_time', 'We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.')}
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <ContactForm 
                className="shadow-xl"
                title={getContent('contact', 'form_title', 'Send us a Message')}
                subtitle={getContent('contact', 'form_subtitle', 'Fill out the form below and we\'ll get back to you as soon as possible.')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">Service Areas</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              While we're based in New York, we work with clients nationwide and internationally 
              across all our service verticals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 text-center shadow-lg">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Brand & Marketing</h3>
              <p className="text-slate-600">
                Serving clients globally with remote collaboration and strategic brand development.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-lg">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">AI Technology</h3>
              <p className="text-slate-600">
                Providing AI solutions and automation services to businesses worldwide.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-lg">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Business Funding</h3>
              <p className="text-slate-600">
                Comprehensive business funding solutions for companies across all industries nationwide.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact