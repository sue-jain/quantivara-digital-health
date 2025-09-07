import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger';

const db = new Database('database.sqlite');

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

async function createDoctorsOnly() {
  try {
    logger.info('👨‍⚕️ Creating demo doctors only...');
    logger.info('📊 Database file exists:', require('fs').existsSync('database.sqlite'));

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
        hospitalName: 'Nanavati Max Super Speciality Hospital',
        licenseNumber: 'MH-MED-2019-005',
        qualification: 'MD Endocrinology',
        experienceYears: 7,
        password: 'demo123'
      }
    ];

    // Clear existing doctors first
    db.prepare('DELETE FROM app_doctors').run();
    logger.info('🗑️ Cleared existing doctors');

    // Insert doctors
    const insertDoctor = db.prepare(`
      INSERT INTO app_doctors (
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
        null, // hospital_id - set to null
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

    logger.info('🎉 Demo doctors created successfully!');
    logger.info('📋 Demo Doctor Credentials:');
    logger.info('   Username: [NMR_UID]');
    logger.info('   Password: demo123');
    logger.info('   Examples:');
    for (const doctor of DEMO_DOCTORS) {
      logger.info(`   - ${doctor.nmrUid} / demo123 (${doctor.firstName} ${doctor.lastName} - ${doctor.specialty})`);
    }

  } catch (error) {
    logger.error('❌ Error creating demo doctors:', error);
    throw error;
  }
}

export default createDoctorsOnly;