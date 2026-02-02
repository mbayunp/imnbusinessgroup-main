import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-bold tracking-wide transition-all duration-200 ${
      isActive ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
    }`;

  const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `block px-6 py-4 text-base font-black transition-all ${
      isActive 
        ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600' 
        : 'text-slate-900 hover:bg-slate-50 border-l-4 border-transparent'
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-slate-100 shadow-sm font-sans">
      <nav className="container mx-auto flex h-20 items-center justify-between px-6">
        
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img src="/logo.png" alt="IMN Logo" className="h-9 md:h-11 w-auto" />
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden items-center space-x-10 lg:flex">
          <li><NavLink to="/" className={navLinkClasses}>Beranda</NavLink></li>
          <li><NavLink to="/tentang" className={navLinkClasses}>Tentang</NavLink></li>
          <li><NavLink to="/kegiatan" className={navLinkClasses}>Kegiatan</NavLink></li>
          <li><NavLink to="/careers" className={navLinkClasses}>Karir</NavLink></li>
          <li><NavLink to="/press-releases" className={navLinkClasses}>Berita Pers</NavLink></li>
          <li><NavLink to="/contact" className={navLinkClasses}>Kontak</NavLink></li>
          <li>
            <NavLink 
              to="/admin/login" 
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-md transition-all active:scale-95"
            >
              Portal Admin
            </NavLink>
          </li>
        </ul>

        {/* Hamburger Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-900 hover:text-blue-600 transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      <div
        className={`lg:hidden absolute top-[80px] left-0 right-0 bg-white border-b border-slate-200 shadow-xl overflow-hidden transition-all duration-300 ease-in-out origin-top ${
          isMobileMenuOpen ? 'max-h-[500px] opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-0'
        }`}
      >
        <div className="flex flex-col py-2 font-sans">
          <ul className="divide-y divide-slate-50">
            <li><NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClasses}>Beranda</NavLink></li>
            <li><NavLink to="/tentang" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClasses}>Tentang Kami</NavLink></li>
            <li><NavLink to="/kegiatan" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClasses}>Kegiatan Kami</NavLink></li>
            <li><NavLink to="/careers" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClasses}>Lowongan Karir</NavLink></li>
            <li><NavLink to="/press-releases" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClasses}>Rilis Pers</NavLink></li>
            <li><NavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClasses}>Hubungi Kami</NavLink></li>
          </ul>

          <div className="px-6 py-4 bg-slate-50 mt-2">
            <NavLink 
              to="/admin/login" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="block w-full py-3.5 rounded-2xl bg-blue-600 text-white font-black text-center text-sm uppercase tracking-widest shadow-lg active:scale-95"
            >
              Login Portal Admin
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;