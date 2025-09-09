import { db } from '../config/sqlite';
import { logger } from '../utils/logger';
import createAuthTables from './createAuthTables';
import createDoctorTables from './createDoctorTables';
import createDemoLabs from './createDemoLabs';

const createTables = () => {
  try {
    logger.info('🏗️  Creating database tables...');

    // First, create the new auth system tables
    logger.info('🔐 Setting up new authentication system tables...');
    createAuthTables();
    createDoctorTables();
    
    // Create demo labs
    logger.info('🧪 Setting up demo labs...');
    createDemoLabs();

    // Keep existing tables for backward compatibility with DEMO_HUB
    logger.info('🔄 Creating legacy tables for DEMO_HUB compatibility...');
    
    // Users table (legacy - for DEMO_HUB)
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        abha_id TEXT UNIQUE,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'patient',
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        date_of_birth TEXT,
        gender TEXT,
        address TEXT, -- JSON string
        languages TEXT DEFAULT '["en"]', -- JSON array
        is_active INTEGER DEFAULT 1,
        email_verified INTEGER DEFAULT 0,
        phone_verified INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        last_login TEXT
      );
    `);

    // Healthcare providers (hospitals, labs, clinics)
    db.exec(`
      CREATE TABLE IF NOT EXISTS healthcare_providers (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        name TEXT NOT NULL,
        type TEXT NOT NULL, -- 'hospital', 'lab', 'clinic'
        registration_number TEXT UNIQUE,
        address TEXT NOT NULL, -- JSON string
        contact_info TEXT NOT NULL, -- JSON string
        certifications TEXT, -- JSON array
        specialties TEXT, -- JSON array
        tier TEXT DEFAULT 'tier-2',
        is_government INTEGER DEFAULT 0,
        monthly_fee INTEGER DEFAULT 0, -- in paise
        reports_processed INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);

    // Doctors
    db.exec(`
      CREATE TABLE IF NOT EXISTS doctors (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        provider_id TEXT REFERENCES healthcare_providers(id),
        medical_registration_number TEXT UNIQUE NOT NULL,
        degree TEXT NOT NULL,
        specialization TEXT,
        experience_years INTEGER DEFAULT 0,
        consultation_fee INTEGER DEFAULT 0, -- in paise
        medical_system TEXT DEFAULT 'allopathy',
        languages TEXT DEFAULT '["en", "hi"]', -- JSON array
        is_verified INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);

    // Patients
    db.exec(`
      CREATE TABLE IF NOT EXISTS patients (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        blood_group TEXT,
        height_cm INTEGER,
        weight_kg REAL,
        emergency_contact TEXT, -- JSON string
        medical_conditions TEXT, -- JSON array
        allergies TEXT, -- JSON array
        current_medications TEXT, -- JSON string
        family_history TEXT, -- JSON string
        insurance_details TEXT, -- JSON string
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);

    // Family relationships
    db.exec(`
      CREATE TABLE IF NOT EXISTS family_relationships (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        primary_patient_id TEXT REFERENCES patients(id),
        related_patient_id TEXT REFERENCES patients(id),
        relationship TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);

    // Medical documents
    db.exec(`
      CREATE TABLE IF NOT EXISTS medical_documents (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        patient_id TEXT REFERENCES patients(id),
        provider_id TEXT REFERENCES healthcare_providers(id),
        doctor_id TEXT REFERENCES doctors(id),
        document_type TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        file_path TEXT,
        file_name TEXT,
        file_size INTEGER,
        mime_type TEXT,
        processing_started_at TEXT,
        processing_completed_at TEXT,
        extraction_accuracy REAL,
        extracted_data TEXT, -- JSON string
        original_language TEXT DEFAULT 'en',
        urgency TEXT DEFAULT 'routine',
        abha_id TEXT, -- ABHA ID for direct linking
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);

    // Prescriptions
    db.exec(`
      CREATE TABLE IF NOT EXISTS prescriptions (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        document_id TEXT REFERENCES medical_documents(id) ON DELETE CASCADE,
        patient_id TEXT REFERENCES patients(id),
        doctor_id TEXT REFERENCES doctors(id),
        diagnosis TEXT, -- JSON array
        medications TEXT NOT NULL, -- JSON array
        advice TEXT, -- JSON array
        follow_up_date TEXT,
        medical_system TEXT DEFAULT 'allopathy',
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);

    // Lab reports
    db.exec(`
      CREATE TABLE IF NOT EXISTS lab_reports (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        document_id TEXT REFERENCES medical_documents(id) ON DELETE CASCADE,
        patient_id TEXT REFERENCES patients(id),
        lab_provider_id TEXT REFERENCES healthcare_providers(id),
        test_results TEXT NOT NULL, -- JSON array
        critical_values INTEGER DEFAULT 0,
        abnormal_values INTEGER DEFAULT 0,
        ai_insights TEXT, -- JSON array
        report_date TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);

    // Revenue tracking
    db.exec(`
      CREATE TABLE IF NOT EXISTS revenue_events (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        event_type TEXT NOT NULL,
        amount_paise INTEGER NOT NULL,
        currency TEXT DEFAULT 'INR',
        document_id TEXT REFERENCES medical_documents(id),
        description TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);

    // Network connections
    db.exec(`
      CREATE TABLE IF NOT EXISTS network_connections (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        lab_provider_id TEXT REFERENCES healthcare_providers(id),
        hospital_provider_id TEXT REFERENCES healthcare_providers(id),
        connection_date TEXT DEFAULT (datetime('now')),
        reports_exchanged INTEGER DEFAULT 0,
        total_revenue_paise INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1
      );
    `);

    // Medical audit log
    db.exec(`
      CREATE TABLE IF NOT EXISTS medical_audit_log (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT REFERENCES users(id),
        patient_id TEXT REFERENCES patients(id),
        document_id TEXT REFERENCES medical_documents(id),
        action TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        success INTEGER DEFAULT 1,
        details TEXT, -- JSON string
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);

    // Add missing abha_id column to medical_documents if it doesn't exist
    try {
      db.exec(`ALTER TABLE medical_documents ADD COLUMN abha_id TEXT;`);
      logger.info('✅ Added abha_id column to medical_documents table');
    } catch (error) {
      // Column already exists, ignore error
      logger.info('ℹ️ abha_id column already exists in medical_documents table');
    }

    // Create indexes for performance (with error handling for each index)
    const createIndexes = () => {
      const indexes = [
        'CREATE INDEX IF NOT EXISTS idx_users_abha_id ON users(abha_id)',
        'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
        'CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)',
        'CREATE INDEX IF NOT EXISTS idx_providers_type ON healthcare_providers(type)',
        'CREATE INDEX IF NOT EXISTS idx_providers_tier ON healthcare_providers(tier)',
        'CREATE INDEX IF NOT EXISTS idx_documents_patient ON medical_documents(patient_id)',
        'CREATE INDEX IF NOT EXISTS idx_documents_type ON medical_documents(document_type)',
        'CREATE INDEX IF NOT EXISTS idx_documents_status ON medical_documents(status)',
        'CREATE INDEX IF NOT EXISTS idx_documents_abha_id ON medical_documents(abha_id)',
        'CREATE INDEX IF NOT EXISTS idx_revenue_entity ON revenue_events(entity_type, entity_id)',
        'CREATE INDEX IF NOT EXISTS idx_revenue_created ON revenue_events(created_at)'
      ];
      
      for (const index of indexes) {
        try {
          db.exec(index);
        } catch (error) {
          logger.warn(`⚠️ Could not create index: ${index}`, error);
        }
      }
    };
    
    createIndexes();

    logger.info('✅ Database tables created successfully');
    return true;
  } catch (error) {
    logger.error('❌ Error creating database tables:', error);
    return false;
  }
};

// Main setup function
const setupDatabase = () => {
  logger.info('🚀 Setting up Quantivara database...');
  
  if (createTables()) {
    logger.info('🎉 Database setup completed successfully!');
    logger.info('💡 Next step: Run "npm run db:seed" to populate with demo data');
  } else {
    logger.error('💥 Database setup failed!');
    process.exit(1);
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

export { setupDatabase, createTables };