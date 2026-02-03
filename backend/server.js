import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs'; // Tambahan: untuk cek folder
import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import Database & Models
import { sequelize } from './models/index.js';
import { initModels } from './models/initModels.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import pressReleaseRoutes from './routes/pressReleaseRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

// Import Middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// 1. Init Config
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 2. Cek & Buat Folder Uploads Otomatis
// Ini penting agar server tidak error saat upload pertama kali
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Folder uploads berhasil dibuat otomatis.');
}

// 3. Middleware Global
app.use(cors({
  origin: 'http://localhost:5173', // Sesuaikan dengan port frontend Anda
  credentials: true, // Izinkan cookie
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. Static Files (PENTING UNTUK GAMBAR)
// Membuat folder uploads bisa diakses via URL: http://localhost:5000/uploads/namafile.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 5. Test Route
app.get('/', (req, res) => {
  res.send('🎉 API is running...');
});

// 6. Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes); // Route upload (pastikan ini ada)

// Route Career & Press Release
// (Middleware Auth dipasang spesifik di dalam file router masing-masing)
app.use('/api/careers', careerRoutes);            
app.use('/api/press-releases', pressReleaseRoutes); 
app.use('/api/contact', contactRoutes); 

// 7. Error Middleware (Wajib di paling bawah)
app.use(notFound);
app.use(errorHandler);

// 8. Server Start & Database Sync
const startServer = async () => {
  try {
    // Cek koneksi DB
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Init Model Relasi
    initModels(sequelize);

    // Sync Database
    // alter: false -> Aman, tidak merusak struktur tabel/index yang sudah diperbaiki
    await sequelize.sync({ alter: true }); 
    console.log('✅ Database Synced');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di port ${PORT}`);
      console.log(`📂 Static files served at: http://localhost:${PORT}/uploads`);
    });

  } catch (err) {
    console.error('❌ Gagal menjalankan server:', err);
  }
};

startServer();