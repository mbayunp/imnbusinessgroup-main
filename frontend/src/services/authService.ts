import axios from 'axios';
import Cookies from 'js-cookie';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = Cookies.get('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username: string, password: string) => {
  const response = await API.post('/auth/login', { username, password });
  if (response.data.token) {
    Cookies.set('jwtToken', response.data.token, { expires: 1, secure: true, sameSite: 'strict' });
    if (response.data.id) Cookies.set('userId', response.data.id.toString());
    if (response.data.role) Cookies.set('userRole', response.data.role);
  }
  return response.data;
};

export const logout = () => {
  Cookies.remove('jwtToken');
  Cookies.remove('userId');
  Cookies.remove('userRole');
  API.post('/auth/logout').catch(() => {}); 
};

export const getProfile = async () => {
  const token = Cookies.get('jwtToken');
  if (!token) return null;

  try {
    const response = await API.get('/auth/me');
    return response.data;
  } catch (error) {
    return null; 
  }
};

export const getPublicData = async (endpoint: string) => {
  const response = await API.get(endpoint);
  return response.data;
};

export const register = async (username: string, password: string, role: string) => {
  const response = await API.post('/auth/register', { 
    username, 
    password, 
    role 
  });
  return response.data;
};