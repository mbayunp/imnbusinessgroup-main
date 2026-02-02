import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import RevealOnScroll from '../components/RevealOnScroll';
import { FiArrowRight, FiCheckCircle, FiTarget, FiZap, FiUsers, FiAward, FiBriefcase } from 'react-icons/fi';

const anakPerusahaan = [
  { name: 'PT. Global Agro Pratama', logo: '/logo-agro.png', desc: 'Fokus pada ketahanan pangan dan teknologi pertanian modern.' },
  { name: 'PT. SAPA Management', logo: '/logo-sapa.png', desc: 'Layanan aqiqah dan manajemen peternakan syariah profesional.' },
  { name: 'PT. Global Garda Sarana', logo: '/logo-garda.png', desc: 'Solusi pengadaan, fashion, serta ekspor-impor skala global.' },
  { name: 'Al Husna Group', logo: '/logo-niaga.png', desc: 'Unit bisnis kuliner dan retail pendukung ekosistem grup.' }
];

const team = [
  { name: 'MUGI WIDODO', role: 'Komisaris Utama', image: '/pak-wiwid.png' },
  { name: 'ANDI PUTRA SANJAYA', role: 'Komisaris', image: '/pak-andi.png' },
  { name: 'DANA VEGA SUPRIATNA', role: 'CEO', image: '/pak-dana.png' },
  { name: 'M ARIEF HIDAYAT PS', role: 'Business Project Director', image: '/pak-arif.png' }
];

