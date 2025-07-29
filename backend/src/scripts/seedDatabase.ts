import { db } from '../config/sqlite';
import { logger } from '../utils/logger';
import bcrypt from 'bcryptjs';

// Sample data for Indian healthcare ecosystem
const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad',
  'Nashik', 'Nagpur', 'Indore', 'Bhopal', 'Lucknow', 'Kanpur', 'Patna', 'Jaipur',
  'Surat', 'Vadodara', 'Rajkot', 'Coimbatore', 'Madurai', 'Thiruvananthapuram'
];

const INDIAN_NAMES = {
  male: ['Rajesh', 'Suresh', 'Ramesh', 'Ashok', 'Vikram', 'Arjun', 'Rohan', 'Amit', 'Sanjay', 'Deepak'],
  female: ['Priya', 'Sunita', 'Meera', 'Kavita', 'Rashmi', 'Pooja', 'Anjali', 'Neha', 'Ritu', 'Shreya'],
  surnames: ['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Agarwal', 'Jain', 'Shah', 'Mehta', 'Verma']
};

const MEDICAL_CONDITIONS = [
  'Type 2 Diabetes Mellitus', 'Hypertension', 'Coronary Artery Disease', 'Asthma', 
  'Chronic Kidney Disease', 'Rheumatoid Arthritis', 'Thyroid Disorders', 'COPD',
  'Osteoporosis', 'Depression', 'Migraine', 'Gastroesophageal Reflux Disease'
];

const INDIAN_MEDICATIONS = [
  { name: 'Metformin', dosage: '500mg', indication: 'Diabetes' },
  { name: 'Amlodipine', dosage: '5mg', indication: 'Hypertension' },
  { name: 'Atorvastatin', dosage: '20mg', indication: 'High Cholesterol' },
  { name: 'Aspirin', dosage: '75mg', indication: 'Cardioprotective' },
  { name: 'Omeprazole', dosage: '20mg', indication: 'Acid Reflux' },
  { name: 'Levothyroxine', dosage: '50mcg', indication: 'Thyroid' }
];

const HOSPITALS = [
  { name: 'Apollo Hospitals', tier: 'tier-1', fee: 10000000 }, // ₹1,00,000
  { name: 'Fortis Healthcare', tier: 'tier-1', fee: 10000000 },
  { name: 'Max Healthcare', tier: 'tier-1', fee: 8000000 }, // ₹80,000
  { name: 'Manipal Hospitals', tier: 'tier-1', fee: 8000000 },
  { name: 'AIIMS Delhi', tier: 'tier-1', fee: 0, isGov: true }
];

const LABS = [
  { name: 'PathLabs', tier: 'tier-1', fee: 1500000 }, // ₹15,000
  { name: 'Dr. Lal PathLabs', tier: 'tier-1', fee: 1500000 },
  { name: 'SRL Diagnostics', tier: 'tier-1', fee: 1200000 }, // ₹12,000
  { name: 'Metropolis Healthcare', tier: 'tier-1', fee: 1200000 },
  { name: 'LifeCare Diagnostics', tier: 'tier-2', fee: 700000 } // ₹7,000
];

// Helper functions
const generateABHAId = (): string => {
  return Array.from({ length: 14 }, () => Math.floor(Math.random() * 10)).join('');
};

const generatePhone = (): string => {
  return '9' + Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
};

