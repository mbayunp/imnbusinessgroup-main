import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { createPressRelease, getPressReleaseById, updatePressRelease, uploadImage } from '../services/pressReleaseService';
import { PressRelease, PressReleasePayload } from '../types/pressRelease';
import { AxiosError } from 'axios';
import { 
  FiArrowLeft, FiImage, FiFileText, FiUploadCloud, 
  FiCheckCircle, FiAlertCircle, FiLoader, FiX 
} from 'react-icons/fi';

const AdminPressReleaseFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formType, setFormType] = useState<'add' | 'edit'>('add');
  const IMAGE_BASE_URL = 'https://imnbusinessgroup.co.id';

  useEffect(() => {
    if (id) {
      setFormType('edit');
      const fetchPressRelease = async () => {
        setLoading(true);
        try {
          const pressRelease: PressRelease = await getPressReleaseById(id);
          setTitle(pressRelease.title);
          setContent(pressRelease.content);
          if (pressRelease.imageUrl) {
            setExistingImageUrl(pressRelease.imageUrl);
            setImagePreview(`${IMAGE_BASE_URL}${pressRelease.imageUrl}`);
          }
        } catch (err: unknown) {
          setError('Gagal memuat data rilis pers.');
        } finally {
          setLoading(false);
        }
      };
      fetchPressRelease();
    }
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setExistingImageUrl(null);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    let finalImageUrl: string | undefined = undefined;

    try {
      if (imageFile) {
        setSuccessMessage('Mengunggah gambar...');
        finalImageUrl = await uploadImage(imageFile);
      } else if (existingImageUrl) {
        finalImageUrl = existingImageUrl;
      }

      const pressReleaseData: PressReleasePayload = {
        title,
        content,
        imageUrl: finalImageUrl || '',
      };

      if (formType === 'add') {
        await createPressRelease(pressReleaseData);
        setSuccessMessage('Berita rilis pers berhasil diterbitkan!');
      } else {
        await updatePressRelease(id!, pressReleaseData);
        setSuccessMessage('Perubahan berita berhasil disimpan!');
      }

      setTimeout(() => navigate('/admin/press-releases'), 1500);
    } catch (err: unknown) {
      let errorMessage = 'Terjadi kesalahan sistem.';
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
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <NavLink to="/admin/press-releases" className="inline-flex items-center text-sm text-slate-400 hover:text-indigo-600 transition-colors mb-1 group">
              <FiArrowLeft className="mr-1 group-hover:-translate-x-1 transition-transform" /> Kembali ke Daftar
            </NavLink>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center">
              <FiFileText className="mr-3 text-indigo-600" />
              {formType === 'add' ? 'RILIS BERITA BARU' : 'EDIT RILIS PERS'}
            </h1>
          </div>
        </div>
      </div>

      {/* FORM BODY */}
      <div className="max-w-5xl mx-auto w-full px-6 py-10 flex-1">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Judul Rilis Pers</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"
                    placeholder="Masukkan judul berita yang menarik..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Isi Konten Berita</label>
                  <textarea
                    rows={15}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700 leading-relaxed"
                    placeholder="Tuliskan isi berita secara lengkap di sini..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Media & Action */}
          <div className="lg:col-span-1 space-y-6">
            {/* Image Upload Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center uppercase tracking-wider">
                <FiImage className="mr-2 text-indigo-500" /> Thumbnail Berita
              </h3>
              
              <div className="relative group">
                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden shadow-inner border border-slate-100 bg-slate-50">
                    <img src={imagePreview} alt="Preview" className="w-full h-56 object-cover transition-transform group-hover:scale-105 duration-500" />
                    <button 
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-black rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 hover:border-indigo-400 transition-all cursor-pointer group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                      <FiUploadCloud className="text-4xl text-slate-300 group-hover:text-indigo-500 transition-colors mb-3" />
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Klik untuk Unggah Foto</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase">JPG, PNG (Max 2MB)</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                )}
              </div>
            </div>

            {/* Status & Action Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-[11px] font-bold flex items-start animate-in fade-in zoom-in duration-200">
                  <FiAlertCircle className="mr-2 text-base flex-shrink-0 mt-0.5" /> {error}
                </div>
              )}
              {successMessage && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-[11px] font-bold flex items-start animate-in fade-in zoom-in duration-200">
                  <FiCheckCircle className="mr-2 text-base flex-shrink-0 mt-0.5" /> {successMessage}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-black text-indigo-600 tracking-widest uppercase text-xs transition-all shadow-lg flex items-center justify-center active:scale-95 ${
                  loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
                }`}
              >
                {loading ? <FiLoader className="animate-spin text-lg" /> : (formType === 'add' ? 'Terbitkan Sekarang' : 'Simpan Perubahan')}
              </button>

              <NavLink 
                to="/admin/press-releases"
                className="block w-full py-3 text-center text-slate-400 font-bold hover:text-slate-600 transition-colors text-[10px] uppercase tracking-widest"
              >
                Batalkan
              </NavLink>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPressReleaseFormPage;