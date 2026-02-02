import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAdminAuth';
import { login } from '../services/authService';

const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { loginUser, isAuthenticated } = useAuth();

  // Redirect otomatis jika sudah login
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login(username, password);
      await loginUser(); // Update context
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Login gagal. Periksa username dan password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* --- Background Image dengan Overlay --- */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          backgroundImage: 'url("/imn-building2.png")', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      >
        {/* Overlay Gelap + Blur agar text kontras */}
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
      </div>

      {/* --- Tombol Kembali (Pojok Kiri Atas) --- */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-20 flex items-center text-white/80 hover:text-white transition-colors duration-200 group"
      >
        <div className="bg-white/10 p-2 rounded-full group-hover:bg-blue-600 transition-colors mr-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h14" /></svg>
        </div>
        <span className="font-medium text-sm">Kembali ke Website</span>
      </Link>

      {/* --- Card Login --- */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 border border-slate-200">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Admin Login</h1>
            <p className="text-slate-500 mt-2 text-sm">Masuk untuk mengelola konten IMN Business Group</p>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 flex items-center animate-pulse">
              <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="text-sm text-red-700 font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Username */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-800"
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-800"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Tombol Submit */}
            <button
              className={`w-full py-3 px-4 rounded-lg text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 
                ${isSubmitting 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                }`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Memproses...
                </div>
              ) : 'Masuk Dashboard'}
            </button>
          </form>

          {/* Footer Card: Alternatif Link ke Home */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
             <Link to="/" className="text-sm text-slate-500 hover:text-blue-600 transition-colors font-medium">
                &larr; Kembali ke Halaman Utama
             </Link>
          </div>

        </div>
        
        <p className="text-center text-slate-400 text-xs mt-6">
          &copy; {new Date().getFullYear()} IMN Business Group. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;