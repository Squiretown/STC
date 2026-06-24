import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, CheckCircle, ArrowRight, GraduationCap, Map, Cog, Users, ShieldCheck, Rocket } from 'lucide-react';
import ContactForm from '../components/ContactForm';

const partners = [
  {
    name: 'OpenAI',
    description: 'GPT-4, ChatGPT & advanced language models',
  },
  {
    name: 'Microsoft AI',
    description: 'Azure AI, Copilot & enterprise integrations',
  },
  {
    name: 'Google AI',
    description: 'Gemini, Vertex AI & Workspace intelligence',
  },
  {
    name: 'Anthropic',
    description: 'Claude — safe, reliable AI for business',
  },
  {
    name: 'Amazon AI',
    description: 'AWS AI services & Bedrock platform',
  },
];

const services = [
  {
    icon: GraduationCap,
    title: 'AI Education & Workshops',
    description: 'Structured programs that give business leaders and teams the knowledge to understand, evaluate, and confidently use AI tools.',
  },
  {
    icon: Map,
    title: 'AI Strategy & Planning',
    description: 'A clear roadmap for where and how AI fits into your business — prioritized by ROI, risk, and organizational readiness.',
  },
  {
    icon: Cog,
    title: 'Business Process Automation',
    description: 'Identify repetitive, high-volume workflows and deploy AI solutions that free your team to focus on higher-value work.',
  },
  {
    icon: Users,
    title: 'Team Training & Adoption',
    description: 'Role-specific training that builds practical AI skills across your organization, improving productivity from day one.',
  },
  {
    icon: ShieldCheck,
    title: 'AI Policy & Best Practices',
    description: 'Governance frameworks, acceptable-use policies, and risk guidelines that let your team move fast without creating liability.',
  },
  {
    icon: Rocket,
    title: 'AI Implementation Support',
    description: 'Hands-on guidance through vendor selection, integration, testing, and go-live — so projects ship on time and deliver results.',
  },
];

const AITechnology: React.FC = () => {
  return (
    <>
      {/* Hero */}
      <section className="hero-section relative text-white py-16 md:py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0c1829 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #2563eb 0%, transparent 50%), radial-gradient(circle at 80% 30%, #0ea5e9 0%, transparent 45%)' }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(37,99,235,0.25)', border: '1px solid rgba(37,99,235,0.4)' }}>
            <Bot className="h-7 w-7 text-blue-300" aria-hidden="true" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
            AI Strategy & Implementation
          </h1>
          <p className="text-base md:text-xl mb-8 max-w-3xl mx-auto" style={{ color: '#94a3b8' }}>
            Practical guidance, structured education, and hands-on support to help your organization understand and deploy AI with confidence.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 md:px-8 md:py-4 rounded-lg text-base font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all duration-200 group"
          >
            Start the Conversation
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="content-section py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0F172A' }}>Our AI Services</h2>
            <p className="text-base md:text-xl max-w-2xl mx-auto" style={{ color: '#475569' }}>
              Six focused service areas that cover the full journey — from understanding AI to running it in production.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-2xl p-6 border border-slate-100 hover:border-blue-100 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, #1e40af, #0369a1)' }}>
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#0F172A' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="content-section py-16 md:py-24" style={{ background: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#0F172A' }}>We Focus on Outcomes, Not Jargon</h2>
              <p className="text-base md:text-lg mb-6 leading-relaxed" style={{ color: '#475569' }}>
                Most AI projects fail not because of the technology — but because organizations don't have the foundation: the right knowledge, the right processes, and the right culture. We fix that first.
              </p>
              <div className="space-y-5">
                {[
                  ['Improved productivity', 'Free your team from repetitive work so they can focus on decisions, relationships, and growth.'],
                  ['Streamlined operations', 'Connect AI tools to your actual workflows — not just demo environments.'],
                  ['Future-ready organization', 'Build lasting capability inside your team so you\'re not dependent on outside vendors forever.'],
                  ['Responsible adoption', 'Governance and policy frameworks that manage risk alongside opportunity.'],
                ].map(([title, body]) => (
                  <div key={title} className="flex items-start space-x-4">
                    <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: '#0ea5e9' }} aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-sm mb-1" style={{ color: '#0F172A' }}>{title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img
                src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg"
                alt="Business team collaborating on AI strategy"
                className="landscape-img rounded-2xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Powered By Industry-Leading AI */}
      <section className="content-section py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0F172A' }}>Powered By Industry-Leading AI</h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: '#475569' }}>
              We work with the world's most trusted AI platforms so our clients benefit from proven, enterprise-grade technology.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {partners.map(({ name, description }) => (
              <div
                key={name}
                className="rounded-2xl p-4 md:p-6 text-center border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all duration-300"
                style={{ background: '#f8fafc' }}
              >
                <p className="text-base font-bold mb-1 md:mb-2" style={{ color: '#0F172A' }}>{name}</p>
                <p className="text-xs leading-relaxed hidden sm:block" style={{ color: '#64748b' }}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="content-section py-16 md:py-24" style={{ background: '#0F172A' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Engagement Process</h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: '#94a3b8' }}>
              A structured, low-risk path from curiosity to confident AI adoption.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              ['01', 'Discovery', 'We learn your business, goals, current tools, and team readiness.'],
              ['02', 'Strategy', 'We map the highest-impact AI opportunities and build a prioritized roadmap.'],
              ['03', 'Education', 'Leaders and teams get the knowledge they need before any deployment begins.'],
              ['04', 'Implementation', 'We guide rollout — vendor selection, integration, testing, and go-live.'],
              ['05', 'Optimization', 'Ongoing coaching, measurement, and iteration to maximize ROI over time.'],
            ].map(([num, title, body]) => (
              <div key={num} className="text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-base font-bold text-white" style={{ background: 'linear-gradient(135deg, #1d4ed8, #0369a1)' }}>
                  {num}
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="content-section py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm
            title="Ready to Start Your AI Journey?"
            subtitle="Let's talk about where your organization is today and what AI adoption could look like for you."
          />
        </div>
      </section>
    </>
  );
};

export default AITechnology;
