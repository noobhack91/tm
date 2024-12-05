import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ChallanReceipt = sequelize.define('ChallanReceipt', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  consigneeId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'challan_receipts',
  underscored: true,
  timestamps: true
});

export default ChallanReceipt;