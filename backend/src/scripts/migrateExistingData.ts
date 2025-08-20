import { db } from '../config/sqlite';
import { logger } from '../utils/logger';
import { profilePopulationService } from '../services/profilePopulationService';

const migrateExistingData = async () => {
  try {
    logger.info('🔄 Migrating existing document data to profile tables...');

    // Get all existing documents with extracted data
    const existingDocuments = db.prepare(`
      SELECT id, abha_id, document_type, extracted_data, created_at
      FROM medical_documents 
      WHERE extracted_data IS NOT NULL 
      AND abha_id IS NOT NULL
      ORDER BY created_at DESC
    `).all() as any[];

    logger.info(`📄 Found ${existingDocuments.length} existing documents to migrate`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const doc of existingDocuments) {
      try {
        // Check if this document has already been migrated
        const existingMigration = db.prepare(`
          SELECT COUNT(*) as count FROM user_medications 
          WHERE source_document_id = ?
          UNION ALL
          SELECT COUNT(*) as count FROM user_lab_results 
          WHERE source_document_id = ?
          UNION ALL
          SELECT COUNT(*) as count FROM user_vital_signs 
          WHERE source_document_id = ?
        `).all(doc.id, doc.id, doc.id) as any[];

        const totalExistingRecords = existingMigration.reduce((sum, row) => sum + row.count, 0);
        
        if (totalExistingRecords > 0) {
          skippedCount++;
          logger.info(`⏭️ Skipped document ${doc.id}: Already migrated (${totalExistingRecords} profile records exist)`);
          continue;
        }

        // Parse the extracted data
        const extractedData = JSON.parse(doc.extracted_data);
        
        // Populate profile data
        await profilePopulationService.populateUserProfile(
          doc.abha_id,
          extractedData,
          doc.id,
          doc.document_type
        );
        
        migratedCount++;
        logger.info(`✅ Migrated document: ${doc.id} (${doc.document_type}) for ABHA ID: ${doc.abha_id}`);
        
      } catch (error) {
        skippedCount++;
        logger.warn(`⚠️ Skipped document ${doc.id}: ${error}`);
      }
    }

    // Show migration results
    logger.info('📊 Migration Results:');
    logger.info(`   ✅ Successfully migrated: ${migratedCount} documents`);
    logger.info(`   ⚠️ Skipped: ${skippedCount} documents`);
    logger.info(`   📄 Total processed: ${existingDocuments.length} documents`);

    // Show profile data summary - only if tables exist
    let totalMedications = { count: 0 };
    let totalLabResults = { count: 0 };
    let totalAlerts = { count: 0 };

    try {
      // Check if profile tables exist before querying
      const tablesCheck = db.prepare(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name IN ('user_medications', 'user_lab_results', 'user_critical_alerts')
      `).all() as any[];

      if (tablesCheck.length === 3) {
        totalMedications = db.prepare('SELECT COUNT(*) as count FROM user_medications').get() as any;
        totalLabResults = db.prepare('SELECT COUNT(*) as count FROM user_lab_results').get() as any;
        totalAlerts = db.prepare('SELECT COUNT(*) as count FROM user_critical_alerts').get() as any;
      } else {
        logger.warn('⚠️ Profile tables not fully created yet, skipping summary');
      }
    } catch (error) {
      logger.warn('⚠️ Could not generate profile summary, tables may not exist yet');
    }

    logger.info('📈 Profile Data Summary:');
    logger.info(`   💊 Active Medications: ${totalMedications.count}`);
    logger.info(`   🧪 Lab Results: ${totalLabResults.count}`);
    logger.info(`   🚨 Critical Alerts: ${totalAlerts.count}`);

    logger.info('✅ Migration completed successfully!');
    logger.info('🎯 Existing data is now available in profile tabs!');

  } catch (error) {
    logger.error('❌ Migration failed:', error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  migrateExistingData()
    .then(() => {
      logger.info('✅ Migration completed!');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

export { migrateExistingData }; 