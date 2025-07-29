import Database from 'better-sqlite3';
import path from 'path';
import { logger } from '../utils/logger';

const dbPath = path.join(__dirname, '../../data/quantivara.db');

// Ensure data directory exists
import fs from 'fs';
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create database connection
export const db: Database.Database = new Database(dbPath, {
  verbose: process.env.NODE_ENV === 'development' ? console.log : undefined
});

// Enable foreign keys and WAL mode for better performance
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Test connection
try {
  const result = db.prepare('SELECT 1 as test').get() as { test: number } | undefined;
  if (result?.test === 1) {
    logger.info('✅ SQLite database connected successfully');
  }
} catch (error) {
  logger.error('❌ SQLite connection failed:', error);
  process.exit(1);
}

// Graceful shutdown
process.on('exit', () => {
  logger.info('🔒 Closing SQLite database connection');
  db.close();
});

process.on('SIGINT', () => {
  logger.info('🔒 Closing SQLite database connection');
  db.close();
  process.exit(0);
});

export default db;