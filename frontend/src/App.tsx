import React, { useState, useEffect } from 'react'; // Tambahkan useState & useEffect
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Beranda';
import About from './pages/Tentang';
import Contact from './pages/Contact';
import Services from './pages/Kegiatan';
import Careers from './pages/Careers';
import PersPage from './pages/PersPage';
import AdminLogin from './pages/AdminLogin';
import RegisterPage from './pages/RegisterPage';
import PrivacyPolicyPage from './pages/KebijakanPrivasi'; 

// Import Admin pages...
import AdminDashboard from './pages/AdminDashboard';
import AdminCareerListPage from './pages/AdminCareerListPage';
import AdminCareerFormPage from './pages/AdminCareerFormPage';
import AdminPressReleaseListPage from './pages/AdminPressReleaseListPage';
import AdminPressReleaseFormPage from './pages/AdminPressReleaseFormPage';

import AdminRoute from './components/AdminRoute';
import Preloader from './components/Preloader'; // <--- IMPORT PRELOADER DISINI

import './style.css';

const App: React.FC = () => {
  const location = useLocation();
  
  // State untuk mengontrol loader
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Efek untuk memunculkan loader setiap kali rute/halaman berubah
  useEffect(() => {
    // Aktifkan loader
    setIsLoading(true);

    // Matikan loader setelah jeda waktu (misal 800ms)
    // Ini memberikan efek transisi yang halus
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Anda bisa ubah angkanya: 500 = 0.5 detik, 1000 = 1 detik

    return () => clearTimeout(timer);
  }, [location.pathname]); // Trigger setiap pathname berubah

  const noNavFooterRoutes = [
    '/admin/login',
    '/admin/register',
    '/admin/dashboard',
    '/admin/careers',
    '/admin/careers/add',
    '/admin/careers/edit',
    '/admin/press-releases',
    '/admin/press-releases/add',
    '/admin/press-releases/edit',
  ].map(path => path.replace(/\/$/, ''));

  const currentPathname = location.pathname.replace(/\/$/, '');
  const showNavAndFooter = !noNavFooterRoutes.includes(currentPathname);
  const publicPagesWithHero = ['/', '/tentang', '/kegiatan', '/press-releases', '/contact'].map(path => path.replace(/\/$/, ''));

  return (
    <div className="flex min-h-screen flex-col w-full overflow-x-hidden relative"> 
      
      {/* TAMPILKAN LOADER JIKA STATE TRUE */}
      {isLoading && <Preloader />}

      {showNavAndFooter && <Navbar />}
      
      <main className={`w-full flex-1 ${showNavAndFooter && !publicPagesWithHero.includes(currentPathname) ?'' : ''}`}> 
        <Routes>
          {/* Rute Publik */}
          <Route path="/" element={<Home />} />
          <Route path="/tentang" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/kegiatan" element={<Services />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/press-releases" element={<PersPage />} /> 
          <Route path="/kebijakan-privasi" element={<PrivacyPolicyPage />} />
          
          {/* Rute Login Admin & Registrasi */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<RegisterPage />} /> 

          {/* Rute yang dilindungi */}
          <Route element={<AdminRoute />}> 
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/careers" element={<AdminCareerListPage />} />
              <Route path="/admin/careers/add" element={<AdminCareerFormPage />} />
              <Route path="/admin/careers/edit/:id" element={<AdminCareerFormPage />} />
              <Route path="/admin/press-releases" element={<AdminPressReleaseListPage />} />
              <Route path="/admin/press-releases/add" element={<AdminPressReleaseFormPage />} />
              <Route path="/admin/press-releases/edit/:id" element={<AdminPressReleaseFormPage />} />
          </Route>
        </Routes>
      </main>
      
      {showNavAndFooter && <Footer />}
      
    </div>
  );
};

export default App;