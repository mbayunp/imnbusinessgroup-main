// backend/models/index.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv'; 

// Import fungsi inisialisasi semua model
import { initUserModel } from './User.js';
import { initCareerModel } from './Career.js';
import { initPressReleaseModel } from './PressRelease.js';
import { initActivityLogModel } from './ActivityLog.js';
import { initContactModel } from './ContactMessage.js'; 

dotenv.config();

// Setup Koneksi
const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASS, 
  {
    host: process.env.DB_HOST, 
    // PERBAIKAN PENTING: Tambahkan port ini agar koneksi ke 3307 (XAMPP Anda)
    port: process.env.DB_PORT || 3307, 
    dialect: 'mysql',
    logging: false, 
  }
);

// Inisialisasi Model
const User = initUserModel(sequelize);
const Career = initCareerModel(sequelize);
const PressRelease = initPressReleaseModel(sequelize);
const ActivityLog = initActivityLogModel(sequelize);
const ContactMessage = initContactModel(sequelize);

// --- Definisi Relasi ---
User.hasMany(Career, { foreignKey: 'createdBy' });
Career.belongsTo(User, { foreignKey: 'createdBy' });

User.hasMany(PressRelease, { foreignKey: 'createdBy' });
PressRelease.belongsTo(User, { foreignKey: 'createdBy' });

User.hasMany(ActivityLog, { foreignKey: 'user' });
ActivityLog.belongsTo(User, { foreignKey: 'user' });

// Export Semua Model
export {
  sequelize,
  User,
  Career,
  PressRelease,
  ActivityLog,
  ContactMessage,
};