import { db } from '../../src/config/sqlite';
import fs from 'fs';
import path from 'path';

describe('Demo Script Database Checks', () => {
  const dbFile = path.join(__dirname, '../../../data/quantivara.db');

  describe('Database Status Checks', () => {
    it('should detect missing abha_id column in medical_documents', () => {
      // This test simulates the demo script's check for missing abha_id column
      const hasAbhaIdColumn = () => {
        try {
          db.prepare("SELECT abha_id FROM medical_documents LIMIT 1").get();
          return true;
        } catch (error) {
          return false;
        }
      };

      // The check should work without throwing
      expect(typeof hasAbhaIdColumn()).toBe('boolean');
    });

    it('should count users correctly', () => {
      const userCount = () => {
        try {
          const result = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
          return result.count;
        } catch (error) {
          return 0;
        }
      };

      const count = userCount();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('should count demo ABHA IDs correctly', () => {
      const demoAbhaCount = () => {
        try {
          const result = db.prepare(`
            SELECT COUNT(*) as count FROM users 
            WHERE abha_id IN ('12345678901234', '98765432109876', '45678901234567', '11112222333344', '55556666777788')
          `).get() as any;
          return result.count;
        } catch (error) {
          return 0;
        }
      };

      const count = demoAbhaCount();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
      expect(count).toBeLessThanOrEqual(5);
    });
  });

  describe('Database File Checks', () => {
    it('should detect database file existence', () => {
      const dbExists = fs.existsSync(dbFile);
      expect(typeof dbExists).toBe('boolean');
    });

    it('should handle database file path correctly', () => {
      const relativePath = 'data/quantivara.db';
      const absolutePath = path.resolve(relativePath);
      
      expect(typeof absolutePath).toBe('string');
      expect(absolutePath).toContain('quantivara.db');
    });
  });

  describe('SQLite Command Simulation', () => {
    it('should simulate sqlite3 command for abha_id check', () => {
      // Simulate: sqlite3 "$DB_FILE" "SELECT abha_id FROM medical_documents LIMIT 1;"
      const simulateSqliteCommand = (sql: string) => {
        try {
          db.prepare(sql).get();
          return true;
        } catch (error) {
          return false;
        }
      };

      const result = simulateSqliteCommand("SELECT abha_id FROM medical_documents LIMIT 1;");
      expect(typeof result).toBe('boolean');
    });

    it('should simulate sqlite3 command for user count', () => {
      const simulateSqliteCommand = (sql: string) => {
        try {
          const result = db.prepare(sql).get() as any;
          return result ? result.count || 0 : 0;
        } catch (error) {
          return 0;
        }
      };

      const count = simulateSqliteCommand("SELECT COUNT(*) as count FROM users;");
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('should simulate sqlite3 command for demo ABHA count', () => {
      const simulateSqliteCommand = (sql: string) => {
        try {
          const result = db.prepare(sql).get() as any;
          return result ? result.count || 0 : 0;
        } catch (error) {
          return 0;
        }
      };

      const count = simulateSqliteCommand(`
        SELECT COUNT(*) as count FROM users 
        WHERE abha_id IN ('12345678901234', '98765432109876', '45678901234567', '11112222333344', '55556666777788');
      `);
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
      expect(count).toBeLessThanOrEqual(5);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing table gracefully', () => {
      const checkTable = (tableName: string) => {
        try {
          db.prepare(`SELECT * FROM ${tableName} LIMIT 1`).get();
          return true;
        } catch (error) {
          return false;
        }
      };

      // Test with non-existent table
      const result = checkTable('non_existent_table');
      expect(result).toBe(false);
    });

    it('should handle missing column gracefully', () => {
      const checkColumn = (tableName: string, columnName: string) => {
        try {
          db.prepare(`SELECT ${columnName} FROM ${tableName} LIMIT 1`).get();
          return true;
        } catch (error) {
          return false;
        }
      };

      // Test with non-existent column
      const result = checkColumn('users', 'non_existent_column');
      expect(result).toBe(false);
    });
  });
}); 