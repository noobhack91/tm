import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Consignee from './Consignee.js';

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

Invoice.belongsTo(Consignee);
Consignee.hasOne(Invoice);

export default Invoice;