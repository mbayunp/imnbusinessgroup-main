import React, { useEffect, useState } from 'react';
import { getAllCareers } from '../services/careerService';
import { Career } from '../types/career';
import { AxiosError } from 'axios';
import RevealOnScroll from '../components/RevealOnScroll';
import { FiBriefcase, FiCalendar, FiArrowRight, FiX, FiMapPin } from 'react-icons/fi';

const Careers: React.FC = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);

  const IMAGE_BASE_URL = 'https://imnbusinessgroup.co.id';

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const data = await getAllCareers();
        setCareers(data);
      } catch (err: unknown) {
        let errorMessage = 'Gagal mengambil data lowongan.';
        if (err instanceof AxiosError) {
          // Jika masih 401, berikan pesan instruksi untuk cek backend
          if (err.response?.status === 401) {
            errorMessage = "Akses Publik belum diizinkan oleh server (401).";
          } else {
            errorMessage = err.response?.data?.message || err.message || errorMessage;
          }
        }
        setError(errorMessage);
        console.error('Error fetching careers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCareers();
  }, []);

  const openDetailModal = (career: Career) => {
    setSelectedCareer(career);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedCareer(null);
    setIsDetailModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Memuat Peluang Karir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-blue-100 overflow-x-hidden">
      <main className="max-w-7xl mx-auto pt-32 pb-24 px-5 md:px-6">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <RevealOnScroll animationType="slide-up">
            <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">Career Path</span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mt-4 tracking-tighter italic uppercase">
              Join Our <span className="text-blue-600">Dream Team</span>
            </h1>
            <div className="w-16 h-1.5 bg-blue-600 mx-auto mt-6 rounded-full"></div>
          </RevealOnScroll>
        </div>

        {error ? (
          <div className="max-w-2xl mx-auto p-8 bg-red-50 border border-red-100 rounded-[2rem] text-red-700 text-center font-bold text-sm">
            {error}
          </div>
        ) : careers.length === 0 ? (
          <div className="text-center p-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
            <FiBriefcase className="mx-auto text-slate-300 mb-6" size={56} />
            <p className="text-lg font-black text-slate-400 uppercase tracking-[0.2em]">Belum ada lowongan tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {careers.map((career, index) => (
              <RevealOnScroll key={career.id} delay={index * 100} animationType="slide-up">
                <div
                  className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full cursor-pointer"
                  onClick={() => openDetailModal(career)}
                >
                  <div className="relative h-60 overflow-hidden bg-slate-100">
                    <img
                      src={career.imageUrl ? `${IMAGE_BASE_URL}${career.imageUrl}` : 'https://placehold.co/600x400?text=IMN+Career'}
                      alt={career.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest rounded-lg text-blue-600 shadow-sm">
                        Hiring Now
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight group-hover:text-blue-600 transition-colors uppercase italic">
                      {career.title}
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                      {career.description}
                    </p>
                    
                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between text-slate-400">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                        <FiCalendar className="text-blue-500" />
                        {new Date(career.postedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <span className="text-blue-600 font-black text-[10px] uppercase tracking-tighter flex items-center group-hover:gap-2 transition-all">
                        VIEW DETAIL <FiArrowRight />
                      </span>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        )}
      </main>

      {/* --- Modal Detail --- */}
      {isDetailModalOpen && selectedCareer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={closeDetailModal}></div>
          
          <div className="relative bg-white rounded-[2.5rem] md:rounded-[3.5rem] max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in duration-300">
            <button
              onClick={closeDetailModal}
              className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-900 hover:text-red-600 transition-all shadow-lg"
            >
              <FiX size={24} />
            </button>

            {/* Image Section */}
            <div className="md:w-5/12 bg-slate-200 shrink-0 h-64 md:h-auto overflow-hidden">
              <img
                src={selectedCareer.imageUrl ? `${IMAGE_BASE_URL}${selectedCareer.imageUrl}` : 'https://placehold.co/600x400?text=IMN+Career'}
                alt={selectedCareer.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Description Section */}
            <div className="flex-1 p-8 md:p-14 overflow-y-auto">
              <span className="text-blue-600 font-black uppercase tracking-widest text-[10px] md:text-xs">Job Details</span>
              <h3 className="text-3xl md:text-5xl font-black text-slate-900 mt-2 mb-8 tracking-tighter uppercase italic leading-tight">
                {selectedCareer.title}
              </h3>
              
              <div className="mb-10 text-slate-600 leading-relaxed font-medium text-sm md:text-base whitespace-pre-line">
                {selectedCareer.description}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={selectedCareer.gFormLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95"
                >
                  Apply Now <FiArrowRight className="ml-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;