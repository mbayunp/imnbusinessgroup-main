// src/components/Preloader.tsx
import React from 'react';

const Preloader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-300">
      
      {/* Container Flex Column (Menyusun elemen dari atas ke bawah) */}
      <div className="flex flex-col items-center justify-center gap-6">
        
        {/* 1. LOGO: Efek Pulse (Gelap Terang) */}
        {/* 'animate-pulse' membuat efek opacity naik turun seperti sedang memuat */}
        <img 
          src="/logo.png" 
          alt="IMN Business Group" 
          className="w-48 h-auto object-contain animate-pulse" 
        />

        {/* 2. LOADER BULAT: Di bawah logo */}
        {/* Lingkaran berputar dengan border atas berwarna biru */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-900"></div>
        
        {/* 3. TEKS (Opsional) */}
        <p className="text-sm font-medium text-gray-400 animate-pulse">
          Memuat Halaman...
        </p>

      </div>
    </div>
  );
};

export default Preloader;