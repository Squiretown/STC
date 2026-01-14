import React from 'react';
import { Link } from 'react-router-dom';
import { Home, FileCheck, Shield, Clock, CheckCircle, ArrowRight, Search, TentTree as DocumentText } from 'lucide-react';
import ContactForm from '../components/ContactForm';

const RealEstateTitleServices: React.FC = () => {
  return (
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-900 via-amber-900 to-orange-800 text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Home className="h-10 w-10 text-white" aria-hidden="true" focusable="false" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-8">
              Real Estate Title Services
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 mb-12 max-w-4xl mx-auto">
              Comprehensive title examination, insurance, and closing services to ensure 
              smooth and secure real estate transactions.
            </p>
            <Link
              to="/contact"
              className="bg-white text-orange-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-50 transition-all duration-200 inline-flex items-center group"
            >
              Get Title Services
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" focusable="false" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">Complete Title Services</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From title searches to closing coordination, we provide comprehensive services 
              to protect your real estate investments and ensure clean property transfers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Title Searches</h3>
              <p className="text-slate-600">Comprehensive property history research to identify potential issues.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Title Insurance</h3>
              <p className="text-slate-600">Protection against financial loss from title defects and claims.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <DocumentText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Closing Services</h3>
              <p className="text-slate-600">Professional coordination and management of real estate closings.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <FileCheck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Document Preparation</h3>
              <p className="text-slate-600">Accurate preparation and review of all closing documents.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Services */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-800 mb-8">Professional Title Services</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Complete Title Examination</h3>
                    <p className="text-slate-600">
                      Thorough research of public records to verify clear title ownership and identify 
                      any liens, encumbrances, or other issues that could affect the property transfer.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Owner & Lender Title Insurance</h3>
                    <p className="text-slate-600">
                      Comprehensive title insurance policies to protect both property owners and mortgage 
                      lenders against financial losses due to title defects or claims.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Closing Coordination</h3>
                    <p className="text-slate-600">
                      Professional management of the entire closing process, including document preparation, 
                      fund disbursement, and recording with appropriate government agencies.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Escrow Services</h3>
                    <p className="text-slate-600">
                      Secure handling of funds and documents throughout the transaction process, 
                      ensuring all conditions are met before finalizing the property transfer.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:pl-12">
              <img
                src="https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg"
                alt="Real estate documents and keys"
                className="rounded-2xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Transaction Types */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">Transaction Types We Handle</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We provide title services for all types of real estate transactions, 
              from residential purchases to complex commercial deals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Residential Purchases',
                description: 'Complete title services for home buyers and sellers in residential transactions.'
              },
              {
                title: 'Commercial Real Estate',
                description: 'Specialized title services for office buildings, retail spaces, and industrial properties.'
              },
              {
                title: 'Refinancing',
                description: 'Streamlined title services for mortgage refinancing and loan modifications.'
              },
              {
                title: 'New Construction',
                description: 'Title services for newly constructed homes and commercial developments.'
              },
              {
                title: 'Investment Properties',
                description: 'Comprehensive services for real estate investors and property managers.'
              },
              {
                title: 'Land Transactions',
                description: 'Specialized title services for vacant land and development property sales.'
              }
            ].map((transaction, index) => (
              <div key={index} className="bg-slate-50 rounded-xl p-6 hover:bg-orange-50 transition-colors duration-200">
                <h3 className="text-xl font-semibold text-slate-800 mb-3">{transaction.title}</h3>
                <p className="text-slate-600">{transaction.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">Our Title Process</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We follow a comprehensive process to ensure thorough title examination 
              and smooth closing execution for every transaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Order Processing</h3>
              <p className="text-slate-600">
                Receive and process title order, gathering all necessary property information.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Title Search</h3>
              <p className="text-slate-600">
                Conduct comprehensive search of public records and property history.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Examination</h3>
              <p className="text-slate-600">
                Review findings and prepare title commitment with any requirements.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Closing</h3>
              <p className="text-slate-600">
                Coordinate closing, issue title insurance, and record documents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm 
            title="Ready to Start Your Title Process?"
            subtitle="Contact us today for professional title services and closing coordination."
          />
        </div>
      </section>
  );
};

export default RealEstateTitleServices;