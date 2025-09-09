import express, { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { db } from '../config/sqlite';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Helper: ensure uploads/voice directory exists
const ensureDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// GET /api/v1/doctor/:doctorId/patients
// Returns patients for a doctor, optionally filtered by consent status (approved|pending|revoked)
router.get('/:doctorId/patients', asyncHandler(async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  const { consent } = req.query as { consent?: string };

  const whereConsent = consent ? 'AND dp.consent_status = ?' : '';

  const stmt = db.prepare(`
    SELECT 
      dp.id as relationshipId,
      dp.consent_status as consentStatus,
      dp.consent_date as consentDate,
      dp.access_level as accessLevel,
      dp.relationship_type as relationshipType,
      u.id as patientId,
      u.first_name as firstName,
      u.last_name as lastName,
      u.phone,
      up.abha_id as abhaId
    FROM app_doctor_patients dp
    JOIN app_users u ON u.id = dp.patient_id
    LEFT JOIN app_user_abha_profiles up ON up.user_id = u.id
    WHERE dp.doctor_id = ? ${whereConsent}
    ORDER BY dp.updated_at DESC
  `);

  const rows = consent ? (stmt.all(doctorId, consent) as any[]) : (stmt.all(doctorId) as any[]);

  return res.json({ success: true, data: rows });
}));

// GET /api/v1/doctor/:doctorId/patients/search?q=term
// Search patients by name/phone/username or ABHA ID
router.get('/:doctorId/patients/search', asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query as { q?: string };
  if (!q || String(q).trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Query q (min 2 chars) required' });
  }

  const term = `%${String(q).trim()}%`;

  const results = db.prepare(`
    SELECT 
      u.id as patientId,
      u.username,
      u.first_name as firstName,
      u.last_name as lastName,
      u.phone,
      u.email,
      ap.abha_id as abhaId
    FROM app_users u
    LEFT JOIN app_user_abha_profiles ap ON ap.user_id = u.id
    WHERE u.role = 'patient' AND (
      u.first_name LIKE ? OR u.last_name LIKE ? OR u.username LIKE ? OR u.phone LIKE ? OR ap.abha_id LIKE ?
    )
    ORDER BY u.updated_at DESC
    LIMIT 25
  `).all(term, term, term, term, term) as any[];

  return res.json({ success: true, data: results });
}));

// POST /api/v1/doctor/:doctorId/consultations
// Create a consultation for a (possibly provisional) patient
router.post('/:doctorId/consultations', asyncHandler(async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  const { patientId, chiefComplaint, diagnosis, treatmentPlan, medicines, status } = req.body as { 
    patientId: string; 
    chiefComplaint?: string; 
    diagnosis?: string; 
    treatmentPlan?: string; 
    medicines?: any; 
    status?: string;
  };
  if (!patientId) return res.status(400).json({ success: false, message: 'patientId is required' });
  const doctor = db.prepare('SELECT id FROM app_doctors WHERE id = ? AND is_active = 1').get(doctorId) as any;
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
  const patient = db.prepare('SELECT id FROM app_users WHERE id = ? AND is_active = 1').get(patientId) as any;
  if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
  const id = uuidv4();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO app_consultations (id, doctor_id, patient_id, consultation_date, consultation_type, chief_complaint, diagnosis, treatment_plan, status, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'in_person', ?, ?, ?, ?, ?, ?, ?)
  `).run(id, doctorId, patientId, now, chiefComplaint || null, diagnosis || null, treatmentPlan || null, status || 'in_progress', medicines ? JSON.stringify(medicines) : null, now, now);
  return res.status(201).json({ success: true, data: { consultationId: id } });
}));

// PUT /api/v1/doctor/:doctorId/consultations/:id
router.put('/:doctorId/consultations/:id', asyncHandler(async (req: Request, res: Response) => {
  const { doctorId, id } = req.params;
  const { chiefComplaint, diagnosis, treatmentPlan, medicines, status } = req.body as { 
    chiefComplaint?: string; 
    diagnosis?: string; 
    treatmentPlan?: string; 
    medicines?: any; 
    status?: string;
  };
  const existing = db.prepare('SELECT id FROM app_consultations WHERE id = ? AND doctor_id = ?').get(id, doctorId) as any;
  if (!existing) return res.status(404).json({ success: false, message: 'Consultation not found' });
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE app_consultations
    SET chief_complaint = COALESCE(?, chief_complaint),
        diagnosis = COALESCE(?, diagnosis),
        treatment_plan = COALESCE(?, treatment_plan),
        notes = COALESCE(?, notes),
        status = COALESCE(?, status),
        updated_at = ?
    WHERE id = ? AND doctor_id = ?
  `).run(chiefComplaint || null, diagnosis || null, treatmentPlan || null, medicines ? JSON.stringify(medicines) : null, status || null, now, id, doctorId);
  return res.json({ success: true });
}));

