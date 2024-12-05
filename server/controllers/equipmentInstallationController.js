import { parse } from 'csv-parse/sync';
import logger from '../config/logger.js';
import { sequelize, EquipmentInstallation, EquipmentLocation, User } from '../models/index.js';
import { validateInstallationRequest } from '../validators/installation.validator.js';

export const createInstallationRequest = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    // Validate the entire request body including locations
    const validatedData = validateInstallationRequest(req.body);

    // Create installation request
    const installation = await EquipmentInstallation.create({
      tenderNumber: validatedData.tender_number,
      authorityType: validatedData.authority_type,
      poDate: validatedData.po_contract_date,
      equipment: validatedData.equipment,
      leadTimeToDeliver: validatedData.lead_time_to_deliver,
      leadTimeToInstall: validatedData.lead_time_to_install,
      remarks: validatedData.remarks,
      hasAccessories: validatedData.has_accessories,
      accessories: validatedData.selected_accessories,
      createdBy: req.user.id,
      status: 'Draft'
    }, { transaction });

    // Create locations
    if (validatedData.locations?.length > 0) {
      await EquipmentLocation.bulkCreate(
        validatedData.locations.map((loc, index) => ({
          installationId: installation.id,
          srNo: (index + 1).toString(),
          districtName: loc.districtName,
          blockName: loc.blockName,
          facilityName: loc.facilityName,
          status: 'Pending'
        })),
        { transaction }
      );
    }

    await transaction.commit();
    logger.info(`Installation request created: ${installation.id}`);

    // Fetch complete installation with locations
    const completeInstallation = await EquipmentInstallation.findByPk(installation.id, {
      include: [{
        model: EquipmentLocation,
        as: 'locations'
      }]
    });

    res.status(201).json(completeInstallation);
  } catch (error) {
    await transaction.rollback();
    logger.error('Error creating installation request:', error);
    res.status(400).json({ error: error.message });
  }
};

export const getInstallationRequests = async (req, res) => {
  try {
    const installations = await EquipmentInstallation.findAll({
      include: [{
        model: EquipmentLocation,
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

    const locations = records.map((record, index) => ({
      srNo: (index + 1).toString(),
      districtName: record.district_name?.trim(),
      blockName: record.block_name?.trim(),
      facilityName: record.facility_name?.trim()
    }));

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
      warnings: warnings.length > 0 ? warnings : null
    });
  } catch (error) {
    logger.error('Error processing CSV:', error);
    res.status(400).json({ error: error.message });
  }
};

export const downloadTemplate = async (req, res) => {
      try {
          const template = 'district_name,block_name,facility_name\n';
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', 'attachment; filename=consignee_template.csv');
          res.send(template);
      } catch (error) {
          logger.error('Error downloading template:', error);
          res.status(500).json({ error: 'Error downloading template' });
      }
  };