const randomChoice = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateRealisticMedicalData = (documentType: string) => {
  const accuracy = randomInt(89, 98);
  
  switch (documentType) {
    case 'prescription':
      return {
        documentType: "Prescription",
        patientInfo: {
          name: `${randomChoice(INDIAN_NAMES.male)} ${randomChoice(INDIAN_NAMES.surnames)}`,
          age: `${randomInt(25, 80)} Years`,
          gender: randomChoice(['Male', 'Female']),
          patientId: `PID-2024-${randomInt(1000, 9999)}`
        },
        doctorInfo: {
          name: `Dr. ${randomChoice(INDIAN_NAMES.female)} ${randomChoice(INDIAN_NAMES.surnames)}, MBBS, MD`,
          registration: `MCI-${randomInt(10000, 99999)}`,
          clinic: randomChoice(HOSPITALS).name
        },
        diagnosis: [randomChoice(MEDICAL_CONDITIONS)],
        medications: Array.from({ length: randomInt(2, 4) }, () => {
          const med = randomChoice(INDIAN_MEDICATIONS);
          return {
            name: med.name,
            dosage: med.dosage,
            frequency: randomChoice(['Once daily', 'Twice daily', 'Thrice daily']),
            duration: `${randomInt(7, 30)} days`,
            instructions: randomChoice(['After meals', 'Before meals', 'With water'])
          };
        }),
        advice: [
          'Regular exercise 30 min daily',
          'Avoid sugar and fried foods',
          'Monitor blood pressure daily'
        ],
        followUp: `After ${randomInt(7, 30)} days with reports`,
        extractionAccuracy: `${accuracy}%`
      };
      
    case 'lab_report':
      const criticalCount = randomInt(0, 2);
      const abnormalCount = randomInt(1, 4);
      return {
        documentType: "Lab Report",
        patientInfo: {
          name: `${randomChoice(INDIAN_NAMES.female)} ${randomChoice(INDIAN_NAMES.surnames)}`,
          age: `${randomInt(25, 70)} Years`,
          gender: 'Female',
          sampleId: `LAB-2024-${randomInt(1000, 9999)}`
        },
        labInfo: {
          name: randomChoice(LABS).name,
          address: `Sector ${randomInt(1, 50)}, ${randomChoice(INDIAN_CITIES)}`,
          reportDate: new Date().toLocaleDateString('en-IN')
        },
        tests: [
          {
            name: 'Hemoglobin',
            value: (randomInt(85, 155) / 10).toString(),
            unit: 'g/dL',
            normalRange: '12.0-15.5',
            status: randomChoice(['NORMAL', 'LOW', 'HIGH']),
            critical: Math.random() < 0.2
          },
          {
            name: 'Fasting Blood Sugar',
            value: randomInt(80, 200).toString(),
            unit: 'mg/dL',
            normalRange: '70-100',
            status: randomChoice(['NORMAL', 'HIGH']),
            critical: false
          },
          {
            name: 'Total Cholesterol',
            value: randomInt(150, 300).toString(),
            unit: 'mg/dL',
            normalRange: '<200',
            status: randomChoice(['NORMAL', 'HIGH']),
            critical: false
          }
        ],
        criticalValues: criticalCount,
        abnormalValues: abnormalCount,
        aiInsights: [
          'All parameters within acceptable range',
          'Recommend lifestyle modifications',
          'Follow-up in 3 months advised'
        ],
        extractionAccuracy: `${accuracy}%`
      };
      
    case 'ecg_report':
      return {
        documentType: "ECG Report",
        patientInfo: {
          name: `${randomChoice(INDIAN_NAMES.male)} ${randomChoice(INDIAN_NAMES.surnames)}`,
          age: `${randomInt(40, 80)} Years`,
          gender: 'Male',
          recordId: `ECG-2024-${randomInt(1000, 9999)}`
        },
        testDetails: {
          date: new Date().toLocaleDateString('en-IN'),
          time: `${randomInt(9, 17)}:${randomInt(10, 59)}`,
          technician: `Nurse ${randomChoice(INDIAN_NAMES.female)}`,
          machine: randomChoice(['Philips PageWriter TC70', 'GE MAC 2000', 'Schiller AT-10 plus'])
        },
        measurements: {
          heartRate: `${randomInt(60, 100)} bpm`,
          prInterval: `${randomInt(120, 200)} ms`,
          qrsDuration: `${randomInt(80, 120)} ms`,
          qtInterval: `${randomInt(350, 450)} ms`,
          axis: randomChoice(['Normal', 'Left deviation', 'Right deviation'])
        },
        rhythm: randomChoice(['Sinus rhythm', 'Sinus bradycardia', 'Sinus tachycardia']),
        findings: [
          randomChoice(['Normal ECG', 'Minor T wave changes', 'Borderline first degree AV block']),
          'No acute ST changes'
        ],
        interpretation: randomChoice(['Normal ECG', 'Abnormal ECG - Clinical correlation recommended']),
        urgency: randomChoice(['Routine follow-up', 'Urgent cardiology consultation']),
        extractionAccuracy: `${accuracy}%`
      };
      
    default:
      return {
        documentType: "Medical Document",
        status: "Document processed successfully",
        confidence: `${accuracy}%`,
        extractionAccuracy: `${accuracy}%`
      };
  }
};

