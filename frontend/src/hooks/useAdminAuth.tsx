import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { getProfile, logout as authLogout } from '../services/authService';

interface UserProfile {
  id: number;
  username: string;
  role: string;
}

// 1. Definisi Tipe Context
interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginUser: () => Promise<void>;
  logoutUser: () => Promise<void>; // Pastikan ini ada!
  isAuthenticated: boolean;
  isAdmin: boolean;
  isHR: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const currentUser = await getProfile();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
      // Bersihkan cookie jika sesi tidak valid
      Cookies.remove('jwtToken');
      Cookies.remove('userId');
      Cookies.remove('userRole');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const loginUser = useCallback(async () => {
    setLoading(true);
    await fetchUser();
  }, [fetchUser]);

  // 2. Fungsi Logout
  const logoutUser = useCallback(async () => {
    try {
      await authLogout(); // Panggil API logout
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Hapus state dan cookie di frontend
      setUser(null);
      setLoading(false);
      Cookies.remove('jwtToken');
      Cookies.remove('userId');
      Cookies.remove('userRole');
    }
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isHR = user?.role === 'hr';

  return (
    // 3. BAGIAN KRUSIAL: Masukkan logoutUser ke sini!
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      loginUser, 
      logoutUser, // <--- WAJIB ADA. Jika ini hilang, dashboard akan error.
      isAuthenticated, 
      isAdmin, 
      isHR 
    }}>
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