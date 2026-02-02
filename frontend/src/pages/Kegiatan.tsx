import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RevealOnScroll from '../components/RevealOnScroll';
import { FiArrowRight, FiCheckCircle, FiExternalLink } from 'react-icons/fi';

const Services: React.FC = () => {
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const services = [
    {
      title: "PT Global Agro Pratama",
      description: "Bergerak dalam Agrobisnis dan bidang Peternakan Domba, kambing dan sapi dengan fokus pada ketahanan pangan nasional.",
      icon: "/agro.jpg",
      features: ["Sentra Aqiqah Nusantara", "Niaga Food Indonesia", "Smart Farm"]
    },
    {
      title: "Sapa Management",
      description: "Unit bisnis strategis yang mengelola jasa Aqiqah dengan standar syar'i dan profesionalitas tinggi.",
      icon: "/sapa.png",
      features: ["Sunnah Aqiqah", "Yuu Aqiqah"]
    },
    {
      title: "Global Garda Sarana",
      description: "Penyedia pengadaan barang dan jasa untuk support kebutuhan kantor dengan jaringan ekspor-impor.",
      icon: "/ggs.png",
      features: ["Cetak Yuu", "G Supply", "G Fashion", "Export & Import"]
    },
    {
      title: "Al Husna Group",
      description: "Ekosistem brand retail dan kuliner yang menghadirkan produk berkualitas bagi masyarakat.",
      icon: "/husna.png",
      features: ["Top Aqiqah", "Dapur Buah Batu"]
    }
  ];

  const projects = [
    { title: "Kerja sama dengan PT. Bandung Daya Sentosa", image: "/1.jpg", tag: "Partnership" },
    { title: "Kerja sama penanaman benih dengan Turki", image: "/2.jpg", tag: "Agrobisnis" },
    { title: "Pelepasan Ekspor Hasil Pertanian ke Malaysia", image: "/3.jpg", tag: "Export" },
    { title: "Kolaborasi Produksi Probiotik", image: "/4.jpg", tag: "Innovation" },
    { title: "Mitra Pemberian Makanan Tambahan", image: "/5.jpg", tag: "Social" },
    { title: "Qurban Kaleng Baznas", image: "/6.jpg", tag: "Philanthropy" }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-blue-100">
      
      {/* --- Hero Section --- */}
      <section className="relative h-[75vh] md:h-[85vh] w-full flex items-center overflow-hidden">
        <video 
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105"
          src="/building3.mp4"
        />
        {/* Overlay: Gradient Bawah (Mobile) & Gradient Kiri (Desktop) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 md:bg-gradient-to-r md:from-black/80 md:via-black/50 md:to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-6 w-full">
          <div className="text-center md:text-left text-white">
            <RevealOnScroll animationType="slide-up">
              <span className="inline-block px-3 py-1 mb-4 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] bg-blue-600 rounded-full">
                Activities & Impact
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-7xl font-black mb-4 md:mb-6 tracking-tighter leading-tight italic uppercase">
                Kegiatan <br className="hidden sm:block"/> <span className="text-blue-400">Kami</span>
              </h1>
              <p className="text-sm md:text-xl text-gray-300 leading-relaxed font-medium mb-8 md:mb-10 max-w-xl mx-auto md:mx-0">
                Kami mengidentifikasi peluang bisnis dengan potensi pertumbuhan tinggi untuk mendorong transformasi dan penciptaan nilai jangka panjang bagi bangsa.
              </p>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* --- Main Content --- */}
      <div className="max-w-7xl mx-auto py-16 md:py-24 px-5 md:px-6">
        
        {/* Section Title */}
        <div className="text-center mb-12 md:mb-20">
          <span className="text-blue-600 font-black uppercase tracking-widest text-[10px] md:text-xs">Our Divisions</span>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 mt-2 md:mt-4 tracking-tighter uppercase">Ekosistem Bisnis IMN</h2>
          <div className="w-12 md:w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Divisions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          {services.map((service, index) => (
            <RevealOnScroll key={index} delay={index * 100} animationType="slide-up">
              <div className="group bg-white rounded-3xl md:rounded-[2.5rem] border border-slate-100 p-6 md:p-12 h-full flex flex-col hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500">
                <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 md:mb-8 text-center sm:text-left">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-slate-50 p-3 md:p-4 flex items-center justify-center mb-4 sm:mb-0 group-hover:scale-110 transition-transform">
                    <img src={service.icon} alt="" className="max-h-full max-w-full object-contain" />
                  </div>
                  <h2 className="text-xl md:text-3xl font-black text-slate-900 sm:ml-6 tracking-tight italic uppercase">{service.title}</h2>
                </div>
                
                <p className="text-slate-500 font-medium leading-relaxed mb-6 md:mb-8 text-xs md:text-base text-center sm:text-left flex-grow">
                  {service.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-8">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-center text-[11px] md:text-sm font-bold text-slate-700 bg-slate-50/50 p-2 rounded-lg sm:bg-transparent sm:p-0">
                      <FiCheckCircle className="text-blue-500 mr-2 shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                <button className="w-full sm:w-max px-8 py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs active:scale-95 transition-all shadow-lg flex items-center justify-center">
                  Learn More <FiExternalLink className="ml-2" />
                </button>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* --- Projects Gallery --- */}
        <div className="mt-24 md:mt-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-4 text-center md:text-left">
            <div>
              <span className="text-blue-600 font-black uppercase tracking-widest text-[10px] md:text-xs">Portfolio Gallery</span>
              <h2 className="text-2xl md:text-4xl font-black text-slate-900 mt-2 tracking-tighter italic uppercase">Galeri Proyek Utama</h2>
            </div>
            <p className="text-slate-400 font-medium max-w-xs text-xs md:text-sm mx-auto md:mx-0 italic">Dokumentasi kolaborasi strategis di berbagai sektor bisnis kami.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project, index) => (
              <RevealOnScroll key={index} delay={index * 50} animationType="fade-in">
                <div className="group bg-white rounded-2xl md:rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 h-full">
                  <div className="relative h-48 md:h-64 overflow-hidden">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-md text-blue-600 shadow-sm">
                        {project.tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 md:p-8">
                    <h3 className="text-sm md:text-xl font-black text-slate-800 leading-tight uppercase italic tracking-tight group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        {/* --- Footer CTA --- */}
        <RevealOnScroll animationType="slide-up">
          <div className="relative mt-24 md:mt-32 rounded-[2rem] md:rounded-[3rem] bg-blue-600 overflow-hidden p-10 md:p-24 text-center text-white">
            {/* Dekorasi Blur Samping */}
            <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-white/10 blur-[60px] md:blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl md:text-5xl font-black mb-6 md:mb-8 tracking-tighter uppercase italic">
                Aktivitas Terbaru
              </h2>
              <p className="text-sm md:text-xl text-blue-100 mb-10 md:mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                Ikuti perkembangan terbaru dan kontribusi positif kami melalui rilis berita resmi perusahaan.
              </p>
              <Link to="/press-releases" className="inline-flex items-center bg-white text-blue-900 px-8 py-4 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-sm hover:bg-slate-100 transition-all shadow-xl active:scale-95">
                Lihat Berita Pers <FiArrowRight className="ml-2 md:ml-3" />
              </Link>
            </div>
          </div>
        </RevealOnScroll>

      </div>
    </div>
  );
};

export default Services;