import { Router, Request, Response } from 'express';
import { db } from '../config/sqlite';
import { logger } from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Get patient's care team
router.get('/:userId/care-team', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // Get care team from app_doctor_patients table (doctors with consent)
    const careTeam = db.prepare(`
      SELECT 
        dp.id,
        dp.doctor_id,
        dp.consent_status,
        dp.consent_date,
        dp.consent_expiry_date,
        dp.access_level,
        dp.relationship_type,
        dp.notes,
        d.first_name,
        d.last_name,
        d.specialty,
        d.hospital_name,
        d.qualification,
        d.experience_years,
        d.nmr_uid,
        dp.created_at,
        dp.updated_at
      FROM app_doctor_patients dp
      JOIN app_doctors d ON dp.doctor_id = d.id
      WHERE dp.patient_id = ? AND d.is_active = 1
      ORDER BY dp.consent_date DESC
    `).all(userId) as any[];

    const formattedCareTeam = careTeam.map(member => ({
      id: member.id,
      doctorId: member.doctor_id,
      doctorName: `${member.first_name} ${member.last_name}`,
      specialty: member.specialty,
      hospitalName: member.hospital_name,
      qualification: member.qualification,
      experienceYears: member.experience_years,
      nmrUid: member.nmr_uid,
      consentStatus: member.consent_status,
      consentDate: member.consent_date,
      consentExpiryDate: member.consent_expiry_date,
      accessLevel: member.access_level,
      relationshipType: member.relationship_type,
      notes: member.notes,
      createdAt: member.created_at,
      updatedAt: member.updated_at
    }));

    return res.json({
      success: true,
      data: formattedCareTeam
    });

  } catch (error) {
    logger.error('Error fetching care team:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch care team'
    });
  }
}));

// Get available doctors (for adding to care team)
router.get('/available-doctors', asyncHandler(async (req: Request, res: Response) => {
  try {
    const doctors = db.prepare(`
      SELECT 
        id,
        nmr_uid,
        first_name,
        last_name,
        specialty,
        hospital_name,
        qualification,
        experience_years
      FROM app_doctors
      WHERE is_active = 1
      ORDER BY first_name, last_name
    `).all() as any[];

    const formattedDoctors = doctors.map(doctor => ({
      id: doctor.id,
      nmrUid: doctor.nmr_uid,
      name: `${doctor.first_name} ${doctor.last_name}`,
      specialty: doctor.specialty,
      hospitalName: doctor.hospital_name,
      qualification: doctor.qualification,
      experienceYears: doctor.experience_years,
      displayName: `Dr. ${doctor.first_name} ${doctor.last_name} - ${doctor.specialty} (${doctor.hospital_name})`
    }));

    return res.json({
      success: true,
      data: formattedDoctors
    });

  } catch (error) {
    logger.error('Error fetching available doctors:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch available doctors'
    });
  }
}));

// Add doctor to care team (request consent)
router.post('/:userId/care-team', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { doctorId, relationshipType = 'consultant', notes = '' } = req.body;

  if (!doctorId) {
    return res.status(400).json({
      success: false,
      message: 'Doctor ID is required'
    });
  }

  try {
    // Check if doctor exists
    const doctor = db.prepare(`
      SELECT id, first_name, last_name, specialty 
      FROM app_doctors 
      WHERE id = ? AND is_active = 1
    `).get(doctorId) as any;

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check if relationship already exists
    const existingRelation = db.prepare(`
      SELECT id FROM app_doctor_patients 
      WHERE doctor_id = ? AND patient_id = ?
    `).get(doctorId, userId) as any;

    if (existingRelation) {
      return res.status(400).json({
        success: false,
        message: 'Doctor is already in your care team'
      });
    }

    // Create doctor-patient relationship with pending consent
    const relationshipId = uuidv4();
    const now = new Date().toISOString();
    const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 year from now

    const insertRelation = db.prepare(`
      INSERT INTO app_doctor_patients (
        id, doctor_id, patient_id, consent_status, consent_date, 
        consent_expiry_date, access_level, relationship_type, notes, 
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // For demo purposes, auto-approve consent
    insertRelation.run(
      relationshipId,
      doctorId,
      userId,
      'approved', // Auto-approve for demo
      now,
      expiryDate,
      'read',
      relationshipType,
      notes,
      now,
      now
    );

    logger.info(`✅ Doctor added to care team: ${doctor.first_name} ${doctor.last_name} for patient ${userId}`);

    return res.json({
      success: true,
      message: `Dr. ${doctor.first_name} ${doctor.last_name} has been added to your care team`,
      data: {
        relationshipId,
        doctorName: `${doctor.first_name} ${doctor.last_name}`,
        specialty: doctor.specialty,
        consentStatus: 'approved'
      }
    });

  } catch (error) {
    logger.error('Error adding doctor to care team:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add doctor to care team'
    });
  }
}));

// Remove doctor from care team (revoke consent)
router.delete('/:userId/care-team/:relationshipId', asyncHandler(async (req: Request, res: Response) => {
  const { userId, relationshipId } = req.params;

  try {
    // Get the relationship details first
    const relationship = db.prepare(`
      SELECT dp.id, d.first_name, d.last_name
      FROM app_doctor_patients dp
      JOIN app_doctors d ON dp.doctor_id = d.id
      WHERE dp.id = ? AND dp.patient_id = ?
    `).get(relationshipId, userId) as any;

    if (!relationship) {
      return res.status(404).json({
        success: false,
        message: 'Care team relationship not found'
      });
    }

    // Update consent status to revoked instead of deleting
    const updateRelation = db.prepare(`
      UPDATE app_doctor_patients 
      SET consent_status = 'revoked', updated_at = ?
      WHERE id = ? AND patient_id = ?
    `);

    const result = updateRelation.run(
      new Date().toISOString(),
      relationshipId,
      userId
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Care team relationship not found'
      });
    }

    logger.info(`✅ Doctor removed from care team: ${relationship.first_name} ${relationship.last_name} for patient ${userId}`);

    return res.json({
      success: true,
      message: `Dr. ${relationship.first_name} ${relationship.last_name} has been removed from your care team`
    });

  } catch (error) {
    logger.error('Error removing doctor from care team:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove doctor from care team'
    });
  }
}));

// Update care team member access
router.put('/:userId/care-team/:relationshipId', asyncHandler(async (req: Request, res: Response) => {
  const { userId, relationshipId } = req.params;
  const { accessLevel, relationshipType, notes } = req.body;

  try {
    const updateRelation = db.prepare(`
      UPDATE app_doctor_patients 
      SET access_level = ?, relationship_type = ?, notes = ?, updated_at = ?
      WHERE id = ? AND patient_id = ? AND consent_status = 'approved'
    `);

    const result = updateRelation.run(
      accessLevel,
      relationshipType,
      notes,
      new Date().toISOString(),
      relationshipId,
      userId
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Care team relationship not found or not approved'
      });
    }

    logger.info(`✅ Care team member updated for patient ${userId}`);

    return res.json({
      success: true,
      message: 'Care team member updated successfully'
    });

  } catch (error) {
    logger.error('Error updating care team member:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update care team member'
    });
  }
}));

// Approve pending consent
router.post('/:userId/care-team/:relationshipId/approve', asyncHandler(async (req: Request, res: Response) => {
  const { userId, relationshipId } = req.params;
  try {
    const rel = db.prepare('SELECT id FROM app_doctor_patients WHERE id = ? AND patient_id = ?').get(relationshipId, userId) as any;
    if (!rel) {
      return res.status(404).json({ success: false, message: 'Consent request not found' });
    }
    const now = new Date().toISOString();
    db.prepare(`UPDATE app_doctor_patients
               SET consent_status = 'approved', consent_date = ?, updated_at = ?
               WHERE id = ? AND patient_id = ?`).run(now, now, relationshipId, userId);
    return res.json({ success: true, message: 'Consent approved' });
  } catch (error) {
    logger.error('Error approving consent:', error);
    return res.status(500).json({ success: false, message: 'Failed to approve consent' });
  }
}));

// Reject pending consent
router.post('/:userId/care-team/:relationshipId/reject', asyncHandler(async (req: Request, res: Response) => {
  const { userId, relationshipId } = req.params;
  try {
    const rel = db.prepare('SELECT id FROM app_doctor_patients WHERE id = ? AND patient_id = ?').get(relationshipId, userId) as any;
    if (!rel) {
      return res.status(404).json({ success: false, message: 'Consent request not found' });
    }
    const now = new Date().toISOString();
    db.prepare(`UPDATE app_doctor_patients
               SET consent_status = 'revoked', updated_at = ?
               WHERE id = ? AND patient_id = ?`).run(now, relationshipId, userId);
    return res.json({ success: true, message: 'Consent rejected' });
  } catch (error) {
    logger.error('Error rejecting consent:', error);
    return res.status(500).json({ success: false, message: 'Failed to reject consent' });
  }
}));

export default router;
