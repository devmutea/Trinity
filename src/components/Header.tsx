import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { IMAGES } from '../constants/images';

interface HeaderProps {
  onNavigate: (page: string) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = (id: string) => {
    onNavigate('home');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const navItems = [
    { label: 'Home', action: () => onNavigate('home') },
    { label: 'Services', action: () => scrollToSection('services') },
    { label: 'Routes', action: () => onNavigate('routes') },
    { label: 'Booking', action: () => scrollToSection('search-section') },
    { label: 'Contact', action: () => scrollToSection('contact') },
    { label: 'News', action: () => onNavigate('news') },
    { label: 'FAQ', action: () => onNavigate('faq') },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#7ba2cf]/85 backdrop-blur-md shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group ml-8 sm:ml-12 lg:ml-36"
          >
            <img
              src={IMAGES.logo}
              alt="Trinity Express"
              className="h-12 lg:h-16 w-auto object-contain rounded-md transition-all"
            />
          </button>

          <nav className="hidden lg:flex items-center gap-2 mr-8 lg:mr-16">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="px-4 py-2 text-base lg:text-lg font-bold text-white hover:text-[#132f4c] rounded-lg hover:bg-white/20 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-white hover:text-[#132f4c] mr-4"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-[#7ba2cf]/95 backdrop-blur-md border-t border-white/20 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  item.action();
                  setMobileOpen(false);
                }}
                className="block w-full text-left px-3 py-2.5 text-base font-bold text-white hover:text-[#132f4c] hover:bg-white/20 rounded-lg transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
