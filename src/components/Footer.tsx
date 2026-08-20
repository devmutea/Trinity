import React from 'react';
import { Mail, Phone, MapPin, Twitter, Instagram, Linkedin } from 'lucide-react';
import { IMAGES } from '../constants/images';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (href === '#') {
      onNavigate('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href === '#faq') {
      onNavigate('faq');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href === '#news') {
      onNavigate('news');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNavigate('home');
      const targetId = href.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <footer className="bg-[#132f4c] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & Foundation */}
          <div>
            <div className="flex items-center mb-5">
              <img
                src={IMAGES.logo}
                alt="Trinity Express"
                className="h-16 w-auto object-contain"
              />
            </div>
            <div className="space-y-4 text-sm text-gray-300">
              <div>
                <span className="font-bold text-sky-400 block mb-1">Vision:</span>
                <p className="leading-relaxed">
                  To be the leading provider of reliable and efficient cross-border transportation in the region.
                </p>
              </div>
              <div>
                <span className="font-bold text-sky-400 block mb-1">Mission:</span>
                <p className="leading-relaxed">
                  To connect communities and foster economic growth through enhanced trade, tourism, and people-to-people connections.
                </p>
              </div>
              <div>
                <span className="font-bold text-sky-400 block mb-1">Values:</span>
                <p className="leading-relaxed">
                  Reliability, Safety, Comfort, Customer Focus, Innovation.
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-5 text-white">Useful Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '#' },
                { name: 'Services', href: '#services' },
                { name: 'Routes', href: '#routes' },
                { name: 'Contact', href: '#contact' },
                { name: 'News', href: '#news' },
                { name: 'FAQ', href: '#faq' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-5 text-white">Services</h3>
            <ul className="space-y-3">
              {['Transport', 'Local Bus Service', 'Cross-Border'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-5 text-white">Contact Us</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                <span>KN 1 Rd, Chez Manu House, Nyarugenge-Kigali City</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-sky-400 flex-shrink-0" />
                <span>+250 788 314 935</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-sky-400 flex-shrink-0 mt-1" />
                <div>
                  <span className="font-bold text-white block">Passenger Support:</span>
                  <a href="mailto:contact.trinityexpress@gmail.com" className="text-sky-400 hover:underline">
                    contact.trinityexpress@gmail.com
                  </a>
                  <span className="text-xs text-gray-400 block mt-0.5">For travel assistance and passenger support</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-sky-400 flex-shrink-0 mt-1" />
                <div>
                  <span className="font-bold text-white block">Business Inquiries:</span>
                  <a href="mailto:trinityexpressrw@gmail.com" className="text-sky-400 hover:underline">
                    trinityexpressrw@gmail.com
                  </a>
                  <span className="text-xs text-gray-400 block mt-0.5">For business partnerships and corporate inquiries</span>
                </div>
              </li>
            </ul>

            <div className="mt-8 space-y-3 text-sm text-gray-300">
              <a href="#" className="flex items-center gap-3 hover:text-white transition-colors">
                <Instagram className="w-5 h-5 text-sky-400" />
                <span>Instagram</span>
              </a>
              <a href="#" className="flex items-center gap-3 hover:text-white transition-colors">
                <Twitter className="w-5 h-5 text-sky-400" />
                <span>Twitter</span>
              </a>
              <a href="#" className="flex items-center gap-3 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5 text-sky-400" />
                <span>Linkedin</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Trinity Express. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
