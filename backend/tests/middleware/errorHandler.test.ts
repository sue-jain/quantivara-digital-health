import { Request, Response, NextFunction } from 'express';
import { 
  AppError, 
  MedicalDataError, 
  ABHAValidationError, 
  ProcessingError,
  AuthenticationError,
  AuthorizationError,
  errorHandler,
  asyncHandler
} from '../../src/middleware/errorHandler';

describe('Error Handler Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      url: '/test',
      method: 'GET',
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('test-user-agent')
    } as any;
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Custom Error Classes', () => {
    describe('AppError', () => {
      it('should create error with default status code 500', () => {
        const error = new AppError('Test error');
        expect(error.message).toBe('Test error');
        expect(error.statusCode).toBe(500);
        expect(error.isOperational).toBe(true);
      });

      it('should create error with custom status code and code', () => {
        const error = new AppError('Not found', 404, 'NOT_FOUND');
        expect(error.message).toBe('Not found');
        expect(error.statusCode).toBe(404);
        expect(error.code).toBe('NOT_FOUND');
        expect(error.isOperational).toBe(true);
      });
    });

    describe('MedicalDataError', () => {
      it('should create medical data error with 422 status', () => {
        const error = new MedicalDataError('Invalid medical data', 'INVALID_DATA');
        expect(error.message).toBe('Invalid medical data');
        expect(error.statusCode).toBe(422);
        expect(error.code).toBe('INVALID_DATA');
      });
    });

    describe('ABHAValidationError', () => {
      it('should create ABHA validation error with 400 status', () => {
        const error = new ABHAValidationError('Invalid ABHA ID');
        expect(error.message).toBe('Invalid ABHA ID');
        expect(error.statusCode).toBe(400);
        expect(error.code).toBe('ABHA_VALIDATION_ERROR');
      });
    });

    describe('ProcessingError', () => {
      it('should create processing error with 500 status', () => {
        const error = new ProcessingError('Processing failed');
        expect(error.message).toBe('Processing failed');
        expect(error.statusCode).toBe(500);
        expect(error.code).toBe('PROCESSING_ERROR');
      });
    });

    describe('AuthenticationError', () => {
      it('should create authentication error with default message', () => {
        const error = new AuthenticationError();
        expect(error.message).toBe('Authentication failed');
        expect(error.statusCode).toBe(401);
        expect(error.code).toBe('AUTHENTICATION_ERROR');
      });

      it('should create authentication error with custom message', () => {
        const error = new AuthenticationError('Token expired');
        expect(error.message).toBe('Token expired');
        expect(error.statusCode).toBe(401);
      });
    });

    describe('AuthorizationError', () => {
      it('should create authorization error with default message', () => {
        const error = new AuthorizationError();
        expect(error.message).toBe('Access denied');
        expect(error.statusCode).toBe(403);
        expect(error.code).toBe('AUTHORIZATION_ERROR');
      });
    });
  });

  describe('Error Handler Function', () => {
    it('should handle AppError in development mode', () => {
      process.env.NODE_ENV = 'development';
      const error = new AppError('Test error', 400, 'TEST_ERROR');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'Test error',
            code: 'TEST_ERROR',
            statusCode: 400
          }),
          timestamp: expect.any(String)
        })
      );
    });

    it('should handle operational errors in production mode', () => {
      process.env.NODE_ENV = 'production';
      const error = new AppError('Test error', 400, 'TEST_ERROR');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'Test error',
            code: 'TEST_ERROR'
          }),
          timestamp: expect.any(String)
        })
      );
    });

    it('should handle non-operational errors in production mode', () => {
      process.env.NODE_ENV = 'production';
      const error = new Error('Programming error');
      (error as any).statusCode = 500;

      errorHandler(error as any, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'Something went wrong!',
            code: 'INTERNAL_SERVER_ERROR'
          }),
          timestamp: expect.any(String)
        })
      );
    });

    it('should handle JWT errors', () => {
      const error = new Error('jwt malformed');
      error.name = 'JsonWebTokenError';

      errorHandler(error as any, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'Invalid token. Please log in again!',
            code: 'AUTHENTICATION_ERROR'
          })
        })
      );
    });

    it('should handle expired JWT errors', () => {
      const error = new Error('jwt expired');
      error.name = 'TokenExpiredError';

      errorHandler(error as any, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'Your token has expired! Please log in again.',
            code: 'AUTHENTICATION_ERROR'
          })
        })
      );
    });
  });

  describe('Async Handler', () => {
    it('should call next with error when async function throws', async () => {
      const mockError = new Error('Async error');
      const asyncFunction = jest.fn().mockRejectedValue(mockError);
      const wrappedFunction = asyncHandler(asyncFunction);

      await wrappedFunction(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    it('should not call next when async function succeeds', async () => {
      const asyncFunction = jest.fn().mockResolvedValue('success');
      const wrappedFunction = asyncHandler(asyncFunction);

      await wrappedFunction(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(asyncFunction).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    });

    it('should handle synchronous functions', () => {
      const syncFunction = jest.fn();
      const wrappedFunction = asyncHandler(syncFunction);

      wrappedFunction(mockReq as Request, mockRes as Response, mockNext);

      expect(syncFunction).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});