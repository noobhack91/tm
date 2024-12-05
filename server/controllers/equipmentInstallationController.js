import { parse } from 'csv-parse/sync';
import logger from '../config/logger.js';
import models from '../models/index.js';

export const createInstallationRequest = async (req, res) => {
  const transaction = await models.sequelize.transaction();

  try {
    const {
      tenderNumber,
      authorityType,
      poDate,
      equipment,
      leadTimeToDeliver,
      leadTimeToInstall,
      remarks,
      hasAccessories,
      accessories,
      locations
    } = req.body;

    // Create installation request
    const installation = await models.EquipmentInstallation.create({
      tenderNumber,
      authorityType,
      poDate,
      equipment,
      leadTimeToDeliver,
      leadTimeToInstall,
      remarks,
      hasAccessories,
      accessories: accessories || [],
      createdBy: req.user.id,
      status: 'Draft'
    }, { transaction });

    // Create locations
    if (locations?.length > 0) {
      await models.EquipmentLocation.bulkCreate(
        locations.map((loc, index) => ({
          installationId: installation.id,
          srNo: (index + 1).toString(),
          districtName: loc.districtName,
          blockName: loc.blockName,
          facilityName: loc.facilityName
        })),
        { transaction }
      );
    }

    await transaction.commit();
    logger.info(`Installation request created: ${installation.id}`);
    
    res.status(201).json(installation);
  } catch (error) {
    await transaction.rollback();
    logger.error('Error creating installation request:', error);
    res.status(400).json({ error: error.message });
  }
};

export const uploadConsigneeCSV = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const fileContent = req.file.buffer.toString();
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    // Validate and transform records
    const locations = records.map((record, index) => ({
      srNo: (index + 1).toString(),
      districtName: record.district_name?.trim(),
      blockName: record.block_name?.trim(),
      facilityName: record.facility_name?.trim()
    }));

    // Check for duplicates
    const warnings = [];
    const seen = new Set();
    locations.forEach(loc => {
      const key = `${loc.districtName}-${loc.blockName}-${loc.facilityName}`;
      if (seen.has(key)) {
        warnings.push(`Duplicate entry found: ${key}`);
      }
      seen.add(key);
    });

    res.json({
      locations,
      warnings: warnings.length > 0 ? warnings.join('\n') : null
    });
  } catch (error) {
    logger.error('Error processing CSV:', error);
    res.status(400).json({ error: error.message });
  }
};

export const downloadTemplate = async (req, res) => {
  const template = 'district_name,block_name,facility_name\n';
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=consignee_template.csv');
  res.send(template);
};

export const getInstallationRequests = async (req, res) => {
  try {
    const installations = await models.EquipmentInstallation.findAll({
      include: [{
        model: models.EquipmentLocation,
        as: 'locations'
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(installations);
  } catch (error) {
    logger.error('Error fetching installation requests:', error);
    res.status(500).json({ error: error.message });
  }
};