import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Building2 } from 'lucide-react';
import { useCMS } from '../hooks/useCMS';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { getSetting } = useCMS();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Brand & Marketing', path: '/brand-marketing' },
    { name: 'AI Technology', path: '/ai-technology' },
    { name: 'Business Funding', path: '/business-funding' },
    { name: 'Title Services', path: '/real-estate-title-services' },
     ];

  return (
    <header>
      <nav aria-label="Primary navigation" className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            {getSetting('header_logo_url') ? (
              <img 
                src={getSetting('header_logo_url')} 
                alt="Squiretown Consulting home"
                className="flex-shrink-0"
                style={{
                  width: `${getSetting('header_logo_width', '120')}px`,
                  height: `${getSetting('header_logo_height', '48')}px`,
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
            <Building2 className={`h-8 w-8 text-blue-600 ${getSetting('header_logo_url') ? 'hidden' : ''}`} aria-hidden="true" focusable="false" />
            <span className="text-xl font-bold text-slate-800">
              {getSetting('company_name', 'Squiretown Consulting')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-8 list-none">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-700 hover:text-blue-600'
                }`}
              >
                {item.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
              to="/contact"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Get Started
              </Link>
            </li>
          </ul>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-700 hover:text-blue-600 transition-colors duration-200"
            >
              {isOpen ? <X className="h-6 w-6" aria-hidden="true" focusable="false" /> : <Menu className="h-6 w-6" aria-hidden="true" focusable="false" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-slate-200" role="menu">
            <ul className="px-2 pt-2 pb-3 space-y-1 list-none" role="none">
              {navItems.map((item) => (
                <li key={item.path} role="none">
                  <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  role="menuitem"
                  className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  {item.name}
                  </Link>
                </li>
              ))}
              <li role="none">
                <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                role="menuitem"
                className="block w-full mt-4 bg-blue-600 text-white px-3 py-2 rounded-lg font-medium text-center hover:bg-blue-700 transition-colors duration-200"
              >
                Get Started
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
      </nav>
    </header>
  );
};

export default Navbar;