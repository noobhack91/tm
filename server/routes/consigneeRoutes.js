import express from 'express';
import { createConsignee, getConsignees, updateConsigneeStatus } from '../controllers/consigneeController.js';

const router = express.Router();

router.post('/', createConsignee);
router.get('/', getConsignees);
router.patch('/:id', updateConsigneeStatus);

export default router;