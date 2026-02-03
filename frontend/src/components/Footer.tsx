import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-6">
            <img src="/logo.png" alt="IMN Business Group Logo" className="h-12 brightness-0 invert" /> 
            <p className="text-sm leading-relaxed max-w-sm text-slate-400">
              IMN Business Group berkomitmen untuk mendorong pertumbuhan ekonomi nasional melalui inovasi berkelanjutan di berbagai sektor industri.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-slate-800/50 rounded-lg hover:bg-blue-600 transition-all"><FiInstagram /></a>
              <a href="#" className="p-2 bg-slate-800/50 rounded-lg hover:bg-blue-600 transition-all"><FiFacebook /></a>
              <a href="#" className="p-2 bg-slate-800/50 rounded-lg hover:bg-blue-600 transition-all"><FiLinkedin /></a>
            </div>
          </div>

          {/* About Us Column */}
          <div className="md:col-span-2">
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-6">Perusahaan</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/tentang" className="hover:text-blue-400 transition-colors">Tentang Kami</Link></li>
              <li><Link to="/kegiatan" className="hover:text-blue-400 transition-colors">Kegiatan Kami</Link></li>
              <li><Link to="/careers" className="hover:text-blue-400 transition-colors">Karir</Link></li>
              <li><Link to="/press-releases" className="hover:text-blue-400 transition-colors">Rilis Pers</Link></li>
            </ul>
          </div>

          {/* Services Column */}
          <div className="md:col-span-3">
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-6">Unit Bisnis</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="hover:text-blue-400 cursor-default transition-colors">Agrobisnis & Peternakan</li>
              <li className="hover:text-blue-400 cursor-default transition-colors">Jasa Pengadaan Barang</li>
              <li className="hover:text-blue-400 cursor-default transition-colors">Manajemen Aqiqah</li>
              <li className="hover:text-blue-400 cursor-default transition-colors">IT & Creative Solutions</li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-3">
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-6">Kontak</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-blue-500 mt-1 shrink-0" />
                <span>Jl. Cipondoh Girang, RT.06/RW.12, Cinunuk, Cileunyi, Bandung 40624</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-blue-500 shrink-0" />
                <span>+62 21 1234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-blue-500 shrink-0" />
                <span>info@imnbusinessgroup.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section - GARIS DIHAPUS */}
        <div className="mt-20 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold uppercase tracking-tighter text-slate-500">
            © {currentYear} <span className="text-slate-400">IMN Business Group</span>. Seluruh Hak Cipta Dilindungi.
          </p>
          
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
            <Link to="/kebijakan-privasi" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;