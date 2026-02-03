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

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Folder uploads berhasil dibuat otomatis.');
}

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('🎉 API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

app.use('/api/careers', careerRoutes);
app.use('/api/press-releases', pressReleaseRoutes); 
app.use('/api/contact', contactRoutes); 

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    initModels(sequelize);

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