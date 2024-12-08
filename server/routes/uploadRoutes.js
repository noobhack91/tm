import express from 'express';
import { upload } from '../utils/fileUpload.js';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  uploadLogistics,
  uploadChallan,
  uploadInstallation,
  uploadInvoice
} from '../controllers/uploadController.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Logistics routes - only accessible by logistics users
router.post(
  '/logistics',
  authorize('logistics', 'admin'),
  upload.array('documents'),
  uploadLogistics
);

// Challan routes - only accessible by challan users
router.post(
  '/challan',
  authorize('challan', 'admin'),
  upload.single('file'),
  uploadChallan
);

// Installation routes - only accessible by installation users
router.post(
  '/installation',
  authorize('installation', 'admin'),
  upload.single('file'),
  uploadInstallation
);

// Invoice routes - only accessible by invoice users
router.post(
  '/invoice',
  authorize('invoice', 'admin'),
  upload.single('file'),
  uploadInvoice
);

export default router;