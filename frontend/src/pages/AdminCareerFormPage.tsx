import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
// Pastikan uploadImage diimport dari service yang sudah diperbaiki di atas
import { createCareer, getCareerById, updateCareer, uploadImage } from '../services/careerService';
import { Career, CareerPayload } from '../types/career';
import { AxiosError } from 'axios';
import { 
  FiArrowLeft, FiBriefcase, FiLink, FiType, 
  FiImage, FiUploadCloud, FiCheckCircle, FiAlertCircle, FiLoader, FiX 
} from 'react-icons/fi';

const AdminCareerFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gFormLink, setGFormLink] = useState('');
  
  // State Gambar
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  // State UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formType, setFormType] = useState<'add' | 'edit'>('add');

  // Load Data jika Edit Mode
  useEffect(() => {
    if (id) {
      setFormType('edit');
      const fetchCareer = async () => {
        setLoading(true);
        try {
          const career: Career = await getCareerById(id);
          setTitle(career.title);
          setDescription(career.description);
          setGFormLink(career.gFormLink);
          
          if (career.imageUrl) {
            setExistingImageUrl(career.imageUrl);
            setImagePreview(career.imageUrl);
          }
        } catch (err) {
          setError('Gagal memuat data lowongan.');
        } finally {
          setLoading(false);
        }
      };
      fetchCareer();
    }
  }, [id]);

  // Handle Pilih File Gambar
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validasi ukuran (Max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("Ukuran gambar terlalu besar (Maksimal 2MB)");
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); 
      setExistingImageUrl(null); 
      setError(null);
    }
  };

  // Handle Hapus Gambar
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(null);
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    let finalImageUrl: string | undefined = undefined;

    try {
      // 1. Upload Gambar Dulu (Jika ada file baru)
      if (imageFile) {
        // console.log("Mulai upload gambar..."); // Debugging
        
        // Panggil service uploadImage
        finalImageUrl = await uploadImage(imageFile);
        
        // console.log("Gambar berhasil diupload, URL:", finalImageUrl); // Debugging
      } else if (existingImageUrl) {
        // Jika tidak ada upload baru, gunakan URL lama
        finalImageUrl = existingImageUrl;
      }

      // 2. Siapkan Payload
      const careerData: CareerPayload = {
        title,
        description,
        gFormLink,
        // Pastikan field ini tidak undefined. Kirim string kosong jika tidak ada gambar.
        imageUrl: finalImageUrl || '', 
      };

      // 3. Kirim Data Lowongan ke Backend
      if (formType === 'add') {
        await createCareer(careerData);
        setSuccessMessage('Lowongan berhasil diterbitkan!');
      } else {
        await updateCareer(id!, careerData);
        setSuccessMessage('Perubahan berhasil disimpan!');
      }

      // 4. Redirect kembali ke list
      setTimeout(() => navigate('/admin/careers'), 1500);

    } catch (err: unknown) {
      console.error("Submit Error:", err);
      let errorMessage = 'Terjadi kesalahan sistem saat menyimpan data.';
      
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* HEADER SECTION */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <NavLink to="/admin/careers" className="inline-flex items-center text-sm text-slate-400 hover:text-blue-600 transition-colors mb-1 group">
              <FiArrowLeft className="mr-1 group-hover:-translate-x-1 transition-transform" /> Kembali ke Daftar
            </NavLink>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center">
              <FiBriefcase className="mr-3 text-blue-600" />
              {formType === 'add' ? 'BUAT LOWONGAN BARU' : 'EDIT LOWONGAN KERJA'}
            </h1>
          </div>
        </div>
      </div>

      {/* FORM BODY */}
      <div className="max-w-4xl mx-auto w-full px-6 py-10 flex-1">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                  <FiType className="mr-2 text-blue-500" /> Detail Informasi
                </h3>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Judul Posisi</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-700"
                      placeholder="Contoh: Senior UI/UX Designer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Deskripsi Pekerjaan</label>
                    <textarea
                      rows={8}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-700"
                      placeholder="Jelaskan kualifikasi, tanggung jawab, dan keuntungan..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                  <FiLink className="mr-2 text-emerald-500" /> Jalur Pendaftaran
                </h3>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Link Google Form</label>
                  <div className="relative">
                    <FiLink className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      type="url"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-700"
                      placeholder="https://forms.gle/..."
                      value={gFormLink}
                      onChange={(e) => setGFormLink(e.target.value)}
                      required
                    />
                  </div>
                  <p className="mt-3 text-[11px] text-slate-400 leading-relaxed italic">
                    *Pastikan link dimulai dengan https://forms.gle/
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Media Upload */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                  <FiImage className="mr-2 text-purple-500" /> Visual Banner
                </h3>
                
                <div className="relative group">
                  {imagePreview ? (
                    <div className="relative rounded-2xl overflow-hidden shadow-inner border border-slate-100 bg-slate-50">
                      <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover transition-transform group-hover:scale-105 duration-500" />
                      <button 
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 hover:border-blue-400 transition-all cursor-pointer group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiUploadCloud className="text-3xl text-slate-300 group-hover:text-blue-500 transition-colors mb-2" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Klik untuk Unggah</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  )}
                </div>
                <p className="mt-4 text-[10px] text-slate-400 text-center uppercase font-bold tracking-widest">Format: JPG, PNG (Max 2MB)</p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="sticky top-28 space-y-4">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-bold flex items-center animate-in slide-in-from-right-2">
                    <FiAlertCircle className="mr-2 text-base flex-shrink-0" /> {error}
                  </div>
                )}
                {successMessage && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl text-xs font-bold flex items-center animate-in slide-in-from-right-2">
                    <FiCheckCircle className="mr-2 text-base flex-shrink-0" /> {successMessage}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl font-black text-white tracking-widest uppercase text-sm transition-all shadow-lg flex items-center justify-center active:scale-95 ${
                    loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'
                  }`}
                >
                  {loading ? <FiLoader className="animate-spin text-xl" /> : (formType === 'add' ? 'Terbitkan Lowongan' : 'Simpan Perubahan')}
                </button>

                <NavLink 
                  to="/admin/careers"
                  className="block w-full py-4 text-center text-slate-400 font-bold hover:text-slate-600 transition-colors text-xs uppercase tracking-widest"
                >
                  Batalkan
                </NavLink>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCareerFormPage;