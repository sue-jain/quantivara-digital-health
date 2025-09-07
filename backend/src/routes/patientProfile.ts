import { Router, Request, Response } from 'express';
import { db } from '../config/sqlite';
import { logger } from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get patient profile
router.get('/:userId', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // Get basic user information
    const user = db.prepare(`
      SELECT id, username, email, phone, first_name, last_name, 
             date_of_birth, gender, created_at, updated_at
      FROM app_users 
      WHERE id = ? AND is_active = 1
    `).get(userId) as any;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get ABHA profile information
    const abhaProfile = db.prepare(`
      SELECT abha_id, blood_group, height_cm, weight_kg, emergency_contact,
             medical_conditions, allergies, current_medications, address,
             verification_status, linked_date
      FROM app_user_abha_profiles 
      WHERE user_id = ?
    `).get(userId) as any;

    // Get ABHA registry information if linked
    let abhaRegistry = null;
    if (abhaProfile?.abha_id) {
      abhaRegistry = db.prepare(`
        SELECT abha_id, aadhar_id, name, date_of_birth, gender, mobile, email, status
        FROM app_abha_registry 
        WHERE abha_id = ?
      `).get(abhaProfile.abha_id) as any;
    }

    const profileData = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        firstName: user.first_name,
        lastName: user.last_name,
        dateOfBirth: user.date_of_birth,
        gender: user.gender,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      },
      abhaProfile: abhaProfile ? {
        abhaId: abhaProfile.abha_id,
        bloodGroup: abhaProfile.blood_group,
        height: abhaProfile.height_cm,
        weight: abhaProfile.weight_kg,
        emergencyContact: abhaProfile.emergency_contact,
        medicalConditions: abhaProfile.medical_conditions,
        allergies: abhaProfile.allergies,
        currentMedications: abhaProfile.current_medications,
        address: abhaProfile.address,
        verificationStatus: abhaProfile.verification_status,
        linkedDate: abhaProfile.linked_date
      } : null,
      abhaRegistry: abhaRegistry ? {
        abhaId: abhaRegistry.abha_id,
        aadharId: abhaRegistry.aadhar_id,
        name: abhaRegistry.name,
        dateOfBirth: abhaRegistry.date_of_birth,
        gender: abhaRegistry.gender,
        mobile: abhaRegistry.mobile,
        email: abhaRegistry.email,
        status: abhaRegistry.status
      } : null
    };

    return res.json({
      success: true,
      data: profileData
    });

  } catch (error) {
    logger.error('Error fetching patient profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
}));

// Update patient profile
router.put('/:userId', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { 
    email, 
    phone, 
    firstName, 
    lastName, 
    dateOfBirth, 
    gender,
    bloodGroup,
    height,
    weight,
    emergencyContact,
    medicalConditions,
    allergies,
    currentMedications,
    address
  } = req.body;

  try {
    // Update basic user information (excluding ABHA and Aadhar related fields)
    const updateUser = db.prepare(`
      UPDATE app_users 
      SET email = ?, phone = ?, first_name = ?, last_name = ?, 
          date_of_birth = ?, gender = ?, updated_at = ?
      WHERE id = ? AND is_active = 1
    `);

    const userResult = updateUser.run(
      email,
      phone,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      new Date().toISOString(),
      userId
    );

    if (userResult.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found or no changes made'
      });
    }

    // Update ABHA profile if exists (excluding ABHA ID and Aadhar ID)
    const existingProfile = db.prepare(`
      SELECT id FROM app_user_abha_profiles WHERE user_id = ?
    `).get(userId) as any;

    if (existingProfile) {
      const updateProfile = db.prepare(`
        UPDATE app_user_abha_profiles 
        SET blood_group = ?, height_cm = ?, weight_kg = ?, emergency_contact = ?,
            medical_conditions = ?, allergies = ?, current_medications = ?, 
            address = ?, updated_at = ?
        WHERE user_id = ?
      `);

      updateProfile.run(
        bloodGroup,
        height,
        weight,
        emergencyContact,
        medicalConditions,
        allergies,
        currentMedications,
        address,
        new Date().toISOString(),
        userId
      );
    }

    logger.info(`✅ Patient profile updated: ${userId}`);

    return res.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    logger.error('Error updating patient profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
}));

// Check ABHA linking status
router.get('/:userId/abha-status', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const abhaProfile = db.prepare(`
      SELECT abha_id, verification_status, linked_date
      FROM app_user_abha_profiles 
      WHERE user_id = ?
    `).get(userId) as any;

    const hasAbhaLinked = !!abhaProfile?.abha_id;
    const needsLinking = !hasAbhaLinked;

    return res.json({
      success: true,
      data: {
        hasAbhaLinked,
        needsLinking,
        abhaId: abhaProfile?.abha_id || null,
        verificationStatus: abhaProfile?.verification_status || null,
        linkedDate: abhaProfile?.linked_date || null
      }
    });

  } catch (error) {
    logger.error('Error checking ABHA status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check ABHA status'
    });
  }
}));

export default router;