const seedDatabase = async () => {
  try {
    logger.info('🌱 Starting database seeding...');
    
    // Temporarily disable foreign key constraints for seeding
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

    // Seed healthcare providers (hospitals and labs)
    logger.info('🏥 Seeding healthcare providers...');
    const providerIds: string[] = [];
    
    // Add hospitals
    for (const hospital of HOSPITALS) {
      const result = db.prepare(`
        INSERT INTO healthcare_providers 
        (name, type, registration_number, address, contact_info, certifications, tier, is_government, monthly_fee, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        hospital.name,
        'hospital',
        `HOS-${randomInt(100000, 999999)}`,
        JSON.stringify({
          street: `${randomInt(1, 100)} Medical Complex`,
          city: randomChoice(INDIAN_CITIES),
          state: 'Maharashtra',
          pincode: randomInt(400000, 600000).toString()
        }),
        JSON.stringify({
          phone: generatePhone(),
          email: `info@${hospital.name.toLowerCase().replace(/\s+/g, '')}.com`,
          website: `www.${hospital.name.toLowerCase().replace(/\s+/g, '')}.com`
        }),
        JSON.stringify(['NABH', 'NABL']),
        hospital.tier,
        hospital.isGov ? 1 : 0,
        hospital.fee,
        1
      );
      providerIds.push(result.lastInsertRowid.toString());
    }
    
    // Add labs
    for (const lab of LABS) {
      const result = db.prepare(`
        INSERT INTO healthcare_providers 
        (name, type, registration_number, address, contact_info, certifications, tier, monthly_fee, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        lab.name,
        'lab',
        `LAB-${randomInt(100000, 999999)}`,
        JSON.stringify({
          street: `${randomInt(1, 100)} Diagnostic Center`,
          city: randomChoice(INDIAN_CITIES),
          state: 'Maharashtra',
          pincode: randomInt(400000, 600000).toString()
        }),
        JSON.stringify({
          phone: generatePhone(),
          email: `lab@${lab.name.toLowerCase().replace(/\s+/g, '')}.com`
        }),
        JSON.stringify(['NABL', 'ISO_15189']),
        lab.tier,
        lab.fee,
        1
      );
      providerIds.push(result.lastInsertRowid.toString());
    }

    // Seed users and patients
    logger.info('👥 Seeding users and patients...');
    const patientIds: string[] = [];
    
    for (let i = 0; i < 50; i++) {
      const gender = randomChoice(['Male', 'Female']);
      const firstName = randomChoice(gender === 'Male' ? INDIAN_NAMES.male : INDIAN_NAMES.female);
      const lastName = randomChoice(INDIAN_NAMES.surnames);
      const abhaId = generateABHAId();
      
      // Create user
      const userResult = db.prepare(`
        INSERT INTO users 
        (abha_id, email, phone, password_hash, first_name, last_name, date_of_birth, gender, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        abhaId,
        `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i}@email.com`,
        generatePhone(),
        await bcrypt.hash('demo123', 10),
        firstName,
        lastName,
        new Date(randomInt(1950, 2000), randomInt(0, 11), randomInt(1, 28)).toISOString().split('T')[0],
        gender,
        'patient'
      );
      
      // Create patient profile
      const patientResult = db.prepare(`
        INSERT INTO patients 
        (user_id, blood_group, height_cm, weight_kg, emergency_contact, medical_conditions, allergies, current_medications)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        userResult.lastInsertRowid.toString(),
        randomChoice(['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-']),
        randomInt(150, 180),
        randomInt(50, 90),
        JSON.stringify({
          name: `${randomChoice(INDIAN_NAMES.male)} ${lastName}`,
          relationship: 'Spouse',
          phone: generatePhone()
        }),
        JSON.stringify([randomChoice(MEDICAL_CONDITIONS)]),
        JSON.stringify(Math.random() > 0.7 ? [randomChoice(['Dust', 'Pollen', 'Peanuts', 'Dairy'])] : []),
        JSON.stringify(Math.random() > 0.5 ? [randomChoice(INDIAN_MEDICATIONS)] : [])
      );
      
      patientIds.push(patientResult.lastInsertRowid.toString());
    }

    // Seed doctors
    logger.info('👨‍⚕️ Seeding doctors...');
    for (let i = 0; i < 20; i++) {
      const gender = randomChoice(['Male', 'Female']);
      const firstName = randomChoice(gender === 'Male' ? INDIAN_NAMES.male : INDIAN_NAMES.female);
      const lastName = randomChoice(INDIAN_NAMES.surnames);
      
      // Create user
      const userResult = db.prepare(`
        INSERT INTO users 
        (email, phone, password_hash, first_name, last_name, role)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        `dr.${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i}@hospital.com`,
        generatePhone(),
        await bcrypt.hash('doctor123', 10),
        firstName,
        lastName,
        'doctor'
      );
      
      // Create doctor profile
      db.prepare(`
        INSERT INTO doctors 
        (user_id, provider_id, medical_registration_number, degree, specialization, experience_years, consultation_fee)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        userResult.lastInsertRowid.toString(),
        randomChoice(providerIds.slice(0, 5)), // Only assign to hospitals, not labs
        `MCI-${randomInt(100000, 999999)}`,
        randomChoice(['MBBS, MD', 'MBBS, MS', 'MBBS, DM']),
        randomChoice(['Cardiology', 'Orthopedics', 'General Medicine', 'Pediatrics', 'Gynecology']),
        randomInt(5, 25),
        randomInt(50000, 200000) // ₹500 to ₹2000
      );
    }

    // Seed medical documents with realistic processing data
    logger.info('📄 Seeding medical documents...');
    const documentTypes = ['prescription', 'lab_report', 'ecg_report'];
    
    for (let i = 0; i < 100; i++) {
      const docType = randomChoice(documentTypes);
      const patientId = randomChoice(patientIds);
      const providerId = randomChoice(providerIds);
      const extractedData = generateRealisticMedicalData(docType);
      
      const docResult = db.prepare(`
        INSERT INTO medical_documents 
        (patient_id, provider_id, document_type, status, file_name, extraction_accuracy, extracted_data, processing_completed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        patientId,
        providerId,
        docType,
        'completed',
        `${docType}_sample_${i + 1}.pdf`,
        parseFloat(extractedData.extractionAccuracy.replace('%', '')),
        JSON.stringify(extractedData),
        new Date().toISOString()
      );
      
      // Add revenue event
      const isLab = Math.random() > 0.5;
      db.prepare(`
        INSERT INTO revenue_events 
        (entity_type, entity_id, event_type, amount_paise, document_id)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        isLab ? 'lab' : 'hospital',
        providerId,
        'per_report_fee',
        isLab ? 5000 : 10000, // ₹50 for lab, ₹100 for hospital
        docResult.lastInsertRowid.toString()
      );
    }

    // Create network connections for demo visualization
    logger.info('🔗 Creating network connections...');
    const hospitalProviders = providerIds.slice(0, 5); // First 5 are hospitals
    const labProviders = providerIds.slice(5); // Last 5 are labs
    
    for (const labId of labProviders) {
      for (const hospitalId of hospitalProviders) {
        db.prepare(`
          INSERT INTO network_connections 
          (lab_provider_id, hospital_provider_id, reports_exchanged, total_revenue_paise)
          VALUES (?, ?, ?, ?)
        `).run(
          labId,
          hospitalId,
          randomInt(10, 100),
          randomInt(50000, 500000) // ₹500 to ₹5000
        );
      }
    }

    // Re-enable foreign key constraints
    db.pragma('foreign_keys = ON');
    
    logger.info('✅ Database seeding completed successfully!');
    logger.info(`📊 Seeded data summary:`);
    logger.info(`   - Healthcare Providers: ${HOSPITALS.length + LABS.length}`);
    logger.info(`   - Patients: 50`);
    logger.info(`   - Doctors: 20`);
    logger.info(`   - Medical Documents: 100`);
    logger.info(`   - Network Connections: ${labProviders.length * hospitalProviders.length}`);
    logger.info('🎯 Ready for investor demos!');
    
  } catch (error) {
    logger.error('❌ Database seeding failed:', error);
    // Re-enable foreign key constraints even on error
    db.pragma('foreign_keys = ON');
    throw error;
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedDatabase };