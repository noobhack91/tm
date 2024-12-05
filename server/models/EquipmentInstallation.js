import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EquipmentInstallation = sequelize.define('EquipmentInstallation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  tenderNumber: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  authorityType: {
    type: DataTypes.ENUM('UPSMC', 'UKSMC', 'SGPGIMS'),
    allowNull: false
  },
  poDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  equipment: {
    type: DataTypes.STRING,
    allowNull: false
  },
  leadTimeToDeliver: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  leadTimeToInstall: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  remarks: {
    type: DataTypes.TEXT
  },
  hasAccessories: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  accessories: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Submitted', 'In Progress', 'Completed'),
    defaultValue: 'Draft'
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false
  }
});

export default EquipmentInstallation;