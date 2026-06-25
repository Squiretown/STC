import React from 'react';
import HomeNav from '../components/home/HomeNav';
import HeroDashboard from '../components/home/HeroDashboard';
import TrustBar from '../components/home/TrustBar';
import CapabilitiesWork from '../components/home/CapabilitiesWork';
import CTAForm from '../components/home/CTAForm';
import HomeFooter from '../components/home/HomeFooter';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Home: React.FC = () => (
  <div id="top" className="min-h-screen bg-white overflow-x-hidden">
    <HomeNav />

    {/* Hero */}
    <section
      className="relative"
      style={{ background: 'linear-gradient(180deg,#0d1426,#0a0f1f)', color: '#fff' }}
      aria-labelledby="hero-heading"
    >
      {/* ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(37,99,235,0.55), transparent)' }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-[1200px] mx-auto px-7 py-[88px] grid gap-14 items-center"
        style={{ gridTemplateColumns: '1fr 1.1fr' }}>

        {/* Left copy */}
        <div className="flex flex-col">
          <p
            className="text-[12px] font-semibold tracking-[0.16em] uppercase mb-4"
            style={{ color: '#7aa2ff' }}
          >
            Strategy · Automation · Custom Software
          </p>
          <h1
            id="hero-heading"
            className="font-display font-extrabold leading-[1.05] tracking-tight"
            style={{ fontSize: 'clamp(34px,4.2vw,54px)' }}
          >
            Systems that run your business.{' '}
            <span style={{ color: '#7aa2ff' }}>Not the other way around.</span>
          </h1>
          <p
            className="mt-5 text-[17px] leading-relaxed max-w-[460px]"
            style={{ color: '#cbd5e1' }}
          >
            Squiretown Consulting designs, builds, and ships the workflows, automation, and software that let your team stop managing tools and start driving growth.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 font-sans font-semibold text-[15px] text-white px-6 py-3.5 rounded-input no-underline group transition-all duration-150"
              style={{ background: '#2563eb', boxShadow: '0 8px 24px -10px rgba(37,99,235,0.5)' }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = '#1d4ed8';
                el.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = '#2563eb';
                el.style.transform = '';
              }}
            >
              Start a Conversation
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-[3px]" aria-hidden="true" />
            </a>
            <a
              href="#capabilities"
              className="inline-flex items-center gap-2 font-sans font-semibold text-[15px] px-6 py-3.5 rounded-input no-underline transition-all duration-150"
              style={{
                color: '#e2e8f0',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(255,255,255,0.06)';
              }}
            >
              See what we build
            </a>
          </div>

        </div>

        {/* Right: dashboard */}
        <div className="hidden lg:block">
          <HeroDashboard />
        </div>
      </div>
    </section>

    <TrustBar />
    <CapabilitiesWork />
    <CTAForm />
    <HomeFooter />
  </div>
);

export default Home;
