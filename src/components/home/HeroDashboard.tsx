import React, { useEffect, useRef } from 'react';
import {
  LayoutDashboard, Workflow, Zap, Database, Wrench, BarChart2, Settings, Bell,
} from 'lucide-react';

const METRICS = [
  { icon: LayoutDashboard, label: 'AI Automation',   count: 128,   delta: '↑ 18%', sub: 'Active automations',      prefix: '',  suffix: '',  decimals: 0 },
  { icon: Workflow,         label: 'Workflows',       count: 342,   delta: '↑ 24%', sub: 'Running',                 prefix: '',  suffix: '',  decimals: 0 },
  { icon: BarChart2,        label: 'Operations',      count: 1842,  delta: '↑ 16%', sub: 'Tasks completed',         prefix: '',  suffix: '',  decimals: 0 },
  { icon: Database,         label: 'Data Refreshes',  count: 96,    delta: '↑ 21%', sub: 'This period',             prefix: '',  suffix: '',  decimals: 0 },
  { icon: Wrench,           label: 'Internal Tools',  count: 28,    delta: '↑ 12%', sub: 'Active',                  prefix: '',  suffix: '',  decimals: 0 },
  { icon: BarChart2,        label: 'Growth Systems',  count: 3.6,   delta: '↑ 19%', sub: 'Pipeline contribution',   prefix: '$', suffix: 'M', decimals: 1 },
];

const CHART_LINE = 'M0,72 L30,66 L60,70 L90,54 L120,58 L150,42 L180,46 L210,30 L240,36 L270,20 L300,24';
const CHART_AREA = `${CHART_LINE} L300,92 L0,92 Z`;

