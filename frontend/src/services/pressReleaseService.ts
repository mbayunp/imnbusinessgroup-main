import axios from 'axios';
// Import interface dari file types agar sinkron
import { PressRelease, PressReleaseStats, PressReleasePayload } from '../types/pressRelease';

const API_URL = '/api/press-releases';

export const getPressReleases = async (): Promise<PressRelease[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getAllPressReleases = async (): Promise<PressRelease[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getPressReleaseById = async (id: string): Promise<PressRelease> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createPressRelease = async (data: PressReleasePayload): Promise<any> => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updatePressRelease = async (id: string, data: PressReleasePayload): Promise<any> => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deletePressRelease = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

export const getPressReleaseStats = async (): Promise<PressReleaseStats> => {
  try {
    const response = await axios.get(API_URL);
    
    const total = Array.isArray(response.data) ? response.data.length : 0;
    
    return { totalPressReleases: total };
  } catch (error) {
    console.error("Gagal menghitung statistik:", error);
    return { totalPressReleases: 0 };
  }
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await axios.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data; 
};