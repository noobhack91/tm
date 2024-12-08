import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './config/logger.js';
import { authenticate } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { sequelize } from './models/index.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import consigneeRoutes from './routes/consigneeRoutes.js';
import equipmentInstallationRoutes from './routes/equipmentInstallationRoutes.js';
import tenderRoutes from './routes/tenderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Create uploads directory if it doesn't exist
import { mkdirSync } from 'fs';
try {
  mkdirSync(path.join(__dirname, '../uploads'));
  mkdirSync(path.join(__dirname, '../logs'));
} catch (err) {
  if (err.code !== 'EEXIST') throw err;
}

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/tenders', authenticate, tenderRoutes);
app.use('/api/consignees', authenticate, consigneeRoutes);
app.use('/api/upload', authenticate, uploadRoutes);
app.use('/api/equipment-installation', authenticate, equipmentInstallationRoutes);
app.use('/api/admin',authenticate, adminRoutes);  
// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}).catch(err => {
  logger.error('Database connection failed:', err);
});