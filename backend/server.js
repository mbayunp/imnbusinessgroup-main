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
import contactRoutes from './routes/contactRoutes.js';

// Import Middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

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
    await sequelize.authenticate();
    console.log('✅ Database connected');

    initModels(sequelize);

    // alter: true memperbarui skema tanpa menghapus data yang sudah ada
    await sequelize.sync({ alter: true }); 
    console.log('✅ Database Synced');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di port ${PORT}`);
    });

  } catch (err) {
    console.error('❌ Gagal menjalankan server:', err);
  }
};

// --- ROUTES ---

// Folder Static untuk Gambar (Pindahkan ke atas agar bisa diakses publik)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('🎉 API is running...');
});

// Route Utama
app.use('/api/auth', authRoutes);

/** * PERBAIKAN PENTING: 
 * Hapus middleware 'protect' dari sini. 
 * Proteksi admin/HR diatur di dalam file router masing-masing (careerRoutes.js & pressReleaseRoutes.js)
 * agar fungsi GET (view publik) tetap bisa diakses tanpa login.
 */
app.use('/api/careers', careerRoutes);             //
app.use('/api/press-releases', pressReleaseRoutes); //
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes); 

// Error Middleware (Harus paling bawah)
app.use(notFound);
app.use(errorHandler);

startServer();