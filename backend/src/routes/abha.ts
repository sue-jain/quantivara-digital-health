import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/sqlite';
import { logger } from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Helper function to generate unique ABHA ID
const generateUniqueABHAId = (): string => {
  // Use timestamp + random to ensure uniqueness
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return (timestamp + random).padStart(14, '0');
};

// Lookup ABHA ID by AADHAR
router.post('/lookup', asyncHandler(async (req: Request, res: Response) => {
  const { aadharId } = req.body;

  if (!aadharId) {
    return res.status(400).json({
      success: false,
      message: 'AADHAR ID is required'
    });
  }

  // Clean AADHAR ID (remove spaces, dashes)
  const cleanAadharId = aadharId.replace(/\D/g, '');

  // Validate AADHAR format (12 digits)
  if (cleanAadharId.length !== 12) {
    return res.status(400).json({
      success: false,
      message: 'AADHAR ID must be 12 digits'
    });
  }

  // Search for existing ABHA ID
  const existingABHA = db.prepare(`
    SELECT abha_id, name, date_of_birth, gender, mobile, email, is_demo_patient
    FROM app_abha_registry 
    WHERE aadhar_id = ?
  `).get(cleanAadharId) as any;

  if (existingABHA) {
    // Check if ABHA ID is already linked to a user
    const isLinked = db.prepare(`
      SELECT user_id FROM app_user_abha_profiles WHERE abha_id = ?
    `).get(existingABHA.abha_id) as any;

    return res.json({
      success: true,
      message: 'ABHA ID found',
      data: {
        found: true,
        abhaId: existingABHA.abha_id,
        name: existingABHA.name,
        dateOfBirth: existingABHA.date_of_birth,
        gender: existingABHA.gender,
        mobile: existingABHA.mobile,
        email: existingABHA.email,
        isDemoPatient: existingABHA.is_demo_patient === 1,
        isLinked: !!isLinked
      }
    });
  } else {
    return res.json({
      success: true,
      message: 'No ABHA ID found for this AADHAR',
      data: {
        found: false,
        aadharId: cleanAadharId
      }
    });
  }
}));

