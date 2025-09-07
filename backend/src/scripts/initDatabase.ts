import { db } from '../config/sqlite';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger';
import createAuthTables from './createAuthTables';
import createDemoUsers from './createDemoUsers';
import createDoctorTables from './createDoctorTables';
import createDemoDoctors from './createDemoDoctors';

const initDatabase = async () => {
  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, '../../sql/sqlite-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schema
      .split(';')
      .filter(stmt => stmt.trim())
      .map(stmt => stmt.trim() + ';');
    
    logger.info('Initializing database schema...');
    
    statements.forEach((statement, index) => {
      try {
        db.exec(statement);
        logger.info(`Executed statement ${index + 1}/${statements.length}`);
      } catch (error) {
        logger.error(`Failed to execute statement ${index + 1}:`, error);
        logger.error(`Statement: ${statement.substring(0, 100)}...`);
      }
    });
    
    // Insert demo providers if not exists
    const demoProviders = [
      {
        id: 'demo-provider-001',
        name: 'Apollo Health Center',
        type: 'hospital',
        registration_number: 'HOSP-001',
        address: JSON.stringify({ city: 'Delhi', area: 'Saket' })
      },
      {
        id: 'demo-lab-001',
        name: 'PathLabs Diagnostics',
        type: 'lab',
        registration_number: 'LAB-001',
        address: JSON.stringify({ city: 'Noida', area: 'Sector 18' })
      }
    ];
    
    const insertProvider = db.prepare(`
      INSERT OR IGNORE INTO healthcare_providers (id, name, type, registration_number, address)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    demoProviders.forEach(provider => {
      insertProvider.run(
        provider.id,
        provider.name,
        provider.type,
        provider.registration_number,
        provider.address
      );
    });
    
    // Insert demo patient
    const insertUser = db.prepare(`
      INSERT OR IGNORE INTO users (id, email, password_hash, role, first_name, last_name, abha_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertUser.run(
      'demo-patient-001',
      'demo@quantivara.com',
      '$2a$10$XQq9rM3h0syPQf5xK1PoNu8Ey/iW6VYmJmL5V3kHwgzUBqCLxGFW2', // "demo123"
      'patient',
      'Demo',
      'Patient',
      '1234-5678-9012'
    );
    
    // Initialize authentication system tables
    await createAuthTables();
    
    // Create demo users first
    await createDemoUsers();
    
    // Initialize doctor system tables
    await createDoctorTables();
    
    // Skip demo doctors for now (will create separately)
    logger.info('⏭️ Skipping demo doctors creation for now');
    
    logger.info('✅ Database initialized successfully');
    
  } catch (error) {
    logger.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  initDatabase().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  });
}

export default initDatabase;