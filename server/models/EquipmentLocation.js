import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EquipmentLocation = sequelize.define('EquipmentLocation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  installationId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  srNo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  districtName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  blockName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  facilityName: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default EquipmentLocation;