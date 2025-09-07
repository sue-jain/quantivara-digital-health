import express, { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { db } from '../config/sqlite';
import { logRevenueEvent } from '../utils/logger';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Lab partner onboarding - Critical for B2B demo
router.post('/onboard', asyncHandler(async (req: Request, res: Response) => {
  const { name, address, certifications, specialties } = req.body;
  
  try {
    const registrationNumber = `LAB-${Date.now()}`;
    
    const result = db.prepare(`
      INSERT INTO healthcare_providers 
      (name, type, registration_number, address, contact_info, certifications, specialties, tier, monthly_fee)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name,
      'lab',
      registrationNumber,
      JSON.stringify(address),
      JSON.stringify({ phone: '9876543210', email: `${name.toLowerCase().replace(' ', '')}@lab.com` }),
      JSON.stringify(certifications || ['NABL']),
      JSON.stringify(specialties || []),
      'tier-2',
      700000 // ₹7,000
    );

    // Log onboarding revenue event
    logRevenueEvent('lab', result.lastInsertRowid.toString(), 700000, 'INR', {
      eventType: 'onboarding',
      labName: name
    });

    res.status(201).json({
      success: true,
      message: 'Lab partner onboarded successfully',
      data: {
        labId: result.lastInsertRowid.toString(),
        registrationNumber,
        monthlyFee: '₹7,000',
        status: 'active',
        networkAccess: 'Instant access to 20+ hospital networks'
      }
    });
    
  } catch (error) {
    throw new AppError('Lab onboarding failed', 500, 'ONBOARDING_ERROR');
  }
}));

// Lab analytics and revenue tracking
router.get('/:labId/analytics', asyncHandler(async (req: Request, res: Response) => {
  const { labId } = req.params;
  
  try {
    // Get lab details
    const labQuery = `
      SELECT hp.*, 
        (SELECT COUNT(*) FROM medical_documents md WHERE md.provider_id = hp.id) as total_reports,
        (SELECT SUM(amount_paise) FROM revenue_events re WHERE re.entity_id = hp.id AND re.entity_type = 'lab') as total_revenue_paise,
        (SELECT COUNT(*) FROM network_connections nc WHERE nc.lab_provider_id = hp.id) as hospital_connections
      FROM healthcare_providers hp 
      WHERE hp.id = ? AND hp.type = 'lab'
    `;
    
    const lab = db.prepare(labQuery).get(labId) as any;
    
    if (!lab) {
      throw new AppError('Lab not found', 404, 'LAB_NOT_FOUND');
    }

    // Get monthly revenue breakdown
    const monthlyRevenueQuery = `
      SELECT 
        strftime('%Y-%m', created_at) as month,
        SUM(amount_paise) as revenue_paise,
        COUNT(*) as report_count
      FROM revenue_events 
      WHERE entity_id = ? AND entity_type = 'lab'
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month DESC
      LIMIT 6
    `;
    
    const monthlyData = db.prepare(monthlyRevenueQuery).all(labId) as any[];

    const analyticsData = {
      labId,
      labName: lab.name,
      tier: lab.tier,
      monthlyFee: lab.monthly_fee, // in paise
      monthlyFeeINR: `₹${(lab.monthly_fee / 100).toLocaleString('en-IN')}`,
      totalReports: lab.total_reports || 0,
      totalRevenue: lab.total_revenue_paise || 0,
      totalRevenueINR: `₹${((lab.total_revenue_paise || 0) / 100).toLocaleString('en-IN')}`,
      hospitalConnections: lab.hospital_connections || 0,
      monthlyBreakdown: monthlyData.map(month => ({
        month: month.month,
        revenue: month.revenue_paise,
        revenueINR: `₹${(month.revenue_paise / 100).toLocaleString('en-IN')}`,
        reportCount: month.report_count,
        averagePerReport: `₹${Math.round((month.revenue_paise / month.report_count) / 100)}`
      })),
      kpis: {
        averageRevenuePerReport: lab.total_reports > 0 ? Math.round((lab.total_revenue_paise || 0) / lab.total_reports) : 0,
        networkGrowth: `${lab.hospital_connections || 0} hospitals connected`,
        processingAccuracy: '94-98%'
      }
    };

    res.json({
      success: true,
      message: 'Lab analytics retrieved successfully',
      data: analyticsData
    });
    
  } catch (error) {
    throw error;
  }
}));

// Get all labs for network visualization
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  try {
    const labsQuery = `
      SELECT 
        hp.id, hp.name, hp.tier, hp.monthly_fee,
        (SELECT COUNT(*) FROM medical_documents md WHERE md.provider_id = hp.id) as reports_processed,
        (SELECT COUNT(*) FROM network_connections nc WHERE nc.lab_provider_id = hp.id) as connections
      FROM healthcare_providers hp 
      WHERE hp.type = 'lab' AND hp.is_active = 1
      ORDER BY reports_processed DESC
    `;
    
    const labs = db.prepare(labsQuery).all() as any[];
    
    const labsData = labs.map(lab => ({
      id: lab.id,
      name: lab.name,
      tier: lab.tier,
      monthlyFee: `₹${(lab.monthly_fee / 100).toLocaleString('en-IN')}`,
      reportsProcessed: lab.reports_processed || 0,
      hospitalConnections: lab.connections || 0,
      revenue: `₹${((lab.monthly_fee + (lab.reports_processed * 5000)) / 100).toLocaleString('en-IN')}` // Monthly fee + per report
    }));

    res.json({
      success: true,
      message: 'Labs retrieved successfully',
      data: {
        totalLabs: labs.length,
        labs: labsData,
        totalNetworkValue: `₹${labs.reduce((sum, lab) => sum + lab.monthly_fee + (lab.reports_processed * 5000), 0) / 100}`
      }
    });
    
  } catch (error) {
    throw error;
  }
}));

// Public endpoint: list lab test catalog (for dropdowns)
router.get('/tests/catalog', asyncHandler(async (_req: Request, res: Response) => {
  const rows = db.prepare('SELECT id, name, loinc_code as loincCode FROM app_lab_tests_catalog WHERE is_active = 1 ORDER BY name ASC').all() as any[];
  res.json({ success: true, data: rows });
}));

// New auth system: list available labs (for care team/lab booking)
router.get('/list', asyncHandler(async (_req: Request, res: Response) => {
  const labs = db.prepare(`
    SELECT id, hfr_uid as hfrUid, name, email, phone, address, city, state_code as stateCode, license_number as licenseNumber
    FROM app_labs WHERE is_active = 1
    ORDER BY name
  `).all() as any[];
  res.json({ success: true, data: labs });
}));

// New auth system: lab login with HFR ID
router.post('/login', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { hfrUid, password } = req.body;
  if (!hfrUid || !password) { res.status(400).json({ success: false, message: 'HFR ID and password are required' }); return; }
  const lab = db.prepare('SELECT * FROM app_labs WHERE hfr_uid = ? AND is_active = 1').get(hfrUid) as any;
  if (!lab) { res.status(401).json({ success: false, message: 'Invalid HFR ID or password' }); return; }
  const ok = await bcrypt.compare(password, lab.password);
  if (!ok) { res.status(401).json({ success: false, message: 'Invalid HFR ID or password' }); return; }
  const token = `${lab.id}-${Date.now()}`;
  db.prepare('INSERT INTO app_lab_sessions (id, lab_id, session_token, expires_at) VALUES (?, ?, ?, ?)')
    .run(token, lab.id, token, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());
  res.json({ success: true, data: { token, lab: { id: lab.id, hfrUid: lab.hfr_uid, name: lab.name } } });
}));

// List consented patients for a lab (based on app_user_care_team)
router.get('/:labId/patients', asyncHandler(async (req: Request, res: Response) => {
  const { labId } = req.params;
  try {
    // validate lab exists
    const lab = db.prepare('SELECT id FROM app_labs WHERE id = ? AND is_active = 1').get(labId) as any;
    if (!lab) {
      return res.status(404).json({ success: false, message: 'Lab not found' });
    }
    const rows = db.prepare(`
      SELECT c.user_id, u.first_name, u.last_name, p.abha_id
      FROM app_user_care_team c
      JOIN app_users u ON u.id = c.user_id
      LEFT JOIN app_user_abha_profiles p ON p.user_id = u.id
      WHERE c.provider_type = 'lab' AND c.provider_id = ? AND c.consent_status = 'approved'
      ORDER BY c.consent_date DESC, c.created_at DESC
    `).all(labId) as any[];

    const data = rows.map(r => ({ patientId: r.user_id, name: `${r.first_name || ''} ${r.last_name || ''}`.trim(), abhaId: r.abha_id }));
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch lab patients' });
  }
}));

// Ordered tests APIs
router.get('/:labId/patient/:userId/tests', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const rows = db.prepare(`
      SELECT id, test_id, test_name, status, ordered_by, report_id, created_at, updated_at
      FROM app_patient_ordered_tests WHERE user_id = ? ORDER BY created_at DESC
    `).all(userId) as any[];
    return res.json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch ordered tests' });
  }
}));

router.post('/:labId/patient/:userId/tests', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { testId, testName, orderedBy } = req.body as { testId: string; testName: string; orderedBy: 'self'|'doctor' };
  if (!testId || !testName || !orderedBy) {
    return res.status(400).json({ success: false, message: 'testId, testName, orderedBy are required' });
  }
  try {
    const id = require('uuid').v4();
    db.prepare(`
      INSERT INTO app_patient_ordered_tests (id, user_id, test_id, test_name, status, ordered_by)
      VALUES (?, ?, ?, ?, 'ordered', ?)
    `).run(id, userId, testId, testName, orderedBy);
    return res.json({ success: true, data: { id } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add test' });
  }
}));

router.put('/:labId/patient/:userId/tests/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id, userId } = req.params;
  const { status, reportId } = req.body as { status?: 'ordered'|'pending_review'|'completed'; reportId?: string };
  try {
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      UPDATE app_patient_ordered_tests SET status = COALESCE(?, status), report_id = COALESCE(?, report_id), updated_at = ?
      WHERE id = ? AND user_id = ?
    `);
    const result = stmt.run(status || null, reportId || null, now, id, userId);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Test not found' });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update test' });
  }
}));

export default router;