// GET /api/v1/doctor/:doctorId/patient/:patientId/visits
// Get all consultations/visits for a patient
router.get('/:doctorId/patient/:patientId/visits', asyncHandler(async (req: Request, res: Response) => {
  const { doctorId, patientId } = req.params;
  
  const consultations = db.prepare(`
    SELECT 
      c.id,
      c.consultation_date,
      c.consultation_type,
      c.chief_complaint,
      c.diagnosis,
      c.treatment_plan,
      c.status,
      c.notes,
      c.created_at,
      d.first_name || ' ' || d.last_name as doctor_name,
      d.specialty as doctor_specialty
    FROM app_consultations c
    JOIN app_doctors d ON c.doctor_id = d.id
    WHERE c.patient_id = ?
    ORDER BY c.consultation_date DESC
  `).all(patientId) as any[];

  const visits = consultations.map(consultation => ({
    id: consultation.id,
    doctorName: consultation.doctor_name,
    doctorSpecialty: consultation.doctor_specialty,
    date: consultation.consultation_date,
    type: consultation.consultation_type,
    chiefComplaint: consultation.chief_complaint,
    diagnosis: consultation.diagnosis,
    treatmentPlan: consultation.treatment_plan,
    status: consultation.status === 'completed' ? 'completed' : 'upcoming',
    notes: consultation.notes,
    createdAt: consultation.created_at
  }));

  return res.json({ success: true, data: visits });
}));

