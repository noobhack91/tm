import logger from '../config/logger.js';
import { ChallanReceipt, Consignee, InstallationReport, Invoice, LogisticsDetails } from '../models/index.js';

export const uploadLogistics = async (req, res) => {
  try {
    const { consigneeId, date, courierName, docketNumber } = req.body;

    // Verify consignee exists
    const consignee = await Consignee.findByPk(consigneeId);
    if (!consignee) {
      return res.status(404).json({ error: 'Consignee not found' });
    }

    const documents = req.files ? req.files.map(file => file.path) : [];

    const logistics = await LogisticsDetails.create({
      consigneeId,
      date: new Date(date),
      courierName,
      docketNumber,
      documents
    });

    // Update consignee status
    await consignee.update({
      consignmentStatus: 'Dispatched'
    });

    logger.info(`Logistics details added for consignee ${consigneeId}`);
    res.status(201).json(logistics);
  } catch (error) {
    logger.error('Error uploading logistics details:', error);
    res.status(400).json({ error: error.message });
  }
};

export const uploadChallan = async (req, res) => {
  try {
    const { consigneeId, date } = req.body;

    // Verify consignee exists
    const consignee = await Consignee.findByPk(consigneeId);
    if (!consignee) {
      return res.status(404).json({ error: 'Consignee not found' });
    }

    const filePath = req.file ? req.file.path : null;
    if (!filePath) {
      return res.status(400).json({ error: 'File is required' });
    }

    const challan = await ChallanReceipt.create({
      consigneeId,
      date: new Date(date),
      filePath
    });

    // Update consignee status if needed
    if (consignee.consignmentStatus === 'Dispatched') {
      await consignee.update({
        consignmentStatus: 'Installation Pending'
      });
    }

    logger.info(`Challan receipt added for consignee ${consigneeId}`);
    res.status(201).json(challan);
  } catch (error) {
    logger.error('Error uploading challan receipt:', error);
    res.status(400).json({ error: error.message });
  }
};

export const uploadInstallation = async (req, res) => {
  try {
    const { consigneeId, date } = req.body;

    // Verify consignee exists
    const consignee = await Consignee.findByPk(consigneeId);
    if (!consignee) {
      return res.status(404).json({ error: 'Consignee not found' });
    }

    const filePath = req.file ? req.file.path : null;
    if (!filePath) {
      return res.status(400).json({ error: 'File is required' });
    }

    const installation = await InstallationReport.create({
      consigneeId,
      date: new Date(date),
      filePath
    });

    // Update consignee status
    await consignee.update({
      consignmentStatus: 'Installation Done'
    });

    logger.info(`Installation report added for consignee ${consigneeId}`);
    res.status(201).json(installation);
  } catch (error) {
    logger.error('Error uploading installation report:', error);
    res.status(400).json({ error: error.message });
  }
};

export const uploadInvoice = async (req, res) => {
  try {
    const { consigneeId, date } = req.body;

    // Verify consignee exists
    const consignee = await Consignee.findByPk(consigneeId);
    if (!consignee) {
      return res.status(404).json({ error: 'Consignee not found' });
    }

    const filePath = req.file ? req.file.path : null;
    if (!filePath) {
      return res.status(400).json({ error: 'File is required' });
    }

    const invoice = await Invoice.create({
      consigneeId,
      date: new Date(date),
      filePath
    });

    // Update consignee status
    await consignee.update({
      consignmentStatus: 'Invoice Done'
    });

    logger.info(`Invoice added for consignee ${consigneeId}`);
    res.status(201).json(invoice);
  } catch (error) {
    logger.error('Error uploading invoice:', error);
    res.status(400).json({ error: error.message });
  }
};