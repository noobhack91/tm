// database/migrations/combine_tenders_equipment.js

async function up(queryInterface, Sequelize) {
    // 1. Create temporary table with new structure
    await queryInterface.createTable('tenders_new', {
      // ... (all columns from the schema above)
    });
  
    // 2. Migrate data from both tables
    await queryInterface.sequelize.query(`
      INSERT INTO tenders_new (
        tender_number, authority_type, po_date, contract_date, 
        equipment_name, lead_time_to_deliver, lead_time_to_install,
        remarks, has_accessories, accessories, status,
        accessories_pending, installation_pending, invoice_pending,
        created_by, created_at, updated_at
      )
      SELECT 
        t.tender_number,
        COALESCE(ei.authority_type, t.authority_type),
        t.po_date,
        t.contract_date,
        COALESCE(ei.equipment, t.equipment_name),
        t.lead_time_to_deliver,
        t.lead_time_to_install,
        ei.remarks,
        COALESCE(ei.has_accessories, t.accessories_pending),
        COALESCE(ei.accessories, ARRAY[]::TEXT[]),
        CASE 
          WHEN t.status = 'Pending' THEN 'Draft'
          ELSE t.status
        END,
        t.accessories_pending,
        t.installation_pending,
        t.invoice_pending,
        COALESCE(ei.created_by, t.created_by),
        t.created_at,
        t.updated_at
      FROM tenders t
      LEFT JOIN equipment_installations ei ON t.tender_number = ei.tender_number;
    `);
  
    // 3. Drop old tables and rename new table
    await queryInterface.dropTable('equipment_installations');
    await queryInterface.dropTable('tenders');
    await queryInterface.renameTable('tenders_new', 'tenders');
  }
  
  async function down(queryInterface, Sequelize) {
    // Revert changes if needed
  }
  
  export { up, down };