// POST /api/v1/doctor/:doctorId/patients
// Create a new patient (demo convenience). Body: { firstName, lastName, phone, email? }
router.post('/:doctorId/patients', asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, phone, email } = req.body || {};
  if (!firstName || !lastName || !phone) {
    return res.status(400).json({ success: false, message: 'firstName, lastName, phone are required' });
  }

  const id = uuidv4();
  const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${Math.floor(Math.random()*1000)}`;
  // bcrypt hash for 'demo123' (same used elsewhere)
  const demoHash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

  const insert = db.prepare(`
    INSERT INTO app_users (id, username, password_hash, email, phone, first_name, last_name, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'patient')
  `);
  insert.run(id, username, demoHash, email || null, phone, firstName, lastName);

  const created = db.prepare(`
    SELECT id as patientId, username, first_name as firstName, last_name as lastName, phone, email
    FROM app_users WHERE id = ?
  `).get(id) as any;

  return res.status(201).json({ success: true, message: 'Patient created', data: created });
}));

// POST /api/v1/doctor/:doctorId/voice
// Save a voice diagnosis record. Body: { patientId, audioBase64?, transcript? }
router.post('/:doctorId/voice', asyncHandler(async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  const { patientId, audioBase64, transcript, consultationId } = req.body || {};

  if (!patientId) {
    return res.status(400).json({ success: false, message: 'patientId is required' });
  }

  let audioPath: string | null = null;
  if (audioBase64) {
    const buffer = Buffer.from(audioBase64, 'base64');
    const dir = path.join(__dirname, '../../uploads/voice');
    ensureDir(dir);
    const filename = `${uuidv4()}.wav`;
    const fullPath = path.join(dir, filename);
    fs.writeFileSync(fullPath, buffer);
    audioPath = `/uploads/voice/${filename}`;
  }

  const id = uuidv4();
  const stmt = db.prepare(`
    INSERT INTO app_voice_diagnosis (id, doctor_id, patient_id, consultation_id, audio_file_path, transcribed_text, ai_analysis, symptoms_extracted, confidence_score, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'processed')
  `);
  stmt.run(
    id,
    doctorId,
    patientId,
    consultationId || null,
    audioPath,
    transcript || null,
    null, // ai_analysis (JSON) - not in demo
    null, // symptoms_extracted (JSON)
    null  // confidence_score
  );

  const record = db.prepare(`
    SELECT id, doctor_id as doctorId, patient_id as patientId, audio_file_path as audioFilePath, transcribed_text as transcribedText, status, created_at as createdAt
    FROM app_voice_diagnosis WHERE id = ?
  `).get(id) as any;

  return res.status(201).json({ success: true, message: 'Voice diagnosis saved', data: record });
}));

// GET /api/v1/doctor/medicine-interactions?drugA=..&drugB=..
router.get('/medicine-interactions', asyncHandler(async (req: Request, res: Response) => {
  const { drugA, drugB } = req.query as { drugA?: string; drugB?: string };
  if (!drugA || !drugB) {
    return res.status(400).json({ success: false, message: 'drugA and drugB are required' });
  }

  const row = db.prepare(`
    SELECT * FROM app_medicine_interactions 
    WHERE (drug_a = ? AND drug_b = ?) OR (drug_a = ? AND drug_b = ?)
    LIMIT 1
  `).get(drugA, drugB, drugB, drugA) as any;

  if (!row) {
    return res.json({
      success: true,
      data: {
        interaction: 'none_known',
        severity: 'none',
        advisory: 'No known interactions found in demo dataset.'
      }
    });
  }

  return res.json({
    success: true,
    data: {
      interaction: row.interaction_type,
      severity: row.severity,
      advisory: row.advisory
    }
  });
}));

export default router;

// --- Consent: Doctor creates consent request (pending) ---
router.post('/:doctorId/consent-requests', asyncHandler(async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  const { patientId, scopes } = req.body as { patientId?: string; scopes?: { labReports?: boolean; prescriptions?: boolean; pastHistory?: boolean } };

  if (!patientId) {
    return res.status(400).json({ success: false, message: 'patientId is required' });
  }

  // Ensure doctor exists
  const doctor = db.prepare('SELECT id FROM app_doctors WHERE id = ? AND is_active = 1').get(doctorId) as any;
  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor not found' });
  }

  // Ensure patient exists
  const patient = db.prepare('SELECT id FROM app_users WHERE id = ? AND is_active = 1').get(patientId) as any;
  if (!patient) {
    return res.status(404).json({ success: false, message: 'Patient not found' });
  }

  const now = new Date().toISOString();
  const expiryDate = new Date(Date.now() + 365*24*60*60*1000).toISOString();
  const notes = JSON.stringify({ scopes: {
    labReports: !!scopes?.labReports,
    prescriptions: !!scopes?.prescriptions,
    pastHistory: !!scopes?.pastHistory
  }});

  // Check existing relationship
  const existing = db.prepare('SELECT id, consent_status FROM app_doctor_patients WHERE doctor_id = ? AND patient_id = ?').get(doctorId, patientId) as any;

  if (existing) {
    // Update to pending with new scopes
    db.prepare(`UPDATE app_doctor_patients
                SET consent_status = 'pending', notes = ?, updated_at = ?
                WHERE id = ?`).run(notes, now, existing.id);
    return res.json({ success: true, message: 'Consent request updated', data: { relationshipId: existing.id, consentStatus: 'pending' } });
  }

  const relationshipId = uuidv4();
  db.prepare(`INSERT INTO app_doctor_patients (
      id, doctor_id, patient_id, consent_status, consent_date, consent_expiry_date,
      access_level, relationship_type, notes, created_at, updated_at
    ) VALUES (?, ?, ?, 'pending', ?, ?, 'read', 'consultant', ?, ?, ?)`)
    .run(relationshipId, doctorId, patientId, now, expiryDate, notes, now, now);

  return res.json({ success: true, message: 'Consent request created', data: { relationshipId, consentStatus: 'pending' } });
}));

// --- Consent-aware patient summary for doctors ---
router.get('/:doctorId/patient/:patientId/summary', asyncHandler(async (req: Request, res: Response) => {
  const { doctorId, patientId } = req.params;

  // Minimal identity
  const patient = db.prepare('SELECT first_name, last_name FROM app_users WHERE id = ? AND is_active = 1').get(patientId) as any;
  if (!patient) {
    return res.status(404).json({ success: false, message: 'Patient not found' });
  }

  const rel = db.prepare('SELECT consent_status, notes FROM app_doctor_patients WHERE doctor_id = ? AND patient_id = ?').get(doctorId, patientId) as any;

  if (!rel || rel.consent_status !== 'approved') {
    return res.json({ success: true, data: {
      name: `${patient.first_name} ${patient.last_name}`,
      consentStatus: rel?.consent_status || 'none',
      allowed: { labReports: false, prescriptions: false, pastHistory: false },
      sections: {}
    }});
  }

  let scopes = { labReports: false, prescriptions: false, pastHistory: false } as any;
  try {
    const parsed = rel.notes ? JSON.parse(rel.notes) : {};
    scopes = parsed.scopes || scopes;
  } catch {}

  // For prototype, return empty arrays gated by scopes
  const sections: any = {};
  if (scopes.labReports) sections.labReports = [];
  if (scopes.prescriptions) sections.prescriptions = [];
  if (scopes.pastHistory) sections.pastHistory = [];

  return res.json({ success: true, data: {
    name: `${patient.first_name} ${patient.last_name}`,
    consentStatus: 'approved',
    allowed: scopes,
    sections
  }});
}));

// --- Doctor-assisted patient invite flow (mirrors lab, but for doctors) ---
// Create a patient invite
router.post('/:doctorId/patient-invites', asyncHandler(async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  const { firstName, lastName, dateOfBirth, phone } = req.body as { firstName?: string; lastName?: string; dateOfBirth?: string; phone: string };
  // Ensure doctor exists
  const doctor = db.prepare('SELECT id, first_name, last_name FROM app_doctors WHERE id = ? AND is_active = 1').get(doctorId) as any;
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
  if (!phone) return res.status(400).json({ success: false, message: 'Phone is required' });
  const inviteId = uuidv4();
  const inviteCode = `INV-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const otpCode = '123456'; // demo
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  db.prepare(`
    INSERT INTO app_patient_invites (id, doctor_id, first_name, last_name, date_of_birth, phone, invite_code, otp_code, status, expires_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
  `).run(inviteId, doctorId, firstName || null, lastName || null, dateOfBirth || null, phone, inviteCode, otpCode, expiresAt);
  return res.json({ success: true, data: { inviteId, inviteCode, otp: otpCode, expiresAt, doctor: { id: doctor.id, name: `${doctor.first_name} ${doctor.last_name}`.trim() } } });
}));

