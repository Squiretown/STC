import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Palette, Bot, Building, Briefcase, CheckCircle, Users, Award, TrendingUp } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import { useCMS } from '../hooks/useCMS';

const Home: React.FC = () => {
  const { getContent, getSetting } = useCMS();

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-24 lg:py-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight" 
                dangerouslySetInnerHTML={{ 
                  __html: getContent('home', 'hero_title', 'Transform Your Business with<span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-yellow-400"> Expert Consulting</span>') 
                }} />
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              {getContent('home', 'hero_subtitle', 'We blend creative branding, cutting-edge AI solutions, and business funding expertise to drive your business forward in today\'s competitive landscape.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/contact"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-200 inline-flex items-center justify-center group"
              >
                {getSetting('hero_cta_primary', 'Get Started Today')}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" focusable="false" />
              </Link>
              <Link
                to="/about"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-slate-900 transition-all duration-200 inline-flex items-center justify-center"
              >
                {getSetting('hero_cta_secondary', 'Learn More')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              {getContent('home', 'services_title', 'Our Core Services')}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {getContent('home', 'services_subtitle', 'We offer comprehensive solutions across three key business verticals, each designed to accelerate your growth and success.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand & Marketing */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Palette className="h-8 w-8 text-white" aria-hidden="true" focusable="false" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Brand Awareness & Marketing</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Build a powerful brand identity that resonates with your audience. From logo design to comprehensive 
                marketing strategies, we help you stand out in the marketplace.
              </p>
              <ul className="space-y-2 mb-8 list-none">
                <li className="flex items-center text-slate-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" aria-hidden="true" focusable="false" />
                  Logo & Visual Identity Design
                </li>
                <li className="flex items-center text-slate-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" aria-hidden="true" focusable="false" />
                  Marketing Content Creation
                </li>
                <li className="flex items-center text-slate-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" aria-hidden="true" focusable="false" />
                  Brand Strategy & Positioning
                </li>
              </ul>
              <Link
                to="/brand-marketing"
                className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors duration-200"
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" focusable="false" />
              </Link>
            </div>

            {/* AI Technology */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Bot className="h-8 w-8 text-white" aria-hidden="true" focusable="false" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">AI Technology Stack Building</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Harness the power of artificial intelligence to automate processes, enhance decision-making, 
                and drive innovation throughout your organization.
              </p>
              <ul className="space-y-2 mb-8 list-none">
                <li className="flex items-center text-slate-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" aria-hidden="true" focusable="false" />
                  Custom AI Solution Development
                </li>
                <li className="flex items-center text-slate-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" aria-hidden="true" focusable="false" />
                  Workflow Automation
                </li>
                <li className="flex items-center text-slate-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" aria-hidden="true" focusable="false" />
                  Integration & Optimization
                </li>
              </ul>
              <Link
                to="/ai-technology"
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200"
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" focusable="false" />
              </Link>
            </div>

            {/* Business Strategy & Consulting */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-slate-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Building className="h-8 w-8 text-white" aria-hidden="true" focusable="false" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Business Strategy & Consulting</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                We work alongside business owners as a strategic partner — helping you structure, plan, and position your business for sustainable growth and long-term success.
              </p>
              <ul className="space-y-2 mb-8 list-none">
                <li className="flex items-center text-slate-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" aria-hidden="true" focusable="false" />
                  Business Structure & Planning
                </li>
                <li className="flex items-center text-slate-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" aria-hidden="true" focusable="false" />
                  Growth Strategy Development
                </li>
                <li className="flex items-center text-slate-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" aria-hidden="true" focusable="false" />
                  Financial Modeling & Advisory
                </li>
              </ul>
              <Link
                to="/business-funding"
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200"
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" focusable="false" />
              </Link>
            </div>

            {/* Our Work */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="h-8 w-8 text-white" aria-hidden="true" focusable="false" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Our Work</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Explore the platforms, tools, and products we've built — from AI-powered apps to real estate investment platforms and FinTech tools.
              </p>
              <ul className="space-y-2 mb-8 list-none">
                <li className="flex items-center text-slate-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" aria-hidden="true" focusable="false" />
                  Live product portfolio
                </li>
                <li className="flex items-center text-slate-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" aria-hidden="true" focusable="false" />
                  Client case studies
                </li>
                <li className="flex items-center text-slate-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" aria-hidden="true" focusable="false" />
                  AI, FinTech & brand projects
                </li>
              </ul>
              <Link
                to="/work"
                className="inline-flex items-center text-slate-700 font-semibold hover:text-slate-900 transition-colors duration-200"
              >
                View Our Work
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" focusable="false" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-blue-600" aria-hidden="true" focusable="false" />
              </div>
              <h3 className="text-4xl font-bold text-slate-800 mb-2">500+</h3>
              <p className="text-xl text-slate-600">Satisfied Clients</p>
            </div>
            <div>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-10 w-10 text-green-600" aria-hidden="true" focusable="false" />
              </div>
              <h3 className="text-4xl font-bold text-slate-800 mb-2">15+</h3>
              <p className="text-xl text-slate-600">Years of Experience</p>
            </div>
            <div>
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-10 w-10 text-purple-600" aria-hidden="true" focusable="false" />
              </div>
              <h3 className="text-4xl font-bold text-slate-800 mb-2">98%</h3>
              <p className="text-xl text-slate-600">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm />
        </div>
      </section>
    </>
  );
};

export default Home;