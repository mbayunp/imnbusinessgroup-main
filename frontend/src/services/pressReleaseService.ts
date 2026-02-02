import axios from 'axios';

const API_URL = '/api/press-releases';

export interface PressRelease {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  postedDate: string;
  createdBy?: number;
}

export interface PressReleaseStats {
  totalPressReleases: number;
}

export const getPressReleases = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getPressReleaseById = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createPressRelease = async (data: { title: string; content: string; imageUrl?: string }) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updatePressRelease = async (id: string, data: { title?: string; content?: string; imageUrl?: string }) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deletePressRelease = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await axios.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data; // Mengembalikan URL gambar
};

export const getPressReleaseStats = async () => {
  const response = await axios.get(`${API_URL}/stats/count`);

  return response.data; 
};