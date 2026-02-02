// backend/config/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
import { initModels } from '../models/initModels.js';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Koneksi ke database berhasil.');
    initModels(sequelize);
  } catch (error) {
    console.error('❌ Gagal koneksi ke database:', error);
    process.exit(1);
  }
};

export { sequelize }; 
