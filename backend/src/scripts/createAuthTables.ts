import { db } from '../config/sqlite';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

const createAuthTables = async () => {
  try {
    logger.info('🏗️ Creating authentication system tables...');

    // 1. ABHA Registry (Government System Simulation)
    logger.info('📋 Creating app_abha_registry table...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS app_abha_registry (
        id TEXT PRIMARY KEY,
        aadhar_id TEXT UNIQUE NOT NULL,
        abha_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        date_of_birth TEXT NOT NULL,
        gender TEXT NOT NULL,
        mobile TEXT,
        email TEXT,
        created_date TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        is_demo_patient BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. App Users (Login System)
    logger.info('👤 Creating app_users table...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS app_users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        first_name TEXT,
        last_name TEXT,
        date_of_birth TEXT,
        gender TEXT,
        role TEXT DEFAULT 'patient',
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. User ABHA Profiles (Health Data)
    logger.info('🏥 Creating app_user_abha_profiles table...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS app_user_abha_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        abha_id TEXT NOT NULL,
        blood_group TEXT,
        height_cm INTEGER,
        weight_kg INTEGER,
        emergency_contact TEXT, -- JSON
        medical_conditions TEXT, -- JSON
        allergies TEXT, -- JSON
        current_medications TEXT, -- JSON
        address TEXT, -- JSON
        linked_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        verification_status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES app_users(id),
        FOREIGN KEY (abha_id) REFERENCES app_abha_registry(abha_id),
        UNIQUE(user_id, abha_id)
      )
    `);

    // 4. User Sessions (Authentication)
    logger.info('🔐 Creating app_user_sessions table...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS app_user_sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES app_users(id)
      )
    `);

    // 5. User Care Team
    logger.info('👥 Creating app_user_care_team table...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS app_user_care_team (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        abha_id TEXT, -- nullable for pending invites before ABHA registration
        provider_type TEXT NOT NULL, -- doctor/lab/hospital
        provider_id TEXT,
        provider_name TEXT NOT NULL,
        consent_status TEXT DEFAULT 'pending', -- pending/approved/revoked
        consent_date DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES app_users(id),
        FOREIGN KEY (abha_id) REFERENCES app_abha_registry(abha_id)
      )
    `);
    
    // Migration: Make abha_id nullable if it was previously NOT NULL
    try {
      db.exec(`ALTER TABLE app_user_care_team ALTER COLUMN abha_id DROP NOT NULL`);
    } catch (e) {
      // Table might not exist yet or column might already be nullable
    }

    // 6. User Medical Documents
    logger.info('📄 Creating app_user_medical_documents table...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS app_user_medical_documents (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        abha_id TEXT NOT NULL,
        document_type TEXT NOT NULL,
        file_name TEXT NOT NULL,
        content TEXT, -- JSON
        metadata TEXT, -- JSON
        extraction_accuracy INTEGER,
        status TEXT DEFAULT 'processed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES app_users(id),
        FOREIGN KEY (abha_id) REFERENCES app_abha_registry(abha_id)
      )
    `);

    // 7. User Diagnoses
    logger.info('🩺 Creating app_user_diagnoses table...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS app_user_diagnoses (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        abha_id TEXT NOT NULL,
        diagnosis_name TEXT NOT NULL,
        diagnosis_date TEXT NOT NULL,
        doctor_name TEXT,
        status TEXT DEFAULT 'active',
        severity TEXT DEFAULT 'moderate',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES app_users(id),
        FOREIGN KEY (abha_id) REFERENCES app_abha_registry(abha_id)
      )
    `);

    // Create indexes for performance
    logger.info('📊 Creating indexes...');
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_app_users_username ON app_users(username);
      CREATE INDEX IF NOT EXISTS idx_app_users_email ON app_users(email);
      CREATE INDEX IF NOT EXISTS idx_app_abha_registry_aadhar ON app_abha_registry(aadhar_id);
      CREATE INDEX IF NOT EXISTS idx_app_abha_registry_abha ON app_abha_registry(abha_id);
      CREATE INDEX IF NOT EXISTS idx_app_user_abha_profiles_user ON app_user_abha_profiles(user_id);
      CREATE INDEX IF NOT EXISTS idx_app_user_abha_profiles_abha ON app_user_abha_profiles(abha_id);
      CREATE INDEX IF NOT EXISTS idx_app_user_sessions_token ON app_user_sessions(token);
      CREATE INDEX IF NOT EXISTS idx_app_user_sessions_user ON app_user_sessions(user_id);
    `);

    logger.info('✅ Authentication system tables created successfully!');
    
    // 7b. Patient Ordered Lab Tests
    logger.info('🧪 Creating app_patient_ordered_tests table...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS app_patient_ordered_tests (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        test_id TEXT NOT NULL,
        test_name TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'ordered', -- ordered | pending_review | completed
        ordered_by TEXT NOT NULL, -- self | doctor
        report_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES app_users(id)
      )
    `);

    // 8. Labs (HFR registry for labs)
    logger.info('🧪 Creating app_labs table...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS app_labs (
        id TEXT PRIMARY KEY,
        hfr_uid TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        address TEXT,
        city TEXT,
        state_code TEXT,
        license_number TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 8b. Patient Invites (lab-assisted onboarding)
    logger.info('✉️ Creating app_patient_invites table...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS app_patient_invites (
        id TEXT PRIMARY KEY,
        lab_id TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        date_of_birth TEXT,
        phone TEXT NOT NULL,
        invite_code TEXT UNIQUE NOT NULL,
        otp_code TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending', -- pending | verified | expired | completed
        expires_at DATETIME NOT NULL,
        user_id TEXT, -- set after OTP verify when provisional user is created
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lab_id) REFERENCES app_labs(id),
        FOREIGN KEY (user_id) REFERENCES app_users(id)
      )
    `);
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_app_patient_invites_code ON app_patient_invites(invite_code);
      CREATE INDEX IF NOT EXISTS idx_app_patient_invites_phone ON app_patient_invites(phone);
      CREATE INDEX IF NOT EXISTS idx_app_patient_invites_status ON app_patient_invites(status);
    `);
    
    logger.info('🧪 Creating app_lab_sessions table...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS app_lab_sessions (
        id TEXT PRIMARY KEY,
        lab_id TEXT NOT NULL,
        session_token TEXT UNIQUE NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lab_id) REFERENCES app_labs(id)
      )
    `);
    
    // Populate demo ABHA registry
    await populateDemoABHARegistry();

    // Create Lab Tests Catalog table
    logger.info('🧪 Creating app_lab_tests_catalog table...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS app_lab_tests_catalog (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        loinc_code TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed top lab tests if empty
    const existingCount = db.prepare('SELECT COUNT(*) as count FROM app_lab_tests_catalog').get() as { count: number };
    if (!existingCount || existingCount.count === 0) {
      logger.info('🧪 Populating sample lab tests...');
      const tests = [
        { id: 'LT-CBC', name: 'Complete Blood Count (CBC)', loinc: '57021-8' },
        { id: 'LT-LIPID', name: 'Lipid Profile', loinc: '24331-1' },
        { id: 'LT-LFT', name: 'Liver Function Test (LFT)', loinc: '24325-3' },
        { id: 'LT-KFT', name: 'Kidney Function Test (KFT)', loinc: '35203-9' },
        { id: 'LT-TSH', name: 'Thyroid Stimulating Hormone (TSH)', loinc: '3016-3' },
        { id: 'LT-HBA1C', name: 'HbA1c (Glycated Hemoglobin)', loinc: '4548-4' },
        { id: 'LT-FASTINGGLU', name: 'Fasting Blood Glucose', loinc: '14771-0' },
        { id: 'LT-PSA', name: 'Prostate Specific Antigen (PSA)', loinc: '2857-1' },
        { id: 'LT-VITD', name: 'Vitamin D (25-OH)', loinc: '62292-8' },
        { id: 'LT-URINE', name: 'Urine Routine & Microscopy', loinc: '5804-0' }
      ];
      const stmt = db.prepare('INSERT OR REPLACE INTO app_lab_tests_catalog (id, name, loinc_code) VALUES (?, ?, ?)');
      tests.forEach(t => stmt.run(t.id, t.name, t.loinc));
    }
    
  } catch (error) {
    logger.error('❌ Failed to create authentication tables:', error);
    throw error;
  }
};

