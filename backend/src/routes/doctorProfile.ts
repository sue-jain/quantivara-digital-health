import express, { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { db } from '../config/sqlite';

const router = express.Router();

// GET /api/v1/doctor-profile/:doctorId
router.get('/:doctorId', asyncHandler(async (req: Request, res: Response) => {
  const { doctorId } = req.params;

  const doctor = db.prepare(`
    SELECT 
      id, nmr_uid as nmrUid, first_name as firstName, last_name as lastName,
      email, phone, specialty, state_code as stateCode,
      hospital_id as hospitalId, hospital_name as hospitalName,
      license_number as licenseNumber, qualification, experience_years as experienceYears,
      is_active as isActive, created_at as createdAt, updated_at as updatedAt
    FROM app_doctors
    WHERE id = ?
  `).get(doctorId) as any;

  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor not found' });
  }

  return res.json({ success: true, data: doctor });
}));

// PUT /api/v1/doctor-profile/:doctorId
router.put('/:doctorId', asyncHandler(async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  const {
    firstName, lastName, email, phone, specialty, stateCode,
    hospitalId, hospitalName, licenseNumber, qualification, experienceYears
  } = req.body || {};

  const doctorExists = db.prepare('SELECT id FROM app_doctors WHERE id = ?').get(doctorId) as any;
  if (!doctorExists) {
    return res.status(404).json({ success: false, message: 'Doctor not found' });
  }

  const stmt = db.prepare(`
    UPDATE app_doctors SET
      first_name = COALESCE(?, first_name),
      last_name = COALESCE(?, last_name),
      email = COALESCE(?, email),
      phone = COALESCE(?, phone),
      specialty = COALESCE(?, specialty),
      state_code = COALESCE(?, state_code),
      hospital_id = COALESCE(?, hospital_id),
      hospital_name = COALESCE(?, hospital_name),
      license_number = COALESCE(?, license_number),
      qualification = COALESCE(?, qualification),
      experience_years = COALESCE(?, experience_years),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  stmt.run(
    firstName, lastName, email, phone, specialty, stateCode,
    hospitalId, hospitalName, licenseNumber, qualification, experienceYears,
    doctorId
  );

  const updated = db.prepare(`
    SELECT 
      id, nmr_uid as nmrUid, first_name as firstName, last_name as lastName,
      email, phone, specialty, state_code as stateCode,
      hospital_id as hospitalId, hospital_name as hospitalName,
      license_number as licenseNumber, qualification, experience_years as experienceYears,
      is_active as isActive, created_at as createdAt, updated_at as updatedAt
    FROM app_doctors WHERE id = ?
  `).get(doctorId) as any;

  return res.json({ success: true, message: 'Doctor profile updated', data: updated });
}));

export default router;


