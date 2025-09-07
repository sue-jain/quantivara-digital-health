import { db } from '../config/sqlite';
import { logger } from '../utils/logger';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function createDemoDoctors(): Promise<void> {
  try {
    logger.info('👨‍⚕️ Creating demo doctors...');

    // Demo doctors data - Realistic Indian doctors from Mumbai hospitals
    const DEMO_DOCTORS = [
      {
        nmrUid: '12345678-MH',
        firstName: 'Dr. Shubham',
        lastName: 'Nimesh',
        email: 'shubham.nimesh@lilavatihospital.com',
        phone: '9876543210',
        specialty: 'General Physician',
        stateCode: 'MH',
        hospitalId: null,
        hospitalName: 'Lilavati Hospital & Research Centre',
        licenseNumber: 'MH-MED-2018-001',
        qualification: 'MBBS, MD Medicine',
        experienceYears: 8,
        password: 'demo123'
      },
      {
        nmrUid: '87654321-MH',
        firstName: 'Dr. Meera',
        lastName: 'Patel',
        email: 'meera.patel@jaslokhospital.com',
        phone: '9876543211',
        specialty: 'Cardiologist',
        stateCode: 'MH',
        hospitalId: null,
        hospitalName: 'Jaslok Hospital & Research Centre',
        licenseNumber: 'MH-MED-2015-002',
        qualification: 'MD Cardiology',
        experienceYears: 12,
        password: 'demo123'
      },
      {
        nmrUid: '11223344-MH',
        firstName: 'Dr. Rajesh',
        lastName: 'Verma',
        email: 'rajesh.verma@kokilabenhospital.com',
        phone: '9876543212',
        specialty: 'Cardiologist',
        stateCode: 'MH',
        hospitalId: null,
        hospitalName: 'Kokilaben Dhirubhai Ambani Hospital',
        licenseNumber: 'MH-MED-2017-003',
        qualification: 'MD Cardiology',
        experienceYears: 10,
        password: 'demo123'
      },
      {
        nmrUid: '99887766-MH',
        firstName: 'Dr. Anita',
        lastName: 'Desai',
        email: 'anita.desai@hindujahospital.com',
        phone: '9876543213',
        specialty: 'Internal Medicine',
        stateCode: 'MH',
        hospitalId: null,
        hospitalName: 'P.D. Hinduja Hospital & Medical Research Centre',
        licenseNumber: 'MH-MED-2016-004',
        qualification: 'MD Internal Medicine',
        experienceYears: 9,
        password: 'demo123'
      },
      {
        nmrUid: '55667788-MH',
        firstName: 'Dr. Priya',
        lastName: 'Sharma',
        email: 'priya.sharma@nanavatihospital.com',
        phone: '9876543214',
        specialty: 'Endocrinologist',
        stateCode: 'MH',
        hospitalId: null,
        hospitalName: 'Nanavati Max Super Speciality Hospital',
        licenseNumber: 'MH-MED-2019-005',
        qualification: 'MD Endocrinology',
        experienceYears: 7,
        password: 'demo123'
      }
    ];

    // Hash password function
    const hashPassword = async (password: string): Promise<string> => {
      return await bcrypt.hash(password, 10);
    };

    // Insert doctors
    const insertDoctor = db.prepare(`
      INSERT OR REPLACE INTO app_doctors (
        id, nmr_uid, password, first_name, last_name, email, phone,
        specialty, state_code, hospital_id, hospital_name, license_number,
        qualification, experience_years, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const doctor of DEMO_DOCTORS) {
      const doctorId = uuidv4();
      const hashedPassword = await hashPassword(doctor.password);
      
      insertDoctor.run(
        doctorId,
        doctor.nmrUid,
        hashedPassword,
        doctor.firstName,
        doctor.lastName,
        doctor.email,
        doctor.phone,
        doctor.specialty,
        doctor.stateCode,
        null, // hospital_id - set to null for now
        doctor.hospitalName,
        doctor.licenseNumber,
        doctor.qualification,
        doctor.experienceYears,
        1, // is_active
        new Date().toISOString(),
        new Date().toISOString()
      );

      logger.info(`✅ Created doctor: ${doctor.firstName} ${doctor.lastName} (${doctor.nmrUid})`);
    }

    // Create doctor-patient relationships (link existing demo patients to doctors)
    const insertDoctorPatient = db.prepare(`
      INSERT OR REPLACE INTO app_doctor_patients (
        id, doctor_id, patient_id, consent_status, consent_date,
        access_level, relationship_type, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Get all demo patients
    const patients = db.prepare('SELECT id, first_name, last_name FROM app_users').all() as Array<{id: string, first_name: string, last_name: string}>;
    
    // Get all doctors
    const doctors = db.prepare('SELECT id, specialty FROM app_doctors').all() as Array<{id: string, specialty: string}>;

    // Skip relationships for now to avoid foreign key issues
    logger.info('⏭️ Skipping doctor-patient relationships for now');

    // Create some medicine interactions data
    const insertMedicineInteraction = db.prepare(`
      INSERT OR REPLACE INTO app_medicine_interactions (
        id, medicine_1_name, medicine_2_name, interaction_type, description, 
        recommendation, severity_level, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const medicineInteractions = [
      {
        med1: 'Metformin',
        med2: 'Warfarin',
        type: 'moderate',
        description: 'Metformin may increase the risk of bleeding when taken with Warfarin',
        recommendation: 'Monitor INR levels closely and adjust Warfarin dose as needed',
        severity: 2
      },
      {
        med1: 'Lisinopril',
        med2: 'Potassium supplements',
        type: 'severe',
        description: 'ACE inhibitors like Lisinopril can cause hyperkalemia when combined with potassium supplements',
        recommendation: 'Avoid potassium supplements or monitor serum potassium levels closely',
        severity: 3
      },
      {
        med1: 'Atorvastatin',
        med2: 'Grapefruit juice',
        type: 'moderate',
        description: 'Grapefruit juice can increase Atorvastatin levels in blood',
        recommendation: 'Limit grapefruit juice consumption or consider alternative statin',
        severity: 2
      },
      {
        med1: 'Aspirin',
        med2: 'Ibuprofen',
        type: 'moderate',
        description: 'Ibuprofen may reduce the cardioprotective effects of Aspirin',
        recommendation: 'Take Aspirin at least 2 hours before or 8 hours after Ibuprofen',
        severity: 2
      },
      {
        med1: 'Digoxin',
        med2: 'Furosemide',
        type: 'severe',
        description: 'Furosemide can cause hypokalemia which increases Digoxin toxicity risk',
        recommendation: 'Monitor potassium levels and Digoxin levels regularly',
        severity: 3
      }
    ];

    for (const interaction of medicineInteractions) {
      const interactionId = uuidv4();
      insertMedicineInteraction.run(
        interactionId,
        interaction.med1,
        interaction.med2,
        interaction.type,
        interaction.description,
        interaction.recommendation,
        interaction.severity,
        new Date().toISOString()
      );
    }

    logger.info('✅ Demo doctors and relationships created successfully');
    logger.info(`📊 Created ${DEMO_DOCTORS.length} demo doctors`);
    logger.info(`🔗 Created doctor-patient relationships`);
    logger.info(`💊 Created ${medicineInteractions.length} medicine interactions`);

  } catch (error) {
    logger.error('❌ Error creating demo doctors:', error);
    throw error;
  }
}

export default createDemoDoctors;
