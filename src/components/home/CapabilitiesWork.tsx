import React from 'react';
import { Bot, Code2, ArrowLeftRight, BarChart2, Users, Lightbulb, Zap, Database, LayoutDashboard, Wrench } from 'lucide-react';

const capabilities = [
  { icon: Bot,            title: 'AI & Automation',     desc: 'Identify where AI fits, then deploy it to cut time, reduce cost, and improve outcomes.' },
  { icon: Code2,          title: 'Custom Software',      desc: 'Secure, scalable applications built around your business and your customers.' },
  { icon: ArrowLeftRight, title: 'Workflow Design',      desc: 'Map and automate the processes that quietly eat hours, so your team stops repeating itself.' },
  { icon: BarChart2,      title: 'Data & Reporting',     desc: 'Turn raw data into dashboards and metrics people actually use to decide.' },
  { icon: Users,          title: 'CRM & Operations',     desc: 'Systems that improve the customer experience and the way the work gets done.' },
  { icon: Lightbulb,      title: 'Product Strategy',     desc: 'Validate ideas, define the roadmap, and build products that move the business.' },
];

const work = [
  { icon: Zap,            title: 'Automation Platform',   desc: 'End-to-end automation for a high-volume service business.',          result: '65% fewer manual hours' },
  { icon: Database,       title: 'Customer Portal',        desc: 'Self-serve portal that lifted satisfaction and cut support load.',     result: '40% fewer support tickets' },
  { icon: LayoutDashboard,title: 'Data & Reporting Hub',   desc: 'Unified dashboards for real-time, organization-wide visibility.',     result: 'Real-time decisions across teams' },
  { icon: Wrench,         title: 'Internal Tools Suite',   desc: 'Custom tools that streamlined operations and saved time.',             result: '3 tools, 1 unified workflow' },
];

const CapabilitiesWork: React.FC = () => (
  <section
    id="capabilities"
    className="py-[84px] bg-white"
    aria-labelledby="cap-heading"
  >
    <div className="w-full max-w-[1200px] mx-auto px-7">
      <div
        className="grid gap-14"
        style={{ gridTemplateColumns: 'clamp(300px,1.55fr,1fr) 1fr' }}
      >
        {/* Left: Capabilities */}
        <div>
          <div className="mb-8">
            <p className="text-blue-600 text-[12px] font-semibold tracking-[0.14em] uppercase mb-3">Capabilities</p>
            <h2
              id="cap-heading"
              className="font-display font-extrabold leading-[1.08] tracking-tight text-navy-900"
              style={{ fontSize: 'clamp(28px,3.4vw,40px)', maxWidth: '460px' }}
            >
              End-to-end support for how you build and grow.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {capabilities.map(cap => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.title}
                  className="rounded-card border border-line p-[22px] bg-white transition-all duration-200 hover:-translate-y-[3px]"
                  style={{
                    transition: 'border-color .18s, transform .18s, box-shadow .18s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = '#2563eb';
                    el.style.boxShadow = '0 18px 40px -28px rgba(37,99,235,0.5)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = '';
                    el.style.boxShadow = '';
                  }}
                >
                  <div
                    className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center mb-3.5"
                    style={{ background: 'rgba(37,99,235,0.10)', color: '#2563eb' }}
                  >
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </div>
                  <h3 className="font-display font-bold text-[17px] text-navy-900">{cap.title}</h3>
                  <p className="text-[13.5px] text-ink-600 mt-1.5 leading-[1.55]">{cap.desc}</p>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-600 mt-3 no-underline group"
                  >
                    Learn more
                    <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Work */}
        <div id="work">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-600 text-[12px] font-semibold tracking-[0.14em] uppercase">Selected Work</p>
            <a href="#contact" className="text-[13px] font-semibold text-blue-600 inline-flex items-center gap-1 no-underline group">
              View all work
              <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
            </a>
          </div>
          <p className="text-[11.5px] text-ink-500 mb-4">Representative outcomes from recent builds.</p>

          {work.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex gap-3.5 py-[18px] group"
                style={{
                  borderTop: i === 0 ? '1px solid #e6ebf2' : 'none',
                  borderBottom: '1px solid #e6ebf2',
                }}
              >
                <div
                  className="w-[38px] h-[38px] rounded-[9px] flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={{ background: '#f7f9fc', border: '1px solid #e6ebf2', color: '#0a0f1f' }}
                  onMouseEnter={() => {}}
                >
                  <Icon
                    className="h-4 w-4 transition-colors duration-200 group-hover:text-white"
                    aria-hidden="true"
                    style={{ transition: 'color .18s' }}
                  />
                </div>
                <div>
                  <h4 className="font-display font-bold text-[15px] text-navy-900">{item.title}</h4>
                  <p className="text-[12.5px] text-ink-600 mt-0.5 leading-[1.45]">{item.desc}</p>
                  <p className="text-[12px] font-semibold mt-1.5" style={{ color: '#16a34a' }}>
                    Result: {item.result}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

export default CapabilitiesWork;
