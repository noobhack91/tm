import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Consignee from './Consignee.js';

const LogisticsDetails = sequelize.define('LogisticsDetails', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  courierName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  docketNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  documents: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
});

LogisticsDetails.belongsTo(Consignee);
Consignee.hasOne(LogisticsDetails);

export default LogisticsDetails;