import React from 'react';
import { Link } from 'react-router-dom';

const HomeFooter: React.FC = () => (
  <footer
    role="contentinfo"
    style={{ background: '#0a0f1f', color: '#fff' }}
  >
    <div className="w-full max-w-[1200px] mx-auto px-7 pt-[64px] pb-[40px]">
      <div
        className="grid gap-10 pb-[48px]"
        style={{
          gridTemplateColumns: 'minmax(0,1.8fr) minmax(0,1fr) minmax(0,1fr)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Left: brand + address */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-[38px] h-[38px] rounded-[9px] flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <span className="font-display font-extrabold text-[13px] tracking-[0.04em] text-white">STC</span>
            </div>
            <div>
              <div className="font-display font-bold text-[17px] tracking-[0.02em] leading-none">SQUIRETOWN</div>
              <div className="font-sans font-semibold text-[9px] tracking-[0.32em] mt-[2px]" style={{ color: '#64748b' }}>
                CONSULTING
              </div>
            </div>
          </div>

          <p className="text-[12px] font-semibold tracking-[0.08em] uppercase mb-1" style={{ color: '#64748b' }}>
            Mailing address
          </p>
          <address className="not-italic text-[14px] leading-relaxed" style={{ color: '#94a3b8' }}>
            15 W Montauk Hwy, Ste 112<br />
            Hampton Bays, NY 11946
          </address>
          <p className="text-[12px] mt-1" style={{ color: '#475569' }}>
            By appointment — not a walk-in office.
          </p>
        </div>

        {/* Company links */}
        <div>
          <h3 className="font-display font-bold text-[13px] tracking-[0.08em] uppercase mb-4" style={{ color: '#64748b' }}>
            Company
          </h3>
          <nav aria-label="Footer company links">
            <ul className="space-y-2.5 list-none">
              <li>
                <a href="#capabilities" className="text-[14px] transition-colors duration-150 no-underline" style={{ color: '#94a3b8' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
                >
                  Capabilities
                </a>
              </li>
              <li>
                <a href="#work" className="text-[14px] transition-colors duration-150 no-underline" style={{ color: '#94a3b8' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
                >
                  Work
                </a>
              </li>
              <li>
                <a href="#contact" className="text-[14px] transition-colors duration-150 no-underline" style={{ color: '#94a3b8' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
                >
                  Contact
                </a>
              </li>
              <li>
                <Link to="/admin" className="text-[13px] no-underline" style={{ color: '#334155' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#64748b'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#334155'; }}
                >
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Get in touch */}
        <div>
          <h3 className="font-display font-bold text-[13px] tracking-[0.08em] uppercase mb-4" style={{ color: '#64748b' }}>
            Get in touch
          </h3>
          <p className="text-[14px] mb-2" style={{ color: '#94a3b8' }}>Use the contact form above.</p>
          <a
            href="mailto:info@squiretown.co"
            className="text-[14px] no-underline"
            style={{ color: '#7aa2ff' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#7aa2ff'; }}
          >
            info@squiretown.co
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-[28px]">
        <p className="text-[13px]" style={{ color: '#475569' }}>
          © 2026 Squiretown Consulting, LLC.
        </p>
        <div className="flex items-center gap-5">
          <Link
            to="/privacy"
            className="text-[13px] no-underline transition-colors duration-150"
            style={{ color: '#475569' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#475569'; }}
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="text-[13px] no-underline transition-colors duration-150"
            style={{ color: '#475569' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#475569'; }}
          >
            Terms of Service
          </Link>
          <Link
            to="/sms-terms"
            className="text-[13px] no-underline transition-colors duration-150"
            style={{ color: '#475569' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#475569'; }}
          >
            SMS Terms
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default HomeFooter;
