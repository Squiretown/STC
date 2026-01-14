import React from 'react';
import { Link } from 'react-router-dom';
import { Building, DollarSign, TrendingUp, Shield, CheckCircle, ArrowRight, Handshake, Calculator } from 'lucide-react';
import ContactForm from '../components/ContactForm';

const BusinessFunding: React.FC = () => {
  return (
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-900 via-emerald-900 to-green-800 text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Building className="h-10 w-10 text-white" aria-hidden="true" focusable="false" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-8">
              Business Funding & Capital Solutions
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-12 max-w-4xl mx-auto">
              Secure the capital you need to grow your business through our comprehensive funding 
              solutions and strategic financial advisory services.
            </p>
            <Link
              to="/contact"
              className="bg-white text-green-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-50 transition-all duration-200 inline-flex items-center group"
            >
              Secure Your Funding
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" focusable="false" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">Business Funding Services</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From startup capital to growth funding, we provide comprehensive solutions 
              for all your business financing needs across industries and growth stages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Business Loans</h3>
              <p className="text-slate-600">Secure optimal loan terms for your business expansion and operational needs.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Calculator className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Financial Planning</h3>
              <p className="text-slate-600">Comprehensive financial modeling and capital structure optimization.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Handshake className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Investor Relations</h3>
              <p className="text-slate-600">Connect with investors and secure equity funding for growth initiatives.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Risk Assessment</h3>
              <p className="text-slate-600">Comprehensive risk analysis and funding strategy optimization.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Services */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-800 mb-8">Expert Financial Advisory</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Business Loan Structuring</h3>
                    <p className="text-slate-600">
                      Design optimal loan structures that maximize capital access while minimizing cost, 
                      tailored to your specific business model and growth strategy.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Lender & Investor Networks</h3>
                    <p className="text-slate-600">
                      Leverage our extensive network of lenders, investors, and financial institutions to secure 
                      competitive rates and terms for your business funding needs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Due Diligence Support</h3>
                    <p className="text-slate-600">
                      Comprehensive business analysis, financial modeling, and market research to strengthen 
                      your funding applications and ensure successful capital raises.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Growth Strategy Planning</h3>
                    <p className="text-slate-600">
                      Strategic guidance on capital deployment, scaling operations, and building sustainable 
                      business models that attract ongoing investment.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:pl-12">
              <img
                src="https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg"
                alt="Business funding consultation"
                className="rounded-2xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Funding Types */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">Funding Solutions We Provide</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We have extensive experience across all major funding types and business stages, 
              ensuring you get the right capital solution for your specific needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'SBA Loans',
                description: 'Government-backed loans with favorable terms for small businesses and startups.'
              },
              {
                title: 'Traditional Bank Loans',
                description: 'Conventional business loans from banks and credit unions for established businesses.'
              },
              {
                title: 'Equipment Financing',
                description: 'Specialized funding for machinery, vehicles, and business equipment purchases.'
              },
              {
                title: 'Working Capital',
                description: 'Short-term funding for inventory, payroll, and operational expenses.'
              },
              {
                title: 'Investment Capital',
                description: 'Equity funding from angel investors, VCs, and private equity firms.'
              },
              {
                title: 'Alternative Financing',
                description: 'Revenue-based financing, merchant cash advances, and peer-to-peer lending.'
              }
            ].map((funding, index) => (
              <div key={index} className="bg-slate-50 rounded-xl p-6 hover:bg-green-50 transition-colors duration-200">
                <h3 className="text-xl font-semibold text-slate-800 mb-3">{funding.title}</h3>
                <p className="text-slate-600">{funding.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">Our Funding Process</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We streamline the business funding process to ensure efficient capital access 
              and optimal outcomes for our clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Assessment</h3>
              <p className="text-slate-600">
                Evaluate your funding needs, business model, and financial position.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Strategy</h3>
              <p className="text-slate-600">
                Develop a comprehensive funding strategy tailored to your goals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Preparation</h3>
              <p className="text-slate-600">
                Prepare compelling applications and connect with the right funding sources.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Execution</h3>
              <p className="text-slate-600">
                Manage the entire process from application through approval and funding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm 
            title="Ready to Secure Your Business Funding?"
            subtitle="Let's discuss your capital needs and funding requirements."
          />
        </div>
      </section>
  );
};

export default BusinessFunding;