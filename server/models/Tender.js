import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Consignee from './Consignee.js';

const Tender = sequelize.define('Tender', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  tenderNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  authorityType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  poDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  contractDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  leadTimeToInstall: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  leadTimeToDeliver: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  equipmentName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Partially Completed', 'Completed', 'Closed'),
    defaultValue: 'Pending'
  },
  accessoriesPending: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  installationPending: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  invoicePending: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'tenders',
  underscored: true,
  timestamps: true
});

// Define associations
Tender.hasMany(Consignee, {
  foreignKey: 'tenderId',
  as: 'consignees'
});

export default Tender;