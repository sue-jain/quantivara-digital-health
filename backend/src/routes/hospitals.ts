import express, { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Hospital dashboard data
router.get('/:hospitalId/dashboard', asyncHandler(async (req: Request, res: Response) => {
  const { hospitalId } = req.params;
  
  res.json({
    success: true,
    message: 'Hospital dashboard data',
    data: {
      hospitalId,
      monthlyRevenue: 100000, // ₹1,00,000 INR
      networkConnections: 50,
      placeholder: true
    }
  });
}));

// Available hospital network
router.get('/network/available', asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Available hospital network',
    data: {
      hospitals: [],
      totalCount: 20,
      placeholder: true
    }
  });
}));

export default router;