const About: React.FC = () => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-700 font-sans selection:bg-blue-100">
      <main className="overflow-x-hidden">
        
        {/* --- Hero Section (Video Background) --- */}
        <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover scale-105" src="/building2.mp4" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-slate-900"></div>
          
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <RevealOnScroll animationType="slide-up">
              <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-tight uppercase italic">
                Our Story & <br/> <span className="text-blue-400">Legacy</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-200 mb-10 font-medium leading-relaxed">
                Memimpin dengan inovasi, kemitraan strategis, dan komitmen terhadap keberlanjutan bisnis di Indonesia sejak 2016.
              </p>
              <Link to="/contact" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/40 group">
                Hubungi Kami <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </RevealOnScroll>
          </div>
        </section>

        {/* --- Profil Perusahaan Section --- */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <RevealOnScroll animationType="slide-right">
              <div>
                <span className="text-blue-600 font-black uppercase tracking-widest text-xs">Corporate Profile</span>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 mb-8 tracking-tighter leading-tight">
                  Membangun Kemakmuran <br/> Melalui Inovasi Nasional
                </h2>
                <div className="space-y-6 text-slate-600 leading-relaxed font-medium">
                  <p>
                    <span className="text-blue-600 font-bold">PT. Indomakmur Nasional (IMN)</span> didirikan oleh empat visioner yang berdedikasi untuk berkontribusi penuh terhadap kemakmuran Nusantara melalui pengembangan bisnis skala internasional.
                  </p>
                  <p>
                    Kami mengintegrasikan ekosistem Agro, Infrastruktur, Digitalisasi, hingga Pendidikan dalam satu visi besar: Memberikan manfaat luas bagi masyarakat Indonesia.
                  </p>
                </div>
                
                <div className="mt-10 grid grid-cols-2 gap-6 border-t border-slate-100 pt-10">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm"><FiUsers size={24}/></div>
                    <span className="font-bold text-slate-800 text-sm">100+ SDM Profesional</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm"><FiBriefcase size={24}/></div>
                    <span className="font-bold text-slate-800 text-sm">4 Anak Perusahaan</span>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
            
            <RevealOnScroll animationType="slide-left" delay={200}>
              <div className="relative group">
                <div className="absolute -inset-4 bg-blue-100/50 rounded-[3rem] blur-2xl group-hover:bg-blue-200/50 transition-colors"></div>
                <img src="/imn-building.png" alt="Kantor IMN" className="relative w-full h-[500px] object-cover rounded-[2.5rem] shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]" />
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* --- Visi Misi & Tujuan (Modern Card) --- */}
        <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <RevealOnScroll delay={0}>
              <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-200 h-full hover:shadow-xl transition-all">
                <FiTarget className="text-blue-600 mb-6" size={40} />
                <h3 className="text-xl font-black text-slate-900 mb-4 uppercase italic">Tujuan Kami</h3>
                <p className="text-slate-500 font-medium leading-relaxed italic">"Menghadirkan semangat anak bangsa dalam berkontribusi pada kemajuan dan ketahanan bangsa."</p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <div className="bg-blue-600 p-10 rounded-[2rem] shadow-xl text-white h-full transform lg:-translate-y-4">
                <FiZap className="text-blue-200 mb-6" size={40} />
                <h3 className="text-xl font-black mb-4 uppercase italic tracking-wider">Visi Utama</h3>
                <p className="font-bold leading-relaxed">Menjadi perusahaan terpercaya dan profesional yang konsisten bertumbuh serta berkontribusi positif bagi bangsa dan negara.</p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={400}>
              <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-200 h-full hover:shadow-xl transition-all">
                <FiAward className="text-blue-600 mb-6" size={40} />
                <h3 className="text-xl font-black text-slate-900 mb-4 uppercase italic">Misi Kami</h3>
                <ul className="space-y-4">
                  {[
                    'Portofolio bisnis yang sehat & layanan terbaik',
                    'Pengembangan SDM & lingkungan kerja harmonis',
                    'Tata kelola korporasi (GCG) yang ekselen'
                  ].map((misi, i) => (
                    <li key={i} className="flex gap-3 text-sm font-bold text-slate-600 leading-snug">
                      <FiCheckCircle className="text-blue-500 shrink-0 mt-1" /> {misi}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* --- Subsidiaries Slider Section --- */}
<section className="py-24 px-6 bg-[#F8FAFC] overflow-hidden">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-20">
      <RevealOnScroll animationType="slide-up">
        <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">Ecosystem</span>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 tracking-tighter">Anak Perusahaan Kami</h2>
        <div className="w-20 h-1.5 bg-blue-600 mx-auto mt-6 rounded-full"></div>
      </RevealOnScroll>
    </div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-16"> 
  <Swiper
    modules={[Navigation, Pagination, Autoplay]}
    navigation={true}
    centeredSlides={true}
    loop={true}
    autoplay={{ delay: 5000, disableOnInteraction: false }}
    pagination={{ clickable: true, dynamicBullets: true }}
    spaceBetween={50} // Beri jarak lebih lebar agar tidak tabrakan saat zoom
    slidesPerView={1.2} 
    breakpoints={{
      640: { slidesPerView: 1.5 },
      1024: { slidesPerView: 2.2 } // PERBAIKAN: Gunakan 2.2 agar kartu tengah LEBAR
    }}
    className="pb-24 !overflow-visible subsidiary-swiper"
  >
    {anakPerusahaan.map((group, idx) => (
      <SwiperSlide key={idx} className="transition-all duration-500 py-10">
        {/* Padding kartu diperbesar (p-12 md:p-16) untuk kesan lebih luas */}
        <div className="card-content bg-white p-12 md:p-16 rounded-[3.5rem] border border-slate-100 shadow-sm transition-all duration-500 h-full flex flex-col items-center text-center">
          
          {/* PERBAIKAN LOGO: Container diperbesar (h-36 ke h-48) */}
          <div className="h-32 md:h-48 w-full flex items-center justify-center mb-12 px-4">
            <img 
              src={group.logo} 
              alt={group.name} 
              className="max-h-full w-auto object-contain transition-all duration-700 hover:scale-110" 
            />
          </div>
          
          <div className="flex-grow">
            <h4 className="font-black text-slate-900 mb-4 uppercase tracking-widest text-lg md:text-xl">
              {group.name}
            </h4>
            <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
              {group.desc}
            </p>
          </div>
          
          <div className="mt-8 w-16 h-1.5 bg-blue-600 rounded-full opacity-0 active-line transition-opacity duration-500"></div>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
</div>
  </div>
</section>

        {/* --- Leadership Section (Modern Grid) --- */}
        <section className="py-24 px-6 bg-slate-900 text-white rounded-[4rem] mx-4 mb-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-4 text-blue-500">Board of Leadership</h2>
              <div className="h-1.5 w-20 bg-white mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {team.map((member, index) => (
                <RevealOnScroll key={index} delay={index * 100} animationType="slide-up">
                  <div className="group text-center">
                    <div className="relative mb-6 mx-auto w-56 h-56 rounded-full overflow-hidden border-4 border-slate-800 transition-all duration-500 group-hover:border-blue-500 shadow-2xl">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                      <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <h3 className="text-xl font-black tracking-tight">{member.name}</h3>
                    <p className="text-blue-400 text-xs font-black uppercase tracking-widest mt-2">{member.role}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="py-20 px-6 bg-blue-600 text-center">
          <RevealOnScroll>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tighter uppercase italic">Membangun Masa Depan <br/> Bersama IMN Group</h2>
              <Link to="/contact" className="inline-block bg-white text-slate-900 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all shadow-2xl active:scale-95">
                Mulai Kemitraan Sekarang
              </Link>
            </div>
          </RevealOnScroll>
        </section>

      </main>
    </div>
  );
};

export default About;