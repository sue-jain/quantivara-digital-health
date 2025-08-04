import { db } from '../config/sqlite';
import { logger } from '../utils/logger';
import bcrypt from 'bcryptjs';

// Fixed demo ABHA IDs for consistent demos
const DEMO_ABHA_IDS = [
  '12345678901234', // Ramesh Kumar - Diabetes
  '98765432109876', // Priya Sharma - Asthma  
  '45678901234567', // Suresh Patel - Heart Disease
  '11112222333344', // Ashok Gupta - Hypertension
  '55556666777788', // Meera Singh - Thyroid
];

const DEMO_PATIENTS = [
  { abhaId: '12345678901234', firstName: 'Ramesh', lastName: 'Kumar', gender: 'Male', conditions: ['Type 2 Diabetes Mellitus', 'Hypertension'] },
  { abhaId: '98765432109876', firstName: 'Priya', lastName: 'Sharma', gender: 'Female', conditions: ['Asthma'] },
  { abhaId: '45678901234567', firstName: 'Suresh', lastName: 'Patel', gender: 'Male', conditions: ['Coronary Artery Disease'] },
  { abhaId: '11112222333344', firstName: 'Ashok', lastName: 'Gupta', gender: 'Male', conditions: ['Hypertension'] },
  { abhaId: '55556666777788', firstName: 'Meera', lastName: 'Singh', gender: 'Female', conditions: ['Thyroid Disorders'] },
];

const resetDatabase = async () => {
  try {
    logger.info('🔄 Resetting database with fixed demo data...');
    
    // Temporarily disable foreign key constraints
    db.pragma('foreign_keys = OFF');
    
    // Clear existing data
    logger.info('🧹 Clearing existing data...');
    const tables = [
      'revenue_events', 'network_connections', 'medical_audit_log',
      'lab_reports', 'prescriptions', 'medical_documents',
      'family_relationships', 'patients', 'doctors', 'healthcare_providers', 'users'
    ];
    
    for (const table of tables) {
      db.prepare(`DELETE FROM ${table}`).run();
    }

    // Seed healthcare providers
    logger.info('🏥 Seeding healthcare providers...');
    const providerIds: string[] = [];
    
    // Add hospitals
    const hospitals = [
      { name: 'Apollo Hospitals', tier: 'tier-1', fee: 10000000 },
      { name: 'Fortis Healthcare', tier: 'tier-1', fee: 10000000 },
      { name: 'Max Healthcare', tier: 'tier-1', fee: 8000000 },
    ];
    
    for (const hospital of hospitals) {
      const result = db.prepare(`
        INSERT INTO healthcare_providers 
        (name, type, registration_number, address, contact_info, certifications, tier, is_government, monthly_fee, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        hospital.name,
        'hospital',
        `HOS-${Math.floor(Math.random() * 900000) + 100000}`,
        JSON.stringify({
          street: 'Medical Complex',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        }),
        JSON.stringify({
          phone: '9876543210',
          email: `info@${hospital.name.toLowerCase().replace(/\s+/g, '')}.com`,
          website: `www.${hospital.name.toLowerCase().replace(/\s+/g, '')}.com`
        }),
        JSON.stringify(['NABH', 'NABL']),
        hospital.tier,
        0,
        hospital.fee,
        1
      );
      providerIds.push(result.lastInsertRowid.toString());
    }

    // Seed demo patients
    logger.info('👥 Seeding demo patients...');
    const patientIds: string[] = [];
    
    for (let i = 0; i < DEMO_PATIENTS.length; i++) {
      const patient = DEMO_PATIENTS[i];
      
      // Create user
      const userResult = db.prepare(`
        INSERT INTO users 
        (abha_id, email, phone, password_hash, first_name, last_name, date_of_birth, gender, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        patient.abhaId,
        `${patient.firstName.toLowerCase()}.${patient.lastName.toLowerCase()}@email.com`,
        `98765432${i.toString().padStart(2, '0')}`,
        await bcrypt.hash('demo123', 10),
        patient.firstName,
        patient.lastName,
        '1990-01-01',
        patient.gender,
        'patient'
      );
      
      // Create patient profile
      const patientResult = db.prepare(`
        INSERT INTO patients 
        (user_id, blood_group, height_cm, weight_kg, emergency_contact, medical_conditions, allergies, current_medications)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        userResult.lastInsertRowid.toString(),
        'A+',
        165,
        70,
        JSON.stringify({
          name: `${patient.firstName} ${patient.lastName}`,
          relationship: 'Spouse',
          phone: `98765432${(i + 10).toString().padStart(2, '0')}`
        }),
        JSON.stringify(patient.conditions),
        JSON.stringify([]),
        JSON.stringify([])
      );
      
      patientIds.push(patientResult.lastInsertRowid.toString());
    }

    // Re-enable foreign key constraints
    db.pragma('foreign_keys = ON');
    
    logger.info('✅ Database reset completed successfully!');
    logger.info(`📊 Demo data summary:`);
    logger.info(`   - Healthcare Providers: ${hospitals.length}`);
    logger.info(`   - Demo Patients: ${DEMO_PATIENTS.length}`);
    logger.info('🎯 Ready for consistent demos!');
    
  } catch (error) {
    logger.error('❌ Database reset failed:', error);
    // Re-enable foreign key constraints even on error
    db.pragma('foreign_keys = ON');
    throw error;
  }
};

// Run reset if this file is executed directly
if (require.main === module) {
  resetDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { resetDatabase }; 