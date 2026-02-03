// backend/models/initModels.js

import { initUserModel } from './User.js';
import { initCareerModel } from './Career.js';
import { initProjectModel } from './Project.js'; 

export const initModels = (sequelize) => {
  const User = initUserModel(sequelize);
  const Career = initCareerModel(sequelize);
  const Project = initProjectModel(sequelize);
  
  // Relasi User -> Career
  User.hasMany(Career, { foreignKey: 'createdBy' });
  Career.belongsTo(User, { foreignKey: 'createdBy' });

  // Relasi User -> Project
  User.hasMany(Project, { foreignKey: 'createdBy' });
  Project.belongsTo(User, { foreignKey: 'createdBy' });

  return { User, Career, Project };
};