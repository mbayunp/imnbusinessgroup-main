import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook, FiLinkedin, FiArrowRight } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-8 font-sans border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Column (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="block">
                {/* Pastikan file logo.png ada di public folder */}
                <img src="/logo.png" alt="IMN Business Group Logo" className="h-10 brightness-0 invert opacity-90 hover:opacity-100 transition-opacity" /> 
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              IMN Business Group berkomitmen mendorong pertumbuhan ekonomi nasional melalui inovasi berkelanjutan dan solusi terintegrasi di berbagai sektor industri strategis.
            </p>
            
            {/* Social Media Buttons */}
            <div className="flex space-x-3 pt-2">
              {[
                { icon: <FiInstagram />, link: "#" },
                { icon: <FiFacebook />, link: "#" },
                { icon: <FiLinkedin />, link: "#" }
              ].map((social, index) => (
                <a 
                    key={index} 
                    href={social.link} 
                    className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm border border-slate-800"
                >
                    {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Column 1 (Span 2) */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6 relative inline-block">
                Perusahaan
                <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-blue-600 rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { name: 'Tentang Kami', path: '/tentang' },
                { name: 'Kegiatan', path: '/kegiatan' },
                { name: 'Karir', path: '/careers' },
                { name: 'Rilis Pers', path: '/press-releases' }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link to={item.path} className="text-slate-400 hover:text-blue-500 transition-all duration-300 flex items-center group">
                    <span className="w-0 group-hover:w-2 h-px bg-blue-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 (Span 3) */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6 relative inline-block">
                Layanan
                <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-blue-600 rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                'Agrobisnis & Peternakan',
                'Jasa Pengadaan Barang',
                'Manajemen Aqiqah',
                'IT & Creative Solutions'
              ].map((service, idx) => (
                <li key={idx} className="text-slate-400 hover:text-blue-500 cursor-default transition-colors flex items-start">
                   {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Contact Column (Span 3) */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6 relative inline-block">
                Tetap Terhubung
                <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-blue-600 rounded-full"></span>
            </h3>
            
            {/* Address Info */}
            <ul className="space-y-4 text-sm mb-6">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-blue-500 mt-1 shrink-0" />
                <span className="text-slate-400 leading-snug">Jl. Cipondoh Girang, RT.06/RW.12, Cinunuk, Cileunyi, Bandung 40624</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-blue-500 shrink-0" />
                <span className="text-slate-400">+62 21 1234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-blue-500 shrink-0" />
                <span className="text-slate-400">info@imnbusinessgroup.com</span>
              </li>
            </ul>

            {/* Newsletter Input Mockup */}
            <div className="relative">
                <input 
                    type="email" 
                    placeholder="Email Anda" 
                    className="w-full bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-slate-600"
                />
                <button className="absolute right-1.5 top-1.5 bg-blue-600 text-white p-1.5 rounded-md hover:bg-blue-500 transition-colors">
                    <FiArrowRight />
                </button>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 text-center md:text-left">
            © {currentYear} <span className="font-bold text-slate-300">IMN Business Group</span>. Seluruh Hak Cipta Dilindungi.
          </p>
          
          <div className="flex gap-6 text-xs font-medium text-slate-500 uppercase tracking-wide">
            <Link to="/kebijakan-privasi" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-blue-400 transition-colors">Support</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;