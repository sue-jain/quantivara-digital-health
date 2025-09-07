import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';

// Import configurations and middleware
import { dbConfig } from './config/database';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { webSocketManager } from './websocket/server';
import initDatabase from './scripts/initDatabase';

// Import routes
import authRoutes from './routes/auth';
import abhaRoutes from './routes/abha';
import patientRoutes from './routes/patients';
import documentRoutes from './routes/documents';
import userDocumentRoutes from './routes/userDocuments';
import patientProfileRoutes from './routes/patientProfile';
import patientCareTeamRoutes from './routes/patientCareTeam';
import labRoutes from './routes/labs';
import hospitalRoutes from './routes/hospitals';
import analyticsRoutes from './routes/analytics';
import demoRoutes from './routes/demo';
import processingRoutes from './routes/processing';
import doctorProfileRoutes from './routes/doctorProfile';
import doctorRoutes from './routes/doctor';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

const PORT = process.env.PORT || 3001;

// Initialize database on startup
const startServer = async () => {
  try {
    await initDatabase();
    logger.info('✅ Database initialization completed');
  } catch (error) {
    logger.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  frameguard: false // allow embedding files in iframe from frontend (different port)
}));

// Allow frontend to embed backend pages/files in iframes (dev ports)
app.use((req, res, next) => {
  const allowedAncestors = [
    'http://localhost:8080',
    'http://localhost:5173',
  ];
  res.setHeader('Content-Security-Policy', `frame-ancestors 'self' ${allowedAncestors.join(' ')};`);
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  }
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:8081'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Logging
app.use(morgan('combined', {
  stream: { write: (message: string) => logger.info(message.trim()) }
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
const apiPrefix = `/api/${process.env.API_VERSION || 'v1'}`;

app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/abha`, abhaRoutes);
app.use(`${apiPrefix}/patients`, patientRoutes);
app.use(`${apiPrefix}/documents`, documentRoutes);
app.use(`${apiPrefix}/user-documents`, userDocumentRoutes);
app.use(`${apiPrefix}/patient-profile`, patientProfileRoutes);
app.use(`${apiPrefix}/patient`, patientCareTeamRoutes);
app.use(`${apiPrefix}/labs`, labRoutes);
app.use(`${apiPrefix}/hospitals`, hospitalRoutes);
app.use(`${apiPrefix}/analytics`, analyticsRoutes);
app.use(`${apiPrefix}/demo`, demoRoutes);
app.use(`${apiPrefix}/processing`, processingRoutes);
app.use(`${apiPrefix}/doctor-profile`, doctorProfileRoutes);
app.use(`${apiPrefix}/doctor`, doctorRoutes);

// WebSocket connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  socket.on('join-room', (roomId: string) => {
    socket.join(roomId);
    logger.info(`Client ${socket.id} joined room: ${roomId}`);
  });
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Make io available to routes
app.set('io', io);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  webSocketManager.shutdown();
  server.close(() => {
    logger.info('Server closed.');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  webSocketManager.shutdown();
  server.close(() => {
    logger.info('Server closed.');
    process.exit(0);
  });
});

// Start server
const startApp = async () => {
  await startServer();
  
  server.listen(PORT, () => {
    logger.info(`🚀 Quantivara Backend Server running on port ${PORT}`);
    logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
    logger.info(`🏥 Demo Mode: ${process.env.DEMO_MODE === 'true' ? 'Enabled' : 'Disabled'}`);
    logger.info(`🔗 API Base URL: http://localhost:${PORT}${apiPrefix}`);
    logger.info(`📡 WebSocket Server: http://localhost:${PORT}`);
    
    // Initialize WebSocket server for real-time document processing
    webSocketManager.initialize(server);
    logger.info(`🔌 WebSocket endpoint: ws://localhost:${PORT}/ws`);
    
    if (process.env.NODE_ENV === 'development') {
      logger.info(`📋 Health Check: http://localhost:${PORT}/health`);
      logger.info(`🌐 CORS Origins: ${process.env.ALLOWED_ORIGINS}`);
    }
  });
};

// Start the application
startApp().catch((error) => {
  logger.error('❌ Failed to start server:', error);
  process.exit(1);
});

export { app, io };