// WebSocket Service for Real-time Communication

import { getWsUrl } from '@/config/api';

export type WebSocketMessageType = 
  | 'connection_established'
  | 'processing_started'
  | 'processing_progress'
  | 'processing_complete'
  | 'processing_error'
  | 'live_analytics_update'
  | 'network_update'
  | 'revenue_update'
  | 'processing_queue_update'
  | 'error'
  | 'pong';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  data: any;
  sessionId?: string;
}

export interface WebSocketOptions {
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private sessionId: string | null = null;
  private options: WebSocketOptions = {};
  private reconnectAttempts = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private messageHandlers: Map<WebSocketMessageType, Array<(data: any) => void>> = new Map();
  
  constructor() {
    // Initialize message handlers map
    this.messageHandlers = new Map();
  }
  
  connect(options: WebSocketOptions = {}) {
    this.options = {
      reconnect: true,
      reconnectInterval: 5000,
      maxReconnectAttempts: 5,
      ...options,
    };
    
    const wsUrl = getWsUrl();
    console.log('Connecting to WebSocket:', wsUrl);
    
    try {
      this.socket = new WebSocket(wsUrl);
      
      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.startPingInterval();
        
        if (this.options.onOpen) {
          this.options.onOpen();
        }
      };
      
      this.socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('WebSocket message received:', message.type, message.data);
          
          // Handle connection established
          if (message.type === 'connection_established') {
            this.sessionId = message.data.sessionId;
          }
          
          // Call registered handlers
          const handlers = this.messageHandlers.get(message.type);
          if (handlers) {
            handlers.forEach(handler => handler(message.data));
          }
          
          // Call general message handler
          if (this.options.onMessage) {
            this.options.onMessage(message);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (this.options.onError) {
          this.options.onError(error);
        }
      };
      
      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.stopPingInterval();
        
        if (this.options.onClose) {
          this.options.onClose();
        }
        
        // Attempt reconnection
        if (this.options.reconnect && this.reconnectAttempts < this.options.maxReconnectAttempts!) {
          this.reconnectAttempts++;
          console.log(`Attempting reconnection ${this.reconnectAttempts}/${this.options.maxReconnectAttempts}`);
          
          this.reconnectTimeout = setTimeout(() => {
            this.connect(this.options);
          }, this.options.reconnectInterval);
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }
  
  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    this.stopPingInterval();
    this.options.reconnect = false;
    
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
    
    this.socket = null;
    this.sessionId = null;
  }
  
  send(type: string, data: any) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      return;
    }
    
    const message = {
      type,
      data,
      sessionId: this.sessionId,
    };
    
    this.socket.send(JSON.stringify(message));
  }
  
  // Register a handler for a specific message type
  on(type: WebSocketMessageType, handler: (data: any) => void) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    
    this.messageHandlers.get(type)!.push(handler);
    
    // Return unsubscribe function
    return () => {
      const handlers = this.messageHandlers.get(type);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }
  
  // Remove all handlers for a specific message type
  off(type: WebSocketMessageType) {
    this.messageHandlers.delete(type);
  }
  
  // Document processing methods
  startDocumentProcessing(patientId: string, providerId: string, documentType: string, fileName: string) {
    this.send('start_document_processing', {
      patientId,
      providerId,
      documentType,
      fileName,
    });
  }
  
  // Analytics methods
  requestLiveAnalytics() {
    this.send('get_live_analytics', {});
  }
  
  // Subscription methods
  subscribeToUpdates(subscriptionType: 'network_effects' | 'revenue_stream' | 'processing_queue') {
    this.send('subscribe_to_updates', { subscriptionType });
  }
  
  // Connection state
  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }
  
  getSessionId(): string | null {
    return this.sessionId;
  }
  
  // Private methods
  private startPingInterval() {
    this.pingInterval = setInterval(() => {
      if (this.isConnected()) {
        this.send('ping', { timestamp: new Date().toISOString() });
      }
    }, 30000); // Ping every 30 seconds
  }
  
  private stopPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;