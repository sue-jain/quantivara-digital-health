import { db } from '../config/sqlite';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger';
import { setupDatabase } from './setupDatabase';
import { addDemoData } from './addDemoData';

const initDatabase = async () => {
  try {
    logger.info('🚀 Initializing Quantivara Digital Health Database...');
    logger.info('================================================');
    
    // Step 1: Create all database tables (new auth system + legacy compatibility)
    logger.info('📋 Step 1: Creating database schema...');
    setupDatabase();
    
    // Step 2: Add demo data for both new auth system and legacy system
    logger.info('📋 Step 2: Adding demo data...');
    await addDemoData();
    
    // Step 3: Verify setup
    logger.info('📋 Step 3: Verifying database setup...');
    
    // Check new auth system tables
    const newAuthTables = [
      'app_users', 'app_doctors', 'app_labs', 'app_user_sessions', 
      'app_doctor_sessions', 'app_abha_registry', 'app_user_abha_profiles'
    ];
    
    for (const table of newAuthTables) {
      const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get() as { count: number };
      logger.info(`   ✅ ${table}: ${count.count} records`);
    }
    
    // Check legacy tables
    const legacyTables = ['users', 'doctors', 'healthcare_providers', 'medical_documents'];
    for (const table of legacyTables) {
      try {
        const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get() as { count: number };
        logger.info(`   ✅ ${table}: ${count.count} records`);
      } catch (error) {
        logger.warn(`   ⚠️ ${table}: Table not found (this is OK for fresh setup)`);
      }
    }
    
    // Step 4: Display demo credentials
    logger.info('📋 Step 4: Demo credentials summary...');
    logger.info('================================================');
    logger.info('🔐 NEW AUTH SYSTEM DEMO CREDENTIALS:');
    logger.info('');
    logger.info('👤 PATIENTS (Phone/OTP or Username/Password):');
    logger.info('   • Phone: 9876543210 (OTP: 123456)');
    logger.info('   • Phone: 9876543211 (OTP: 123456)');
    logger.info('   • Username: ramesh_kumar / Password: demo123');
    logger.info('   • Username: priya_sharma / Password: demo123');
    logger.info('');
    logger.info('👨‍⚕️ DOCTORS (HPR ID/Password):');
    logger.info('   • HPR ID: 12345678-MH / Password: demo123');
    logger.info('   • HPR ID: 87654321-MH / Password: demo123');
    logger.info('   • HPR ID: 11223344-MH / Password: demo123');
    logger.info('');
    logger.info('🧪 LABS (HFR ID/Password):');
    logger.info('   • HFR ID: HFR-MUM-001 / Password: demo123');
    logger.info('   • HFR ID: HFR-MUM-002 / Password: demo123');
    logger.info('   • HFR ID: HFR-MUM-003 / Password: demo123');
    logger.info('');
    logger.info('🏥 LEGACY DEMO_HUB (for backward compatibility):');
    logger.info('   • ABHA IDs: 1234-5678-9012-34, 9876-5432-1098-76, etc.');
    logger.info('   • Document processing and analytics dashboard');
    logger.info('');
    logger.info('🎯 READY FOR DEMO!');
    logger.info('   • New auth system: /user/*, /doctor/*, /lab/* routes');
    logger.info('   • Legacy system: /demo/* routes (unchanged)');
    logger.info('================================================');
    
  } catch (error) {
    logger.error('❌ Database initialization failed:', error);
    throw error;
  }
};

// Run if this file is executed directly
if (require.main === module) {
  initDatabase()
    .then(() => {
      logger.info('🎉 Database initialization completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('💥 Database initialization failed:', error);
      process.exit(1);
    });
}

export { initDatabase };