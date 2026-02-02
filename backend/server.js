import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
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
import contactRoutes from './routes/contactRoutes.js'; // <--- PENTING: Route Contact

// Import Middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { protect } from './middleware/authMiddleware.js';

dotenv.config();

// --- DEFINISI __DIRNAME (Wajib untuk ES Modules) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- MIDDLEWARE ---
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true 
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- DATABASE CONNECTION & SYNC ---
const startServer = async () => {
  try {
    // 1. Tes Koneksi
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // 2. Inisialisasi Model
    initModels(sequelize);

    // 3. SYNC DATABASE
    // alter: true akan memperbarui tabel jika ada kolom baru (seperti di Contact)
    await sequelize.sync({ alter: true }); 
    console.log('✅ Database Synced (Tabel diperbarui)');

    // 4. Jalankan Server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di port ${PORT}`);
    });

  } catch (err) {
    console.error('❌ Gagal menjalankan server:', err);
  }
};

// --- ROUTES ---
app.get('/', (req, res) => {
  res.send('🎉 API is running...');
});

// Route Utama
app.use('/api/auth', authRoutes);
app.use('/api/careers', protect, careerRoutes);         // Ada protect (harus login)
app.use('/api/press-releases', protect, pressReleaseRoutes); // Ada protect
app.use('/api/upload', uploadRoutes);

// Route Contact (BARU DITAMBAHKAN)
// Perhatikan: Di dalam contactRoutes.js nanti ada yang public (POST) dan admin (GET/DELETE)
app.use('/api/contact', contactRoutes); 

// Folder Static untuk Gambar
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error Middleware (Harus paling bawah)
app.use(notFound);
app.use(errorHandler);

// Jalankan Server
startServer();