import express, { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { db } from '../config/sqlite';
import { logger } from '../utils/logger';

const router = express.Router();

// Generate demo healthcare metrics for investor presentations
const generateDemoMetrics = () => {
  const baseMetrics = {
    activeHospitals: 12,
    activeLabs: 157,
    dailyDocuments: 256 + Math.floor(Math.random() * 50),
    averageAccuracy: 94 + Math.random() * 4,
    networkConnections: 1884, // 12 hospitals × 157 labs
    monthlyRevenue: 17840000, // In paise (₹1,78,400)
  };
  
  return {
    ...baseMetrics,
    growthRate: '23%',
    systemUptime: '99.98%',
    processingSpeed: '2.1 seconds/document',
    patientReach: '50,000+',
  };
};

// Demo data reset for investor presentations
router.post('/reset', asyncHandler(async (req: Request, res: Response) => {
  try {
    // Reset demo-specific data while preserving core structure
    db.prepare('DELETE FROM revenue_events WHERE entity_id LIKE "demo_%"').run();
    db.prepare('UPDATE medical_documents SET status = "completed" WHERE status = "processing"').run();
    
    logger.info('Demo data reset requested', { ip: req.ip });
    
    res.json({
      success: true,
      message: 'Demo data reset completed',
      data: {
        timestamp: new Date().toISOString(),
        resetItems: {
          revenueEvents: 'cleared',
          processingQueue: 'cleared',
          activeConnections: 'maintained',
        }
      }
    });
  } catch (error) {
    throw error;
  }
}));

// Demo status and configuration
router.get('/status', asyncHandler(async (req: Request, res: Response) => {
  const metrics = generateDemoMetrics();
  
  res.json({
    success: true,
    message: 'Demo status',
    data: {
      demoMode: process.env.DEMO_MODE === 'true',
      environment: process.env.NODE_ENV,
      version: '1.0.0',
      metrics,
      features: {
        abhaLookup: true,
        documentProcessing: true,
        realtimeAnalytics: true,
        networkEffects: true,
        revenueTracking: true,
      },
      lastUpdated: new Date().toISOString()
    }
  });
}));

// Simulate real hospital-lab connection for demo
router.post('/simulate-connection', asyncHandler(async (req: Request, res: Response) => {
  const { labId, hospitalId } = req.body;
  
  try {
    // Create a network connection event
    const connectionResult = db.prepare(`
      INSERT INTO network_connections (lab_id, hospital_id, is_active, created_at)
      VALUES (?, ?, 1, ?)
    `).run(labId || 1, hospitalId || 1, new Date().toISOString());
    
    // Create a revenue event
    const revenueResult = db.prepare(`
      INSERT INTO revenue_events (entity_id, entity_type, event_type, amount_paise, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      `demo_${Date.now()}`,
      'hospital',
      'network_connection',
      10000000, // ₹1,00,000 in paise
      new Date().toISOString()
    );
    
    res.json({
      success: true,
      message: 'Network connection simulated',
      data: {
        connectionId: connectionResult.lastInsertRowid,
        revenueGenerated: '₹1,00,000',
        networkEffect: 'Active',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    throw error;
  }
}));

// Get live demo statistics for investor dashboard
router.get('/live-stats', asyncHandler(async (req: Request, res: Response) => {
  try {
    const stats = db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM medical_documents WHERE DATE(created_at) = DATE('now')) as today_documents,
        (SELECT COUNT(*) FROM medical_documents WHERE status = 'processing') as processing_now,
        (SELECT AVG(extraction_accuracy) FROM medical_documents WHERE extraction_accuracy IS NOT NULL) as avg_accuracy,
        (SELECT COUNT(*) FROM network_connections WHERE DATE(created_at) = DATE('now')) as new_connections,
        (SELECT SUM(amount_paise) FROM revenue_events WHERE DATE(created_at) = DATE('now')) as today_revenue
    `).get() as any;
    
    res.json({
      success: true,
      message: 'Live demo statistics',
      data: {
        documentsToday: stats.today_documents || 0,
        currentlyProcessing: stats.processing_now || 0,
        averageAccuracy: stats.avg_accuracy ? `${Math.round(stats.avg_accuracy)}%` : '94%',
        newConnections: stats.new_connections || 0,
        todayRevenue: `₹${((stats.today_revenue || 0) / 100).toLocaleString('en-IN')}`,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    throw error;
  }
}));

// Generate sample medical timeline for demo
router.get('/sample-timeline/:abhaId', asyncHandler(async (req: Request, res: Response) => {
  const { abhaId } = req.params;
  
  // Generate realistic medical timeline data
  const sampleTimeline = [
    {
      id: 'doc_001',
      type: 'prescription',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      provider: 'Max Healthcare',
      doctor: 'Dr. Sharma',
      summary: { medications: ['Metformin 500mg', 'Lisinopril 10mg'], diagnosis: 'Diabetes Type 2' },
      accuracy: 96
    },
    {
      id: 'doc_002',
      type: 'lab_report',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      provider: 'SRL Diagnostics',
      doctor: null,
      summary: { tests: ['HbA1c: 7.2%', 'FBS: 140 mg/dL'], critical: true },
      accuracy: 98
    },
    {
      id: 'doc_003',
      type: 'discharge_summary',
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      provider: 'Apollo Hospital',
      doctor: 'Dr. Patel',
      summary: { procedure: 'Cardiac Catheterization', stay: '3 days', outcome: 'Successful' },
      accuracy: 94
    }
  ];
  
  res.json({
    success: true,
    message: 'Sample medical timeline',
    data: {
      abhaId,
      timeline: sampleTimeline,
      totalDocuments: sampleTimeline.length,
      timespan: '30 days',
      nextAppointment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  });
}));

export default router;