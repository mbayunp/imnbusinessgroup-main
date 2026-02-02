// backend/models/PressRelease.js
import { DataTypes, Model } from 'sequelize';

class PressRelease extends Model {}

export const initPressReleaseModel = (sequelize) => {
  PressRelease.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // Kita gunakan 'imageUrl' agar konsisten dengan Career
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Kolom ini yang menyebabkan error sebelumnya (sekarang kita definisikan)
    postedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    // Definisi Relasi User (Foreign Key)
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  }, {
    sequelize,
    modelName: 'PressRelease', // Penting: Nama Model dipakai di Controller
    tableName: 'press_releases',
    timestamps: true,
  });

  return PressRelease;
};