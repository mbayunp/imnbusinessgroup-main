// backend/models/Career.js
import { DataTypes, Model } from 'sequelize';

class Career extends Model {}

export const initCareerModel = (sequelize) => {
  Career.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    gFormLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    // PERBAIKAN: Definisi Foreign Key Explicit
    createdBy: {
      type: DataTypes.INTEGER, // Wajib INTEGER agar cocok dengan User.id
      allowNull: true,
      references: {
        model: 'users', // Nama tabel referensi
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  }, {
    sequelize,
    modelName: 'Career',
    tableName: 'careers',
    timestamps: true,
  });

  return Career;
};