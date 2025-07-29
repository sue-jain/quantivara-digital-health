import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { logger } from '../utils/logger';
import { documentProcessor } from './documentProcessor';
import { db } from '../config/sqlite';
import { v4 as uuidv4 } from 'uuid';

interface WebSocketMessage {
  type: string;
  data: any;
  sessionId?: string;
}

interface ConnectedClient {
  id: string;
  socket: WebSocket;
  sessionId: string;
  connectedAt: Date;
  lastPing: Date;
}

class WebSocketManager {
  private wss: WebSocketServer | null = null;
  private clients = new Map<string, ConnectedClient>();
  private pingInterval: NodeJS.Timeout | null = null;

  initialize(server: Server) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws'
    });

    this.wss.on('connection', (ws: WebSocket, request) => {
      const clientId = uuidv4();
      const sessionId = uuidv4();
      
      const client: ConnectedClient = {
        id: clientId,
        socket: ws,
        sessionId,
        connectedAt: new Date(),
        lastPing: new Date()
      };

      this.clients.set(clientId, client);
      
      logger.info(`WebSocket client connected: ${clientId} from ${request.socket.remoteAddress}`);

      // Send connection confirmation
      this.sendMessage(ws, {
        type: 'connection_established',
        data: {
          clientId,
          sessionId,
          message: 'Connected to Quantivara AI processing server',
          serverTime: new Date().toISOString()
        }
      });

      // Handle incoming messages
      ws.on('message', async (message: Buffer) => {
        try {
          const parsedMessage: WebSocketMessage = JSON.parse(message.toString());
          await this.handleMessage(clientId, parsedMessage);
        } catch (error) {
          logger.error(`Error processing WebSocket message from ${clientId}:`, error);
          this.sendMessage(ws, {
            type: 'error',
            data: {
              message: 'Invalid message format',
              error: 'MESSAGE_PARSE_ERROR'
            }
          });
        }
      });

      // Handle pong responses
      ws.on('pong', () => {
        const client = this.clients.get(clientId);
        if (client) {
          client.lastPing = new Date();
        }
      });

      // Handle disconnection
      ws.on('close', () => {
        logger.info(`WebSocket client disconnected: ${clientId}`);
        documentProcessor.handleDisconnection(client.sessionId);
        this.clients.delete(clientId);
      });

      // Handle errors
      ws.on('error', (error) => {
        logger.error(`WebSocket error for client ${clientId}:`, error);
        this.clients.delete(clientId);
      });
    });

    // Start ping/pong heartbeat
    this.startHeartbeat();

    logger.info('WebSocket server initialized on /ws endpoint');
  }

  private async handleMessage(clientId: string, message: WebSocketMessage) {
    const client = this.clients.get(clientId);
    if (!client) return;

    logger.info(`Received message from ${clientId}: ${message.type}`);

    switch (message.type) {
      case 'start_document_processing':
        await this.handleDocumentProcessing(client, message.data);
        break;

      case 'get_live_analytics':
        await this.handleLiveAnalytics(client);
        break;

      case 'ping':
        this.sendMessage(client.socket, {
          type: 'pong',
          data: { timestamp: new Date().toISOString() }
        });
        break;

      case 'subscribe_to_updates':
        await this.handleSubscribeToUpdates(client, message.data);
        break;

      default:
        this.sendMessage(client.socket, {
          type: 'error',
          data: {
            message: `Unknown message type: ${message.type}`,
            error: 'UNKNOWN_MESSAGE_TYPE'
          }
        });
    }
  }

  private async handleDocumentProcessing(client: ConnectedClient, data: any) {
    const { patientId, providerId, documentType, fileName } = data;

    try {
      // Create a new document record in the database
      const documentResult = db.prepare(`
        INSERT INTO medical_documents 
        (patient_id, provider_id, document_type, status, file_name, uploaded_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        patientId,
        providerId,
        documentType,
        'processing',
        fileName,
        new Date().toISOString()
      );

      const documentId = documentResult.lastInsertRowid.toString();

      // Send immediate confirmation
      this.sendMessage(client.socket, {
        type: 'processing_started',
        data: {
          documentId,
          message: 'Document processing initiated',
          estimatedTime: '15-30 seconds'
        }
      });

      // Start the processing simulation
      await documentProcessor.startProcessing(
        client.socket,
        client.sessionId,
        documentId,
        patientId,
        providerId,
        documentType,
        fileName
      );

    } catch (error) {
      logger.error('Document processing initiation failed:', error);
      this.sendMessage(client.socket, {
        type: 'processing_error',
        data: {
          message: 'Failed to start document processing',
          error: 'PROCESSING_INIT_ERROR'
        }
      });
    }
  }

  private async handleLiveAnalytics(client: ConnectedClient) {
    try {
      // Get real-time analytics data
      const analyticsQuery = `
        SELECT 
          (SELECT COUNT(*) FROM medical_documents WHERE status = 'processing') as processing_docs,
          (SELECT COUNT(*) FROM medical_documents WHERE status = 'completed') as completed_docs,
          (SELECT AVG(extraction_accuracy) FROM medical_documents WHERE extraction_accuracy IS NOT NULL) as avg_accuracy,
          (SELECT COUNT(*) FROM healthcare_providers WHERE is_active = 1) as active_providers,
          (SELECT SUM(amount_paise) FROM revenue_events WHERE DATE(created_at) = DATE('now')) as daily_revenue
      `;

      const analytics = db.prepare(analyticsQuery).get() as any;

      this.sendMessage(client.socket, {
        type: 'live_analytics_update',
        data: {
          currentlyProcessing: analytics.processing_docs || 0,
          completedToday: analytics.completed_docs || 0,
          averageAccuracy: analytics.avg_accuracy ? `${Math.round(analytics.avg_accuracy)}%` : '94%',
          activeProviders: analytics.active_providers || 0,
          dailyRevenue: `₹${((analytics.daily_revenue || 0) / 100).toLocaleString('en-IN')}`,
          serverLoad: Math.random() * 0.3 + 0.1, // Simulated 10-40% load
          processingQueue: Math.floor(Math.random() * 5),
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      logger.error('Live analytics fetch failed:', error);
      this.sendMessage(client.socket, {
        type: 'error',
        data: {
          message: 'Failed to fetch live analytics',
          error: 'ANALYTICS_ERROR'
        }
      });
    }
  }

  private async handleSubscribeToUpdates(client: ConnectedClient, data: any) {
    const { subscriptionType } = data;

    // Simulate different types of real-time updates
    const updateHandlers = {
      'network_effects': () => this.sendNetworkUpdates(client),
      'revenue_stream': () => this.sendRevenueUpdates(client),
      'processing_queue': () => this.sendProcessingUpdates(client)
    };

    if (updateHandlers[subscriptionType as keyof typeof updateHandlers]) {
      // Send initial data
      updateHandlers[subscriptionType as keyof typeof updateHandlers]();
      
      this.sendMessage(client.socket, {
        type: 'subscription_confirmed',
        data: {
          subscriptionType,
          message: `Subscribed to ${subscriptionType} updates`,
          updateInterval: '5 seconds'
        }
      });
    }
  }

  private sendNetworkUpdates(client: ConnectedClient) {
    // Send network effects updates every 5 seconds
    const interval = setInterval(() => {
      if (!this.clients.has(client.id)) {
        clearInterval(interval);
        return;
      }

      const networkUpdate = {
        totalConnections: 25 + Math.floor(Math.random() * 3), // Simulate slight growth
        activeTransfers: Math.floor(Math.random() * 8),
        recentConnection: {
          lab: 'PathLabs Sector-15',
          hospital: 'Max Healthcare',
          timestamp: new Date().toISOString()
        }
      };

      this.sendMessage(client.socket, {
        type: 'network_update',
        data: networkUpdate
      });
    }, 5000);
  }

  private sendRevenueUpdates(client: ConnectedClient) {
    // Send revenue stream updates
    const interval = setInterval(() => {
      if (!this.clients.has(client.id)) {
        clearInterval(interval);
        return;
      }

      const revenueUpdate = {
        realtimeRevenue: `₹${(Math.random() * 5000 + 2000).toFixed(0)}`,
        recentTransaction: {
          type: Math.random() > 0.5 ? 'Lab Processing Fee' : 'Hospital Network Fee',
          amount: `₹${Math.floor(Math.random() * 1000 + 500)}`,
          timestamp: new Date().toISOString()
        },
        monthlyProjection: `₹${(45000 + Math.random() * 5000).toFixed(0)}`
      };

      this.sendMessage(client.socket, {
        type: 'revenue_update',
        data: revenueUpdate
      });
    }, 7000);
  }

  private sendProcessingUpdates(client: ConnectedClient) {
    // Send processing queue updates
    const interval = setInterval(() => {
      if (!this.clients.has(client.id)) {
        clearInterval(interval);
        return;
      }

      const queueUpdate = {
        queueLength: Math.floor(Math.random() * 6),
        processingRate: `${(Math.random() * 2 + 1).toFixed(1)} docs/min`,
        averageAccuracy: `${Math.floor(Math.random() * 8 + 90)}%`,
        systemLoad: `${Math.floor(Math.random() * 30 + 15)}%`
      };

      this.sendMessage(client.socket, {
        type: 'processing_queue_update',
        data: queueUpdate
      });
    }, 4000);
  }

  private sendMessage(ws: WebSocket, message: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private startHeartbeat() {
    this.pingInterval = setInterval(() => {
      this.clients.forEach((client, clientId) => {
        if (client.socket.readyState === WebSocket.OPEN) {
          // Check if client responded to last ping
          const timeSinceLastPing = new Date().getTime() - client.lastPing.getTime();
          if (timeSinceLastPing > 60000) { // 1 minute timeout
            logger.warn(`Client ${clientId} appears inactive, closing connection`);
            client.socket.terminate();
            this.clients.delete(clientId);
            return;
          }

          // Send ping
          client.socket.ping();
        } else {
          this.clients.delete(clientId);
        }
      });
    }, 30000); // Ping every 30 seconds
  }

  // Broadcast message to all connected clients
  broadcast(message: any) {
    this.clients.forEach((client) => {
      this.sendMessage(client.socket, message);
    });
  }

  // Get connection statistics
  getStats() {
    return {
      totalConnections: this.clients.size,
      connectedClients: Array.from(this.clients.values()).map(client => ({
        id: client.id,
        sessionId: client.sessionId,
        connectedAt: client.connectedAt,
        lastPing: client.lastPing
      }))
    };
  }

  shutdown() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    this.clients.forEach((client) => {
      client.socket.close();
    });

    this.clients.clear();

    if (this.wss) {
      this.wss.close();
    }

    logger.info('WebSocket server shut down');
  }
}

export const webSocketManager = new WebSocketManager();