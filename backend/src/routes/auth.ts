import express, { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Placeholder auth routes for now
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Auth route - Login endpoint',
    data: { placeholder: true }
  });
}));

router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Auth route - Register endpoint',
    data: { placeholder: true }
  });
}));

export default router;