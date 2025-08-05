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
  { abhaId: '12345678901234', firstName: 'Ramesh', lastName: 'Kumar', gender: 'Male', dateOfBirth: '1975-03-15', conditions: ['Type 2 Diabetes Mellitus', 'Hypertension'] },
  { abhaId: '98765432109876', firstName: 'Priya', lastName: 'Sharma', gender: 'Female', dateOfBirth: '1988-07-22', conditions: ['Asthma'] },
  { abhaId: '45678901234567', firstName: 'Suresh', lastName: 'Patel', gender: 'Male', dateOfBirth: '1965-11-08', conditions: ['Coronary Artery Disease'] },
  { abhaId: '11112222333344', firstName: 'Ashok', lastName: 'Gupta', gender: 'Male', dateOfBirth: '1980-01-30', conditions: ['Hypertension'] },
  { abhaId: '55556666777788', firstName: 'Meera', lastName: 'Singh', gender: 'Female', dateOfBirth: '1992-09-14', conditions: ['Thyroid Disorders'] },
];

const DEMO_HOSPITALS = [
  { name: 'Apollo Hospitals', tier: 'tier-1', fee: 10000000 },
  { name: 'Fortis Healthcare', tier: 'tier-1', fee: 10000000 },
  { name: 'Max Healthcare', tier: 'tier-1', fee: 8000000 },
];

const addDemoData = async () => {
  try {
    logger.info('🔍 Checking for missing demo data...');
    
    // Check which demo ABHA IDs already exist
    const existingDemoAbhas = db.prepare(`
      SELECT abha_id FROM users 
      WHERE abha_id IN (${DEMO_ABHA_IDS.map(() => '?').join(',')})
    `).all(DEMO_ABHA_IDS) as { abha_id: string }[];
    
    const existingAbhaIds = existingDemoAbhas.map(row => row.abha_id);
    const missingAbhaIds = DEMO_ABHA_IDS.filter(id => !existingAbhaIds.includes(id));
    
    if (missingAbhaIds.length === 0) {
      logger.info('✅ All demo ABHA IDs already exist in database');
      logger.info('📊 Demo data summary:');
      logger.info(`   - Demo Patients: ${DEMO_PATIENTS.length} (all present)`);
      logger.info('🎯 Ready for consistent demos!');
      return;
    }
    
    logger.info(`🔍 Found ${missingAbhaIds.length} missing demo ABHA IDs: ${missingAbhaIds.join(', ')}`);
    logger.info('➕ Adding missing demo data...');
    
    // Temporarily disable foreign key constraints
    db.pragma('foreign_keys = OFF');
    
    // Check if healthcare providers exist, add if missing
    logger.info('🏥 Checking healthcare providers...');
    const existingProviders = db.prepare(`
      SELECT name FROM healthcare_providers 
      WHERE name IN (${DEMO_HOSPITALS.map(() => '?').join(',')})
    `).all(DEMO_HOSPITALS.map(h => h.name)) as { name: string }[];
    
    const existingProviderNames = existingProviders.map(row => row.name);
    const missingProviders = DEMO_HOSPITALS.filter(h => !existingProviderNames.includes(h.name));
    
    if (missingProviders.length > 0) {
      logger.info(`🏥 Adding ${missingProviders.length} missing healthcare providers...`);
      for (const hospital of missingProviders) {
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
      }
    }

    // Add missing demo patients
    logger.info(`👥 Adding ${missingAbhaIds.length} missing demo patients...`);
    const patientIds: string[] = [];
    
    for (const missingAbhaId of missingAbhaIds) {
      const patient = DEMO_PATIENTS.find(p => p.abhaId === missingAbhaId);
      if (!patient) continue;
      
      // Create user
      const userResult = db.prepare(`
        INSERT INTO users 
        (abha_id, email, phone, password_hash, first_name, last_name, date_of_birth, gender, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        patient.abhaId,
        `${patient.firstName.toLowerCase()}.${patient.lastName.toLowerCase()}@email.com`,
        `98765432${Math.floor(Math.random() * 100)}`,
        await bcrypt.hash('demo123', 10),
        patient.firstName,
        patient.lastName,
        patient.dateOfBirth,
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
          phone: `98765432${Math.floor(Math.random() * 100)}`
        }),
        JSON.stringify(patient.conditions),
        JSON.stringify([]),
        JSON.stringify([])
      );
      
      patientIds.push(patientResult.lastInsertRowid.toString());
    }

    // Re-enable foreign key constraints
    db.pragma('foreign_keys = ON');
    
    logger.info('✅ Demo data addition completed successfully!');
    logger.info(`📊 Demo data summary:`);
    logger.info(`   - Healthcare Providers: ${DEMO_HOSPITALS.length} (${missingProviders.length} added)`);
    logger.info(`   - Demo Patients: ${DEMO_PATIENTS.length} (${missingAbhaIds.length} added)`);
    logger.info('🎯 Ready for consistent demos!');
    
  } catch (error) {
    logger.error('❌ Demo data addition failed:', error);
    // Re-enable foreign key constraints even on error
    db.pragma('foreign_keys = ON');
    throw error;
  }
};

// Run if this file is executed directly
if (require.main === module) {
  addDemoData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { addDemoData }; 