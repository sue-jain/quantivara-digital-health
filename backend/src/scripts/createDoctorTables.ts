import { db } from '../config/sqlite';
import { logger } from '../utils/logger';

export async function createDoctorTables(): Promise<void> {
  try {
    logger.info('🏥 Creating doctor-related database tables...');

    // 1. Doctors table - stores doctor information
    const createDoctorsTable = db.prepare(`
      CREATE TABLE IF NOT EXISTS app_doctors (
        id TEXT PRIMARY KEY,
        nmr_uid TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        specialty TEXT NOT NULL,
        state_code TEXT NOT NULL,
        hospital_id TEXT,
        hospital_name TEXT,
        license_number TEXT,
        qualification TEXT,
        experience_years INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Doctor-Patient relationships (care team with consent)
    const createDoctorPatientTable = db.prepare(`
      CREATE TABLE IF NOT EXISTS app_doctor_patients (
        id TEXT PRIMARY KEY,
        doctor_id TEXT NOT NULL,
        patient_id TEXT NOT NULL,
        consent_status TEXT DEFAULT 'pending', -- pending, approved, revoked
        consent_date DATETIME,
        consent_expiry_date DATETIME,
        access_level TEXT DEFAULT 'read', -- read, write, full
        relationship_type TEXT DEFAULT 'primary', -- primary, consultant, specialist
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (doctor_id) REFERENCES app_doctors (id),
        FOREIGN KEY (patient_id) REFERENCES app_users (id),
        UNIQUE(doctor_id, patient_id)
      )
    `);

    // 3. Doctor sessions (for authentication)
    const createDoctorSessionsTable = db.prepare(`
      CREATE TABLE IF NOT EXISTS app_doctor_sessions (
        id TEXT PRIMARY KEY,
        doctor_id TEXT NOT NULL,
        session_token TEXT UNIQUE NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (doctor_id) REFERENCES app_doctors (id)
      )
    `);

    // 4. Doctor consultations/visits
    const createConsultationsTable = db.prepare(`
      CREATE TABLE IF NOT EXISTS app_consultations (
        id TEXT PRIMARY KEY,
        doctor_id TEXT NOT NULL,
        patient_id TEXT NOT NULL,
        consultation_date DATETIME NOT NULL,
        consultation_type TEXT DEFAULT 'in_person', -- in_person, telemedicine, follow_up
        chief_complaint TEXT,
        diagnosis TEXT,
        treatment_plan TEXT,
        prescription_id TEXT,
        follow_up_date DATETIME,
        status TEXT DEFAULT 'completed', -- scheduled, in_progress, completed, cancelled
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (doctor_id) REFERENCES app_doctors (id),
        FOREIGN KEY (patient_id) REFERENCES app_users (id)
      )
    `);

    // 5. Doctor prescriptions
    const createPrescriptionsTable = db.prepare(`
      CREATE TABLE IF NOT EXISTS app_prescriptions (
        id TEXT PRIMARY KEY,
        consultation_id TEXT NOT NULL,
        doctor_id TEXT NOT NULL,
        patient_id TEXT NOT NULL,
        prescription_date DATETIME NOT NULL,
        medicines TEXT NOT NULL, -- JSON array of medicines
        instructions TEXT,
        follow_up_required BOOLEAN DEFAULT 0,
        follow_up_date DATETIME,
        status TEXT DEFAULT 'active', -- active, completed, cancelled
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (consultation_id) REFERENCES app_consultations (id),
        FOREIGN KEY (doctor_id) REFERENCES app_doctors (id),
        FOREIGN KEY (patient_id) REFERENCES app_users (id)
      )
    `);

    // 6. Voice diagnosis records
    const createVoiceDiagnosisTable = db.prepare(`
      CREATE TABLE IF NOT EXISTS app_voice_diagnosis (
        id TEXT PRIMARY KEY,
        doctor_id TEXT NOT NULL,
        patient_id TEXT NOT NULL,
        consultation_id TEXT,
        audio_file_path TEXT,
        transcribed_text TEXT,
        ai_analysis TEXT, -- JSON of AI analysis results
        symptoms_extracted TEXT, -- JSON array of symptoms
        confidence_score REAL,
        status TEXT DEFAULT 'processed', -- processing, processed, failed
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (doctor_id) REFERENCES app_doctors (id),
        FOREIGN KEY (patient_id) REFERENCES app_users (id),
        FOREIGN KEY (consultation_id) REFERENCES app_consultations (id)
      )
    `);

    // 7. Medicine interaction database
    const createMedicineInteractionsTable = db.prepare(`
      CREATE TABLE IF NOT EXISTS app_medicine_interactions (
        id TEXT PRIMARY KEY,
        medicine_1_name TEXT NOT NULL,
        medicine_2_name TEXT NOT NULL,
        interaction_type TEXT NOT NULL, -- severe, moderate, minor
        description TEXT NOT NULL,
        recommendation TEXT,
        severity_level INTEGER NOT NULL, -- 1=minor, 2=moderate, 3=severe
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 8. Doctor notifications/alerts
    const createDoctorNotificationsTable = db.prepare(`
      CREATE TABLE IF NOT EXISTS app_doctor_notifications (
        id TEXT PRIMARY KEY,
        doctor_id TEXT NOT NULL,
        notification_type TEXT NOT NULL, -- consent_request, patient_update, system_alert
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        patient_id TEXT,
        consultation_id TEXT,
        is_read BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (doctor_id) REFERENCES app_doctors (id),
        FOREIGN KEY (patient_id) REFERENCES app_users (id),
        FOREIGN KEY (consultation_id) REFERENCES app_consultations (id)
      )
    `);

    // Execute table creation
    createDoctorsTable.run();
    createDoctorPatientTable.run();
    createDoctorSessionsTable.run();
    createConsultationsTable.run();
    createPrescriptionsTable.run();
    createVoiceDiagnosisTable.run();
    createMedicineInteractionsTable.run();
    createDoctorNotificationsTable.run();

    // Create indexes for better performance
    const createIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_doctors_nmr_uid ON app_doctors (nmr_uid)',
      'CREATE INDEX IF NOT EXISTS idx_doctors_email ON app_doctors (email)',
      'CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON app_doctors (specialty)',
      'CREATE INDEX IF NOT EXISTS idx_doctors_hospital ON app_doctors (hospital_id)',
      'CREATE INDEX IF NOT EXISTS idx_doctor_patients_doctor ON app_doctor_patients (doctor_id)',
      'CREATE INDEX IF NOT EXISTS idx_doctor_patients_patient ON app_doctor_patients (patient_id)',
      'CREATE INDEX IF NOT EXISTS idx_doctor_patients_consent ON app_doctor_patients (consent_status)',
      'CREATE INDEX IF NOT EXISTS idx_consultations_doctor ON app_consultations (doctor_id)',
      'CREATE INDEX IF NOT EXISTS idx_consultations_patient ON app_consultations (patient_id)',
      'CREATE INDEX IF NOT EXISTS idx_consultations_date ON app_consultations (consultation_date)',
      'CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor ON app_prescriptions (doctor_id)',
      'CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON app_prescriptions (patient_id)',
      'CREATE INDEX IF NOT EXISTS idx_voice_diagnosis_doctor ON app_voice_diagnosis (doctor_id)',
      'CREATE INDEX IF NOT EXISTS idx_voice_diagnosis_patient ON app_voice_diagnosis (patient_id)',
      'CREATE INDEX IF NOT EXISTS idx_medicine_interactions_med1 ON app_medicine_interactions (medicine_1_name)',
      'CREATE INDEX IF NOT EXISTS idx_medicine_interactions_med2 ON app_medicine_interactions (medicine_2_name)',
      'CREATE INDEX IF NOT EXISTS idx_doctor_notifications_doctor ON app_doctor_notifications (doctor_id)',
      'CREATE INDEX IF NOT EXISTS idx_doctor_notifications_unread ON app_doctor_notifications (doctor_id, is_read)'
    ];

    createIndexes.forEach(indexQuery => {
      db.prepare(indexQuery).run();
    });

    logger.info('✅ Doctor tables created successfully');
    logger.info('📊 Created tables:');
    logger.info('   - app_doctors (doctor information)');
    logger.info('   - app_doctor_patients (doctor-patient relationships)');
    logger.info('   - app_doctor_sessions (doctor authentication)');
    logger.info('   - app_consultations (consultation records)');
    logger.info('   - app_prescriptions (prescription records)');
    logger.info('   - app_voice_diagnosis (voice diagnosis records)');
    logger.info('   - app_medicine_interactions (medicine interaction database)');
    logger.info('   - app_doctor_notifications (doctor notifications)');

  } catch (error) {
    logger.error('❌ Error creating doctor tables:', error);
    throw error;
  }
}

export default createDoctorTables;


