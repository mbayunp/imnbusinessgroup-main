// backend/models/initModels.js

// PERBAIKAN: Gunakan kurung kurawal { } untuk Named Import
import { initUserModel } from './User.js';
import { initCareerModel } from './Career.js';
// Pastikan Project.js juga sudah menggunakan 'export const initProjectModel'
import { initProjectModel } from './Project.js'; 

export const initModels = (sequelize) => {
  const User = initUserModel(sequelize);
  const Career = initCareerModel(sequelize);
  const Project = initProjectModel(sequelize);

  // Definisikan relasi (Associations)
  
  // Relasi User -> Career
  User.hasMany(Career, { foreignKey: 'createdBy' });
  Career.belongsTo(User, { foreignKey: 'createdBy' });

  // Relasi User -> Project
  User.hasMany(Project, { foreignKey: 'createdBy' });
  Project.belongsTo(User, { foreignKey: 'createdBy' });

  return { User, Career, Project };
};