// Verify patient invite by OTP (doctor-origin) and create provisional user and pending doctor-patient relation
router.post('/:doctorId/patient-invites/:inviteId/otp/verify', asyncHandler(async (req: Request, res: Response) => {
  const { doctorId, inviteId } = req.params;
  const { code } = req.body as { code: string };
  const invite = db.prepare('SELECT * FROM app_patient_invites WHERE id = ? AND doctor_id = ?').get(inviteId, doctorId) as any;
  if (!invite) return res.status(404).json({ success: false, message: 'Invite not found' });
  if (new Date(invite.expires_at).getTime() < Date.now()) return res.status(400).json({ success: false, message: 'Invite expired' });
  if (invite.status !== 'pending') return res.status(400).json({ success: false, message: 'Invite already used' });
  if (!code || code !== invite.otp_code) return res.status(400).json({ success: false, message: 'Invalid OTP' });
  // Create provisional user if not already created
  let userId = invite.user_id as string | null;
  if (!userId) {
    userId = `user-invite-${invite.id}`;
    db.prepare(`
      INSERT OR IGNORE INTO app_users (id, username, password_hash, email, phone, first_name, last_name, date_of_birth, role, is_active, created_at, updated_at)
      VALUES (?, ?, ?, NULL, ?, ?, ?, ?, 'patient', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(userId, `p_${invite.invite_code.toLowerCase()}`, '$2a$10$demoHashForLaterSet', invite.phone, invite.first_name, invite.last_name, invite.date_of_birth);
  }
  // Mark verified and save user_id
  db.prepare("UPDATE app_patient_invites SET status = 'verified', user_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(userId, inviteId);
  // Create doctor-patient pending relation
  const relationshipId = uuidv4();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT OR IGNORE INTO app_doctor_patients (id, doctor_id, patient_id, consent_status, consent_date, access_level, relationship_type, created_at, updated_at)
    VALUES (?, ?, ?, 'pending', NULL, 'read', 'primary', ?, ?)
  `).run(relationshipId, doctorId, userId, now, now);
  return res.json({ success: true, data: { userId, relationshipId } });
}));


