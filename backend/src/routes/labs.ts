import express, { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { db } from '../config/sqlite';
import { logRevenueEvent } from '../utils/logger';

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

export default router;