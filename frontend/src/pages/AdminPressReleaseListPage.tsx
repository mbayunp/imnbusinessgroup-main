import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getAllPressReleases, deletePressRelease } from '../services/pressReleaseService';
import { AxiosError } from 'axios';
import { 
  FiPlus, FiEdit2, FiTrash2, FiArrowLeft, 
  FiFileText, FiCalendar, FiAlertCircle, FiCheckCircle, FiLoader, FiSearch, FiImage
} from 'react-icons/fi';
import { PressRelease } from '../types/pressRelease';

const AdminPressReleaseListPage: React.FC = () => {
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [pressReleaseToDeleteId, setPressReleaseToDeleteId] = useState<string | null>(null);

  const fetchPressReleases = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllPressReleases();
      setPressReleases(data);
    } catch (err: unknown) {
      let errorMessage = 'Gagal memuat daftar berita pers.';
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPressReleases();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleDeleteClick = (id: number) => {
    setPressReleaseToDeleteId(id.toString());
    setShowDeleteConfirmModal(true);
  };

  const cancelDelete = () => {
    setPressReleaseToDeleteId(null);
    setShowDeleteConfirmModal(false);
  };

  const confirmDelete = async () => {
    if (!pressReleaseToDeleteId) return;
    setShowDeleteConfirmModal(false);
    setLoading(true);
    try {
      await deletePressRelease(pressReleaseToDeleteId);
      setMessage('Berita pers berhasil dihapus secara permanen.');
      setPressReleaseToDeleteId(null);
      fetchPressReleases();
    } catch (err: unknown) {
      setError('Gagal menghapus berita pers. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const filteredReleases = pressReleases.filter(release => 
    release.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && pressReleases.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center">
          <FiLoader className="animate-spin text-indigo-600 text-4xl mb-4" />
          <p className="text-slate-500 font-semibold tracking-wide animate-pulse">Menyingkronkan Berita...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* HEADER */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 transition-all">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <NavLink
                to="/admin/dashboard"
                className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-indigo-600 transition-all mb-1 group uppercase tracking-widest"
              >
                <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
                Dashboard
              </NavLink>
              <h1 className="text-3xl font-black text-slate-900 flex items-center tracking-tight">
                <span className="w-2 h-8 bg-indigo-600 rounded-full mr-3 hidden md:block"></span>
                Rilis Pers
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="relative hidden lg:block">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Cari berita..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 w-64 transition-all"
                  />
               </div>
               <NavLink
                to="/admin/press-releases/add"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-white font-bold hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95 shadow-lg shadow-indigo-100"
              >
                <FiPlus className="mr-2 text-xl" /> <span className="hidden sm:inline">Tambah Baru</span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8">
        {/* TOASTS */}
        {message && (
          <div className="mb-6 flex items-center p-4 bg-white border-l-4 border-emerald-500 shadow-sm rounded-r-2xl animate-in slide-in-from-right duration-500">
            <div className="bg-emerald-100 p-2 rounded-lg mr-4"><FiCheckCircle className="text-emerald-600 text-xl" /></div>
            <span className="font-bold text-slate-700">{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center p-4 bg-white border-l-4 border-red-500 shadow-sm rounded-r-2xl">
            <div className="bg-red-100 p-2 rounded-lg mr-4"><FiAlertCircle className="text-red-600 text-xl" /></div>
            <span className="font-bold text-slate-700">{error}</span>
          </div>
        )}

        {/* TABLE */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
          {filteredReleases.length === 0 ? (
            <div className="py-32 text-center">
              <div className="bg-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiFileText className="text-indigo-400 text-4xl" />
              </div>
              <h3 className="text-slate-900 font-black text-xl">Belum ada rilis pers</h3>
              <p className="text-slate-400 mt-2 max-w-xs mx-auto font-medium leading-relaxed">Mulai buat rilis pers pertama Anda dengan menekan tombol Tambah Baru di atas.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-slate-100">
                    <th className="px-10 py-6">Visual</th> {/* KOLOM VISUAL */}
                    <th className="px-10 py-6">Informasi Berita</th>
                    <th className="px-10 py-6">Status & Waktu</th>
                    <th className="px-10 py-6 text-right">Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredReleases.map((release) => (
                    <tr key={release.id} className="group hover:bg-slate-50/80 transition-all duration-300">
                      
                      {/* KOLOM THUMBNAIL */}
                      <td className="px-10 py-7 w-32">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm relative">
                          {release.imageUrl ? (
                            <img 
                              src={release.imageUrl} 
                              alt="Thumbnail" 
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image'; }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <FiImage size={24} />
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-10 py-7">
                        <div className="max-w-md">
                          <div className="font-bold text-slate-800 text-lg group-hover:text-indigo-700 transition-colors leading-tight mb-1 truncate">
                            {release.title}
                          </div>
                          <div className="flex items-center text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                            Publikasi Resmi
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-7">
                        <div className="flex flex-col gap-2">
                           <div className="flex items-center text-slate-500 text-sm font-semibold">
                             <FiCalendar className="mr-2 text-slate-300" />
                             {new Date(release.postedDate).toLocaleDateString('id-ID', {
                               day: 'numeric', month: 'short', year: 'numeric'
                             })}
                           </div>
                           <span className="w-fit px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-600 border border-emerald-200 uppercase tracking-tighter">
                             Published
                           </span>
                        </div>
                      </td>
                      <td className="px-10 py-7 text-right">
                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                          <NavLink
                            to={`/admin/press-releases/edit/${release.id}`}
                            className="p-3 bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-xl rounded-2xl transition-all"
                            title="Edit Berita"
                          >
                            <FiEdit2 size={18} />
                          </NavLink>
                          <button
                            onClick={() => handleDeleteClick(release.id)}
                            className="p-3 bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 hover:shadow-xl rounded-2xl transition-all"
                            title="Hapus Berita"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* DELETE MODAL */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300 px-6">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl max-w-sm w-full transform animate-in zoom-in-95 duration-200 border border-white">
            <div className="bg-red-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 rotate-3 shadow-inner">
              <FiTrash2 className="text-red-500 text-4xl" />
            </div>
            <h2 className="text-2xl font-black text-center text-slate-900 mb-3 tracking-tight leading-tight">Hapus Berita?</h2>
            <p className="text-center text-slate-500 text-sm mb-10 font-medium leading-relaxed">
              Tindakan ini permanen. Data berita <span className="font-bold text-slate-800 tracking-tight italic">"{searchTerm || 'ini'}"</span> tidak dapat dipulihkan kembali.
            </p>
            <div className="grid grid-cols-2 gap-4">
               <button onClick={cancelDelete} className="py-4 rounded-2xl bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 transition-all active:scale-95 text-sm">Batal</button>
               <button onClick={confirmDelete} className="py-4 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95 text-sm">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPressReleaseListPage;