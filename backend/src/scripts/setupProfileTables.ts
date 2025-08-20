import { db } from '../config/sqlite';
import { logger } from '../utils/logger';

const setupProfileTables = async () => {
  try {
    logger.info('🏗️  Setting up profile integration tables...');

    // 1. Active Medications Table - for AI-extracted prescription data
    db.exec(`
      CREATE TABLE IF NOT EXISTS user_medications (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT REFERENCES users(id),
        abha_id TEXT NOT NULL,
        medication_name TEXT NOT NULL,
        dosage TEXT,
        frequency TEXT,
        duration TEXT,
        instructions TEXT,
        prescribed_date TEXT,
        source_document_id TEXT, -- Removed foreign key constraint for flexibility
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);

    // 2. Lab Results Table - for AI-extracted lab report data
    db.exec(`
      CREATE TABLE IF NOT EXISTS user_lab_results (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT REFERENCES users(id),
        abha_id TEXT NOT NULL,
        test_name TEXT NOT NULL,
        value TEXT,
        unit TEXT,
        normal_range TEXT,
        status TEXT DEFAULT 'NORMAL', -- NORMAL, HIGH, LOW, CRITICAL
        test_date TEXT,
        lab_name TEXT,
        source_document_id TEXT, -- Removed foreign key constraint for flexibility
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);

    // 3. Vital Signs Table - for AI-extracted vital signs data
    db.exec(`
      CREATE TABLE IF NOT EXISTS user_vital_signs (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT REFERENCES users(id),
        abha_id TEXT NOT NULL,
        vital_type TEXT NOT NULL, -- HEART_RATE, BLOOD_PRESSURE, TEMPERATURE, etc.
        value TEXT,
        unit TEXT,
        measurement_date TEXT,
        source_document_id TEXT, -- Removed foreign key constraint for flexibility
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);

    // 4. Critical Alerts Table - for AI-detected critical values
    db.exec(`
      CREATE TABLE IF NOT EXISTS user_critical_alerts (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT REFERENCES users(id),
        abha_id TEXT NOT NULL,
        alert_type TEXT NOT NULL, -- CRITICAL_LAB_RESULT, DRUG_INTERACTION, etc.
        severity TEXT DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
        message TEXT NOT NULL,
        source_document_id TEXT, -- Removed foreign key constraint for flexibility
        is_resolved INTEGER DEFAULT 0,
        resolved_at TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);

    // 5. Health Trends Table - for aggregated health data
    db.exec(`
      CREATE TABLE IF NOT EXISTS user_health_trends (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT REFERENCES users(id),
        abha_id TEXT NOT NULL,
        trend_type TEXT NOT NULL, -- BLOOD_PRESSURE, BLOOD_SUGAR, WEIGHT, etc.
        value TEXT,
        unit TEXT,
        measurement_date TEXT,
        trend_direction TEXT, -- INCREASING, DECREASING, STABLE
        confidence_score REAL,
        source_document_ids TEXT, -- JSON array of source documents
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);

    // Create indexes for performance
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_user_medications_abha_id ON user_medications(abha_id);
      CREATE INDEX IF NOT EXISTS idx_user_medications_active ON user_medications(is_active);
      CREATE INDEX IF NOT EXISTS idx_user_lab_results_abha_id ON user_lab_results(abha_id);
      CREATE INDEX IF NOT EXISTS idx_user_lab_results_status ON user_lab_results(status);
      CREATE INDEX IF NOT EXISTS idx_user_vital_signs_abha_id ON user_vital_signs(abha_id);
      CREATE INDEX IF NOT EXISTS idx_user_vital_signs_type ON user_vital_signs(vital_type);
      CREATE INDEX IF NOT EXISTS idx_user_critical_alerts_abha_id ON user_critical_alerts(abha_id);
      CREATE INDEX IF NOT EXISTS idx_user_critical_alerts_resolved ON user_critical_alerts(is_resolved);
      CREATE INDEX IF NOT EXISTS idx_user_health_trends_abha_id ON user_health_trends(abha_id);
      CREATE INDEX IF NOT EXISTS idx_user_health_trends_type ON user_health_trends(trend_type);
    `);

    logger.info('✅ Profile integration tables created successfully!');
    logger.info('📊 New tables added:');
    logger.info('   - user_medications (for AI-extracted prescription data)');
    logger.info('   - user_lab_results (for AI-extracted lab data)');
    logger.info('   - user_vital_signs (for AI-extracted vital signs)');
    logger.info('   - user_critical_alerts (for AI-detected critical values)');
    logger.info('   - user_health_trends (for aggregated health data)');
    logger.info('🎯 Ready for Phase 2: Profile Population Logic');

  } catch (error) {
    logger.error('❌ Error setting up profile tables:', error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  setupProfileTables()
    .then(() => {
      logger.info('✅ Profile tables setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('❌ Profile tables setup failed:', error);
      process.exit(1);
    });
}

export { setupProfileTables }; 