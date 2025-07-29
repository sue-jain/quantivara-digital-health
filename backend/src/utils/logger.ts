import winston from 'winston';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Add colors to winston
winston.addColors(colors);

// Define which logs to print based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    level: level(),
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }),
  
  // File transport for errors
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/error.log'),
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  
  // File transport for all logs
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/combined.log'),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  })
];

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || level(),
  levels,
  format,
  transports,
  exitOnError: false,
});

// Note: Healthcare-specific logging is handled by separate loggers below

// Medical audit logger for HIPAA compliance
export const medicalAuditLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/medical-audit.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 10,
    })
  ]
});

// Revenue tracking logger
export const revenueLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/revenue-tracking.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  ]
});

// Performance monitoring logger
export const performanceLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/performance.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 3,
    })
  ]
});

// Healthcare-specific logging functions
export const logMedicalAccess = (userId: string, patientId: string, action: string, details?: any) => {
  medicalAuditLogger.info({
    type: 'medical-access',
    userId,
    patientId,
    action,
    details,
    timestamp: new Date().toISOString(),
    ip: details?.ip,
    userAgent: details?.userAgent
  });
};

export const logRevenueEvent = (entityType: string, entityId: string, amount: number, currency: string, details?: any) => {
  revenueLogger.info({
    type: 'revenue-event',
    entityType,
    entityId,
    amount,
    currency,
    details,
    timestamp: new Date().toISOString()
  });
};

export const logPerformance = (operation: string, duration: number, success: boolean, details?: any) => {
  performanceLogger.info({
    type: 'performance',
    operation,
    duration,
    success,
    details,
    timestamp: new Date().toISOString()
  });
};

export { logger };