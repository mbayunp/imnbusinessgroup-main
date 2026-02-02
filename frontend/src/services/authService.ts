// src/services/authService.ts
import axios from 'axios';

const API = axios.create({
  baseURL: '/api/auth', // Pastikan ini sesuai dengan settingan Proxy Vite
  withCredentials: true,
});

// PERBAIKAN: Login menerima username & password terpisah (supaya aman jika LoginPage kirim terpisah)
export const login = async (username: string, password: string) => {
  const response = await API.post('/login', { username, password });
  return response.data;
};

// PERBAIKAN UTAMA: Terima 3 parameter terpisah, lalu bungkus jadi object di sini
export const register = async (username: string, password: string, role: string) => {
  const response = await API.post('/register', { 
    username, 
    password, 
    role 
  });
  return response.data;
};

export const logout = async () => {
  const response = await API.post('/logout');
  return response.data;
};

export const getProfile = async () => {
  const response = await API.get('/me');
  return response.data;
};