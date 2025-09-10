import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/sqlite';
import { logger } from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Helper function to generate session token
const generateSessionToken = (): string => {
  return uuidv4() + '-' + Date.now().toString(36);
};

// Helper function to clean expired sessions
const cleanExpiredSessions = () => {
  const now = new Date().toISOString();
  db.prepare('DELETE FROM app_user_sessions WHERE expires_at < ?').run(now);
};

// Register new user
router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const { username, password, email, phone, firstName, lastName, dateOfBirth, gender } = req.body;

  // Validate required fields
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required'
    });
  }

  // Check if username already exists
  const existingUser = db.prepare('SELECT id FROM app_users WHERE username = ?').get(username) as any;
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Username already exists'
    });
  }

  // Check if email already exists (if provided)
  if (email) {
    const existingEmail = db.prepare('SELECT id FROM app_users WHERE email = ?').get(email) as any;
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create user
  const userId = uuidv4();
  db.prepare(`
    INSERT INTO app_users 
    (id, username, password_hash, email, phone, first_name, last_name, date_of_birth, gender, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    userId,
    username,
    passwordHash,
    email || null,
    phone || null,
    firstName || null,
    lastName || null,
    dateOfBirth || null,
    gender || null,
    'patient'
  );

  logger.info(`✅ New user registered: ${username}`);

  return res.json({
    success: true,
    message: 'User registered successfully',
    data: {
      userId,
      username,
      email,
      role: 'patient'
    }
  });
}));

// Login user (unified for patients and doctors)
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { username, password, userType } = req.body;

  // Validate required fields
  if (!username || !password || !userType) {
    return res.status(400).json({
      success: false,
      message: 'Username, password, and user type are required'
    });
  }

  // Validate user type
  if (!['patient', 'doctor'].includes(userType)) {
    return res.status(400).json({
      success: false,
      message: 'User type must be either "patient" or "doctor"'
    });
  }

  let user: any = null;
  let userRole = '';

  if (userType === 'patient') {
    // Find patient user
    user = db.prepare(`
      SELECT id, username, password_hash, email, phone, first_name, last_name, 
             date_of_birth, gender, role, is_active, created_at
      FROM app_users 
      WHERE username = ? AND is_active = 1
    `).get(username) as any;
    userRole = 'patient';
  } else if (userType === 'doctor') {
    // Find doctor user
    user = db.prepare(`
      SELECT id, nmr_uid as username, password, email, phone, first_name, last_name,
             specialty, state_code, hospital_name, license_number, qualification,
             experience_years, is_active, created_at
      FROM app_doctors 
      WHERE nmr_uid = ? AND is_active = 1
    `).get(username) as any;
    userRole = 'doctor';
  }

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid username or password'
    });
  }

  // Verify password (different field names for patients vs doctors)
  const passwordField = userType === 'patient' ? 'password_hash' : 'password';
  const isValidPassword = await bcrypt.compare(password, user[passwordField]);
  if (!isValidPassword) {
    return res.status(401).json({
      success: false,
      message: 'Invalid username or password'
    });
  }

  // Clean expired sessions
  cleanExpiredSessions();

  // Create session (different tables for patients vs doctors)
  const sessionToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

  if (userType === 'patient') {
    db.prepare(`
      INSERT INTO app_user_sessions (id, user_id, token, expires_at)
      VALUES (?, ?, ?, ?)
    `).run(uuidv4(), user.id, sessionToken, expiresAt);
  } else if (userType === 'doctor') {
    db.prepare(`
      INSERT INTO app_doctor_sessions (id, doctor_id, session_token, expires_at)
      VALUES (?, ?, ?, ?)
    `).run(uuidv4(), user.id, sessionToken, expiresAt);
  }

  logger.info(`✅ ${userRole} logged in: ${username}`);

  // Prepare user data based on type
  const userData = userType === 'patient' ? {
    id: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    firstName: user.first_name,
    lastName: user.last_name,
    dateOfBirth: user.date_of_birth,
    gender: user.gender,
    role: user.role,
    createdAt: user.created_at
  } : {
    id: user.id,
    username: user.username, // This is nmr_uid for doctors
    email: user.email,
    phone: user.phone,
    firstName: user.first_name,
    lastName: user.last_name,
    specialty: user.specialty,
    stateCode: user.state_code,
    hospitalName: user.hospital_name,
    licenseNumber: user.license_number,
    qualification: user.qualification,
    experienceYears: user.experience_years,
    role: 'doctor',
    createdAt: user.created_at
  };

  return res.json({
    success: true,
    message: 'Login successful',
    data: {
      token: sessionToken,
      user: userData,
      userType: userRole
    }
  });
}));

// Complete registration from invite (set username/password, optional ABHA later)
router.post('/register-from-invite', asyncHandler(async (req: Request, res: Response) => {
  const { inviteCode, username, password } = req.body as { inviteCode: string; username: string; password: string };
  if (!inviteCode || !username || !password) return res.status(400).json({ success: false, message: 'inviteCode, username, password are required' });
  const invite = db.prepare('SELECT * FROM app_patient_invites WHERE invite_code = ?').get(inviteCode) as any;
  if (!invite) return res.status(404).json({ success: false, message: 'Invite not found' });
  if (invite.status !== 'verified' && invite.status !== 'completed') return res.status(400).json({ success: false, message: 'Invite not verified yet' });
  const userId = invite.user_id as string;
  // Ensure username is unique
  const existing = db.prepare('SELECT id FROM app_users WHERE username = ? AND id != ?').get(username, userId) as any;
  if (existing) return res.status(400).json({ success: false, message: 'Username already taken' });
  const hash = await bcrypt.hash(password, 10);
  try {
    db.prepare('UPDATE app_users SET username = ?, password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(username, hash, userId);
  } catch (e: any) {
    return res.status(400).json({ success: false, message: 'Failed to set credentials' });
  }
  db.prepare("UPDATE app_patient_invites SET status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(invite.id);
  // Create session
  const token = `${userId}-${Date.now()}`;
  db.prepare('INSERT INTO app_user_sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)').run(token, userId, token, new Date(Date.now() + 7*24*60*60*1000).toISOString());
  return res.json({ success: true, data: { userId, token } });
}));

// Lookup invite by code (for patient-side continue invite)
router.get('/invites/:inviteCode', asyncHandler(async (req: Request, res: Response) => {
  const { inviteCode } = req.params;
  const inv = db.prepare('SELECT id, lab_id, first_name, last_name, phone, status, expires_at FROM app_patient_invites WHERE invite_code = ?').get(inviteCode) as any;
  if (!inv) return res.status(404).json({ success: false, message: 'Invite not found' });
  return res.json({ success: true, data: inv });
}));

// Verify invite by code + OTP (patient-side)
router.post('/invites/:inviteCode/otp/verify', asyncHandler(async (req: Request, res: Response) => {
  const { inviteCode } = req.params;
  const { code } = req.body as { code: string };
  const invite = db.prepare('SELECT * FROM app_patient_invites WHERE invite_code = ?').get(inviteCode) as any;
  if (!invite) return res.status(404).json({ success: false, message: 'Invite not found' });
  if (new Date(invite.expires_at).getTime() < Date.now()) return res.status(400).json({ success: false, message: 'Invite expired' });
  // If already verified, be idempotent and return success
  if (invite.status === 'verified' || invite.status === 'completed') {
    return res.json({ success: true, message: 'Invite already verified', data: { userId: invite.user_id } });
  }
  if (!code || code !== invite.otp_code) return res.status(400).json({ success: false, message: 'Invalid OTP' });
  // Ensure provisional user exists
  let userId = invite.user_id as string | null;
  if (!userId) {
    userId = `user-invite-${invite.id}`;
    db.prepare(`
      INSERT OR IGNORE INTO app_users (id, username, password_hash, email, phone, first_name, last_name, date_of_birth, role, is_active, created_at, updated_at)
      VALUES (?, ?, ?, NULL, ?, ?, ?, ?, 'patient', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(userId, `p_${invite.invite_code.toLowerCase()}`, '$2a$10$demoHashForLaterSet', invite.phone, invite.first_name, invite.last_name, invite.date_of_birth);
  }
  db.prepare('UPDATE app_patient_invites SET status = \'verified\', user_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(userId, invite.id);
  // Ensure pending link exists for the originator (lab or doctor)
  if (invite.lab_id) {
    const existsLab = db.prepare('SELECT id FROM app_user_care_team WHERE user_id = ? AND provider_type = "lab" AND provider_id = ?').get(userId, invite.lab_id) as any;
    if (!existsLab) {
      const careTeamId = require('uuid').v4();
      const abhaRow = db.prepare('SELECT abha_id FROM app_user_abha_profiles WHERE user_id = ?').get(userId) as any;
      
      // Use existing ABHA ID if available, otherwise NULL (user will register ABHA later)
      const abhaId = abhaRow?.abha_id || null;
      
      db.prepare(`
        INSERT INTO app_user_care_team (id, user_id, abha_id, provider_type, provider_id, provider_name, consent_status, created_at, updated_at)
        VALUES (?, ?, ?, 'lab', ?, (SELECT name FROM app_labs WHERE id = ?), 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).run(careTeamId, userId, abhaId, invite.lab_id, invite.lab_id);
    }
  }
  if (invite.doctor_id) {
    const existing = db.prepare('SELECT id FROM app_doctor_patients WHERE doctor_id = ? AND patient_id = ?').get(invite.doctor_id, userId) as any;
    if (!existing) {
      const relationshipId = require('uuid').v4();
      const now = new Date().toISOString();
      db.prepare(`
        INSERT INTO app_doctor_patients (id, doctor_id, patient_id, consent_status, consent_date, access_level, relationship_type, created_at, updated_at)
        VALUES (?, ?, ?, 'pending', NULL, 'read', 'primary', ?, ?)
      `).run(relationshipId, invite.doctor_id, userId, now, now);
    }
  }
  return res.json({ success: true, data: { userId } });
}));
// Logout user (unified for patients and doctors)
router.post('/logout', asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Token is required'
    });
  }

  // Try to remove from patient sessions first
  let result = db.prepare('DELETE FROM app_user_sessions WHERE token = ?').run(token);
  let userType = 'patient';

  // If not found in patient sessions, try doctor sessions
  if (result.changes === 0) {
    result = db.prepare('DELETE FROM app_doctor_sessions WHERE session_token = ?').run(token);
    userType = 'doctor';
  }

  if (result.changes === 0) {
    return res.status(404).json({
      success: false,
      message: 'Session not found'
    });
  }

  logger.info(`✅ ${userType} logged out`);

  return res.json({
    success: true,
    message: 'Logout successful'
  });
}));

// Verify session token (unified for patients and doctors)
router.post('/verify', asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Token is required'
    });
  }

  // Clean expired sessions
  cleanExpiredSessions();

  // Try to find patient session first
  let session = db.prepare(`
    SELECT s.user_id, s.expires_at, u.username, u.email, u.first_name, u.last_name, 
           u.date_of_birth, u.gender, u.role, u.created_at
    FROM app_user_sessions s
    JOIN app_users u ON s.user_id = u.id
    WHERE s.token = ? AND s.expires_at > ? AND u.is_active = 1
  `).get(token, new Date().toISOString()) as any;

  let userType = 'patient';

  // If not found in patient sessions, try doctor sessions
  if (!session) {
    session = db.prepare(`
      SELECT s.doctor_id, s.expires_at, d.nmr_uid as username, d.email, d.first_name, d.last_name,
             d.specialty, d.state_code, d.hospital_name, d.license_number, d.qualification,
             d.experience_years, d.created_at
      FROM app_doctor_sessions s
      JOIN app_doctors d ON s.doctor_id = d.id
      WHERE s.session_token = ? AND s.expires_at > ? AND d.is_active = 1
    `).get(token, new Date().toISOString()) as any;
    userType = 'doctor';
  }

  if (!session) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }

  // Prepare user data based on type
  const userData = userType === 'patient' ? {
    id: session.user_id,
    username: session.username,
    email: session.email,
    firstName: session.first_name,
    lastName: session.last_name,
    dateOfBirth: session.date_of_birth,
    gender: session.gender,
    role: session.role,
    createdAt: session.created_at
  } : {
    id: session.doctor_id,
    username: session.username, // This is nmr_uid for doctors
    email: session.email,
    firstName: session.first_name,
    lastName: session.last_name,
    specialty: session.specialty,
    stateCode: session.state_code,
    hospitalName: session.hospital_name,
    licenseNumber: session.license_number,
    qualification: session.qualification,
    experienceYears: session.experience_years,
    role: 'doctor',
    createdAt: session.created_at
  };

  return res.json({
    success: true,
    message: 'Token is valid',
    data: {
      user: userData,
      userType: userType
    }
  });
}));

// Get user profile
router.get('/profile/:userId', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  // Get user info
  const user = db.prepare(`
    SELECT id, username, email, phone, first_name, last_name, 
           date_of_birth, gender, role, created_at
    FROM app_users 
    WHERE id = ? AND is_active = 1
  `).get(userId) as any;

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Get ABHA profile if linked
  const abhaProfile = db.prepare(`
    SELECT p.*, r.name as abha_name, r.abha_id
    FROM app_user_abha_profiles p
    JOIN app_abha_registry r ON p.abha_id = r.abha_id
    WHERE p.user_id = ?
  `).get(userId) as any;

  return res.json({
    success: true,
    message: 'User profile retrieved successfully',
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        firstName: user.first_name,
        lastName: user.last_name,
        dateOfBirth: user.date_of_birth,
        gender: user.gender,
        role: user.role,
        createdAt: user.created_at
      },
      abhaProfile: abhaProfile ? {
        abhaId: abhaProfile.abha_id,
        abhaName: abhaProfile.abha_name,
        bloodGroup: abhaProfile.blood_group,
        heightCm: abhaProfile.height_cm,
        weightKg: abhaProfile.weight_kg,
        emergencyContact: abhaProfile.emergency_contact ? JSON.parse(abhaProfile.emergency_contact) : null,
        medicalConditions: abhaProfile.medical_conditions ? JSON.parse(abhaProfile.medical_conditions) : [],
        allergies: abhaProfile.allergies ? JSON.parse(abhaProfile.allergies) : [],
        currentMedications: abhaProfile.current_medications ? JSON.parse(abhaProfile.current_medications) : [],
        address: abhaProfile.address ? JSON.parse(abhaProfile.address) : null,
        linkedDate: abhaProfile.linked_date,
        verificationStatus: abhaProfile.verification_status
      } : null
    }
  });
}));

export default router;