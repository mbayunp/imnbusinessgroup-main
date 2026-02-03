import api from './api'; // Pastikan ini mengarah ke instance axios yang punya interceptor
import { Career, CareerPayload } from '../types/career';
import { AxiosError } from 'axios';

// --- Interface Khusus ---
export interface CareerStats {
  totalCareers: number;
  activeCareers: number;
}

// --- Helper: Error Handler Terpusat ---
// Ini membersihkan kode agar tidak perlu menulis if (axiosError) berulang kali
const handleError = (error: unknown, defaultMessage: string): never => {
  let errorMessage = defaultMessage;
  
  if (error instanceof AxiosError) {
    // Coba ambil pesan dari backend (response.data.message), kalau tidak ada pakai pesan error axios standar
    errorMessage = (error.response?.data as { message?: string })?.message || error.message;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  
  console.error(`Service Error: ${errorMessage}`, error); // Log untuk debugging developer
  throw errorMessage; // Lempar pesan error string ke komponen
};

// --- Services ---

const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await api.post<{ imageUrl: string }>('/upload', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
      },
    });
    // Mengembalikan URL gambar dari backend
    return response.data.imageUrl;
  } catch (error) {
    throw handleError(error, "Gagal mengunggah gambar.");
  }
};

const getAllCareers = async (): Promise<Career[]> => {
  try {
    const response = await api.get<Career[]>('/careers');
    // Safety check: Pastikan yang dikembalikan adalah array, jika tidak return array kosong
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    throw handleError(error, "Gagal memuat daftar lowongan.");
  }
};

const getCareerById = async (id: string): Promise<Career> => {
  try {
    const response = await api.get<Career>(`/careers/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error, "Gagal memuat detail lowongan.");
  }
};

const createCareer = async (careerData: CareerPayload): Promise<Career> => {
  try {
    const response = await api.post<Career>('/careers', careerData);
    return response.data;
  } catch (error) {
    throw handleError(error, "Gagal membuat lowongan baru.");
  }
};

const updateCareer = async (id: string, careerData: CareerPayload): Promise<Career> => {
  try {
    const response = await api.put<Career>(`/careers/${id}`, careerData);
    return response.data;
  } catch (error) {
    throw handleError(error, "Gagal memperbarui lowongan.");
  }
};

const deleteCareer = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await api.delete<{ message: string }>(`/careers/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error, "Gagal menghapus lowongan.");
  }
};

const getCareerStats = async (): Promise<CareerStats> => {
  try {
    // Catatan: Pastikan route backend '/careers/stats' didefinisikan SEBELUM '/careers/:id'
    // agar 'stats' tidak dianggap sebagai ID.
    const response = await api.get<CareerStats>('/careers/stats');
    
    return {
      totalCareers: response.data.totalCareers || 0,
      activeCareers: response.data.activeCareers || 0
    };
  } catch (error) {
    // Jika endpoint stats belum ada, kembalikan nilai default agar dashboard tidak error total
    console.warn("Gagal load stats, menggunakan default 0", error);
    return { totalCareers: 0, activeCareers: 0 };
  }
};

export {
  getAllCareers,
  getCareerById,
  createCareer,
  updateCareer,
  deleteCareer,
  uploadImage,
  getCareerStats,
};