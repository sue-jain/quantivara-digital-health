import { db } from '../config/sqlite';
import { logger } from '../utils/logger';
import bcrypt from 'bcryptjs';

// Demo patients with complete medical information and login credentials
const DEMO_PATIENTS = [
  { 
    abhaId: '12345678901234', 
    firstName: 'Ramesh', 
    lastName: 'Kumar', 
    gender: 'Male', 
    dateOfBirth: '1975-03-15',
    aadharId: '123456789012',
    conditions: ['Type 2 Diabetes Mellitus', 'Hypertension'],
    username: 'ramesh_kumar',
    password: 'demo123',
    email: 'ramesh.kumar@example.com',
    phone: '9876543210',
    address: 'Mumbai, Maharashtra, India',
    bloodGroup: 'B+',
    emergencyContact: '9876543215',
    medicalHistory: 'Diagnosed with Type 2 Diabetes in 2018, Hypertension in 2020'
  },
  { 
    abhaId: '98765432109876', 
    firstName: 'Priya', 
    lastName: 'Sharma', 
    gender: 'Female', 
    dateOfBirth: '1988-07-22',
    aadharId: '987654321098',
    conditions: ['Asthma'],
    username: 'priya_sharma',
    password: 'demo123',
    email: 'priya.sharma@example.com',
    phone: '9876543211',
    address: 'Mumbai, Maharashtra, India',
    bloodGroup: 'A+',
    emergencyContact: '9876543216',
    medicalHistory: 'Asthma since childhood, well controlled with medication'
  },
  { 
    abhaId: '45678901234567', 
    firstName: 'Suresh', 
    lastName: 'Patel', 
    gender: 'Male', 
    dateOfBirth: '1965-11-08',
    aadharId: '456789012345',
    conditions: ['Coronary Artery Disease'],
    username: 'suresh_patel',
    password: 'demo123',
    email: 'suresh.patel@example.com',
    phone: '9876543212',
    address: 'Mumbai, Maharashtra, India',
    bloodGroup: 'O+',
    emergencyContact: '9876543217',
    medicalHistory: 'Heart attack in 2019, underwent angioplasty, on cardiac medications'
  },
  { 
    abhaId: '11112222333344', 
    firstName: 'Ashok', 
    lastName: 'Gupta', 
    gender: 'Male', 
    dateOfBirth: '1980-01-30',
    aadharId: '111122223333',
    conditions: ['Hypertension'],
    username: 'ashok_gupta',
    password: 'demo123',
    email: 'ashok.gupta@example.com',
    phone: '9876543213',
    address: 'Mumbai, Maharashtra, India',
    bloodGroup: 'AB+',
    emergencyContact: '9876543218',
    medicalHistory: 'Hypertension diagnosed in 2015, managed with lifestyle changes and medication'
  },
  { 
    abhaId: '55556666777788', 
    firstName: 'Meera', 
    lastName: 'Singh', 
    gender: 'Female', 
    dateOfBirth: '1992-09-14',
    aadharId: '555566667777',
    conditions: ['Thyroid Disorders'],
    username: 'meera_singh',
    password: 'demo123',
    email: 'meera.singh@example.com',
    phone: '9876543214',
    address: 'Mumbai, Maharashtra, India',
    bloodGroup: 'B-',
    emergencyContact: '9876543219',
    medicalHistory: 'Hypothyroidism diagnosed in 2018, on thyroid replacement therapy'
  },
];

