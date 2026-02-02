import React, { useEffect, useState } from 'react';
import { getAllPressReleases } from '../services/pressReleaseService';
import { PressRelease } from '../types/pressRelease';
import { AxiosError } from 'axios';
import RevealOnScroll from '../components/RevealOnScroll';
import { FiCalendar, FiArrowRight, FiX, FiFileText } from 'react-icons/fi';

const PersPage: React.FC = () => {
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPressRelease, setSelectedPressRelease] = useState<PressRelease | null>(null);

  const IMAGE_BASE_URL = 'https://imnbusinessgroup.co.id';

  useEffect(() => {
    const fetchPressReleases = async () => {
      try {
        const data = await getAllPressReleases();
        setPressReleases(data);
      } catch (err: unknown) {
        let errorMessage = 'Gagal mengambil data berita pers.';
        if (err instanceof AxiosError) {
          // Menangani error unauthorized jika rute masih terproteksi di backend
          if (err.response?.status === 401) {
            errorMessage = "Akses publik belum diizinkan. Pastikan rute backend sudah dibuka.";
          } else {
            errorMessage = err.response?.data?.message || err.message || errorMessage;
          }
        } else {
          errorMessage = (err as Error).message || errorMessage;
        }
        setError(errorMessage);
        console.error('Error fetching press releases:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPressReleases();
  }, []);

  const openDetailModal = (pressRelease: PressRelease) => {
    setSelectedPressRelease(pressRelease);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedPressRelease(null);
    setIsDetailModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Memuat Berita Pers...</p>
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
            <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">Corporate Updates</span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mt-4 tracking-tighter italic uppercase">
              Berita & <span className="text-blue-600">Rilis Pers</span>
            </h1>
            <div className="w-16 h-1.5 bg-blue-600 mx-auto mt-6 rounded-full"></div>
            <p className="mt-8 text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Temukan pembaruan strategis, laporan perkembangan, dan informasi penting terkini dari ekosistem IMN Business Group.
            </p>
          </RevealOnScroll>
        </div>

        {error ? (
          <div className="max-w-2xl mx-auto p-8 bg-red-50 border border-red-100 rounded-[2.5rem] text-red-700 text-center font-bold text-sm">
            Error: {error}
          </div>
        ) : pressReleases.length === 0 ? (
          <div className="text-center p-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
            <FiFileText className="mx-auto text-slate-300 mb-6" size={56} />
            <p className="text-lg font-black text-slate-400 uppercase tracking-[0.2em]">Belum ada rilis pers tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {pressReleases.map((pressRelease, index) => (
              <RevealOnScroll key={pressRelease.id} delay={index * 100} animationType="slide-up">
                <div
                  className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full cursor-pointer"
                  onClick={() => openDetailModal(pressRelease)}
                >
                  {/* Bagian Gambar */}
                  <div className="relative h-60 overflow-hidden bg-slate-100">
                    <img
                      src={pressRelease.imageUrl ? `${IMAGE_BASE_URL}${pressRelease.imageUrl}` : 'https://placehold.co/600x400?text=IMN+News'}
                      alt={pressRelease.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/600x400?text=Image+Not+Found';
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest rounded-lg text-blue-600 shadow-sm">
                        Official Release
                      </span>
                    </div>
                  </div>

                  {/* Konten Kartu */}
                  <div className="p-8 flex flex-col flex-grow">
                    <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-4 tracking-tight group-hover:text-blue-600 transition-colors uppercase italic leading-tight">
                      {pressRelease.title}
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                      {pressRelease.content}
                    </p>
                    
                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between text-slate-400">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                        <FiCalendar className="text-blue-500" />
                        {new Date(pressRelease.postedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      <span className="text-blue-600 font-black text-[10px] uppercase tracking-tighter flex items-center group-hover:gap-2 transition-all">
                        BACA SELENGKAPNYA <FiArrowRight />
                      </span>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        )}
      </main>

      {/* Modal Detail Premium */}
      {isDetailModalOpen && selectedPressRelease && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-fade-in" onClick={closeDetailModal}></div>
          
          <div className="relative bg-white rounded-[2.5rem] md:rounded-[3.5rem] max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-zoom-in">
            {/* Tombol Tutup */}
            <button
              onClick={closeDetailModal}
              className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-900 hover:bg-red-50 hover:text-red-600 transition-all shadow-lg"
            >
              <FiX size={24} />
            </button>

            {/* Bagian Gambar Modal */}
            <div className="md:w-5/12 bg-slate-100 shrink-0 h-64 md:h-auto overflow-hidden">
              <img
                src={selectedPressRelease.imageUrl ? `${IMAGE_BASE_URL}${selectedPressRelease.imageUrl}` : 'https://placehold.co/600x400?text=IMN+News'}
                alt={selectedPressRelease.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bagian Deskripsi Modal */}
            <div className="flex-1 p-8 md:p-14 overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-blue-600 font-black uppercase tracking-widest text-[10px] md:text-xs">Press Release</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                  <FiCalendar />
                  {new Date(selectedPressRelease.postedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
              
              <h3 className="text-2xl md:text-4xl font-black text-slate-900 mb-8 tracking-tighter uppercase italic leading-tight">
                {selectedPressRelease.title}
              </h3>
              
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium text-sm md:text-base whitespace-pre-line">
                {selectedPressRelease.content}
              </div>
              
              <div className="mt-12 pt-8 border-t border-slate-100">
                <p className="text-xs text-slate-400 italic">© {new Date().getFullYear()} IMN Business Group. Hak cipta dilindungi undang-undang.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersPage;