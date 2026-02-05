import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { register } from '../services/authService';
import { useAuth } from '../hooks/useAdminAuth';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';

const RegisterPage: React.FC = () => {
  // State untuk Form Registrasi
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('hr');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // State untuk PIN Keamanan
  const [pinInput, setPinInput] = useState('');
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { loginUser } = useAuth();
  
  // --- KONFIGURASI PIN ---
  const SECRET_PIN = '012301';

  // Handler untuk Verifikasi PIN
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === SECRET_PIN) {
      setIsPinVerified(true);
      setPinError(null);
    } else {
      setPinError('PIN Akses salah! Silakan coba lagi.');
      setPinInput(''); // Reset input jika salah
    }
  };

  // Handler untuk Registrasi (Kode Asli)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userData = await register(username, password, role);
      console.log('Registration successful:', userData);

      Cookies.set('jwtToken', userData.token, { expires: 1/24 });
      Cookies.set('userId', userData.id.toString(), { expires: 7 });
      Cookies.set('userRole', userData.role, { expires: 7 });

      await loginUser();
      navigate('/admin/dashboard');
    } catch (err: unknown) {
      let errorMessage = 'Failed to register. Please try again.';
      if (err instanceof AxiosError) {
        errorMessage = (err.response?.data as { message?: string })?.message || err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
      console.error('Registration failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER LAYOUT UTAMA ---
  return (
    <div
      className="flex min-h-screen w-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: 'url("/imn-building2.png")' }}
    >
      {/* KONDISI 1: JIKA PIN BELUM TERVERIFIKASI 
         Tampilkan Form PIN
      */}
      {!isPinVerified ? (
        <div className="w-full max-w-sm rounded-xl bg-white bg-opacity-95 p-8 shadow-2xl backdrop-blur-sm border border-slate-200">
           <div className="flex justify-center mb-6">
             <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
             </div>
           </div>
           
           <h2 className="mb-2 text-center text-2xl font-bold text-slate-800">Akses Terbatas</h2>
           <p className="mb-6 text-center text-sm text-slate-500">Halaman ini khusus untuk pendaftaran internal. Masukkan PIN untuk melanjutkan.</p>

           <form onSubmit={handlePinSubmit}>
             <div className="mb-5">
               <input
                 type="password"
                 className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-center text-xl tracking-widest text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                 value={pinInput}
                 onChange={(e) => setPinInput(e.target.value)}
                 placeholder="------"
                 maxLength={6}
                 autoFocus
               />
             </div>
             
             {pinError && (
               <div className="mb-4 text-center text-sm text-red-600 font-medium animate-pulse">
                 {pinError}
               </div>
             )}

             <button
               type="submit"
               className="w-full rounded-lg bg-slate-800 px-6 py-3 text-white font-bold hover:bg-slate-900 transition-all"
             >
               Buka Akses
             </button>

             <div className="mt-6 text-center">
                <NavLink to="/" className="text-sm text-gray-500 hover:text-blue-600">
                   Kembali ke Beranda
                </NavLink>
             </div>
           </form>
        </div>
      ) : (
        /* KONDISI 2: JIKA PIN BENAR 
           Tampilkan Form Registrasi Asli 
        */
        <div className="w-full max-w-md rounded-xl bg-white bg-opacity-90 p-8 shadow-2xl backdrop-blur-sm border border-blue-200 animate-in fade-in zoom-in duration-300">
          <div className="flex justify-end mb-4">
            <NavLink
              to="/"
              className="flex items-center text-gray-600 hover:text-blue-700 font-semibold transition-colors"
            >
              <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l7-7 7 7M19 10v10a1 1 0 01-1 1h-3" /></svg>
              Kembali ke Beranda
            </NavLink>
          </div>

          <h2 className="mb-8 text-center text-4xl font-extrabold text-blue-800">Registrasi Admin/HR</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="Masukkan username"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Masukkan password"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="role" className="mb-2 block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="hr">HR</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-red-100 p-4 text-sm text-red-700 font-medium border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              className={`w-full rounded-lg bg-blue-600 px-6 py-3 text-white font-bold text-lg hover:bg-blue-700 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ${
                loading ? 'cursor-not-allowed opacity-70' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Mendaftar...' : 'Daftar'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;