// Create new ABHA ID
router.post('/create', asyncHandler(async (req: Request, res: Response) => {
  const { aadharId, name, dateOfBirth, gender, mobile, email } = req.body;

  // Validate required fields
  if (!aadharId || !name || !dateOfBirth || !gender) {
    return res.status(400).json({
      success: false,
      message: 'AADHAR ID, name, date of birth, and gender are required'
    });
  }

  // Clean AADHAR ID
  const cleanAadharId = aadharId.replace(/\D/g, '');

  // Validate AADHAR format
  if (cleanAadharId.length !== 12) {
    return res.status(400).json({
      success: false,
      message: 'AADHAR ID must be 12 digits'
    });
  }

  // Check if AADHAR already exists
  const existingAadhar = db.prepare('SELECT abha_id FROM app_abha_registry WHERE aadhar_id = ?').get(cleanAadharId) as any;
  if (existingAadhar) {
    return res.status(400).json({
      success: false,
      message: 'AADHAR ID already exists in the system'
    });
  }

  // Generate unique ABHA ID
  let abhaId = generateUniqueABHAId();
  
  // Ensure ABHA ID is unique
  let attempts = 0;
  while (db.prepare('SELECT id FROM app_abha_registry WHERE abha_id = ?').get(abhaId) && attempts < 10) {
    abhaId = generateUniqueABHAId();
    attempts++;
  }

  if (attempts >= 10) {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate unique ABHA ID'
    });
  }

  // Create ABHA ID in registry
  const registryId = uuidv4();
  db.prepare(`
    INSERT INTO app_abha_registry 
    (id, aadhar_id, abha_id, name, date_of_birth, gender, mobile, email, created_date, status, is_demo_patient)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    registryId,
    cleanAadharId,
    abhaId,
    name,
    dateOfBirth,
    gender,
    mobile || null,
    email || null,
    new Date().toISOString().split('T')[0],
    'active',
    0 // Not a demo patient
  );

  logger.info(`✅ New ABHA ID created: ${abhaId} for AADHAR: ${cleanAadharId}`);

  return res.json({
    success: true,
    message: 'ABHA ID created successfully',
    data: {
      abhaId,
      name,
      dateOfBirth,
      gender,
      mobile,
      email,
      createdDate: new Date().toISOString().split('T')[0]
    }
  });
}));

// Link ABHA ID to user
router.post('/link', asyncHandler(async (req: Request, res: Response) => {
  const { userId, abhaId } = req.body;

  if (!userId || !abhaId) {
    return res.status(400).json({
      success: false,
      message: 'User ID and ABHA ID are required'
    });
  }

  // Verify user exists
  const user = db.prepare('SELECT id FROM app_users WHERE id = ? AND is_active = 1').get(userId) as any;
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Verify ABHA ID exists
  const abhaRecord = db.prepare('SELECT * FROM app_abha_registry WHERE abha_id = ?').get(abhaId) as any;
  if (!abhaRecord) {
    return res.status(404).json({
      success: false,
      message: 'ABHA ID not found'
    });
  }

  // Check if ABHA ID is already linked
  const existingLink = db.prepare('SELECT user_id FROM app_user_abha_profiles WHERE abha_id = ?').get(abhaId) as any;
  if (existingLink) {
    return res.status(400).json({
      success: false,
      message: 'ABHA ID is already linked to another account'
    });
  }

  // Check if user already has an ABHA profile
  const existingUserProfile = db.prepare('SELECT abha_id FROM app_user_abha_profiles WHERE user_id = ?').get(userId) as any;
  if (existingUserProfile) {
    return res.status(400).json({
      success: false,
      message: 'User already has an ABHA profile linked'
    });
  }

  // Create ABHA profile
  const profileId = uuidv4();
  db.prepare(`
    INSERT INTO app_user_abha_profiles 
    (id, user_id, abha_id, linked_date, verification_status)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    profileId,
    userId,
    abhaId,
    new Date().toISOString(),
    'verified'
  );

  logger.info(`✅ ABHA ID ${abhaId} linked to user ${userId}`);

  return res.json({
    success: true,
    message: 'ABHA ID linked successfully',
    data: {
      abhaId,
      linkedDate: new Date().toISOString(),
      verificationStatus: 'verified'
    }
  });
}));

// Get user's ABHA profile
router.get('/profile/:userId', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const profile = db.prepare(`
    SELECT p.*, r.name as abha_name, r.abha_id, r.aadhar_id, r.date_of_birth, r.gender
    FROM app_user_abha_profiles p
    JOIN app_abha_registry r ON p.abha_id = r.abha_id
    WHERE p.user_id = ?
  `).get(userId) as any;

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'ABHA profile not found'
    });
  }

  return res.json({
    success: true,
    message: 'ABHA profile retrieved successfully',
    data: {
      abhaId: profile.abha_id,
      aadharId: profile.aadhar_id,
      name: profile.abha_name,
      dateOfBirth: profile.date_of_birth,
      gender: profile.gender,
      bloodGroup: profile.blood_group,
      heightCm: profile.height_cm,
      weightKg: profile.weight_kg,
      emergencyContact: profile.emergency_contact ? JSON.parse(profile.emergency_contact) : null,
      medicalConditions: profile.medical_conditions ? JSON.parse(profile.medical_conditions) : [],
      allergies: profile.allergies ? JSON.parse(profile.allergies) : [],
      currentMedications: profile.current_medications ? JSON.parse(profile.current_medications) : [],
      address: profile.address ? JSON.parse(profile.address) : null,
      linkedDate: profile.linked_date,
      verificationStatus: profile.verification_status
    }
  });
}));

// Unlink ABHA ID from user
router.delete('/unlink/:userId', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  // Check if user has ABHA profile
  const profile = db.prepare('SELECT abha_id FROM app_user_abha_profiles WHERE user_id = ?').get(userId) as any;
  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'No ABHA profile found for this user'
    });
  }

  // Remove ABHA profile
  db.prepare('DELETE FROM app_user_abha_profiles WHERE user_id = ?').run(userId);

  logger.info(`✅ ABHA ID unlinked from user ${userId}`);

  return res.json({
    success: true,
    message: 'ABHA ID unlinked successfully'
  });
}));

export default router;
