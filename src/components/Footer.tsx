import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, Mailbox } from 'lucide-react';
import { useCMS } from '../hooks/useCMS';

const Footer: React.FC = () => {
  const { getSetting } = useCMS();

  return (
    <footer className="bg-slate-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company Info - Left Side */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            {/* Company Name Above Logo */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4" id="footer-company">
                {getSetting('company_name', 'Squiretown Consulting')}
              </h2>
              
              {/* Logo Below Company Name */}
              {getSetting('footer_logo_url') ? (
                <img 
                  src={getSetting('footer_logo_url')} 
                  alt=""
                  className="mb-6"
                  style={{
                    width: `${getSetting('footer_logo_width', '100')}px`,
                    height: `${getSetting('footer_logo_height', '40')}px`,
                    objectFit: 'contain',
                    display: 'block'
                  }}
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <Building2 className={`h-10 w-10 text-blue-400 mb-6 ${getSetting('footer_logo_url') ? 'hidden' : ''}`} aria-hidden="true" focusable="false" />
            </div>
            
            {/* Company Description */}
            <p className="text-slate-300 mb-6 max-w-md">
              {getSetting('company_description', 'Artificial intelligence is changing how organizations operate. Our mission is to help businesses understand, adopt, and benefit from AI with confidence.')}
            </p>
            
           {/* Contact Information */}
<div className="space-y-2">
  <div className="flex items-center space-x-3">
    <Mail className="h-4 w-4 text-blue-400" aria-hidden="true" focusable="false" />
    <a
      href={`mailto:${getSetting('company_email', 'info@squiretown.co')}`}
      className="text-slate-300 hover:text-blue-400 no-underline hover:no-underline"
    >
      {getSetting('company_email', 'info@squiretown.co')}
    </a>
  </div>
  <div className="flex items-center space-x-3">
    <Phone className="h-4 w-4 text-blue-400" aria-hidden="true" focusable="false" />
    <a
      href={`tel:${getSetting('company_phone', '(555) 123-4567')}`}
      className="text-slate-300 hover:text-blue-400 no-underline hover:no-underline"
    >
      {getSetting('company_phone', '(555) 123-4567')}
    </a>
  </div>
  <div className="flex items-start space-x-3">
    <Mailbox className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" aria-hidden="true" focusable="false" />
    <div>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getSetting('company_address', '15 Monauk Hwy, Suite 112, Hampton Bays, NY 11946'))}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-slate-300 hover:text-blue-400 no-underline hover:no-underline"
      >
        {getSetting('company_address', '15 Monauk Hwy, Suite 112, Hampton Bays, NY 11946')}
      </a>
      <p className="text-xs text-slate-400 italic mt-1">(Mailing Address)</p>
    </div>
  </div> 
  </div>
</div>    
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4" id="footer-services">Services</h3>
            <nav aria-labelledby="footer-services">
              <ul className="space-y-2 list-none">
                <li>
                <Link to="/ai-technology" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                  AI Education & Workshops
                </Link>
              </li>
              <li>
                <Link to="/ai-technology" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                  AI Strategy & Implementation
                </Link>
              </li>
              <li>
                <Link to="/brand-marketing" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                  Brand & Marketing
                </Link>
              </li>
              <li>
                <Link to="/business-funding" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                  Business Strategy
                </Link>
              </li>
              <li>
                <Link to="/work" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                  Our Work
                </Link>
              </li>
              </ul>
            </nav>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4" id="footer-company-links">Company</h3>
            <nav aria-labelledby="footer-company-links">
              <ul className="space-y-2 list-none">
                <li>
                <Link to="/about" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                  Contact
                </Link>
                </li>
                <li>
                <Link to="/accessibility" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                  Accessibility
                </Link>
                </li>
                <li>
                <Link to="/admin" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                  Login
                </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2026 Squiretown Consulting, LLC. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/sms-terms" className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-200">
                SMS Terms
              </Link>
              <Link to="/terms" className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-200">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;