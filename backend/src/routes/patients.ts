import express, { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { db } from '../config/sqlite';
import { logMedicalAccess, performanceLogger } from '../utils/logger';

const router = express.Router();

// Debug route to check available patients
router.get('/debug/patients', asyncHandler(async (req: Request, res: Response) => {
  try {
    const debugQuery = `
      SELECT 
        u.first_name, u.last_name, u.date_of_birth, u.abha_id, u.role
      FROM users u 
      WHERE u.role = 'patient'
      LIMIT 10
    `;
    
    const patients = db.prepare(debugQuery).all() as any[];
    
    res.json({
      success: true,
      message: 'Available patients for testing',
      data: patients
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching patients',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

// NEW: Name + DOB lookup - Returns ABHA ID (MUST BE BEFORE PARAMETERIZED ROUTES)
router.get('/lookup/abha-id', asyncHandler(async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { firstName, lastName, dateOfBirth } = req.query;
  
  // Validate required parameters
  if (!firstName || !lastName || !dateOfBirth) {
    throw new AppError('Missing required parameters: firstName, lastName, dateOfBirth', 400, 'MISSING_PARAMETERS');
  }
  
  // Normalize input for better performance and UX
  const normalizedFirstName = firstName.toString().trim();
  const normalizedLastName = lastName.toString().trim();
  const normalizedDateOfBirth = dateOfBirth.toString();
  
  try {
    // Try exact match first (fastest)
    let lookupQuery = `
      SELECT 
        u.id as user_id, u.abha_id, u.first_name, u.last_name, u.date_of_birth, 
        u.gender, u.phone, u.email, u.role
      FROM users u 
      WHERE u.first_name = ? 
        AND u.last_name = ? 
        AND u.date_of_birth = ?
        AND u.role = 'patient'
    `;
    
    let patient = db.prepare(lookupQuery).get(
      normalizedFirstName,
      normalizedLastName,
      normalizedDateOfBirth
    ) as any;
    
    // If exact match fails, try case-insensitive (slower but more user-friendly)
    if (!patient) {
      lookupQuery = `
        SELECT 
          u.id as user_id, u.abha_id, u.first_name, u.last_name, u.date_of_birth, 
          u.gender, u.phone, u.email, u.role
        FROM users u 
        WHERE LOWER(u.first_name) = LOWER(?) 
          AND LOWER(u.last_name) = LOWER(?) 
          AND u.date_of_birth = ?
          AND u.role = 'patient'
      `;
      
      patient = db.prepare(lookupQuery).get(
        normalizedFirstName,
        normalizedLastName,
        normalizedDateOfBirth
      ) as any;
    }
    
    if (!patient) {
      throw new AppError('Patient not found with the provided details', 404, 'PATIENT_NOT_FOUND');
    }

    // Log lookup access for audit
    logMedicalAccess('system', patient.user_id, 'name_dob_lookup', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      lookupMethod: 'name_dob'
    });

    const lookupData = {
      abhaId: patient.abha_id,
      patientInfo: {
        name: `${patient.first_name} ${patient.last_name}`,
        dateOfBirth: patient.date_of_birth,
        gender: patient.gender,
        phone: patient.phone,
        email: patient.email
      },
      responseTime: `${Date.now() - startTime}ms`
    };

    performanceLogger.info({
      operation: 'name_dob_lookup',
      duration: Date.now() - startTime,
      success: true,
      lookupMethod: 'name_dob'
    });

    res.json({
      success: true,
      message: 'Patient found successfully',
      data: lookupData
    });
    
  } catch (error) {
    performanceLogger.info({
      operation: 'name_dob_lookup',
      duration: Date.now() - startTime,
      success: false,
      lookupMethod: 'name_dob'
    });
    throw error;
  }
}));

// EXISTING: ABHA ID lookup - Critical for emergency demo (UNCHANGED)
router.get('/:abhaId/profile', asyncHandler(async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { abhaId } = req.params;
  
  try {
    // Query patient data with user info
    const patientQuery = `
      SELECT 
        u.id as user_id, u.abha_id, u.first_name, u.last_name, u.date_of_birth, 
        u.gender, u.phone, u.address, u.created_at,
        p.blood_group, p.height_cm, p.weight_kg, p.emergency_contact, 
        p.medical_conditions, p.allergies, p.current_medications
      FROM users u 
      LEFT JOIN patients p ON u.id = p.user_id 
      WHERE u.abha_id = ?
    `;
    
    const patient = db.prepare(patientQuery).get(abhaId) as any;
    
    if (!patient) {
      throw new AppError('Patient not found with this ABHA ID', 404, 'PATIENT_NOT_FOUND');
    }

    // Parse JSON fields
    const profileData = {
      abhaId: patient.abha_id,
      personalInfo: {
        name: `${patient.first_name} ${patient.last_name}`,
        dateOfBirth: patient.date_of_birth,
        gender: patient.gender,
        phone: patient.phone,
        address: patient.address ? JSON.parse(patient.address) : null
      },
      medicalInfo: {
        bloodGroup: patient.blood_group,
        height: patient.height_cm,
        weight: patient.weight_kg,
        emergencyContact: patient.emergency_contact ? JSON.parse(patient.emergency_contact) : null,
        conditions: patient.medical_conditions ? JSON.parse(patient.medical_conditions) : [],
        allergies: patient.allergies ? JSON.parse(patient.allergies) : [],
        currentMedications: patient.current_medications ? JSON.parse(patient.current_medications) : []
      },
      responseTime: `${Date.now() - startTime}ms`
    };

    // Log medical access for audit
    logMedicalAccess('system', patient.user_id, 'profile_access', {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Patient profile retrieved successfully',
      data: profileData
    });
    
  } catch (error) {
    performanceLogger.info({
      operation: 'patient_profile_lookup',
      duration: Date.now() - startTime,
      success: false,
      abhaId
    });
    throw error;
  }
}));

// Emergency profile for 3-second lookup demo
router.get('/:abhaId/emergency-profile', asyncHandler(async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { abhaId } = req.params;
  
  try {
    // Comprehensive emergency query with recent documents
    const emergencyQuery = `
      SELECT 
        u.first_name, u.last_name, u.date_of_birth, u.gender, u.phone,
        p.blood_group, p.emergency_contact, p.medical_conditions, p.allergies, p.current_medications,
        (SELECT COUNT(*) FROM medical_documents md WHERE md.patient_id = p.id) as total_documents,
        (SELECT json_group_array(json_object(
          'type', document_type,
          'date', created_at,
          'provider', (SELECT name FROM healthcare_providers WHERE id = provider_id),
          'accuracy', extraction_accuracy
        )) FROM medical_documents md WHERE md.patient_id = p.id ORDER BY created_at DESC LIMIT 5) as recent_documents
      FROM users u 
      LEFT JOIN patients p ON u.id = p.user_id 
      WHERE u.abha_id = ?
    `;
    
    const emergency = db.prepare(emergencyQuery).get(abhaId) as any;
    
    if (!emergency) {
      throw new AppError('Patient not found with this ABHA ID', 404, 'PATIENT_NOT_FOUND');
    }

    // Parse JSON fields
    const emergencyData = {
      patient: {
        name: `${emergency.first_name} ${emergency.last_name}`,
        age: emergency.date_of_birth ? new Date().getFullYear() - new Date(emergency.date_of_birth).getFullYear() : null,
        gender: emergency.gender,
        bloodGroup: emergency.blood_group,
        phone: emergency.phone
      },
      emergencyContact: emergency.emergency_contact ? JSON.parse(emergency.emergency_contact) : null,
      criticalInfo: {
        conditions: emergency.medical_conditions ? JSON.parse(emergency.medical_conditions) : [],
        allergies: emergency.allergies ? JSON.parse(emergency.allergies) : [],
        currentMedications: emergency.current_medications ? JSON.parse(emergency.current_medications) : []
      },
      recentDocuments: emergency.recent_documents ? JSON.parse(emergency.recent_documents) : [],
      totalDocuments: emergency.total_documents || 0,
      responseTime: `${Date.now() - startTime}ms`,
      lookupSuccess: true
    };

    // Log emergency access
    logMedicalAccess('emergency_system', 'emergency', 'emergency_profile_access', {
      abhaId,
      responseTime: Date.now() - startTime,
      ip: req.ip
    });

    performanceLogger.info({
      operation: 'emergency_profile_lookup',
      duration: Date.now() - startTime,
      success: true,
      abhaId
    });

    res.json({
      success: true,
      message: 'Emergency profile retrieved successfully',
      data: emergencyData
    });
    
  } catch (error) {
    performanceLogger.info({
      operation: 'emergency_profile_lookup',
      duration: Date.now() - startTime,
      success: false,
      abhaId
    });
    throw error;
  }
}));

// Medical timeline
router.get('/:abhaId/timeline', asyncHandler(async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { abhaId } = req.params;
  
  try {
    // Get patient ID first
    const patientQuery = `
      SELECT p.id as patient_id, u.first_name, u.last_name 
      FROM users u 
      LEFT JOIN patients p ON u.id = p.user_id 
      WHERE u.abha_id = ?
    `;
    
    const patient = db.prepare(patientQuery).get(abhaId) as any;
    
    if (!patient) {
      throw new AppError('Patient not found with this ABHA ID', 404, 'PATIENT_NOT_FOUND');
    }

    // Get medical timeline with provider details
    const timelineQuery = `
      SELECT 
        md.id, md.document_type, md.created_at, md.extraction_accuracy,
        md.extracted_data, md.status,
        hp.name as provider_name, hp.type as provider_type,
        d.first_name as doctor_first_name, d.last_name as doctor_last_name
      FROM medical_documents md
      LEFT JOIN healthcare_providers hp ON md.provider_id = hp.id
      LEFT JOIN doctors doc ON md.doctor_id = doc.id
      LEFT JOIN users d ON doc.user_id = d.id
      WHERE md.patient_id = ?
      ORDER BY md.created_at DESC
    `;
    
    const documents = db.prepare(timelineQuery).all(patient.patient_id) as any[];

    const timeline = documents.map(doc => ({
      id: doc.id,
      type: doc.document_type,
      date: doc.created_at,
      provider: doc.provider_name,
      providerType: doc.provider_type,
      doctor: doc.doctor_first_name ? `Dr. ${doc.doctor_first_name} ${doc.doctor_last_name}` : null,
      accuracy: doc.extraction_accuracy,
      status: doc.status,
      summary: doc.extracted_data ? JSON.parse(doc.extracted_data) : null
    }));

    res.json({
      success: true,
      message: 'Medical timeline retrieved successfully',
      data: {
        abhaId,
        patientName: `${patient.first_name} ${patient.last_name}`,
        totalDocuments: timeline.length,
        timeline,
        responseTime: `${Date.now() - startTime}ms`
      }
    });
    
  } catch (error) {
    performanceLogger.info({
      operation: 'medical_timeline',
      duration: Date.now() - startTime,
      success: false,
      abhaId
    });
    throw error;
  }
}));

export default router;