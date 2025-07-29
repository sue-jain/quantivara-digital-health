import { logger, logMedicalAccess, logRevenueEvent, logPerformance } from '../../src/utils/logger';

describe('Logger Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Main Logger', () => {
    it('should be defined', () => {
      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.debug).toBe('function');
    });

    it('should have correct log levels', () => {
      expect(logger.level).toBeDefined();
    });
  });

  describe('Medical Access Logging', () => {
    it('should log medical access events', () => {
      const userId = 'user123';
      const patientId = 'patient456';
      const action = 'profile_access';
      const details = { ip: '192.168.1.1', userAgent: 'test-agent' };

      expect(() => {
        logMedicalAccess(userId, patientId, action, details);
      }).not.toThrow();
    });

    it('should log medical access without details', () => {
      const userId = 'user123';
      const patientId = 'patient456';
      const action = 'emergency_access';

      expect(() => {
        logMedicalAccess(userId, patientId, action);
      }).not.toThrow();
    });
  });

  describe('Revenue Event Logging', () => {
    it('should log revenue events', () => {
      const entityType = 'document_processing';
      const entityId = 'doc123';
      const amount = 50.00;
      const currency = 'INR';
      const details = { provider: 'test_provider' };

      expect(() => {
        logRevenueEvent(entityType, entityId, amount, currency, details);
      }).not.toThrow();
    });

    it('should log revenue events without details', () => {
      const entityType = 'api_call';
      const entityId = 'call123';
      const amount = 10.00;
      const currency = 'USD';

      expect(() => {
        logRevenueEvent(entityType, entityId, amount, currency);
      }).not.toThrow();
    });
  });

  describe('Performance Logging', () => {
    it('should log performance metrics', () => {
      const operation = 'database_query';
      const duration = 150;
      const success = true;
      const details = { query: 'SELECT * FROM users' };

      expect(() => {
        logPerformance(operation, duration, success, details);
      }).not.toThrow();
    });

    it('should log failed performance metrics', () => {
      const operation = 'api_request';
      const duration = 5000;
      const success = false;
      const details = { error: 'timeout' };

      expect(() => {
        logPerformance(operation, duration, success, details);
      }).not.toThrow();
    });
  });
});