import { Consignee, LogisticsDetails, ChallanReceipt, InstallationReport, Invoice } from '../models/index.js';
import logger from '../config/logger.js';

export const createConsignee = async (req, res) => {
  try {
    const consignee = await Consignee.create(req.body);
    res.status(201).json(consignee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getConsignees = async (req, res) => {
  try {
    const { districts } = req.query;
    const where = {};
    
    if (districts) {
      where.districtName = districts.split(',');
    }
    
    const consignees = await Consignee.findAll({
      where,
      include: [
        { model: LogisticsDetails, as: 'logisticsDetails' },
        { model: ChallanReceipt, as: 'challanReceipt' },
        { model: InstallationReport, as: 'installationReport' },
        { model: Invoice, as: 'invoice' }
      ]
    });

    res.json(consignees);
  } catch (error) {
    logger.error('Error fetching consignees:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateConsigneeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const consignee = await Consignee.findByPk(id);
    
    if (!consignee) {
      return res.status(404).json({ error: 'Consignee not found' });
    }
    
    await consignee.update(req.body);
    logger.info(`Consignee ${id} status updated`);
    res.json(consignee);
  } catch (error) {
    logger.error('Error updating consignee:', error);
    res.status(500).json({ error: error.message });
  }
};