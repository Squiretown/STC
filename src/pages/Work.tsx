import React, { useState } from 'react';
import {
  ExternalLink, Globe, Bot, DollarSign, Building2,
  BarChart3, Briefcase, Code2, Layers, Zap, Lightbulb,
  CheckCircle, RefreshCw
} from 'lucide-react';
import ContactForm from '../components/ContactForm';
import { useProjects } from '../hooks/useProjects';
import type { PortfolioProject } from '../lib/supabase';

const ICON_MAP: Record<string, React.ReactNode> = {
  Globe:      <Globe className="h-6 w-6" />,
  Bot:        <Bot className="h-6 w-6" />,
  DollarSign: <DollarSign className="h-6 w-6" />,
  Building2:  <Building2 className="h-6 w-6" />,
  BarChart3:  <BarChart3 className="h-6 w-6" />,
  Briefcase:  <Briefcase className="h-6 w-6" />,
  Code2:      <Code2 className="h-6 w-6" />,
  Layers:     <Layers className="h-6 w-6" />,
  Zap:        <Zap className="h-6 w-6" />,
  Lightbulb:  <Lightbulb className="h-6 w-6" />,
};

const CATEGORIES = ['All', 'Web Platform', 'AI / Automation', 'FinTech', 'Real Estate'] as const;
type Category = typeof CATEGORIES[number];

const StatusBadge: React.FC<{ status: string }> = ({ status }) =>
  status === 'live' ? (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      Live
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      In Development
    </span>
  );

const ProjectCard: React.FC<{ project: PortfolioProject; featured?: boolean }> = ({ project, featured = false }) => (
  <div className={`group relative bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col ${featured ? 'ring-1 ring-slate-200' : ''}`}>
    <div className={`h-1 w-full ${project.accent_color}`} />
    <div className="p-8 flex flex-col flex-1">
      <div className="flex items-start justify-between mb-6">
        <div className={`w-12 h-12 ${project.accent_light} ${project.accent_text} rounded-xl flex items-center justify-center flex-shrink-0`}>
          {ICON_MAP[project.icon_name] ?? <Globe className="h-6 w-6" />}
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <StatusBadge status={project.status} />
          {featured && <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">Featured</span>}
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-1">{project.name}</h3>
      <p className={`text-sm font-medium ${project.accent_text} mb-4`}>{project.tagline}</p>
      <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {project.tags.map(tag => (
          <span key={tag} className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md font-medium">{tag}</span>
        ))}
      </div>
      <div className="border-t border-slate-100 pt-5 mt-auto">
        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 text-sm font-semibold ${project.accent_text} hover:gap-3 transition-all duration-200`}
            aria-label={`Visit ${project.name} — opens in new tab`}
          >
            <ExternalLink className="h-4 w-4" />
            Visit {project.name}
          </a>
        ) : (
          <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-400">
            <Globe className="h-4 w-4" />
            {project.status === 'live' ? 'URL coming soon' : 'In development'}
          </span>
        )}
      </div>
    </div>
  </div>
);

const Work: React.FC = () => {
  const { projects, loading, error } = useProjects();
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const featuredProjects = projects.filter(p => p.featured);
  const filtered = activeCategory === 'All' ? projects : projects.filter(p => p.category === activeCategory);
  const liveCount = projects.filter(p => p.status === 'live').length;

  return (
    <>
      <section className="bg-slate-900 text-white py-24 lg:py-32 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">Our Work</p>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Products we've <span className="text-blue-400">built</span> and <span className="text-blue-400">launched</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-12 max-w-2xl">
              From AI-powered platforms to real estate funding tools, these are the live products and client projects that demonstrate what we actually build.
            </p>
            <div className="flex flex-wrap gap-12">
              <div><p className="text-4xl font-bold">{liveCount}+</p><p className="text-slate-400 text-sm mt-1">Live platforms</p></div>
              <div><p className="text-4xl font-bold">4</p><p className="text-slate-400 text-sm mt-1">Industry verticals</p></div>
              <div><p className="text-4xl font-bold">15+</p><p className="text-slate-400 text-sm mt-1">Years of experience</p></div>
            </div>
          </div>
        </div>
      </section>

      {loading && (
        <section className="py-20 bg-slate-50 flex justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </section>
      )}

      {error && !loading && (
        <section className="py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-700">Could not load projects. Please try refreshing the page.</p>
            </div>
          </div>
        </section>
      )}

      {!loading && !error && featuredProjects.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured projects</h2>
              <p className="text-slate-500">Platforms we're particularly proud of</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map(project => (
                <ProjectCard key={project.id} project={project} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {!loading && !error && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">All projects</h2>
                <p className="text-slate-500">Every platform, tool, and product we've shipped</p>
              </div>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                      activeCategory === cat
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                    }`}
                    aria-pressed={activeCategory === cat}
                  >
                    {cat}{' '}
                    <span className="ml-1 text-xs opacity-60">
                      ({(cat === 'All' ? projects : projects.filter(p => p.category === cat)).length})
                    </span>
                  </button>
                ))}
              </div>
            </div>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-slate-400">
                <Globe className="h-10 w-10 mx-auto mb-4 opacity-40" />
                <p className="text-lg">No projects in this category yet.</p>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What we bring to every project</h2>
            <p className="text-slate-500 text-lg">Whether it's a client product or one of our own platforms, the approach is the same.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Brand before build', body: 'Every product starts with identity — naming, visual language, and positioning before a single component is written.' },
              { title: 'AI-native by default', body: 'We integrate intelligent automation at the architecture level, not as an afterthought bolted on later.' },
              { title: 'Funding-aware design', body: 'Products built for businesses that need capital. We understand funding workflows from the inside out.' },
              { title: 'Production-grade code', body: 'React, TypeScript, Supabase — real stacks, real deployments. Not prototypes handed off to another team.' },
              { title: 'Owned and operated', body: 'Several of these platforms are ours — not just client work. We eat our own cooking.' },
              { title: 'Long Island rooted, nationally scaled', body: 'Based in Hampton Bays, NY. Clients and platforms that operate coast to coast.' },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-2xl p-7 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed pl-8">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Have a project in mind?</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Whether it's building something new, funding something existing, or branding something that doesn't exist yet — let's talk.
            </p>
          </div>
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
            <ContactForm title="" subtitle="" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Work;
