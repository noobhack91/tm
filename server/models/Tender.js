import { DataTypes } from 'sequelize';

export default (sequelize) => {
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
      type: DataTypes.ENUM('UPSMC', 'UKSMC', 'SGPGIMS'),
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
    equipmentName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    leadTimeToDeliver: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    leadTimeToInstall: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
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
      type: DataTypes.ENUM('Draft', 'Submitted', 'In Progress', 'Partially Completed', 'Completed', 'Closed'),
      defaultValue: 'Draft'
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
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'tenders',
    underscored: true,
    timestamps: true
  });

  return Tender;
};