import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import defineChallanReceipt from './definitions/ChallanReceipt.js';
import defineConsignee from './definitions/Consignee.js';
import defineInstallationReport from './definitions/InstallationReport.js';
import defineInvoice from './definitions/Invoice.js';
import defineLogisticsDetails from './definitions/LogisticsDetails.js';
import defineTender from './definitions/Tender.js';
import defineUser from './definitions/User.js';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Initialize models
const User = defineUser(sequelize);
const Tender = defineTender(sequelize);
const Consignee = defineConsignee(sequelize);
const LogisticsDetails = defineLogisticsDetails(sequelize);
const ChallanReceipt = defineChallanReceipt(sequelize);
const InstallationReport = defineInstallationReport(sequelize);
const Invoice = defineInvoice(sequelize);

// Define associations
Tender.hasMany(Consignee, {
  foreignKey: 'tenderId',
  as: 'consignees'
});

Consignee.belongsTo(Tender, {
  foreignKey: 'tenderId'
});

Consignee.hasOne(LogisticsDetails, {
  foreignKey: 'consigneeId',
  as: 'logisticsDetails'
});

LogisticsDetails.belongsTo(Consignee, {
  foreignKey: 'consigneeId'
});

Consignee.hasOne(ChallanReceipt, {
  foreignKey: 'consigneeId',
  as: 'challanReceipt'
});

ChallanReceipt.belongsTo(Consignee, {
  foreignKey: 'consigneeId'
});

Consignee.hasOne(InstallationReport, {
  foreignKey: 'consigneeId',
  as: 'installationReport'
});

InstallationReport.belongsTo(Consignee, {
  foreignKey: 'consigneeId'
});

Consignee.hasOne(Invoice, {
  foreignKey: 'consigneeId',
  as: 'invoice'
});

Invoice.belongsTo(Consignee, {
  foreignKey: 'consigneeId'
});

export {
  ChallanReceipt, Consignee, InstallationReport,
  Invoice, LogisticsDetails, sequelize, Tender, User
};