const populateDemoABHARegistry = async () => {
  try {
    logger.info('🎭 Populating demo ABHA registry...');

    // Check if demo data already exists
    const existingCount = db.prepare('SELECT COUNT(*) as count FROM app_abha_registry WHERE is_demo_patient = 1').get() as { count: number };
    
    if (existingCount.count > 0) {
      logger.info('✅ Demo ABHA registry already populated');
      return;
    }

    // Demo ABHA IDs (same as existing demo patients)
    const demoABHAData = [
      {
        aadhar_id: '123456789012',
        abha_id: '12345678901234',
        name: 'Ramesh Kumar',
        date_of_birth: '1975-03-15',
        gender: 'Male',
        mobile: '9876543201',
        email: 'ramesh.kumar@email.com'
      },
      {
        aadhar_id: '987654321098',
        abha_id: '98765432109876',
        name: 'Priya Sharma',
        date_of_birth: '1988-07-22',
        gender: 'Female',
        mobile: '9876543202',
        email: 'priya.sharma@email.com'
      },
      {
        aadhar_id: '456789012345',
        abha_id: '45678901234567',
        name: 'Suresh Patel',
        date_of_birth: '1965-11-08',
        gender: 'Male',
        mobile: '9876543203',
        email: 'suresh.patel@email.com'
      },
      {
        aadhar_id: '111122223333',
        abha_id: '11112222333344',
        name: 'Ashok Gupta',
        date_of_birth: '1980-01-30',
        gender: 'Male',
        mobile: '9876543204',
        email: 'ashok.gupta@email.com'
      },
      {
        aadhar_id: '555566667777',
        abha_id: '55556666777788',
        name: 'Meera Singh',
        date_of_birth: '1992-09-14',
        gender: 'Female',
        mobile: '9876543205',
        email: 'meera.singh@email.com'
      }
    ];

    // Insert demo ABHA data
    for (const demo of demoABHAData) {
      db.prepare(`
        INSERT INTO app_abha_registry 
        (id, aadhar_id, abha_id, name, date_of_birth, gender, mobile, email, created_date, status, is_demo_patient)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        uuidv4(),
        demo.aadhar_id,
        demo.abha_id,
        demo.name,
        demo.date_of_birth,
        demo.gender,
        demo.mobile,
        demo.email,
        '2024-01-01',
        'active',
        1
      );
    }

    logger.info(`✅ Populated ${demoABHAData.length} demo ABHA records`);
    
  } catch (error) {
    logger.error('❌ Failed to populate demo ABHA registry:', error);
    throw error;
  }
};

export default createAuthTables;
