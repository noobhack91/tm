import express from 'express';
import multer from 'multer';
import {
    createInstallationRequest,
    downloadTemplate,
    getInstallationRequests,
    uploadConsigneeCSV
} from '../controllers/equipmentInstallationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticate);

router.post('/', authorize('admin'), createInstallationRequest);
router.post('/upload-csv', authorize('admin'), upload.single('file'), uploadConsigneeCSV);
router.get('/', authorize('admin', 'logistics', 'installation'), getInstallationRequests);
router.get('/template', authorize('admin'), downloadTemplate);

export default router;