const createDemoUsers = async () => {
  try {
    logger.info('Creating demo users for new authentication system...');

    // Hash password for all demo users
    const hashedPassword = await bcrypt.hash('demo123', 10);

    for (const patient of DEMO_PATIENTS) {
      // Create user in app_users table
      const userId = `user-${patient.abhaId}`;
      
      const userResult = db.prepare(`
        INSERT OR REPLACE INTO app_users 
        (id, username, password_hash, email, phone, first_name, last_name, date_of_birth, gender, role, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        userId,
        patient.username,
        hashedPassword,
        patient.email,
        patient.phone,
        patient.firstName,
        patient.lastName,
        patient.dateOfBirth,
        patient.gender,
        'patient',
        new Date().toISOString(),
        new Date().toISOString()
      );

      // Create ABHA profile in app_abha_registry table
      const abhaResult = db.prepare(`
        INSERT OR REPLACE INTO app_abha_registry 
        (abha_id, aadhar_id, name, date_of_birth, gender, mobile, email, created_date, status, is_demo_patient, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        patient.abhaId,
        patient.aadharId,
        `${patient.firstName} ${patient.lastName}`,
        patient.dateOfBirth,
        patient.gender,
        patient.phone,
        patient.email,
        patient.dateOfBirth,
        'active',
        1, // is_demo_patient
        new Date().toISOString(),
        new Date().toISOString()
      );

      // Link user to ABHA ID in app_user_abha_profiles table
      const linkResult = db.prepare(`
        INSERT OR REPLACE INTO app_user_abha_profiles 
        (id, user_id, abha_id, blood_group, height_cm, weight_kg, emergency_contact, medical_conditions, allergies, current_medications, address, linked_date, verification_status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `profile-${userId}`,
        userId,
        patient.abhaId,
        patient.bloodGroup,
        170, // Default height for demo
        70,  // Default weight for demo
        patient.emergencyContact,
        patient.conditions.join(', '),
        'None known',
        'As prescribed by doctor',
        patient.address,
        new Date().toISOString(),
        'verified',
        new Date().toISOString(),
        new Date().toISOString()
      );

      // Create medical diagnoses for each condition
      for (const condition of patient.conditions) {
        const diagnosisId = `diag-${patient.abhaId}-${condition.replace(/\s+/g, '-').toLowerCase()}`;
        
        db.prepare(`
          INSERT OR REPLACE INTO app_user_diagnoses 
          (id, user_id, abha_id, diagnosis_name, diagnosis_date, doctor_name, status, severity, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          diagnosisId,
          userId,
          patient.abhaId,
          condition,
          patient.dateOfBirth, // Using DOB as diagnosis date for demo
          'Dr. Sample Doctor',
          'active',
          'moderate',
          new Date().toISOString(),
          new Date().toISOString()
        );
      }

      // Create sample medical documents for demo
      const sampleDocuments = [
        {
          id: `doc-${patient.abhaId}-prescription-1`,
          type: 'prescription',
          fileName: `Prescription for ${patient.conditions[0]}.pdf`,
          content: `Prescription for ${patient.firstName} ${patient.lastName}\nMedication: Sample medication for ${patient.conditions[0]}\nDosage: As prescribed\nDoctor: Dr. Sample Doctor`
        },
        {
          id: `doc-${patient.abhaId}-lab-report-1`,
          type: 'lab_report',
          fileName: `Lab Report - ${patient.conditions[0]}.pdf`,
          content: `Lab Report for ${patient.firstName} ${patient.lastName}\nTest: Blood test for ${patient.conditions[0]}\nResults: Within normal range\nDate: ${new Date().toISOString().split('T')[0]}`
        }
      ];

      for (const doc of sampleDocuments) {
        db.prepare(`
          INSERT OR REPLACE INTO app_user_medical_documents 
          (id, user_id, abha_id, document_type, file_name, content, metadata, extraction_accuracy, status, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          doc.id,
          userId,
          patient.abhaId,
          doc.type,
          doc.fileName,
          doc.content,
          JSON.stringify({ source: 'demo', created_by: 'system' }),
          95, // High accuracy for demo
          'processed',
          new Date().toISOString(),
          new Date().toISOString()
        );
      }

      logger.info(`✅ Created demo user: ${patient.firstName} ${patient.lastName} (${patient.username})`);
      logger.info(`   - ABHA ID: ${patient.abhaId}`);
      logger.info(`   - Conditions: ${patient.conditions.join(', ')}`);
      logger.info(`   - Medical documents: ${sampleDocuments.length} created`);
    }

    logger.info('🎉 All demo users created successfully!');
    logger.info('📋 Demo User Credentials:');
    logger.info('   Username: [patient_username]');
    logger.info('   Password: demo123');
    logger.info('   Examples:');
    logger.info('   - ramesh_kumar / demo123');
    logger.info('   - priya_sharma / demo123');
    logger.info('   - suresh_patel / demo123');
    logger.info('   - ashok_gupta / demo123');
    logger.info('   - meera_singh / demo123');

  } catch (error) {
    logger.error('❌ Error creating demo users:', error);
    throw error;
  }
};

export default createDemoUsers;

// Run if called directly
if (require.main === module) {
  createDemoUsers()
    .then(() => {
      logger.info('Demo users creation completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Demo users creation failed:', error);
      process.exit(1);
    });
}
