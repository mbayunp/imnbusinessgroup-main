import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { register } from '../services/authService';
import { useAuth } from '../hooks/useAdminAuth';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('hr'); // Default role
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

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

  return (
    <div
      className="flex min-h-screen w-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: 'url("/imn-building2.png")' }}
    >
      <div className="w-full max-w-md rounded-xl bg-white bg-opacity-90 p-8 shadow-2xl backdrop-blur-sm border border-blue-200">
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
            className={`w-full rounded-lg bg-blue-600 px-6 py-3 text-black font-bold text-lg hover:bg-blue-700 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ${
              loading ? 'cursor-not-allowed opacity-70' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Mendaftar...' : 'Daftar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;