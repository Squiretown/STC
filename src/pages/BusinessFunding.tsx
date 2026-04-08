import React from 'react';
import { Link } from 'react-router-dom';
import { Building, TrendingUp, BarChart2, Target, CheckCircle, ArrowRight, Users, Layers, Lightbulb } from 'lucide-react';
import ContactForm from '../components/ContactForm';

const pillars = [
  {
    icon: Layers,
    color: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Business Structure & Planning',
    description: 'We help you build the right foundation — from entity selection and operational frameworks to long-range business plans that give your company clarity and direction.',
  },
  {
    icon: TrendingUp,
    color: 'bg-slate-100',
    iconColor: 'text-slate-700',
    title: 'Growth Strategy Development',
    description: 'We identify your biggest growth levers and design a step-by-step roadmap to get there — covering market positioning, competitive differentiation, and scalable revenue models.',
  },
  {
    icon: BarChart2,
    color: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Financial Modeling & Advisory',
    description: 'Understand your numbers. We build custom financial models, forecast scenarios, and provide ongoing advisory to ensure your decisions are grounded in data, not guesswork.',
  },
  {
    icon: Target,
    color: 'bg-slate-100',
    iconColor: 'text-slate-700',
    title: 'Market Positioning & Competitive Analysis',
    description: 'We analyze your market landscape, benchmark your position against competitors, and craft a differentiated value proposition that resonates with your ideal customers.',
  },
  {
    icon: Users,
    color: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Team & Organizational Design',
    description: 'Scale sustainably by building the right team structure. We advise on org design, leadership gaps, hiring strategy, and the systems your team needs to execute at scale.',
  },
  {
    icon: Lightbulb,
    color: 'bg-slate-100',
    iconColor: 'text-slate-700',
    title: 'Innovation & Product Strategy',
    description: 'Whether you\'re launching a new product or expanding your offerings, we help you validate ideas, prioritize features, and bring concepts to market with confidence.',
  },
];

const process = [
  {
    step: '01',
    title: 'Discovery',
    description: 'We start by deeply understanding your business, goals, challenges, and the market you\'re operating in.',
  },
  {
    step: '02',
    title: 'Diagnosis',
    description: 'We identify gaps, inefficiencies, and untapped opportunities — giving you an honest assessment of where you stand.',
  },
  {
    step: '03',
    title: 'Strategy',
    description: 'We build a tailored strategic plan with clear priorities, milestones, and measurable outcomes.',
  },
  {
    step: '04',
    title: 'Execution Support',
    description: 'We work alongside you during implementation, adapting the strategy as you learn and grow.',
  },
];

const BusinessFunding: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-24 lg:py-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-medium text-blue-200 mb-8">
              <Building className="h-4 w-4 mr-2" aria-hidden="true" focusable="false" />
              Business Strategy & Consulting
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              A Strategic Partner for Serious Business Owners
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed">
              We work alongside you — not just as advisors, but as partners who are invested in your success. From business structure to growth execution, we help you build with intention.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-200 inline-flex items-center justify-center group"
              >
                Start a Conversation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" focusable="false" />
              </Link>
              <Link
                to="/work"
                className="border-2 border-white/40 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-all duration-200 inline-flex items-center justify-center"
              >
                See Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Statement */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-800 mb-6 leading-tight">
                Strategy without execution is just a plan. We help you do both.
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Most consulting engagements end with a deck and a handshake. Ours don't. We stay engaged through the hard work of actually building — refining your model, supporting decisions, and holding you accountable to the plan we built together.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Whether you're a founder structuring your first business or an established operator ready to scale, we bring the strategic clarity and operational discipline to get you where you're going.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg"
                alt="Business strategy consultation"
                className="rounded-2xl shadow-xl w-full object-cover aspect-[4/3]"
              />
              <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white rounded-xl p-6 shadow-xl hidden lg:block">
                <p className="text-3xl font-bold">15+</p>
                <p className="text-blue-100 text-sm mt-1">Years of strategic experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Pillars */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">What We Work On Together</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our consulting practice spans the full business lifecycle — from early structure to scaling and optimization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100">
                  <div className={`w-14 h-14 ${pillar.color} rounded-xl flex items-center justify-center mb-6`}>
                    <Icon className={`h-7 w-7 ${pillar.iconColor}`} aria-hidden="true" focusable="false" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{pillar.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">How We Engage</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Every engagement is different, but our approach is consistent — thorough, honest, and action-oriented.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="relative">
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-slate-200 z-0" style={{ width: 'calc(100% - 2rem)', left: 'calc(50% + 2rem)' }}></div>
                )}
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-slate-700 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-sm font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 leading-tight">
                We're operators, not just consultants.
              </h2>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Our team has built, launched, and scaled businesses across multiple industries — including AI, FinTech, brand, and real estate. We bring that first-hand experience into every engagement.
              </p>
              <ul className="space-y-4">
                {[
                  'Hands-on involvement — not just recommendations',
                  'Experience across AI, FinTech, Brand, and Real Estate',
                  'Focus on sustainable, long-term business health',
                  'Transparent, honest advisory you can actually act on',
                ].map((item, i) => (
                  <li key={i} className="flex items-start text-slate-300">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" aria-hidden="true" focusable="false" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Clients Served', value: '500+' },
                { label: 'Years of Experience', value: '15+' },
                { label: 'Industries Covered', value: '8+' },
                { label: 'Success Rate', value: '98%' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 border border-white/10 rounded-2xl p-6 text-center">
                  <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Contact */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm
            title="Ready to Build Something That Lasts?"
            subtitle="Tell us where you are and where you want to go. We'll take it from there."
          />
        </div>
      </section>
    </>
  );
};

export default BusinessFunding;
