import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, Award, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { useCMS } from '../hooks/useCMS';

const About: React.FC = () => {
  const { getContent, getSetting } = useCMS();

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section py-16 md:py-24" style={{ background: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ color: '#0F172A' }}>
              {getContent('about', 'hero_title', 'About Squiretown Consulting')}
            </h1>
            <p className="text-base md:text-xl mb-8 max-w-4xl mx-auto" style={{ color: '#475569' }}>
              {getContent('about', 'hero_subtitle', "We're an AI education, strategy, and implementation firm that helps business owners, professionals, and organizations understand and adopt AI with confidence.")}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="content-section py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-800 mb-8">
                {getContent('about', 'mission_title', 'Our Mission')}
              </h2>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: '#475569' }}>
                {getContent('about', 'mission_content', "At Squiretown Consulting, we believe that the organizations best positioned for the future aren't those that simply buy AI tools — they're the ones that understand them. Our mission is to bridge the gap between rapidly advancing AI technology and the business leaders and teams who need practical guidance to adopt it responsibly and effectively.")}
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" aria-hidden="true" focusable="false" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Innovation-Driven</h3>
                    <p className="text-slate-600">
                      We stay at the forefront of industry trends, ensuring our clients benefit from 
                      the latest technologies and methodologies.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" aria-hidden="true" focusable="false" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Results-Focused</h3>
                    <p className="text-slate-600">
                      Every strategy we develop is designed to deliver measurable outcomes that 
                      directly impact your bottom line.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" aria-hidden="true" focusable="false" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Partnership Approach</h3>
                    <p className="text-slate-600">
                      We work as an extension of your team, providing ongoing support and strategic 
                      guidance throughout our engagement.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:pl-12">
              <img
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
                alt="Team collaboration"
                className="landscape-img rounded-2xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Expertise */}
      <section className="content-section py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Our Expertise</h2>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: '#475569' }}>
              We bring deep expertise across AI adoption, business strategy, branding, and organizational change.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
                <Target className="h-7 w-7 text-blue-600" aria-hidden="true" focusable="false" />
              </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: '#0F172A' }}>AI Education & Strategy</h3>
              <p className="leading-relaxed text-sm" style={{ color: '#475569' }}>
                We help business owners and executives move from uncertainty to clarity — building the knowledge base and roadmap required to adopt AI responsibly and profitably.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-5">
                <Award className="h-7 w-7 text-cyan-600" aria-hidden="true" focusable="false" />
              </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: '#0F172A' }}>Implementation & Automation</h3>
              <p className="leading-relaxed text-sm" style={{ color: '#475569' }}>
                Our consultants have guided organizations through end-to-end AI deployments — from use case selection to go-live — across industries including healthcare, finance, real estate, and professional services.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mb-5">
                <TrendingUp className="h-7 w-7 text-slate-600" aria-hidden="true" focusable="false" />
              </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: '#0F172A' }}>Brand & Business Strategy</h3>
              <p className="leading-relaxed text-sm" style={{ color: '#475569' }}>
                Strong brands and sound business structure amplify the impact of any AI investment. We combine brand, strategy, and financial advisory to deliver integrated outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="content-section py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0F172A' }}>Why Choose Squiretown Consulting</h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#475569' }}>
              We're not a software vendor, a staffing firm, or a research lab. We're a trusted advisor who helps your organization make smart decisions about AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-600" aria-hidden="true" focusable="false" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Integrated Approach</h3>
                  <p className="text-slate-600">
                    Unlike single-service providers, we offer comprehensive solutions that address 
                    multiple aspects of your business growth strategy simultaneously.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="h-6 w-6 text-green-600" aria-hidden="true" focusable="false" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Proven Track Record</h3>
                  <p className="text-slate-600">
                    Our portfolio includes successful projects across diverse industries, 
                    demonstrating our ability to adapt and deliver in any business environment.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-purple-600" aria-hidden="true" focusable="false" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Industry Recognition</h3>
                  <p className="text-slate-600">
                    Our work has been recognized by leading industry publications and associations, 
                    validating our expertise and innovative approaches.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-orange-600" aria-hidden="true" focusable="false" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Scalable Solutions</h3>
                  <p className="text-slate-600">
                    Whether you're a growing startup or an established enterprise, 
                    our solutions are designed to scale with your business needs.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-cyan-600" aria-hidden="true" focusable="false" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Transparent Process</h3>
                  <p className="text-slate-600">
                    We maintain open communication throughout every project, providing regular updates 
                    and ensuring you're always informed about progress and next steps.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-pink-600" aria-hidden="true" focusable="false" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Long-term Partnership</h3>
                  <p className="text-slate-600">
                    We're committed to building lasting relationships with our clients, 
                    providing ongoing support and strategic guidance as your business evolves.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="content-section py-16 md:py-24 text-white" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Begin Your AI Journey?</h2>
          <p className="text-base md:text-xl mb-8 md:mb-12" style={{ color: '#94a3b8' }}>
            Whether you're just starting to explore AI or ready to deploy — we'll meet you where you are and help you move forward with clarity.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/contact"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all duration-200 inline-flex items-center justify-center group"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" focusable="false" />
            </Link>
            <Link
              to="/"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 inline-flex items-center justify-center"
            >
              View Our Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;