const HeroDashboard: React.FC = () => {
  const dashRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const playedRef = useRef(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const play = () => {
      if (playedRef.current) return;
      playedRef.current = true;

      if (prefersReduced) {
        countersRef.current.forEach((el, i) => {
          if (!el) return;
          const m = METRICS[i];
          el.textContent = m.prefix + m.count.toLocaleString(undefined, { minimumFractionDigits: m.decimals, maximumFractionDigits: m.decimals }) + m.suffix;
        });
        return;
      }

      // Count up
      countersRef.current.forEach((el, i) => {
        if (!el) return;
        const m = METRICS[i];
        const dur = 1100;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const v = m.count * eased;
          el.textContent = m.prefix + v.toLocaleString(undefined, { minimumFractionDigits: m.decimals, maximumFractionDigits: m.decimals }) + m.suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });

      // Draw chart
      const line = lineRef.current;
      if (line) {
        const len = line.getTotalLength();
        line.style.strokeDasharray = `${len}`;
        line.style.strokeDashoffset = `${len}`;
        line.getBoundingClientRect();
        line.style.transition = 'stroke-dashoffset 1.4s ease';
        line.style.strokeDashoffset = '0';
      }
    };

    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) play(); }),
      { threshold: 0.4 }
    );
    if (dashRef.current) observer.observe(dashRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={dashRef}
      role="img"
      aria-label="Sample operating dashboard showing automation, workflow, and growth metrics"
      className="relative rounded-[18px] overflow-hidden text-white"
      style={{
        background: 'linear-gradient(180deg,#0d1426,#0a0f1f)',
        border: '1px solid rgba(255,255,255,0.14)',
        boxShadow: '0 40px 80px -40px rgba(10,15,31,0.55), 0 0 0 1px rgba(255,255,255,0.02) inset',
      }}
    >
      {/* ambient glow */}
      <div
        className="absolute top-[-120px] right-[-80px] w-[320px] h-[320px] pointer-events-none opacity-50"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.45), transparent 65%)' }}
        aria-hidden="true"
      />

      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-3.5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center gap-2 font-display font-bold text-[12px] tracking-[0.04em]">
          <div className="w-[22px] h-[22px] rounded-[6px] bg-blue-600 flex items-center justify-center">
            <Zap className="h-3 w-3" />
          </div>
          SQUIRETOWN
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-7 h-7 rounded-[7px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <Bell className="h-3.5 w-3.5" />
            <span
              className="absolute -top-1 -right-1 w-[15px] h-[15px] rounded-full bg-blue-600 flex items-center justify-center font-bold text-[9px]"
              aria-hidden="true"
            >
              2
            </span>
          </div>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px]"
            style={{ background: 'linear-gradient(135deg,#2563eb,#6d28d9)' }}
          >
            ST
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex" style={{ minHeight: '360px' }}>
        {/* Sidebar */}
        <aside
          className="hidden sm:flex flex-col gap-1 w-[120px] flex-shrink-0 p-3.5"
          style={{ borderRight: '1px solid rgba(255,255,255,0.08)' }}
        >
          {[
            { icon: LayoutDashboard, label: 'Overview', active: true },
            { icon: Settings,         label: 'Workflows' },
            { icon: Zap,              label: 'Automation' },
            { icon: Database,         label: 'Data' },
            { icon: Wrench,           label: 'Tools' },
            { icon: BarChart2,        label: 'Reports' },
            { icon: Settings,         label: 'Settings' },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-2 px-2 py-2 rounded-lg text-[11px]"
                style={{
                  color: item.active ? '#fff' : '#94a3b8',
                  background: item.active ? 'rgba(37,99,235,0.16)' : 'transparent',
                }}
              >
                <Icon className="h-3.5 w-3.5 flex-shrink-0 opacity-80" />
                {item.label}
              </div>
            );
          })}
        </aside>

        {/* Main area */}
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="font-display font-bold text-[14px]">Operating Overview</h3>
            <div
              className="text-[11px] px-3 py-1 rounded-full"
              style={{
                color: '#cbd5e1',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              Last 30 days
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-3 gap-2">
            {METRICS.map((m, i) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.label}
                  className="rounded-[11px] p-2.5"
                  style={{
                    background: 'rgba(255,255,255,0.035)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <div
                      className="w-[13px] h-[13px] rounded-[4px] flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(37,99,235,0.10)' }}
                    >
                      <Icon className="h-2 w-2" />
                    </div>
                    {m.label}
                  </div>
                  <div className="font-display font-bold text-[20px] mt-2 tracking-tight">
                    <span ref={el => { countersRef.current[i] = el; }}>0</span>
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: '#22c55e' }}>{m.delta}</div>
                  <div className="text-[9px] mt-0.5 text-slate-500">{m.sub}</div>
                </div>
              );
            })}
          </div>

          {/* Chart + Activity */}
          <div className="grid grid-cols-[1.6fr_1fr] gap-2 mt-2">
            <div
              className="rounded-[11px] p-3"
              style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <h4 className="text-[11px] font-semibold mb-2" style={{ color: '#cbd5e1' }}>Performance Overview</h4>
              <svg
                viewBox="0 0 300 92"
                preserveAspectRatio="none"
                className="w-full h-[88px]"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={CHART_AREA} fill="url(#chartGrad)" />
                <path
                  ref={lineRef}
                  d={CHART_LINE}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div
              className="rounded-[11px] p-3"
              style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <h4 className="text-[11px] font-semibold mb-2" style={{ color: '#cbd5e1' }}>Recent Activity</h4>
              {[
                { text: 'New workflow published', ago: '2m' },
                { text: 'Data pipeline refreshed', ago: '8m' },
                { text: 'Lead routed to sales', ago: '21m' },
              ].map(item => (
                <div
                  key={item.text}
                  className="flex items-center gap-2 text-[10.5px] py-1.5"
                  style={{
                    color: '#cbd5e1',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span style={{ color: '#22c55e' }}>●</span>
                  <span className="flex-1 truncate">{item.text}</span>
                  <span className="text-slate-500 text-[9.5px] flex-shrink-0">{item.ago}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroDashboard;
