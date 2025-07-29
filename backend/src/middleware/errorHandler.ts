import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
}

// Custom error class for operational errors
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Healthcare-specific error classes
export class MedicalDataError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 422, code);
  }
}

export class ABHAValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'ABHA_VALIDATION_ERROR');
  }
}

export class ProcessingError extends AppError {
  constructor(message: string) {
    super(message, 500, 'PROCESSING_ERROR');
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

// Development error response
const sendErrorDev = (err: CustomError, res: Response) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: err.message,
      stack: err.stack,
      code: err.code,
      statusCode: err.statusCode
    },
    timestamp: new Date().toISOString()
  });
};

// Production error response
const sendErrorProd = (err: CustomError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: {
        message: err.message,
        code: err.code
      },
      timestamp: new Date().toISOString()
    });
  } else {
    // Programming or unknown error: don't leak error details
    logger.error('Programming error:', err);
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Something went wrong!',
        code: 'INTERNAL_SERVER_ERROR'
      },
      timestamp: new Date().toISOString()
    });
  }
};

// Handle specific database errors
const handleDatabaseError = (err: any): AppError => {
  if (err.code === '23505') {
    // Unique constraint violation
    return new AppError('Duplicate entry found', 409, 'DUPLICATE_ENTRY');
  }
  
  if (err.code === '23503') {
    // Foreign key constraint violation
    return new AppError('Referenced record not found', 409, 'FOREIGN_KEY_VIOLATION');
  }
  
  if (err.code === '23514') {
    // Check constraint violation
    return new AppError('Data validation failed', 422, 'VALIDATION_ERROR');
  }
  
  return new AppError('Database operation failed', 500, 'DATABASE_ERROR');
};

// Handle JWT errors
const handleJWTError = (): AppError => 
  new AuthenticationError('Invalid token. Please log in again!');

const handleJWTExpiredError = (): AppError =>
  new AuthenticationError('Your token has expired! Please log in again.');

// Handle validation errors
const handleValidationError = (err: any): AppError => {
  const errors = Object.values(err.details).map((detail: any) => detail.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400, 'VALIDATION_ERROR');
};

// Main error handling middleware
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err } as CustomError;
  error.message = err.message;

  // Log error for monitoring
  const errorInfo = {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: (req as any).user?.id,
    timestamp: new Date().toISOString()
  };

  if (err.statusCode && err.statusCode >= 500) {
    logger.error('Server Error:', errorInfo);
  } else {
    logger.warn('Client Error:', errorInfo);
  }

  // Handle specific error types
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
  if (err.name === 'ValidationError') error = handleValidationError(err);
  if (err.code?.startsWith('23')) error = handleDatabaseError(err);

  // Send error response
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

// Async error wrapper for async route handlers
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const err = new AppError(`Route ${req.originalUrl} not found`, 404, 'ROUTE_NOT_FOUND');
  next(err);
};