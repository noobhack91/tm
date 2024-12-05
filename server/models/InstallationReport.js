import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Consignee from './Consignee.js';

const InstallationReport = sequelize.define('InstallationReport', {
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

InstallationReport.belongsTo(Consignee);
Consignee.hasOne(InstallationReport);

export default InstallationReport;