import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getAllCareers, deleteCareer } from '../services/careerService';
import { Career } from '../types/career';
import { AxiosError } from 'axios';
import { 
  FiPlus, FiEdit2, FiTrash2, FiArrowLeft, FiExternalLink, 
  FiBriefcase, FiCalendar, FiAlertCircle, FiCheckCircle, FiLoader 
} from 'react-icons/fi';

const AdminCareerListPage: React.FC = () => {
  // --- STATES ---
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [careerToDeleteId, setCareerToDeleteId] = useState<string | null>(null);

  // --- ACTIONS ---
  const fetchCareers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCareers();
      setCareers(data);
    } catch (err: unknown) {
      let errorMessage = 'Gagal memuat lowongan.';
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  // Auto-hide success message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // --- HANDLERS ---
  const handleDeleteClick = (id: number) => {
    setCareerToDeleteId(id.toString());
    setShowDeleteConfirmModal(true);
  };

  const cancelDelete = () => {
    setCareerToDeleteId(null);
    setShowDeleteConfirmModal(false);
  };

  const confirmDelete = async () => {
    if (!careerToDeleteId) return; 

    setShowDeleteConfirmModal(false);
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await deleteCareer(careerToDeleteId);
      setMessage('Lowongan berhasil dihapus dari database.');
      setCareerToDeleteId(null);
      fetchCareers(); // Refresh data
    } catch (err: unknown) {
      let errorMessage = 'Gagal menghapus lowongan.';
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER HELPERS ---
  if (loading && careers.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <FiLoader className="animate-spin text-blue-600 text-4xl mb-4" />
          <p className="text-slate-500 font-medium tracking-wide">Sinkronisasi Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12 font-sans">
      {/* HEADER SECTION */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <NavLink
                to="/admin/dashboard"
                className="inline-flex items-center text-sm text-slate-400 hover:text-blue-600 transition-colors mb-1 group"
              >
                <FiArrowLeft className="mr-1 group-hover:-translate-x-1 transition-transform" /> 
                Kembali ke Dashboard
              </NavLink>
              <h1 className="text-2xl font-black text-slate-800 flex items-center tracking-tight">
                <FiBriefcase className="mr-3 text-blue-600" /> MANAJEMEN KARIR
              </h1>
            </div>
            
            <NavLink
              to="/admin/careers/add"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
            >
              <FiPlus className="mr-2 text-xl" /> Tambah Lowongan
            </NavLink>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8">
        {/* MESSAGES */}
        {message && (
          <div className="mb-6 flex items-center p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
            <FiCheckCircle className="mr-3 text-xl flex-shrink-0" />
            <span className="font-semibold">{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl">
            <FiAlertCircle className="mr-3 text-xl flex-shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* TABLE CARD */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {careers.length === 0 ? (
            <div className="py-24 text-center">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBriefcase className="text-slate-300 text-3xl" />
              </div>
              <h3 className="text-slate-800 font-bold text-lg">Belum Ada Lowongan</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">Database kosong. Silakan tambahkan lowongan kerja baru untuk ditampilkan di website.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-[0.15em] font-black border-b border-slate-100">
                    <th className="px-8 py-5">Informasi Posisi</th>
                    <th className="px-8 py-5">Tanggal Posting</th>
                    <th className="px-8 py-5 text-center">Status</th>
                    <th className="px-8 py-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {careers.map((career) => (
                    <tr key={career.id} className="group hover:bg-blue-50/30 transition-all">
                      <td className="px-8 py-6">
                        <div className="font-extrabold text-slate-700 text-lg group-hover:text-blue-700 transition-colors">{career.title}</div>
                        <div className="flex items-center text-xs mt-1 font-medium">
                          <a 
                            href={career.gFormLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 flex items-center hover:text-blue-700"
                          >
                            <FiExternalLink className="mr-1" /> Tinjau Google Form
                          </a>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center text-slate-500 text-sm font-medium">
                          <FiCalendar className="mr-2 text-slate-300" />
                          {new Date(career.postedDate).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black bg-emerald-100 text-emerald-600 uppercase tracking-widest">
                          PUBLISHED
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <NavLink
                            to={`/admin/careers/edit/${career.id}`}
                            className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:shadow-sm rounded-xl transition-all"
                            title="Edit"
                          >
                            <FiEdit2 size={16} />
                          </NavLink>
                          <button
                            onClick={() => handleDeleteClick(career.id)}
                            className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 hover:shadow-sm rounded-xl transition-all"
                            title="Hapus"
                          >
                            <FiTrash2 size={16} />
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl max-w-sm w-full transform animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="bg-red-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
              <FiTrash2 className="text-red-500 text-3xl" />
            </div>
            <h2 className="text-2xl font-black text-center text-slate-800 mb-2">Hapus Data?</h2>
            <p className="text-center text-slate-500 text-sm mb-10 leading-relaxed">
              Tindakan ini akan menghapus lowongan secara permanen dari website IMN.
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={confirmDelete}
                className="w-full py-4 rounded-2xl bg-red-600 text-white font-black hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95"
              >
                Ya, Hapus Permanen
              </button>
              <button
                onClick={cancelDelete}
                className="w-full py-4 rounded-2xl bg-slate-50 text-slate-500 font-bold hover:bg-slate-100 transition-all active:scale-95"
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCareerListPage;