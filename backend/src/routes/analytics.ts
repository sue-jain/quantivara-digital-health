import express, { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { db } from '../config/sqlite';

const router = express.Router();

// Network effects analytics - Critical for investor demo
router.get('/network-effects', asyncHandler(async (req: Request, res: Response) => {
  try {
    // Get network statistics
    const networkQuery = `
      SELECT 
        (SELECT COUNT(*) FROM healthcare_providers WHERE type = 'lab' AND is_active = 1) as total_labs,
        (SELECT COUNT(*) FROM healthcare_providers WHERE type = 'hospital' AND is_active = 1) as total_hospitals,
        (SELECT COUNT(*) FROM network_connections WHERE is_active = 1) as total_connections,
        (SELECT COUNT(*) FROM medical_documents WHERE status = 'completed') as total_documents_processed,
        (SELECT SUM(amount_paise) FROM revenue_events) as total_revenue_paise
    `;
    
    const stats = db.prepare(networkQuery).get() as any;
    
    // Calculate network value
    const possibleConnections = (stats.total_labs || 0) * (stats.total_hospitals || 0);
    const connectionRate = stats.total_connections ? ((stats.total_connections / possibleConnections) * 100).toFixed(1) : 0;
    
    // Monthly revenue projection based on current network
    const labRevenue = (stats.total_labs || 0) * 70000; // ₹7,000 per lab per month (in paise)
    const hospitalRevenue = (stats.total_hospitals || 0) * 10000000; // ₹1,00,000 per hospital per month (in paise)
    const monthlyRevenue = labRevenue + hospitalRevenue;
    
    const networkData = {
      currentNetwork: {
        totalLabs: stats.total_labs || 0,
        totalHospitals: stats.total_hospitals || 0,
        possibleConnections,
        activeConnections: stats.total_connections || 0,
        connectionRate: `${connectionRate}%`,
        documentsProcessed: stats.total_documents_processed || 0
      },
      revenue: {
        totalEarned: {
          paise: stats.total_revenue_paise || 0,
          inr: `₹${((stats.total_revenue_paise || 0) / 100).toLocaleString('en-IN')}`,
          usd: `$${Math.round((stats.total_revenue_paise || 0) / 8400).toLocaleString('en-US')}` // ₹84 = $1
        },
        monthlyProjection: {
          paise: monthlyRevenue,
          inr: `₹${(monthlyRevenue / 100).toLocaleString('en-IN')}`,
          usd: `$${Math.round(monthlyRevenue / 8400).toLocaleString('en-US')}`
        },
        annualProjection: {
          paise: monthlyRevenue * 12,
          inr: `₹${((monthlyRevenue * 12) / 100).toLocaleString('en-IN')}`,
          usd: `$${Math.round((monthlyRevenue * 12) / 8400).toLocaleString('en-US')}`
        }
      },
      networkEffects: {
        description: "Each lab connects to ALL hospitals, each hospital to ALL labs",
        multiplier: `${stats.total_labs} × ${stats.total_hospitals} = ${possibleConnections} potential connections`,
        growthPotential: `Adding 1 lab = ${stats.total_hospitals} new connections`,
        scalingFactor: "Network value grows exponentially with each new participant"
      },
      projectedGrowth: {
        year1: {
          labs: 500,
          hospitals: 20,
          monthlyRevenue: `₹${((500 * 70000 + 20 * 10000000) / 100).toLocaleString('en-IN')}`,
          connections:500 * 20
        },
        year2: {
          labs: 2000,
          hospitals: 50,  
          monthlyRevenue: `₹${((2000 * 70000 + 50 * 10000000) / 100).toLocaleString('en-IN')}`,
          connections: 2000 * 50
        },
        year3: {
          labs: 5000,
          hospitals: 100,
          monthlyRevenue: `₹${((5000 * 70000 + 100 * 10000000) / 100).toLocaleString('en-IN')}`,
          connections: 5000 * 100
        }
      }
    };

    res.json({
      success: true,
      message: 'Network effects analytics retrieved',
      data: networkData
    });
    
  } catch (error) {
    throw error;
  }
}));

// Live revenue tracking - Updates in real-time
router.get('/revenue', asyncHandler(async (req: Request, res: Response) => {
  try {
    // Get detailed revenue breakdown
    const revenueQuery = `
      SELECT 
        entity_type,
        event_type,
        SUM(amount_paise) as total_paise,
        COUNT(*) as event_count,
        AVG(amount_paise) as avg_paise
      FROM revenue_events 
      GROUP BY entity_type, event_type
    `;
    
    const revenueBreakdown = db.prepare(revenueQuery).all() as any[];
    
    // Get monthly trends
    const monthlyTrendsQuery = `
      SELECT 
        strftime('%Y-%m', created_at) as month,
        entity_type,
        SUM(amount_paise) as revenue_paise,
        COUNT(*) as transactions
      FROM revenue_events 
      GROUP BY strftime('%Y-%m', created_at), entity_type
      ORDER BY month DESC
      LIMIT 12
    `;
    
    const monthlyTrends = db.prepare(monthlyTrendsQuery).all() as any[];
    
    // Calculate totals
    const totalRevenue = revenueBreakdown.reduce((sum, item) => sum + item.total_paise, 0);
    
    const revenueData = {
      summary: {
        totalRevenue: {
          paise: totalRevenue,
          inr: `₹${(totalRevenue / 100).toLocaleString('en-IN')}`,
          usd: `$${Math.round(totalRevenue / 8400).toLocaleString('en-US')}`
        },
        totalTransactions: revenueBreakdown.reduce((sum, item) => sum + item.event_count, 0),
        averageTransactionValue: totalRevenue > 0 ? `₹${Math.round((totalRevenue / revenueBreakdown.reduce((sum, item) => sum + item.event_count, 0)) / 100)}` : '₹0'
      },
      breakdown: revenueBreakdown.map(item => ({
        entityType: item.entity_type,
        eventType: item.event_type,
        revenue: {
          paise: item.total_paise,
          inr: `₹${(item.total_paise / 100).toLocaleString('en-IN')}`,
          usd: `$${Math.round(item.total_paise / 8400)}`
        },
        transactionCount: item.event_count,
        averageValue: `₹${Math.round(item.avg_paise / 100)}`
      })),
      monthlyTrends: monthlyTrends.map(trend => ({
        month: trend.month,
        entityType: trend.entity_type,
        revenue: {
          paise: trend.revenue_paise,
          inr: `₹${(trend.revenue_paise / 100).toLocaleString('en-IN')}`
        },
        transactions: trend.transactions
      })),
      kpis: {
        labRevenue: `₹${(revenueBreakdown.filter(r => r.entity_type === 'lab').reduce((sum, r) => sum + r.total_paise, 0) / 100).toLocaleString('en-IN')}`,
        hospitalRevenue: `₹${(revenueBreakdown.filter(r => r.entity_type === 'hospital').reduce((sum, r) => sum + r.total_paise, 0) / 100).toLocaleString('en-IN')}`,
        avgRevenuePerLab: '₹7,000/month',
        avgRevenuePerHospital: '₹1,00,000/month'
      }
    };

    res.json({
      success: true,
      message: 'Revenue analytics retrieved',
      data: revenueData
    });
    
  } catch (error) {
    throw error;
  }
}));

// Real-time dashboard data for investor demos
router.get('/dashboard', asyncHandler(async (req: Request, res: Response) => {
  try {
    const dashboardQuery = `
      SELECT 
        (SELECT COUNT(*) FROM healthcare_providers WHERE type = 'lab') as labs,
        (SELECT COUNT(*) FROM healthcare_providers WHERE type = 'hospital') as hospitals,
        (SELECT COUNT(*) FROM medical_documents WHERE status = 'completed') as documents,
        (SELECT COUNT(*) FROM users WHERE role = 'patient') as patients,
        (SELECT SUM(amount_paise) FROM revenue_events) as revenue,
        (SELECT COUNT(*) FROM network_connections) as connections
    `;
    
    const dashboard = db.prepare(dashboardQuery).get() as any;
    
    res.json({
      success: true,
      message: 'Dashboard data retrieved',
      data: {
        metrics: {
          labs: dashboard.labs || 0,
          hospitals: dashboard.hospitals || 0,
          documentsProcessed: dashboard.documents || 0,
          patients: dashboard.patients || 0,
          networkConnections: dashboard.connections || 0
        },
        revenue: {
          total: `₹${((dashboard.revenue || 0) / 100).toLocaleString('en-IN')}`,
          projection: {
            monthly: `₹${(((dashboard.labs * 70000) + (dashboard.hospitals * 10000000)) / 100).toLocaleString('en-IN')}`,
            annual: `₹${((((dashboard.labs * 70000) + (dashboard.hospitals * 10000000)) * 12) / 100).toLocaleString('en-IN')}`
          }
        },
        lastUpdated: new Date().toISOString(),
        demoMode: process.env.DEMO_MODE === 'true'
      }
    });
    
  } catch (error) {
    throw error;
  }
}));

export default router;