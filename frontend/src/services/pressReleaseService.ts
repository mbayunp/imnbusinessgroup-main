import api from './api';
import { PressRelease, PressReleasePayload } from '../types/pressRelease';
import { AxiosError } from 'axios';

// --- HELPER ERROR ---
const handleError = (error: unknown, defaultMessage: string): never => {
  let errorMessage = defaultMessage;
  if (error instanceof AxiosError) {
    errorMessage = (error.response?.data as { message?: string })?.message || error.message;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  console.error(`Service Error: ${errorMessage}`, error);
  throw errorMessage;
};

// --- SERVICES ---

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    // Backend mengembalikan: { message: "...", imageUrl: "http://..." }
    const response = await api.post<{ imageUrl: string }>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    // ❌ SALAH (Penyebab Error): return response.data; 
    // ✅ BENAR: Ambil properti .imageUrl nya saja
    return response.data.imageUrl; 

  } catch (error) {
    throw handleError(error, "Gagal mengunggah gambar.");
  }
};

export const getAllPressReleases = async (): Promise<PressRelease[]> => {
  try {
    const response = await api.get<PressRelease[]>('/press-releases');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    throw handleError(error, "Gagal memuat daftar berita.");
  }
};

export const getPressReleaseById = async (id: string): Promise<PressRelease> => {
  try {
    const response = await api.get<PressRelease>(`/press-releases/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error, "Gagal memuat detail berita.");
  }
};

export const createPressRelease = async (data: PressReleasePayload): Promise<PressRelease> => {
  try {
    const response = await api.post<PressRelease>('/press-releases', data);
    return response.data;
  } catch (error) {
    throw handleError(error, "Gagal membuat berita baru.");
  }
};

export const updatePressRelease = async (id: string, data: PressReleasePayload): Promise<PressRelease> => {
  try {
    const response = await api.put<PressRelease>(`/press-releases/${id}`, data);
    return response.data;
  } catch (error) {
    throw handleError(error, "Gagal memperbarui berita.");
  }
};

export const deletePressRelease = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await api.delete<{ message: string }>(`/press-releases/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error, "Gagal menghapus berita.");
  }
};

// Pastikan endpoint stats di backend sudah benar (/press-releases/stats)
export const getPressReleaseStats = async (): Promise<{ totalPressReleases: number }> => {
    try {
        const response = await api.get<{ totalPressReleases: number }>('/press-releases/stats');
        return response.data;
    } catch (error) {
        console.warn("Gagal load stats", error);
        return { totalPressReleases: 0 };
    }
};