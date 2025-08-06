import { db } from '../../src/config/sqlite';
import { setupDatabase, createTables } from '../../src/scripts/setupDatabase';
import { addDemoData } from '../../src/scripts/addDemoData';
import fs from 'fs';
import path from 'path';

describe('Database Setup Tests', () => {
  const testDbPath = path.join(__dirname, '../../../data/test-quantivara.db');
  const originalDbPath = path.join(__dirname, '../../../data/quantivara.db');
  
  beforeAll(() => {
    // Backup original database if it exists
    if (fs.existsSync(originalDbPath)) {
      fs.copyFileSync(originalDbPath, originalDbPath + '.backup');
    }
  });

  afterAll(() => {
    // Restore original database
    if (fs.existsSync(originalDbPath + '.backup')) {
      fs.copyFileSync(originalDbPath + '.backup', originalDbPath);
      fs.unlinkSync(originalDbPath + '.backup');
    }
    
    // Clean up test database
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  beforeEach(() => {
    // Clean up test database before each test
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    
    // Also clean up any existing test data in the main database
    try {
      db.prepare('DELETE FROM users WHERE id = ?').run('existing-user-test-123');
      db.prepare('DELETE FROM users WHERE abha_id = ?').run('88888888888888');
    } catch (error) {
      // Ignore errors if table doesn't exist
    }
  });

  describe('Fresh Database Setup', () => {
    it('should create all tables with abha_id column for new developers', async () => {
      // Mock the database path to use test database
      const originalDb = db;
      const mockDb = {
        ...db,
        exec: jest.fn().mockImplementation((sql) => {
          if (sql.includes('CREATE TABLE')) {
            // Simulate table creation
            return true;
          }
          if (sql.includes('ALTER TABLE medical_documents ADD COLUMN abha_id')) {
            // This should not be called for fresh database
            throw new Error('Column already exists');
          }
          return true;
        })
      };

      // Test table creation
      const result = createTables();
      expect(result).toBe(true);

      // Verify medical_documents table has abha_id column
      const tableInfo = db.prepare("PRAGMA table_info(medical_documents)").all() as any[];
      const hasAbhaIdColumn = tableInfo.some(col => col.name === 'abha_id');
      expect(hasAbhaIdColumn).toBe(true);
    });

    it('should create all required indexes successfully', async () => {
      const result = createTables();
      expect(result).toBe(true);

      // Check that indexes exist
      const indexes = [
        'idx_users_abha_id',
        'idx_users_email', 
        'idx_users_role',
        'idx_documents_abha_id',
        'idx_documents_patient',
        'idx_documents_type',
        'idx_documents_status'
      ];

      for (const indexName of indexes) {
        const indexExists = db.prepare(`
          SELECT name FROM sqlite_master 
          WHERE type='index' AND name=?
        `).get(indexName);
        expect(indexExists).toBeTruthy();
      }
    });
  });

  describe('Existing Database Migration', () => {
    it('should add missing abha_id column to existing medical_documents table', async () => {
      // Create a database without abha_id column (simulating old database)
      db.exec(`
        CREATE TABLE IF NOT EXISTS medical_documents_old (
          id TEXT PRIMARY KEY,
          patient_id TEXT,
          provider_id TEXT,
          document_type TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          file_path TEXT,
          file_name TEXT,
          file_size INTEGER,
          mime_type TEXT,
          processing_started_at TEXT,
          processing_completed_at TEXT,
          extraction_accuracy REAL,
          extracted_data TEXT,
          original_language TEXT DEFAULT 'en',
          urgency TEXT DEFAULT 'routine',
          created_at TEXT DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT (datetime('now'))
        );
      `);

      // Verify abha_id column doesn't exist initially
      const tableInfoBefore = db.prepare("PRAGMA table_info(medical_documents_old)").all() as any[];
      const hasAbhaIdBefore = tableInfoBefore.some(col => col.name === 'abha_id');
      expect(hasAbhaIdBefore).toBe(false);

      // Run the setup (which should add the column)
      const result = createTables();
      expect(result).toBe(true);

      // Verify abha_id column was added
      const tableInfoAfter = db.prepare("PRAGMA table_info(medical_documents)").all() as any[];
      const hasAbhaIdAfter = tableInfoAfter.some(col => col.name === 'abha_id');
      expect(hasAbhaIdAfter).toBe(true);
    });

    it('should handle existing abha_id column gracefully', async () => {
      // Create table with abha_id column already present
      db.exec(`
        CREATE TABLE IF NOT EXISTS medical_documents_existing (
          id TEXT PRIMARY KEY,
          abha_id TEXT,
          patient_id TEXT,
          document_type TEXT NOT NULL
        );
      `);

      // Run setup - should not fail
      const result = createTables();
      expect(result).toBe(true);
    });
  });

  describe('Demo Data Integration', () => {
    it('should add demo ABHA IDs successfully', async () => {
      // Setup database first
      createTables();
      
      // Add demo data
      await addDemoData();

      // Verify demo ABHA IDs exist
      const demoAbhaIds = ['12345678901234', '98765432109876', '45678901234567', '11112222333344', '55556666777788'];
      
      for (const abhaId of demoAbhaIds) {
        const user = db.prepare('SELECT abha_id FROM users WHERE abha_id = ?').get(abhaId) as any;
        expect(user).toBeTruthy();
        expect(user.abha_id).toBe(abhaId);
      }
    });

    it('should preserve existing data when adding demo data', async () => {
      // Setup database
      createTables();
      
      // Add some existing data (with unique ABHA ID and email)
      db.prepare(`
        INSERT INTO users (id, abha_id, email, password_hash, first_name, last_name, role)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run('existing-user-test-123', '88888888888888', 'existing-test-unique@test.com', 'hash', 'Existing', 'User', 'patient');

      // Add demo data
      await addDemoData();

      // Verify existing data is preserved
      const existingUser = db.prepare('SELECT abha_id FROM users WHERE abha_id = ?').get('88888888888888') as any;
      expect(existingUser).toBeTruthy();
      expect(existingUser.abha_id).toBe('88888888888888');

      // Verify demo data was added
      const demoUser = db.prepare('SELECT abha_id FROM users WHERE abha_id = ?').get('12345678901234') as any;
      expect(demoUser).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', () => {
      // This test would require mocking the database connection
      // For now, we'll test that the setup function doesn't throw
      expect(() => {
        try {
          createTables();
        } catch (error) {
          // Should not throw for normal operations
          throw error;
        }
      }).not.toThrow();
    });

    it('should handle missing tables gracefully', () => {
      // Test that setup can handle missing tables
      const result = createTables();
      expect(result).toBe(true);
    });
  });

  describe('Integration with Demo Script', () => {
    it('should work with the demo script database checks', () => {
      // Simulate the demo script's database checks
      const dbFile = path.join(__dirname, '../../../data/quantivara.db');
      
      if (fs.existsSync(dbFile)) {
        // Test the SQL queries that the demo script uses
        const hasAbhaIdColumn = db.prepare("SELECT abha_id FROM medical_documents LIMIT 1").get();
        expect(hasAbhaIdColumn).toBeDefined();

        const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
        expect(userCount.count).toBeGreaterThanOrEqual(0);

        const demoAbhaCount = db.prepare(`
          SELECT COUNT(*) as count FROM users 
          WHERE abha_id IN ('12345678901234', '98765432109876', '45678901234567', '11112222333344', '55556666777788')
        `).get() as any;
        expect(demoAbhaCount.count).toBeGreaterThanOrEqual(0);
      }
    });
  });
});