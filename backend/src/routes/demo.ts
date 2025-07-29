import express, { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Demo data reset for investor presentations
router.post('/reset', asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Demo data reset completed',
    data: {
      timestamp: new Date().toISOString(),
      placeholder: true
    }
  });
}));

// Demo status and configuration
router.get('/status', asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Demo status',
    data: {
      demoMode: process.env.DEMO_MODE === 'true',
      environment: process.env.NODE_ENV,
      version: '1.0.0',
      placeholder: true
    }
  });
}));

export default router;