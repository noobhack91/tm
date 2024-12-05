import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const InstallationReport = sequelize.define('InstallationReport', {
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
    tableName: 'installation_reports',
    underscored: true,
    timestamps: true
  });

  return InstallationReport;
};