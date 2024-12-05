import bcrypt from 'bcryptjs';
import { sequelize, User } from '../server/models/index.js';
import logger from '../server/config/logger.js';

async function seedDatabase() {
  try {
    // Sync database
    await sequelize.sync({ force: true });

    // Create users with roles
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

    logger.info('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();