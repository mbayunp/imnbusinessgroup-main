import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Beranda';
import About from './pages/Tentang';
import Contact from './pages/Contact';
import Services from './pages/Kegiatan';
import Careers from './pages/Careers';
import PersPage from './pages/PersPage';
import AdminLogin from './pages/AdminLogin'; // Pastikan nama file ini benar (AdminLoginPage vs AdminLogin)
import RegisterPage from './pages/RegisterPage';
import PrivacyPolicyPage from './pages/KebijakanPrivasi'; 

// Import Admin pages...
import AdminDashboard from './pages/AdminDashboard';
import AdminCareerListPage from './pages/AdminCareerListPage';
import AdminCareerFormPage from './pages/AdminCareerFormPage';
import AdminPressReleaseListPage from './pages/AdminPressReleaseListPage';
import AdminPressReleaseFormPage from './pages/AdminPressReleaseFormPage';

import AdminRoute from './components/AdminRoute';
import Preloader from './components/Preloader';

// --- PERBAIKAN UTAMA 1: Import AuthProvider ---
import { AuthProvider } from './hooks/useAdminAuth'; 

import './style.css';

const App: React.FC = () => {
  const location = useLocation();
  
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); 
    return () => clearTimeout(timer);
  }, [location.pathname]); 

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
    <AuthProvider>
      <div className="flex min-h-screen flex-col w-full overflow-x-hidden relative"> 
        
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

            {/* Rute yang dilindungi (Admin Only) */}
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
    </AuthProvider>
  );
};

export default App;