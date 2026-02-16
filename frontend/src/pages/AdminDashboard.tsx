import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAdminAuth';
import { getCareerStats, CareerStats } from '../services/careerService';
import { getPressReleaseStats } from '../services/pressReleaseService';
import { PressReleaseStats } from '../types/pressRelease';
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

  // --- LOGIC LOGOUT ---
  const handleLogout = async () => {
    await logoutUser();
    navigate('/admin/login', { replace: true });
  };

  // Redirect otomatis jika tidak terautentikasi
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Fetch Data Logic
  const fetchContactMessages = async () => {
    try {
      const messages = await getAllContactMessages();
      // Sorting: Pesan terbaru di atas, dan yang belum dibaca di paling atas
      const formattedMessages = messages.map((msg: any) => ({
        ...msg,
        read: msg.status === 'read' || msg.read === true
      })).sort((a: any, b: any) => {
        if (a.read === b.read) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return a.read ? 1 : -1; 
      });
      
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
        setTotalAdmins(1); // Sementara hardcode, bisa diganti API call
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

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- Sidebar Navigation --- */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-white shadow-2xl z-50 flex flex-col transition-all duration-300">
        {/* Logo Area */}
        <div className="h-20 flex items-center px-8 border-b border-slate-800 bg-slate-950">
            <div className="flex items-center gap-3">
               <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <span className="font-black text-white text-lg">I</span>
               </div>
               <h1 className="text-xl font-bold tracking-tight text-white">
                  IMN <span className="text-blue-500 font-light">Admin</span>
               </h1>
            </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">
            <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Menu Utama</p>
          
          <NavLink to="/admin/dashboard" className={({ isActive }) => `flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Dashboard
          </NavLink>

          <NavLink to="/admin/careers" className={({ isActive }) => `flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.79 0-7.573-.42-11.372-1.745L2 13v4m6-4v4m6-4v4m6-4v4" /></svg>
            Lowongan Karir
          </NavLink>

          <NavLink to="/admin/press-releases" className={({ isActive }) => `flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10m-3-6l3 3m0 0l-3 3m3-3H9" /></svg>
            Rilis Pers
          </NavLink>

          {user && user.role === 'admin' && (
            <>
                <div className="pt-6 mt-6 border-t border-slate-800">
                    <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Pengaturan Sistem</p>
                    <NavLink to="/admin/register" className={({ isActive }) => `flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                    <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM12 18H8a2 2 0 00-2 2v1h12v-1a2 2 0 00-2-2z" /></svg>
                    Kelola Admin
                    </NavLink>
                </div>
            </>
          )}
        </nav>

        {/* User Profile Footer */}
       <div className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="flex items-center mb-4 px-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold uppercase shadow-lg ring-2 ring-slate-800">
                {user?.username.charAt(0)}
            </div>
            <div className="ml-3 overflow-hidden">
                <p className="text-sm font-bold text-white truncate w-32">{user?.username}</p>
                <p className="text-xs text-slate-400 capitalize bg-slate-800 px-2 py-0.5 rounded-full inline-block mt-0.5">{user?.role}</p>
            </div>
        </div>
        
        <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2.5
                      bg-red-500/10 border border-red-500/20
                      rounded-xl text-xs font-bold text-red-500
                      hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 group"
        >
            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Keluar Sistem
        </button>
    </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 ml-72 p-8 lg:p-12 overflow-y-auto h-screen">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Halo, {user?.username} 👋</h2>
                <p className="text-slate-500 mt-2 font-medium">Berikut adalah ringkasan aktivitas perusahaan hari ini.</p>
            </div>
            <div className="flex items-center space-x-4 bg-white p-2 pr-4 rounded-2xl shadow-sm border border-slate-100">
                 <div className="p-2 bg-blue-50 rounded-xl">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                 </div>
                 <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">{new Date().toLocaleDateString('id-ID', { weekday: 'long' })}</p>
                    <p className="text-xs text-slate-500 font-medium">{new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                 </div>
                 <div className="h-8 w-px bg-slate-200 mx-2"></div>
                 <NavLink to="/" target="_blank" className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
                    Lihat Website
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                 </NavLink>
            </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
             {/* Card 1: Lowongan */}
             <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.79 0-7.573-.42-11.372-1.745L2 13v4m6-4v4m6-4v4m6-4v4" /></svg>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-lg">
                        {careerStats.activeCareers} Aktif
                    </span>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Lowongan</p>
                    <h3 className="text-3xl font-black text-slate-800">{careerStats.totalCareers}</h3>
                </div>
            </div>

            {/* Card 2: Rilis Pers */}
            <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10m-3-6l3 3m0 0l-3 3m3-3H9" /></svg>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-purple-100 text-purple-700 rounded-lg">
                        Publikasi
                    </span>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Berita</p>
                    <h3 className="text-3xl font-black text-slate-800">{pressReleaseStats.totalPressReleases}</h3>
                </div>
            </div>

            {/* Card 3: Pesan Masuk */}
            <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer" onClick={() => document.getElementById('messages-section')?.scrollIntoView({ behavior: 'smooth'})}>
                <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    {contactMessages.filter(m => !m.read).length > 0 && (
                        <span className="text-xs font-bold px-2 py-1 bg-red-500 text-white rounded-lg animate-pulse">
                            {contactMessages.filter(m => !m.read).length} Baru
                        </span>
                    )}
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Kotak Masuk</p>
                    <h3 className="text-3xl font-black text-slate-800">{contactMessages.length}</h3>
                </div>
            </div>

             {/* Card 4: Admin */}
             <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                     <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg">
                        Admin
                    </span>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Pengguna Sistem</p>
                    <h3 className="text-3xl font-black text-slate-800">{totalAdmins}</h3>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                        <span className="bg-blue-100 p-1.5 rounded-lg mr-3">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </span>
                        Aksi Cepat
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                         <button onClick={() => navigate('/admin/careers/add')} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-blue-600 hover:text-white border border-transparent transition-all group duration-300">
                             <div className="flex items-center">
                                 <div className="h-10 w-10 rounded-full bg-white border border-slate-200 text-blue-600 flex items-center justify-center mr-4 group-hover:border-transparent group-hover:text-blue-600 transition-colors">
                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                 </div>
                                 <div className="text-left">
                                     <span className="block text-sm font-bold">Tambah Lowongan</span>
                                     <span className="text-xs text-slate-500 group-hover:text-blue-100">Buat postingan karir baru</span>
                                 </div>
                             </div>
                             <svg className="w-5 h-5 text-slate-400 group-hover:text-white transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                         </button>

                         <button onClick={() => navigate('/admin/press-releases/add')} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-purple-600 hover:text-white border border-transparent transition-all group duration-300">
                             <div className="flex items-center">
                                 <div className="h-10 w-10 rounded-full bg-white border border-slate-200 text-purple-600 flex items-center justify-center mr-4 group-hover:border-transparent group-hover:text-purple-600 transition-colors">
                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                 </div>
                                 <div className="text-left">
                                     <span className="block text-sm font-bold">Tulis Rilis Pers</span>
                                     <span className="text-xs text-slate-500 group-hover:text-purple-100">Publikasikan berita terbaru</span>
                                 </div>
                             </div>
                             <svg className="w-5 h-5 text-slate-400 group-hover:text-white transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                         </button>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="lg:col-span-2" id="messages-section">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center">
                             <span className="bg-orange-100 p-1.5 rounded-lg mr-3">
                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                             </span>
                            Pesan Masuk
                        </h3>
                        {contactMessages.filter(m => !m.read).length > 0 && (
                            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-red-200 shadow-lg">
                                {contactMessages.filter(m => !m.read).length} Belum Dibaca
                            </span>
                        )}
                    </div>
                    
                    <div className="flex-1 overflow-hidden">
                        {contactMessages.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center justify-center text-slate-400">
                                <div className="bg-slate-50 p-6 rounded-full mb-4">
                                     <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <p className="font-medium text-slate-500">Belum ada pesan masuk.</p>
                                <p className="text-sm">Pesan dari formulir kontak akan muncul di sini.</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {contactMessages.slice(0, 5).map((message) => (
                                    <li key={message.id} className={`p-4 hover:bg-blue-50/50 transition-colors cursor-pointer group ${!message.read ? 'bg-blue-50/30' : ''}`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start flex-1 min-w-0" onClick={() => handleViewDetail(message)}>
                                                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold mr-4 border-2 ${!message.read ? 'bg-white border-blue-200 text-blue-600' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                                                    {message.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className={`text-sm truncate mr-2 ${!message.read ? 'font-black text-slate-900' : 'font-semibold text-slate-700'}`}>
                                                            {message.name}
                                                            {!message.read && <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full align-middle"></span>}
                                                        </p>
                                                        <p className="text-xs text-slate-400 font-medium flex-shrink-0 bg-slate-50 px-2 py-1 rounded-md">
                                                            {new Date(message.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                    <p className={`text-sm mb-1 truncate ${!message.read ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>{message.subject}</p>
                                                    <p className="text-xs text-slate-400 truncate max-w-md">{message.message}</p>
                                                </div>
                                            </div>

                                            <div className="ml-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                 <button 
                                                    onClick={(e) => { e.stopPropagation(); confirmDelete(message.id); }}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Hapus Pesan"
                                                 >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                 </button>
                                                 <button 
                                                    onClick={(e) => { e.stopPropagation(); handleViewDetail(message); }}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Baca Detail"
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
                        <div className="p-4 border-t border-slate-100 text-center bg-slate-50">
                            <button className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline transition-all">
                                Lihat Semua Pesan ({contactMessages.length})
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {isDetailModalOpen && selectedMessage && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-0 max-w-2xl w-full shadow-2xl overflow-hidden animate-zoom-in">
              <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">Detail Pesan</h3>
                  <button onClick={closeDetailModal} className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
              </div>

              <div className="p-8">
                <div className="flex items-center mb-8 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                      <div className="h-14 w-14 rounded-2xl bg-white text-blue-600 flex items-center justify-center font-black text-xl mr-5 shadow-sm border border-blue-100">
                        {selectedMessage.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-0.5">Pengirim</p>
                          <h4 className="text-slate-900 font-bold text-lg">{selectedMessage.name}</h4>
                          <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 text-sm hover:underline">{selectedMessage.email}</a>
                      </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                         <div className="p-4 rounded-xl border border-slate-100">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wide flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                Waktu Masuk
                            </p>
                            <p className="text-sm font-semibold text-slate-800">{new Date(selectedMessage.createdAt).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</p>
                         </div>
                         <div className="p-4 rounded-xl border border-slate-100">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wide flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                Telepon
                            </p>
                            <p className="text-sm font-semibold text-slate-800">{selectedMessage.phone || '-'}</p>
                         </div>
                    </div>

                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-2">Subjek Pesan</p>
                        <p className="text-lg font-bold text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-100">{selectedMessage.subject}</p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-3">Isi Pesan</p>
                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">{selectedMessage.message}</p>
                    </div>
                </div>
              </div>

              <div className="bg-slate-50 px-8 py-5 flex justify-end space-x-4 border-t border-slate-100">
                 <button onClick={() => { confirmDelete(selectedMessage.id); }} className="px-5 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-all text-sm font-bold shadow-sm">
                    Hapus Pesan
                 </button>
                 <a href={`mailto:${selectedMessage.email}`} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-100 transition-all text-sm font-bold shadow-sm">
                    Balas Email
                 </a>
                 <button onClick={closeDetailModal} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 text-sm font-bold">
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
          message="Pesan ini akan dihapus permanen dan tidak dapat dikembalikan. Lanjutkan?"
          confirmText="Ya, Hapus Sekarang"
          cancelText="Batal"
        />
      </main>
    </div>
  );
};

export default AdminDashboard;