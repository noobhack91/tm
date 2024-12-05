import { sequelize } from '../server/models/index.js';
import logger from '../server/config/logger.js';
import bcrypt from 'bcryptjs';
import { User, Tender } from '../server/models/index.js';

async function resetDatabase() {
  try {
    // Drop and recreate all tables
    await sequelize.sync({ force: true });
    logger.info('Database tables reset successfully');

    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const roles = ['admin', 'logistics', 'challan', 'installation', 'invoice'];
    
    for (const role of roles) {
      await User.create({
        username: role,
        email: `${role}@example.com`,
        password: hashedPassword,
        role: role
      });
    }
    logger.info('Default users created successfully');

    // Create sample tender data
    const sampleTender = await Tender.create({
      tenderNumber: 'TENDER/2024/001',
      authorityType: 'State Health Department',
      poDate: new Date('2024-03-01'),
      contractDate: new Date('2024-02-15'),
      leadTimeToInstall: 30,
      leadTimeToDeliver: 15,
      equipmentName: 'X-Ray Machine',
      status: 'Pending'
    });

    logger.info('Sample data created successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Database reset failed:', error);
    process.exit(1);
  }
}

resetDatabase();