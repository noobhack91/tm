import { Op } from 'sequelize';
import { sequelize, Tender, Consignee } from '../models/index.js';
import logger from '../config/logger.js';

export const searchTenders = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      tenderNumber,
      district,
      block,
      status,
      accessoriesPending,
      installationPending,
      invoicePending,
      page = 1,
      limit = 50
    } = req.query;

    const where = {};
    
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    if (tenderNumber) {
      where.tenderNumber = {
        [Op.iLike]: `%${tenderNumber}%`
      };
    }

    if (status) {
      where.status = status;
    }

    if (accessoriesPending) {
      where.accessoriesPending = accessoriesPending === 'Yes';
    }

    if (installationPending) {
      where.installationPending = installationPending === 'Yes';
    }

    if (invoicePending) {
      where.invoicePending = invoicePending === 'Yes';
    }

    const offset = (page - 1) * limit;
    
    const { count, rows } = await Tender.findAndCountAll({
      where,
      include: [{
        model: Consignee,
        as: 'consignees',
        where: district || block ? {
          [Op.and]: [
            district ? { districtName: district } : null,
            block ? { blockName: block } : null
          ].filter(Boolean)
        } : undefined,
        required: !!(district || block)
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    logger.info(`Tenders searched with filters: ${JSON.stringify(req.query)}`);

    res.json({
      tenders: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    logger.error('Error searching tenders:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getDistricts = async (req, res) => {
  try {
    const districts = await Consignee.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('district_name')), 'district']],
      raw: true
    });
    
    res.json(districts.map(d => d.district).filter(Boolean));
  } catch (error) {
    logger.error('Error fetching districts:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getBlocks = async (req, res) => {
  try {
    const blocks = await Consignee.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('block_name')), 'block']],
      raw: true
    });
    
    res.json(blocks.map(b => b.block).filter(Boolean));
  } catch (error) {
    logger.error('Error fetching blocks:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getTenderById = async (req, res) => {
  try {
    const tender = await Tender.findByPk(req.params.id, {
      include: [{
        model: Consignee,
        as: 'consignees',
        include: ['logisticsDetails', 'challanReceipt', 'installationReport', 'invoice']
      }]
    });
    
    if (!tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }
    
    res.json(tender);
  } catch (error) {
    logger.error('Error fetching tender:', error);
    res.status(500).json({ error: error.message });
  }
};