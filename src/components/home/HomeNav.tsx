import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useCMS } from '../../hooks/useCMS';

const HomeNav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { getSetting } = useCMS();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Work', href: '#work' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Platforms', href: '#capabilities' }, // placeholder — needs real target
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'border-b border-line shadow-[0_4px_20px_-16px_rgba(10,15,31,0.5)]'
          : 'border-b border-transparent'
      }`}
      style={{ background: 'rgba(255,255,255,0.86)', backdropFilter: 'saturate(160%) blur(12px)' }}
    >
      <div className="w-full max-w-[1200px] mx-auto px-7 flex items-center justify-between h-[72px]">
        {/* Brand */}
        <a href="#top" aria-label="Squiretown Consulting home" className="flex items-center gap-3 no-underline">
          {getSetting('header_logo_url') ? (
            <img
              src={getSetting('header_logo_url')}
              alt="Squiretown Consulting"
              style={{
                height: `${getSetting('header_logo_height', '36')}px`,
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          ) : (
            <>
              <div
                className="w-[38px] h-[38px] rounded-[9px] flex items-center justify-center flex-shrink-0"
                style={{ background: '#0a0f1f', border: '1px solid rgba(255,255,255,0.14)' }}
              >
                <span className="font-display font-extrabold text-[13px] tracking-[0.04em] text-white">STC</span>
              </div>
              <div>
                <div className="font-display font-bold text-[17px] tracking-[0.02em] text-navy-900 leading-none">
                  SQUIRETOWN
                </div>
                <div className="font-sans font-semibold text-[9px] tracking-[0.32em] text-ink-500 mt-[2px]">
                  CONSULTING
                </div>
              </div>
            </>
          )}
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-[30px]" aria-label="Primary">
          {links.map(l => (
            <a
              key={l.label}
              href={l.href}
              className="font-sans font-medium text-[15px] text-ink-600 hover:text-navy-900 transition-colors duration-150 no-underline"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 font-sans font-semibold text-[15px] text-white px-5 py-3 rounded-input transition-all duration-150 no-underline group"
            style={{ background: '#2563eb', boxShadow: '0 8px 24px -10px rgba(37,99,235,0.45)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = '#1d4ed8';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = '#2563eb';
              (e.currentTarget as HTMLElement).style.transform = '';
            }}
          >
            Start a Conversation
            <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-ink-600 hover:text-navy-900"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-line px-7 py-4 space-y-1">
          {links.map(l => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 font-sans font-medium text-[15px] text-ink-600 hover:text-navy-900 no-underline"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="block mt-3 text-center font-sans font-semibold text-[15px] text-white px-5 py-3 rounded-input no-underline"
            style={{ background: '#2563eb' }}
          >
            Start a Conversation →
          </a>
        </div>
      )}
    </header>
  );
};

export default HomeNav;
