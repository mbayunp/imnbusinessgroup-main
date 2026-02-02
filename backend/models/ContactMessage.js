// backend/models/ContactMessage.js
import { DataTypes, Model } from 'sequelize';

class ContactMessage extends Model {}

export const initContactModel = (sequelize) => {
  ContactMessage.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      }
    },
    // TAMBAHKAN KOLOM PHONE DI SINI
    phone: {
      type: DataTypes.STRING,
      allowNull: true, // Boleh kosong jika user tidak mengisi
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'unread'
    }
  }, {
    sequelize,
    modelName: 'ContactMessage',
    tableName: 'contact_messages',
    timestamps: true,
  });

  return ContactMessage;
};

export { ContactMessage };