import React, { useState, useEffect } from 'react';
import RevealOnScroll from '../components/RevealOnScroll';
import { submitContactForm } from '../services/contactService';
import { AxiosError } from 'axios';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const Contact: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const formData = { firstName, lastName, email, phone, subject, message };

    try {
      const response = await submitContactForm(formData);
      setSuccessMessage(response.message || 'Pesan Anda berhasil terkirim!');
      setFirstName(''); setLastName(''); setEmail(''); setPhone(''); setSubject(''); setMessage('');
    } catch (err: unknown) {
      let errorMessage = 'Gagal mengirim pesan. Silakan coba lagi.';
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-blue-100 overflow-x-hidden">
      
      {/* --- Header Section --- */}
      <section className="relative pt-32 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <RevealOnScroll animationType="slide-up">
            <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">Get in Touch</span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mt-4 tracking-tighter italic uppercase">
              Hubungi <span className="text-blue-600">Kami</span>
            </h1>
            <div className="w-16 h-1.5 bg-blue-600 mx-auto mt-6 rounded-full"></div>
            <p className="mt-8 text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Kami siap membantu Anda. Silakan isi formulir di bawah ini atau hubungi kantor kami melalui kanal komunikasi yang tersedia.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* --- Main Content --- */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            
            {/* Form Kontak */}
            <RevealOnScroll animationType="slide-right">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-8 md:p-12">
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight uppercase italic flex items-center">
                  <FiSend className="mr-3 text-blue-600" /> Kirim Pesan
                </h2>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nama Depan <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nama Belakang</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Subjek <span className="text-red-500">*</span></label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none appearance-none"
                    >
                      <option value="">Pilih subjek...</option>
                      <option value="general">Pertanyaan Umum</option>
                      <option value="sales">Penawaran Produk/Layanan</option>
                      <option value="support">Dukungan Teknis</option>
                      <option value="partnership">Kemitraan</option>
                      <option value="career">Karir</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Pesan <span className="text-red-500">*</span></label>
                    <textarea
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none resize-none"
                    ></textarea>
                  </div>

                  {successMessage && (
                    <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700 font-bold border border-emerald-100 animate-fade-in">
                      <FiCheckCircle /> {successMessage}
                    </div>
                  )}
                  {error && (
                    <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-700 font-bold border border-red-100 animate-fade-in">
                      <FiAlertCircle /> {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full rounded-2xl bg-blue-600 px-8 py-5 font-black uppercase tracking-widest text-xs text-white shadow-xl shadow-blue-200 transition-all hover:bg-blue-700 active:scale-[0.98] ${
                      loading ? 'opacity-70' : ''
                    }`}
                  >
                    {loading ? 'Mengirim...' : 'Kirim Pesan'}
                  </button>
                </form>
              </div>
            </RevealOnScroll>

            {/* Info Kontak */}
            <div className="space-y-8">
              <RevealOnScroll animationType="slide-left">
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 md:p-12">
                  <h2 className="text-2xl font-black text-slate-900 mb-10 tracking-tight uppercase italic">Informasi Kontak</h2>
                  <div className="space-y-10">
                    <div className="flex items-start group">
                      <div className="flex-shrink-0 bg-blue-50 p-4 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <FiMapPin size={24} />
                      </div>
                      <div className="ml-6">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Alamat Kantor</h3>
                        <p className="text-slate-700 font-bold leading-relaxed">
                          Jl. Cipondoh Girang, RT.06/RW.12<br />
                          Kel Cinunuk, Kec. Cileunyi<br />
                          Kabupaten Bandung, Jawa Barat 40624
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start group">
                      <div className="flex-shrink-0 bg-blue-50 p-4 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <FiPhone size={24} />
                      </div>
                      <div className="ml-6">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Telepon</h3>
                        <p className="text-slate-700 font-bold leading-relaxed">
                          +62 21 1234 5678 (CS)<br />
                          +62 21 8765 4321 (Sales)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start group">
                      <div className="flex-shrink-0 bg-blue-50 p-4 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <FiMail size={24} />
                      </div>
                      <div className="ml-6">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Email</h3>
                        <p className="text-slate-700 font-bold leading-relaxed">
                          info@perusahaan.com<br />
                          hrd@imnbusinessgroup.co.id
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll animationType="slide-left" delay={200}>
                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl shadow-slate-900/20">
                  <div className="flex items-center mb-8 text-blue-400">
                    <FiClock size={24} />
                    <h2 className="text-xl font-black ml-3 tracking-tight uppercase italic">Jam Operasional</h2>
                  </div>
                  <div className="space-y-4">
                    {[
                      { day: 'Senin - Jumat', hours: '08:00 - 17:00 WIB' },
                      { day: 'Sabtu', hours: '09:00 - 14:00 WIB' },
                      { day: 'Minggu & Hari Libur', hours: 'Tutup' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between border-b border-white/10 pb-3 last:border-0">
                        <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">{item.day}</span>
                        <span className="font-black text-sm">{item.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>

          {/* Google Maps (Tetap Menggunakan Peta Anda) */}
          <RevealOnScroll animationType="slide-up">
            <div className="mt-16 overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border-8 border-white w-full h-[450px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.665279282584!2d107.73196619999999!3d-6.930551599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68c3fcfa905175%3A0x838e90b2735da1b!2sRumah%20Visi%20Indifa%20(RVI)!5e0!3m2!1sen!2sid!4v1750231879374!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Peta Lokasi Kantor"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
};

export default Contact;