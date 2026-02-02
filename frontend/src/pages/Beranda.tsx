import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RevealOnScroll from '../components/RevealOnScroll';
import { FiArrowRight, FiTarget, FiBox, FiCheckCircle, FiPieChart, FiCoffee } from 'react-icons/fi';

const Home = () => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const services = [
    { title: 'Konsultan SDM', desc: 'Optimalisasi potensi talenta untuk kemajuan perusahaan.' },
    { title: 'Teknologi Informasi', desc: 'Transformasi digital dan solusi teknologi terintegrasi.' },
    { title: 'Konsultan Keuangan', desc: 'Manajemen aset dan perencanaan keuangan strategis.' },
    { title: 'Jasa Desain', desc: 'Solusi visual kreatif untuk memperkuat identitas brand.' },
    { title: 'Percetakan', desc: 'Layanan cetak berkualitas tinggi untuk kebutuhan bisnis.' },
    { title: 'Produk Catering', desc: 'Penyediaan konsumsi premium dengan standar higienis.' },
  ];

  const productServices = [
    {
      title: 'Perusahaan Agrobisnis',
      description: 'Menyediakan solusi inovatif untuk sektor pertanian dan agribisnis yang berkelanjutan.',
      icon: <FiTarget className="h-6 w-6 md:h-8 md:w-8 text-emerald-500" />,
      theme: 'border-emerald-100 hover:bg-emerald-50'
    },
    {
      title: 'Aqiqah & Qurban',
      description: 'Pelayanan aqiqah profesional dan qurban syar\'i dengan kualitas hewan terbaik.',
      icon: <FiCheckCircle className="h-6 w-6 md:h-8 md:w-8 text-amber-500" />,
      theme: 'border-amber-100 hover:bg-amber-50'
    },
    {
      title: 'Pengadaan Barang',
      description: 'Supply chain management dengan jaringan luas dan pengiriman terjamin.',
      icon: <FiBox className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />,
      theme: 'border-blue-100 hover:bg-blue-50'
    },
    {
      title: 'Makanan & Minuman',
      description: 'Menghadirkan produk F&B berkualitas dengan cita rasa unggul dan inovatif.',
      icon: <FiCoffee className="h-6 w-6 md:h-8 md:w-8 text-rose-500" />,
      theme: 'border-rose-100 hover:bg-rose-50'
    },
    {
      title: 'Bisnis Support',
      description: 'Meningkatkan efektivitas operasional melalui layanan pendukung komprehensif.',
      icon: <FiPieChart className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />,
      theme: 'border-purple-100 hover:bg-purple-50'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD] font-sans selection:bg-blue-100">
      <main className="flex-grow overflow-x-hidden">
        
        {/* --- Hero Section --- */}
        <section className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden">
          <video
            autoPlay loop muted playsInline
            className="absolute top-0 left-0 w-full h-full object-cover scale-105"
            src="/building1.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90"></div>
          
          <div className="relative z-10 text-center text-white px-4 md:px-6 max-w-5xl mx-auto">
            <RevealOnScroll animationType="slide-up">
              <span className="inline-block px-3 py-1 mb-4 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] bg-blue-600 rounded-full">
                Investment & Business Group
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-7xl font-black mb-4 md:mb-6 tracking-tight leading-tight">
                PT Indo Makmur Nasional <br className="hidden sm:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                   Business Group
                </span>
              </h1>
              <p className="text-sm md:text-xl mb-8 md:mb-10 text-gray-300 max-w-2xl mx-auto leading-relaxed font-medium px-2">
                Bergerak di bidang investasi strategis yang konsisten bertumbuh serta berkontribusi nyata bagi bangsa dan negara.
              </p>
              <div className="flex justify-center items-center">
                <Link
                  to="/tentang"
                  className="group bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl text-sm md:text-lg font-bold transition-all flex items-center shadow-xl shadow-blue-900/40 active:scale-95"
                >
                  Pelajari Lebih Lanjut <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </RevealOnScroll>
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30 text-white hidden md:block">
            <div className="w-1 h-12 rounded-full bg-gradient-to-b from-white to-transparent mx-auto"></div>
          </div>
        </section>

        {/* --- Section 2: Core Expertise & Services --- */}
        <section className="py-16 md:py-24 px-4 md:px-6 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-4 md:gap-6">
              <div className="max-w-2xl">
                <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">Expertise</span>
                <h2 className="text-2xl md:text-5xl font-black text-slate-900 mt-2 md:mt-4 tracking-tight leading-tight">
                  Solusi Bisnis <br className="hidden md:block"/> Komprehensif & Terpadu
                </h2>
              </div>
              <p className="text-slate-500 font-medium max-w-sm leading-relaxed text-xs md:text-base">
                Ekosistem layanan profesional untuk mendukung akselerasi bisnis Anda di berbagai sektor strategis.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {services.map((service, index) => (
                <RevealOnScroll key={index} delay={index * 100} animationType="slide-up">
                  <div className="group relative bg-white p-6 md:p-10 rounded-2xl md:rounded-[2rem] border border-slate-100 transition-all duration-500 hover:shadow-xl overflow-hidden h-full">
                    <div className="relative z-10 flex items-center justify-between mb-6 md:mb-8">
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm font-black italic text-xs md:text-sm">
                         0{index + 1}
                      </div>
                      <FiArrowRight className="text-slate-200 group-hover:text-blue-500 transform -rotate-45 group-hover:rotate-0 transition-all duration-500 text-xl md:text-2xl" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-lg md:text-2xl font-black text-slate-800 mb-2 md:mb-4 group-hover:text-blue-700 transition-colors tracking-tight">
                        {service.title}
                      </h3>
                      <p className="text-slate-500 font-medium leading-relaxed text-xs md:text-sm">
                        {service.desc}
                      </p>
                    </div>
                    <div className="absolute bottom-0 left-0 w-0 h-1 bg-blue-600 group-hover:w-full transition-all duration-700"></div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* --- Section 3: Ecosystem (Core Services) --- */}
        <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-20 px-2">
               <span className="text-blue-600 font-black uppercase tracking-widest text-[10px] md:text-xs">Our Ecosystem</span>
               <h2 className="text-2xl md:text-5xl font-black text-slate-900 mt-2 md:mt-4 tracking-tighter leading-tight">Pilar Bisnis Strategis</h2>
               <div className="w-12 md:w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {productServices.map((item, index) => (
                <RevealOnScroll key={index} delay={index * 50} animationType="fade-in">
                  <div className={`h-full p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border-2 transition-all duration-500 group ${item.theme}`}>
                    <div className="mb-4 md:mb-6 p-3 md:p-4 bg-white inline-block rounded-xl md:rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="text-lg md:text-2xl font-black text-slate-800 mb-2 md:mb-4 tracking-tight">{item.title}</h3>
                    <p className="text-slate-600 font-medium leading-relaxed text-xs md:text-base">{item.description}</p>
                    <div className="mt-6 pt-4 border-t border-slate-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-slate-400 font-bold text-[10px] uppercase tracking-widest italic">
                      Integrated Division
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* --- Section 4: Call To Action --- */}
        <section className="py-12 md:py-24 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="relative rounded-3xl md:rounded-[3rem] bg-slate-900 overflow-hidden p-8 md:p-24 text-center">
              <div className="absolute top-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-blue-600/20 blur-[60px] md:blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-emerald-600/10 blur-[60px] md:blur-[100px] translate-x-1/2 translate-y-1/2"></div>

              <div className="relative z-10">
                <h2 className="text-2xl md:text-6xl font-black mb-6 md:mb-8 text-white tracking-tighter leading-tight italic">
                  Siap Bermitra?
                </h2>
                <p className="mb-8 md:mb-12 text-sm md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed px-4">
                  Bangun masa depan bisnis yang inklusif dan berkelanjutan bersama <span className="text-white font-bold italic uppercase">IMN Business Group</span>.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center bg-white hover:bg-blue-50 text-slate-950 px-6 py-3 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-sm transition-all shadow-2xl active:scale-95"
                >
                  Hubungi Tim <FiArrowRight className="ml-2 md:ml-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;