import { Pool } from 'pg';
import { dbConfig, testConnection, query, transaction, closePool } from '../../src/config/database';

// Mock the pg module
jest.mock('pg', () => ({
  Pool: jest.fn(() => ({
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
    on: jest.fn()
  }))
}));

// Mock logger
jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  }
}));

describe('Database Configuration', () => {
  let mockPool: any;
  let mockClient: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockClient = {
      query: jest.fn(),
      release: jest.fn()
    };
    mockPool = {
      connect: jest.fn().mockResolvedValue(mockClient),
      query: jest.fn(),
      end: jest.fn(),
      on: jest.fn()
    };
    (Pool as unknown as jest.Mock).mockImplementation(() => mockPool);
  });

  describe('Database Configuration', () => {
    it('should have correct default configuration', () => {
      expect(dbConfig).toEqual({
        host: 'localhost',
        port: 5432,
        database: 'quantivara_db',
        user: 'quantivara_user',
        password: 'quantivara_pass',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000
      });
    });

    it('should use environment variables when provided', () => {
      const originalEnv = process.env;
      process.env = {
        ...originalEnv,
        DB_HOST: 'test-host',
        DB_PORT: '3306',
        DB_NAME: 'test_db',
        DB_USER: 'test_user',
        DB_PASSWORD: 'test_pass'
      };

      // Re-import to get updated config
      jest.resetModules();
      const { dbConfig: newConfig } = require('../../src/config/database');

      expect(newConfig.host).toBe('test-host');
      expect(newConfig.port).toBe(3306);
      expect(newConfig.database).toBe('test_db');
      expect(newConfig.user).toBe('test_user');
      expect(newConfig.password).toBe('test_pass');

      process.env = originalEnv;
    });
  });

  describe('Test Connection', () => {
    it('should return true when connection is successful', async () => {
      mockClient.query.mockResolvedValue({ rows: [{ now: new Date() }] });

      const result = await testConnection();

      expect(result).toBe(true);
      expect(mockPool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith('SELECT NOW()');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should return false when connection fails', async () => {
      mockPool.connect.mockRejectedValue(new Error('Connection failed'));

      const result = await testConnection();

      expect(result).toBe(false);
      expect(mockPool.connect).toHaveBeenCalled();
    });

    it('should return false when query fails', async () => {
      mockClient.query.mockRejectedValue(new Error('Query failed'));

      const result = await testConnection();

      expect(result).toBe(false);
      expect(mockClient.query).toHaveBeenCalledWith('SELECT NOW()');
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('Query Function', () => {
    it('should execute query successfully', async () => {
      const mockResult = { rows: [{ id: 1, name: 'test' }], rowCount: 1 };
      mockPool.query.mockResolvedValue(mockResult);

      const result = await query('SELECT * FROM users WHERE id = $1', [1]);

      expect(result).toEqual(mockResult);
      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', [1]);
    });

    it('should handle query without parameters', async () => {
      const mockResult = { rows: [], rowCount: 0 };
      mockPool.query.mockResolvedValue(mockResult);

      const result = await query('SELECT * FROM users');

      expect(result).toEqual(mockResult);
      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM users', undefined);
    });

    it('should throw error when query fails', async () => {
      const error = new Error('Query failed');
      mockPool.query.mockRejectedValue(error);

      await expect(query('INVALID SQL')).rejects.toThrow('Query failed');
    });
  });

  describe('Transaction Function', () => {
    it('should execute transaction successfully', async () => {
      const callback = jest.fn().mockResolvedValue('success');
      
      const result = await transaction(callback);

      expect(result).toBe('success');
      expect(mockPool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(callback).toHaveBeenCalledWith(mockClient);
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should rollback transaction on error', async () => {
      const error = new Error('Transaction failed');
      const callback = jest.fn().mockRejectedValue(error);

      await expect(transaction(callback)).rejects.toThrow('Transaction failed');

      expect(mockPool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(callback).toHaveBeenCalledWith(mockClient);
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should release client even if rollback fails', async () => {
      const error = new Error('Transaction failed');
      const rollbackError = new Error('Rollback failed');
      const callback = jest.fn().mockRejectedValue(error);
      
      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockRejectedValueOnce(rollbackError); // ROLLBACK

      await expect(transaction(callback)).rejects.toThrow('Transaction failed');

      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('Close Pool', () => {
    it('should close pool successfully', async () => {
      mockPool.end.mockResolvedValue(undefined);

      await closePool();

      expect(mockPool.end).toHaveBeenCalled();
    });

    it('should handle pool closing error', async () => {
      const error = new Error('Failed to close pool');
      mockPool.end.mockRejectedValue(error);

      await expect(closePool()).resolves.toBeUndefined();
      expect(mockPool.end).toHaveBeenCalled();
    });
  });
});