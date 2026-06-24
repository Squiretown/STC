import React from 'react';
import { Target, Zap, Users } from 'lucide-react';

const items = [
  { icon: Target, text: 'Strategy to shipped systems' },
  { icon: Zap,    text: 'AI-ready operations' },
  { icon: Users,  text: 'Built for real business teams' },
];

const TrustBar: React.FC = () => (
  <section style={{ background: '#0a0f1f', color: '#fff' }}>
    <div className="w-full max-w-[1200px] mx-auto px-7">
      <div className="grid grid-cols-1 sm:grid-cols-3">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={item.text}
              className="flex items-center gap-3.5 py-6 px-2"
              style={{
                borderRight: i < items.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}
            >
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(37,99,235,0.16)', color: '#7aa2ff' }}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="font-display font-semibold text-[15px]">{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default TrustBar;
