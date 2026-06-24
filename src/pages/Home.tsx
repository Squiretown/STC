import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Cpu, Users, Clock, TrendingUp, RefreshCw,
  HeadphonesIcon, BarChart2, Database, Brain, CheckCircle,
} from 'lucide-react';
import ContactForm from '../components/ContactForm';

const outcomes = [
  { icon: Clock,          label: 'Save Time' },
  { icon: TrendingUp,     label: 'Improve Productivity' },
  { icon: RefreshCw,      label: 'Automate Repetitive Tasks' },
  { icon: HeadphonesIcon, label: 'Enhance Customer Service' },
  { icon: BarChart2,      label: 'Improve Marketing Efficiency' },
  { icon: Brain,          label: 'Support Better Decision Making' },
  { icon: Database,       label: 'Organize Knowledge and Information' },
  { icon: Users,          label: 'Strengthen Team Performance' },
];

const partners = [
  { name: 'OpenAI',        detail: 'GPT-4, ChatGPT & advanced language models' },
  { name: 'Microsoft AI',  detail: 'Azure AI, Copilot & enterprise integrations' },
  { name: 'Google AI',     detail: 'Gemini, Vertex AI & Workspace intelligence' },
  { name: 'Anthropic',     detail: 'Claude — safe, reliable AI for business' },
  { name: 'Amazon AI',     detail: 'AWS AI services & Bedrock platform' },
];

const Home: React.FC = () => {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        className="hero-section relative text-white py-20 md:py-28 lg:py-36 overflow-hidden"
        style={{ background: '#0F172A' }}
      >
        {/* subtle texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase mb-6">
            AI Education · Strategy · Implementation
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
            Helping Businesses Understand and Implement AI
          </h1>
          <p className="text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-10" style={{ color: '#94a3b8' }}>
            Squiretown Consulting helps organizations confidently adopt artificial intelligence through education, training, strategy, and implementation services designed for real-world business operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg text-base font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors duration-200 group"
            >
              Schedule a Consultation
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" aria-hidden="true" />
            </Link>
            <Link
              to="/ai-technology"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg text-base font-semibold border border-slate-600 text-slate-200 hover:border-slate-400 hover:text-white transition-colors duration-200"
            >
              Explore AI Services
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 · AI MADE PRACTICAL ────────────────────────────── */}
      <section className="content-section py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0F172A' }}>
              AI Made Practical for Business
            </h2>
            <p className="text-base md:text-lg leading-relaxed" style={{ color: '#475569' }}>
              We help business owners and teams move beyond the AI hype by providing practical guidance, training, and implementation support that delivers measurable business value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* AI Education */}
            <div className="rounded-2xl border border-slate-100 p-7 hover:shadow-lg hover:border-slate-200 transition-all duration-300 group">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300"
                style={{ background: '#EFF6FF' }}
              >
                <BookOpen className="h-6 w-6 text-blue-700" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#0F172A' }}>AI Education</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: '#475569' }}>
                Learn what AI can and cannot do for your organization through workshops, presentations, and executive briefings.
              </p>
              <ul className="space-y-2 list-none">
                {['Executive & leadership briefings', 'Hands-on workshops for teams', 'AI risk & governance overview'].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm" style={{ color: '#64748b' }}>
                    <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-blue-500" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/ai-technology"
                className="inline-flex items-center gap-1 mt-6 text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors duration-200"
              >
                Learn more <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            {/* AI Implementation */}
            <div
              className="rounded-2xl border p-7 hover:shadow-lg transition-all duration-300 group"
              style={{ background: '#0F172A', borderColor: '#1E293B' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300"
                style={{ background: 'rgba(59,130,246,0.15)' }}
              >
                <Cpu className="h-6 w-6 text-blue-400" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">AI Implementation</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: '#94a3b8' }}>
                Identify opportunities to improve workflows, automate repetitive tasks, and increase productivity using AI tools.
              </p>
              <ul className="space-y-2 list-none">
                {['Process & workflow analysis', 'Tool selection & deployment', 'Integration & go-live support'].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm" style={{ color: '#94a3b8' }}>
                    <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-blue-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/ai-technology"
                className="inline-flex items-center gap-1 mt-6 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                Learn more <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Team Training */}
            <div className="rounded-2xl border border-slate-100 p-7 hover:shadow-lg hover:border-slate-200 transition-all duration-300 group">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300"
                style={{ background: '#F0FDF4' }}
              >
                <Users className="h-6 w-6 text-emerald-700" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#0F172A' }}>Team Training</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: '#475569' }}>
                Equip your employees with the knowledge and confidence to use AI responsibly and effectively.
              </p>
              <ul className="space-y-2 list-none">
                {['Role-specific AI skill building', 'Responsible use guidelines', 'Ongoing coaching & support'].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm" style={{ color: '#64748b' }}>
                    <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-emerald-500" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/ai-technology"
                className="inline-flex items-center gap-1 mt-6 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors duration-200"
              >
                Learn more <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 · BUSINESS OUTCOMES ────────────────────────────── */}
      <section className="content-section py-16 md:py-24" style={{ background: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0F172A' }}>
              How AI Can Help Your Business
            </h2>
            <p className="text-base md:text-lg leading-relaxed" style={{ color: '#475569' }}>
              When properly adopted, AI creates tangible advantages across every part of your organization.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {outcomes.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="bg-white rounded-xl border border-slate-100 px-5 py-5 flex items-start gap-3 hover:shadow-md hover:border-slate-200 transition-all duration-200"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: '#EFF6FF' }}
                >
                  <Icon className="h-4 w-4 text-blue-700" aria-hidden="true" />
                </div>
                <span className="text-sm font-medium leading-snug" style={{ color: '#1E293B' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 md:mt-14">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg text-base font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors duration-200 group"
            >
              Discuss Your Business Goals
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 4 · TRUSTED AI PLATFORMS ─────────────────────────── */}
      <section className="content-section py-14 md:py-20 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold tracking-widest uppercase mb-8 md:mb-10" style={{ color: '#94a3b8' }}>
            Trusted AI Platforms
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {partners.map(({ name, detail }) => (
              <div
                key={name}
                className="rounded-xl border border-slate-100 hover:border-slate-300 hover:shadow-sm transition-all duration-200 p-4 text-center"
                style={{ background: '#F8FAFC' }}
              >
                <p className="font-bold text-sm mb-1" style={{ color: '#0F172A' }}>{name}</p>
                <p className="text-xs leading-snug hidden sm:block" style={{ color: '#64748b' }}>{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ─────────────────────────────────────────────── */}
      <section className="content-section py-16 md:py-24" style={{ background: '#F8FAFC' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm
            title="Schedule a Consultation"
            subtitle="Tell us about your organization and where you'd like AI to help. We'll be in touch within one business day."
          />
        </div>
      </section>
    </>
  );
};

export default Home;
