import React from 'react';
import { Link } from 'react-router-dom';
import { Palette, Target, Megaphone, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import ContactForm from '../components/ContactForm';

const BrandMarketing: React.FC = () => {
  return (
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-pink-900 to-purple-800 text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Palette className="h-10 w-10 text-white" aria-hidden="true" focusable="false" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-8">
              Brand Awareness & Marketing
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-12 max-w-4xl mx-auto">
              Build a powerful brand identity that resonates with your audience and drives business growth 
              through strategic marketing initiatives.
            </p>
            <Link
              to="/contact"
              className="bg-white text-purple-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-50 transition-all duration-200 inline-flex items-center group"
            >
              Start Your Brand Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" focusable="false" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">Our Brand & Marketing Services</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From brand strategy to execution, we create cohesive marketing solutions that 
              elevate your business and connect with your target audience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Brand Strategy</h3>
              <p className="text-slate-600">Develop comprehensive brand positioning and messaging frameworks.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Palette className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Visual Identity</h3>
              <p className="text-slate-600">Create memorable logos and visual systems that represent your brand.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Megaphone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Marketing Campaigns</h3>
              <p className="text-slate-600">Design and execute multi-channel marketing campaigns that drive results.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Growth Analytics</h3>
              <p className="text-slate-600">Track performance and optimize campaigns for maximum ROI.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Services */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-800 mb-8">Complete Brand Development</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Logo & Visual Identity Design</h3>
                    <p className="text-slate-600">
                      Create distinctive logos and comprehensive visual identity systems that reflect your brand values 
                      and resonate with your target audience.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Brand Guidelines & Standards</h3>
                    <p className="text-slate-600">
                      Develop comprehensive brand guidelines to ensure consistent application across all 
                      marketing materials and touchpoints.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Marketing Collateral Design</h3>
                    <p className="text-slate-600">
                      Design professional marketing materials including brochures, business cards, presentations, 
                      and digital assets that reinforce your brand identity.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Digital Marketing Strategy</h3>
                    <p className="text-slate-600">
                      Develop data-driven digital marketing strategies that leverage social media, content marketing, 
                      SEO, and paid advertising to reach your ideal customers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:pl-12">
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
                alt="Brand development process"
                className="rounded-2xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">Our Brand Development Process</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We follow a proven methodology to ensure your brand resonates with your audience 
              and drives business success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Discovery</h3>
              <p className="text-slate-600">
                Understanding your business, audience, and competitive landscape to inform our strategy.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Strategy</h3>
              <p className="text-slate-600">
                Developing brand positioning, messaging, and visual direction based on research insights.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Design</h3>
              <p className="text-slate-600">
                Creating visual identity, marketing materials, and brand assets that bring the strategy to life.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Launch</h3>
              <p className="text-slate-600">
                Implementing the brand across all touchpoints and launching marketing campaigns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm 
            title="Ready to Transform Your Brand?"
            subtitle="Let's create a brand identity that sets you apart from the competition."
          />
        </div>
      </section>
  );
};

export default BrandMarketing;