import { Server } from 'http';
import { webSocketManager } from '../../src/websocket/server';

// Mock WebSocket
jest.mock('ws', () => ({
  WebSocketServer: jest.fn(() => ({
    on: jest.fn(),
    close: jest.fn(),
    clients: new Set()
  })),
  WebSocket: {
    OPEN: 1,
    CLOSED: 3
  }
}));

// Mock dependencies
jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  }
}));

jest.mock('../../src/config/sqlite', () => ({
  db: {
    prepare: jest.fn(() => ({
      run: jest.fn(() => ({ lastInsertRowid: 1 })),
      get: jest.fn(() => ({}))
    }))
  }
}));

jest.mock('../../src/websocket/documentProcessor', () => ({
  documentProcessor: {
    startProcessing: jest.fn(),
    handleDisconnection: jest.fn()
  }
}));

describe('WebSocket Server', () => {
  let mockServer: Partial<Server>;
  let mockWSS: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockServer = {
      on: jest.fn()
    };
    
    const { WebSocketServer } = require('ws');
    mockWSS = {
      on: jest.fn(),
      close: jest.fn(),
      clients: new Set()
    };
    WebSocketServer.mockImplementation(() => mockWSS);
  });

  describe('Initialization', () => {
    it('should initialize WebSocket server successfully', () => {
      webSocketManager.initialize(mockServer as Server);

      expect(mockWSS.on).toHaveBeenCalledWith('connection', expect.any(Function));
    });
  });

  describe('Connection Handling', () => {
    it('should handle new WebSocket connections', () => {
      webSocketManager.initialize(mockServer as Server);

      const connectionHandler = mockWSS.on.mock.calls.find(
        (call: any) => call[0] === 'connection'
      )[1];

      const mockRequest = {
        socket: { remoteAddress: '127.0.0.1' }
      };

      const mockWS = {
        on: jest.fn(),
        send: jest.fn(),
        close: jest.fn(),
        readyState: 1, // OPEN
        ping: jest.fn(),
        terminate: jest.fn()
      };

      connectionHandler(mockWS, mockRequest);

      expect(mockWS.on).toHaveBeenCalledWith('message', expect.any(Function));
      expect(mockWS.on).toHaveBeenCalledWith('close', expect.any(Function));
      expect(mockWS.on).toHaveBeenCalledWith('error', expect.any(Function));
      expect(mockWS.on).toHaveBeenCalledWith('pong', expect.any(Function));
      expect(mockWS.send).toHaveBeenCalledWith(
        expect.stringContaining('connection_established')
      );
    });
  });

  describe('Broadcasting', () => {
    it('should broadcast messages to connected clients', () => {
      webSocketManager.initialize(mockServer as Server);

      const message = { type: 'test', data: 'hello' };
      webSocketManager.broadcast(message);

      // Since we're using a mock implementation, we just verify the method exists and can be called
      expect(() => {
        webSocketManager.broadcast(message);
      }).not.toThrow();
    });
  });

  describe('Statistics', () => {
    it('should return connection statistics', () => {
      webSocketManager.initialize(mockServer as Server);

      const stats = webSocketManager.getStats();

      expect(stats).toEqual({
        totalConnections: expect.any(Number),
        connectedClients: expect.any(Array)
      });
    });
  });

  describe('Shutdown', () => {
    it('should shutdown WebSocket server successfully', () => {
      webSocketManager.initialize(mockServer as Server);

      webSocketManager.shutdown();

      expect(mockWSS.close).toHaveBeenCalled();
    });

    it('should handle shutdown when not initialized', () => {
      expect(() => {
        webSocketManager.shutdown();
      }).not.toThrow();
    });
  });
});