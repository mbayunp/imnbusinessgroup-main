// backend/models/ActivityLog.js
import { DataTypes, Model } from 'sequelize';

class ActivityLog extends Model {}

export const initActivityLogModel = (sequelize) => {
  ActivityLog.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // Opsional: Simpan username sebagai string snapshot (berjaga jika user dihapus)
    username: {
      type: DataTypes.STRING,
      allowNull: true
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // PERBAIKAN UTAMA: Definisi Explicit Foreign Key
    // Nama kolom ini harus sama dengan foreignKey di index.js ('user')
    user: {
      type: DataTypes.INTEGER, // Wajib INTEGER karena User.id adalah INTEGER
      allowNull: true,
      references: {
        model: 'users', // Nama tabel referensi (harus sama dengan tableName di User.js)
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  }, {
    sequelize,
    modelName: 'ActivityLog',
    tableName: 'activity_logs',
    timestamps: true
  });

  return ActivityLog;
};