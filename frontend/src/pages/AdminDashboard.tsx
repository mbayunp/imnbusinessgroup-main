import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAdminAuth';
import { getCareerStats, CareerStats } from '../services/careerService';
import { getPressReleaseStats, PressReleaseStats } from '../services/pressReleaseService';
import { getAllContactMessages, deleteContactMessage, updateContactMessageStatus } from '../services/contactService';
import { ContactMessage } from '../types/contact';
import ConfirmationModal from '../components/ConfirmationModal';

const AdminDashboard: React.FC = () => {
  const { user, loading: authLoading, logoutUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [careerStats, setCareerStats] = useState<CareerStats>({ totalCareers: 0, activeCareers: 0 });
  const [pressReleaseStats, setPressReleaseStats] = useState<PressReleaseStats>({ totalPressReleases: 0 });
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  
  // Modal States
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [messageToDeleteId, setMessageToDeleteId] = useState<string | null>(null);

  // Fetch Data Logic
  const fetchContactMessages = async () => {
    try {
      const messages = await getAllContactMessages();
      // Mapping data backend (status) ke frontend (read boolean)
      const formattedMessages = messages.map((msg: any) => ({
        ...msg,
        read: msg.status === 'read' || msg.read === true
      }));
      setContactMessages(formattedMessages);
    } catch (err) {
      console.error("Gagal memuat pesan kontak", err);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const careers = await getCareerStats();
        setCareerStats(careers);
        const press = await getPressReleaseStats();
        setPressReleaseStats(press);
        setTotalAdmins(1); 
        fetchContactMessages();
      } catch (err) {
        console.error("Gagal memuat data dashboard", err);
      }
    };

    if (!authLoading && isAuthenticated) {
      fetchStats();
    }
  }, [authLoading, isAuthenticated]);

  // Handlers
  const handleMarkAsRead = async (messageId: number) => {
    try {
      await updateContactMessageStatus(messageId.toString(), true);
      setContactMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, read: true, status: 'read' } : msg));
    } catch (err) {
      console.error("Gagal update status pesan", err);
    }
  };

  const confirmDelete = (messageId: number) => {
    setMessageToDeleteId(messageId.toString());
    setIsDeleteConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (messageToDeleteId) {
      try {
        await deleteContactMessage(messageToDeleteId);
        setContactMessages(prev => prev.filter(msg => msg.id !== parseInt(messageToDeleteId!)));
        setIsDeleteConfirmModalOpen(false);
        setMessageToDeleteId(null);
        
        if (selectedMessage?.id === parseInt(messageToDeleteId)) {
            closeDetailModal();
        }
      } catch (err) {
        console.error("Gagal hapus pesan", err);
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmModalOpen(false);
    setMessageToDeleteId(null);
  };

  const handleViewDetail = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDetailModalOpen(true);
    if (!message.read) {
        handleMarkAsRead(message.id);
    }
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedMessage(null);
  };

  // --- Loading State ---
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-lg font-medium text-slate-600">Memuat Dashboard...</div>
        </div>
      </div>
    );
  }

  // --- Access Denied State ---
  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center border border-slate-200">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Akses Ditolak</h3>
          <p className="text-slate-500 mb-6">Sesi Anda telah berakhir atau Anda tidak memiliki izin.</p>
          <button
            onClick={() => logoutUser()}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white font-medium hover:bg-slate-800 transition-colors"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* --- Sidebar Navigation --- */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-white shadow-2xl z-50 flex flex-col transition-all duration-300">
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          {/* PERBAIKAN: Logo diperkecil (text-xl) */}
          <h1 className="text-xl font-bold tracking-wider text-blue-400">IMN<span className="text-white">ADMIN</span></h1>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu Utama</p>
          
          <NavLink to="/admin/dashboard" className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Dashboard
          </NavLink>

          <NavLink to="/admin/careers" className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.79 0-7.573-.42-11.372-1.745L2 13v4m6-4v4m6-4v4m6-4v4" /></svg>
            Lowongan Karir
          </NavLink>

          <NavLink to="/admin/press-releases" className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10m-3-6l3 3m0 0l-3 3m3-3H9" /></svg>
            Rilis Pers
          </NavLink>

          {user && user.role === 'admin' && (
            <>
                <div className="pt-4 mt-4 border-t border-slate-800">
                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pengaturan</p>
                    <NavLink to="/admin/register" className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM12 18H8a2 2 0 00-2 2v1h12v-1a2 2 0 00-2-2z" /></svg>
                    Tambah Admin
                    </NavLink>
                </div>
            </>
          )}
        </nav>

        <div className="p-4 bg-slate-800 border-t border-slate-700">
            <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                    {user?.username.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-white">{user?.username}</p>
                    <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                </div>
            </div>
            <button
                onClick={logoutUser}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-slate-200 bg-slate-700 hover:bg-red-600 hover:text-white transition-colors duration-200"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Keluar
            </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 ml-72 p-8">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-800">Selamat Datang, {user?.username} 👋</h2>
                <p className="text-slate-500 mt-1">Berikut adalah ringkasan aktivitas hari ini.</p>
            </div>
            <div className="flex items-center space-x-4">
                 <div className="text-right hidden md:block">
                    <p className="text-sm font-semibold text-slate-700">{new Date().toLocaleDateString('id-ID', { weekday: 'long' })}</p>
                    <p className="text-xs text-slate-500">{new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                 </div>
                 <NavLink to="/" className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    Lihat Website
                 </NavLink>
            </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Lowongan</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">{careerStats.totalCareers}</h3>
                    </div>
                    <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.79 0-7.573-.42-11.372-1.745L2 13v4m6-4v4m6-4v4m6-4v4" /></svg>
                    </div>
                </div>
                <div className="mt-4 flex items-center text-xs">
                     <span className="text-green-500 font-semibold bg-green-50 px-2 py-0.5 rounded-full">{careerStats.activeCareers} Aktif</span>
                     <span className="text-slate-400 ml-2">saat ini</span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Rilis Pers</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">{pressReleaseStats.totalPressReleases}</h3>
                    </div>
                    <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10m-3-6l3 3m0 0l-3 3m3-3H9" /></svg>
                    </div>
                </div>
                <div className="mt-4 text-xs text-slate-400">
                    Berita & Publikasi Perusahaan
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Pesan Masuk</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">{contactMessages.length}</h3>
                    </div>
                    <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                </div>
                <div className="mt-4 flex items-center text-xs">
                     <span className={`${contactMessages.filter(m => !m.read).length > 0 ? 'text-red-500 bg-red-50' : 'text-slate-500 bg-slate-50'} font-semibold px-2 py-0.5 rounded-full`}>
                        {contactMessages.filter(m => !m.read).length} Belum dibaca
                     </span>
                </div>
            </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Admin Terdaftar</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalAdmins}</h3>
                    </div>
                    <div className="h-12 w-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                </div>
                <div className="mt-4 text-xs text-slate-400">
                    Pengguna Akses Sistem
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        Aksi Cepat
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                         <button onClick={() => navigate('/admin/careers/add')} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all group">
                             <div className="flex items-center">
                                 <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                 </div>
                                 <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">Tambah Lowongan</span>
                             </div>
                             <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                         </button>

                         <button onClick={() => navigate('/admin/press-releases/add')} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-purple-50 hover:border-purple-200 border border-transparent transition-all group">
                             <div className="flex items-center">
                                 <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                 </div>
                                 <span className="text-sm font-medium text-slate-700 group-hover:text-purple-700">Tulis Rilis Pers</span>
                             </div>
                             <svg className="w-4 h-4 text-slate-400 group-hover:text-purple-500 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                         </button>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center">
                             <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                            Pesan & Masukan Terbaru
                        </h3>
                        {contactMessages.filter(m => !m.read).length > 0 && (
                            <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                                {contactMessages.filter(m => !m.read).length} Baru
                            </span>
                        )}
                    </div>
                    
                    <div className="flex-1 overflow-hidden">
                        {contactMessages.length === 0 ? (
                            <div className="p-10 text-center flex flex-col items-center justify-center text-slate-400">
                                <svg className="w-16 h-16 mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <p>Belum ada pesan masuk.</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-50">
                                {contactMessages.slice(0, 5).map((message) => (
                                    <li key={message.id} className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer group ${!message.read ? 'bg-blue-50/30' : ''}`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start flex-1 min-w-0" onClick={() => handleViewDetail(message)}>
                                                {/* PERBAIKAN: Menggunakan name.charAt(0) */}
                                                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${!message.read ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                                                    {message.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        {/* PERBAIKAN: Menggunakan message.name */}
                                                        <p className={`text-sm truncate mr-2 ${!message.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                                                            {message.name}
                                                            {!message.read && <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>}
                                                        </p>
                                                        <p className="text-xs text-slate-400 flex-shrink-0">
                                                            {new Date(message.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                                                        </p>
                                                    </div>
                                                    <p className={`text-sm mb-1 truncate ${!message.read ? 'text-slate-800' : 'text-slate-600'}`}>{message.subject}</p>
                                                    <p className="text-xs text-slate-500 truncate">{message.message}</p>
                                                </div>
                                            </div>

                                            <div className="ml-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                 <button 
                                                    onClick={(e) => { e.stopPropagation(); confirmDelete(message.id); }}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Hapus"
                                                 >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                 </button>
                                                 <button 
                                                    onClick={(e) => { e.stopPropagation(); handleViewDetail(message); }}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                    title="Lihat Detail"
                                                 >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                 </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                     {contactMessages.length > 5 && (
                        <div className="p-4 border-t border-slate-100 text-center">
                            <button className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
                                Lihat Semua Pesan
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* --- Modals --- */}
        {isDetailModalOpen && selectedMessage && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl p-0 max-w-lg w-full shadow-2xl overflow-hidden animate-fade-in-up">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800">Detail Pesan</h3>
                  <button onClick={closeDetailModal} className="text-slate-400 hover:text-slate-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
              </div>

              <div className="p-6">
                <div className="flex items-center mb-6">
                     {/* PERBAIKAN: Menggunakan name */}
                     <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg mr-4">
                        {selectedMessage.name.charAt(0).toUpperCase()}
                     </div>
                     <div>
                         {/* PERBAIKAN: Menggunakan name */}
                         <h4 className="text-slate-900 font-bold text-lg">{selectedMessage.name}</h4>
                         <p className="text-blue-600 text-sm">{selectedMessage.email}</p>
                     </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                         <div className="bg-slate-50 p-3 rounded-lg">
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Tanggal</p>
                            <p className="text-sm font-medium text-slate-800">{new Date(selectedMessage.createdAt).toLocaleString('id-ID')}</p>
                         </div>
                         <div className="bg-slate-50 p-3 rounded-lg">
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Telepon</p>
                            <p className="text-sm font-medium text-slate-800">{selectedMessage.phone || '-'}</p>
                         </div>
                    </div>

                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Subjek</p>
                        <p className="text-base font-semibold text-slate-900">{selectedMessage.subject}</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Isi Pesan</p>
                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
                    </div>
                </div>
              </div>

              <div className="bg-slate-50 px-6 py-4 flex justify-end space-x-3">
                 <button onClick={() => { confirmDelete(selectedMessage.id); }} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-sm font-medium">
                    Hapus Pesan
                 </button>
                 <button onClick={closeDetailModal} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium">
                    Tutup
                 </button>
              </div>
            </div>
          </div>
        )}

        <ConfirmationModal
          isOpen={isDeleteConfirmModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Hapus Pesan?"
          message="Tindakan ini tidak dapat dibatalkan. Pesan akan dihapus secara permanen dari database."
          confirmText="Ya, Hapus"
          cancelText="Batal"
        />
      </main>
    </div>
  );
};

export default AdminDashboard;