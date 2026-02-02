// config/associations.js

const defineAssociations = (sequelizeInstance) => {
  const {
    User,
    ActivityLog,
    Career,
    PressRelease,
    Project,
    ContactMessage
  } = sequelizeInstance.models;

  // User - ActivityLog
  User.hasMany(ActivityLog, {
    foreignKey: 'user',
    as: 'activityLogs',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  ActivityLog.belongsTo(User, {
    foreignKey: 'user',
    as: 'userActivity'
  });

  // User - Career
  User.hasMany(Career, {
    foreignKey: 'createdBy',
    as: 'careers',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });
  Career.belongsTo(User, {
    foreignKey: 'createdBy',
    as: 'creator'
  });

  // User - PressRelease
  User.hasMany(PressRelease, {
    foreignKey: 'createdBy',
    as: 'pressReleases',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });
  PressRelease.belongsTo(User, {
    foreignKey: 'createdBy',
    as: 'creator'
  });

  // User - Project
  User.hasMany(Project, {
    foreignKey: 'createdBy',
    as: 'projects',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });
  Project.belongsTo(User, {
    foreignKey: 'createdBy',
    as: 'creator'
  });

  User.hasMany(ContactMessage, {
    foreignKey: 'userId',
    as: 'contactMessages',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });
  ContactMessage.belongsTo(User, {
    foreignKey: 'userId',
    as: 'sender'
  });
};

export default defineAssociations;
