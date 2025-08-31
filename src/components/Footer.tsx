import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';
import { useCMS } from '../hooks/useCMS';

const Footer: React.FC = () => {
  const { getSetting } = useCMS();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info - Left Side */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            {/* Company Name Above Logo */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">
                {getSetting('company_name', 'Squiretown Consulting')}
              </h2>
              
              {/* Logo Below Company Name */}
              {getSetting('footer_logo_url') ? (
                <img 
                  src={getSetting('footer_logo_url')} 
                  alt={getSetting('company_name', 'Squiretown Consulting')}
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
              <Building2 className={`h-10 w-10 text-blue-400 mb-6 ${getSetting('footer_logo_url') ? 'hidden' : ''}`} />
            </div>
            
            {/* Company Description */}
            <p className="text-slate-300 mb-6 max-w-md">
              {getSetting('company_description', 'Your trusted partner for brand development, AI solutions, and business funding. We blend creativity, technology, and financial expertise to drive your business forward.')}
            </p>
            
           {/* Contact Information */}
<div className="space-y-2">
  <div className="flex items-center space-x-3">
    <Mail className="h-4 w-4 text-blue-400" />
    <a
      href={`mailto:${getSetting('company_email', 'info@squiretown.co')}`}
      className="text-slate-300 hover:text-blue-400 underline underline-offset-2"
    >
      {getSetting('company_email', 'info@squiretown.co')}
    </a>
  </div>
  <div className="flex items-center space-x-3">
    <Phone className="h-4 w-4 text-blue-400" />
    <a
      href={`tel:${getSetting('company_phone', '(555) 123-4567')}`}
      className="text-slate-300 hover:text-blue-400 underline underline-offset-2"
    >
      {getSetting('company_phone', '(555) 123-4567')}
    </a>
  </div>
  <div className="flex items-center space-x-3">
    <MapPin className="h-4 w-4 text-blue-400" />
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getSetting('company_address', '15 Monauk Hwy, Suite 112, Hampton Bays, NY 11946'))}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-300 hover:text-blue-400 underline underline-offset-2"
    >
      {getSetting('company_address', '15 Monauk Hwy, Suite 112, Hampton Bays, NY 11946')}
      </a>
    </div> 
  </div>
</div>    
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/brand-marketing" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                  Brand & Marketing
                </Link>
              </li>
              <li>
                <Link to="/ai-technology" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                  AI Technology
                </Link>
              </li>
              <li>
                <Link to="/business-funding" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                  Business Funding
                </Link>
              </li>
              <li>
                <Link to="/real-estate-title-services" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                  Title Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
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
                <Link to="/admin" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2025 {getSetting('company_name', 'Squiretown Consulting')} LLC. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-200">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;