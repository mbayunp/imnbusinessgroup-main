// src/hooks/useAdminAuth.ts
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { getProfile, logout as authLogout } from '../services/authService'; // Import getProfile dan logout

interface UserProfile {
  id: number;
  username: string;
  role: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginUser: () => Promise<void>;
  logoutUser: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isHR: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = Cookies.get('jwtToken');
    const storedUserId = Cookies.get('userId');
    const storedUserRole = Cookies.get('userRole');

    if (token && storedUserId && storedUserRole) {
      try {
        const currentUser = await getProfile(); // Memanggil API /auth/me
        // Pastikan ID dan role dari API cocok dengan cookie
        if (currentUser.id.toString() === storedUserId && currentUser.role === storedUserRole) {
          setUser(currentUser);
        } else {
          // Jika token valid tapi data user tidak cocok, mungkin token kadaluarsa atau user berubah di DB
          authLogout(); // Logout paksa dari cookie
          setUser(null);
        }
      } catch (error) {
        // Jika getProfile gagal (misal 401 Unauthorized), itu berarti token tidak valid
        console.error('Failed to fetch user profile, likely no active session or invalid token:', error);
        authLogout(); // Hapus cookie dan logout user
        setUser(null);
      }
    } else {
      // Tidak ada token di cookie, atau tidak lengkap
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser(); // Panggil saat komponen mount
  }, [fetchUser]);

  const loginUser = useCallback(async () => {
    setLoading(true);
    // Setelah login/register, token dan user ID/role sudah di cookie
    // Panggil fetchUser untuk memuat ulang status user dari cookie/API
    await fetchUser();
  }, [fetchUser]);

  const logoutUser = useCallback(() => {
    authLogout(); // Panggil fungsi logout dari authService
    setUser(null);
    setLoading(false);
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isHR = user?.role === 'hr';

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, isAuthenticated, isAdmin, isHR }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};