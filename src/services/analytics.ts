// Analytics Service for Dashboard and Real-time Data

import apiClient, { API_ENDPOINTS, ApiResponse } from '@/config/api';
import webSocketService from './websocket';

export interface DashboardData {
  overview: {
    totalDocumentsProcessed: number;
    averageAccuracy: number;
    activeProviders: number;
    monthlyRevenue: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    provider: string;
    timestamp: string;
    status: string;
  }>;
  performanceMetrics: {
    processingSpeed: number;
    uptime: number;
    errorRate: number;
  };
}

export interface RevenueData {
  current: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
  breakdown: {
    labs: number;
    hospitals: number;
    perReportFees: number;
  };
  projections: {
    nextMonth: number;
    nextQuarter: number;
    nextYear: number;
  };
  recentTransactions: Array<{
    id: string;
    type: string;
    amount: number;
    provider: string;
    timestamp: string;
  }>;
}

export interface NetworkEffectsData {
  nodes: Array<{
    id: string;
    name: string;
    type: 'lab' | 'hospital';
    connections: number;
  }>;
  edges: Array<{
    source: string;
    target: string;
    weight: number;
  }>;
  metrics: {
    totalConnections: number;
    averageConnectivity: number;
    networkGrowthRate: number;
  };
}

export interface LiveAnalyticsUpdate {
  currentlyProcessing: number;
  completedToday: number;
  averageAccuracy: string;
  activeProviders: number;
  dailyRevenue: string;
  serverLoad: number;
  processingQueue: number;
  timestamp: string;
}

class AnalyticsService {
  private liveAnalyticsCallback: ((data: LiveAnalyticsUpdate) => void) | null = null;
  private networkUpdateCallback: ((data: any) => void) | null = null;
  private revenueUpdateCallback: ((data: any) => void) | null = null;
  
  constructor() {
    this.setupWebSocketHandlers();
  }
  
  private setupWebSocketHandlers() {
    // Handle live analytics updates
    webSocketService.on('live_analytics_update', (data) => {
      if (this.liveAnalyticsCallback) {
        this.liveAnalyticsCallback(data);
      }
    });
    
    // Handle network updates
    webSocketService.on('network_update', (data) => {
      if (this.networkUpdateCallback) {
        this.networkUpdateCallback(data);
      }
    });
    
    // Handle revenue updates
    webSocketService.on('revenue_update', (data) => {
      if (this.revenueUpdateCallback) {
        this.revenueUpdateCallback(data);
      }
    });
  }
  
  // Get dashboard data
  async getDashboardData(): Promise<DashboardData> {
    try {
      const response = await apiClient<DashboardData>(
        API_ENDPOINTS.analytics.dashboard
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
  
  // Get revenue analytics
  async getRevenueData(): Promise<RevenueData> {
    try {
      const response = await apiClient<RevenueData>(
        API_ENDPOINTS.analytics.revenue
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      throw error;
    }
  }
  
  // Get network effects data
  async getNetworkEffectsData(): Promise<NetworkEffectsData> {
    try {
      const response = await apiClient<NetworkEffectsData>(
        API_ENDPOINTS.analytics.networkEffects
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching network effects data:', error);
      throw error;
    }
  }
  
  // Start live analytics updates
  startLiveAnalytics(callback: (data: LiveAnalyticsUpdate) => void) {
    this.liveAnalyticsCallback = callback;
    
    // Ensure WebSocket is connected
    if (!webSocketService.isConnected()) {
      webSocketService.connect({
        onOpen: () => {
          webSocketService.requestLiveAnalytics();
        },
      });
    } else {
      webSocketService.requestLiveAnalytics();
    }
  }
  
  // Subscribe to network effects updates
  subscribeToNetworkUpdates(callback: (data: any) => void) {
    this.networkUpdateCallback = callback;
    
    if (webSocketService.isConnected()) {
      webSocketService.subscribeToUpdates('network_effects');
    }
  }
  
  // Subscribe to revenue stream updates
  subscribeToRevenueUpdates(callback: (data: any) => void) {
    this.revenueUpdateCallback = callback;
    
    if (webSocketService.isConnected()) {
      webSocketService.subscribeToUpdates('revenue_stream');
    }
  }
  
  // Stop live updates
  stopLiveUpdates() {
    this.liveAnalyticsCallback = null;
    this.networkUpdateCallback = null;
    this.revenueUpdateCallback = null;
  }
  
  // Format currency for Indian Rupees
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  
  // Calculate growth percentage
  calculateGrowth(current: number, previous: number): number {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  }
  
  // Generate demo analytics data (fallback)
  generateDemoAnalytics(): LiveAnalyticsUpdate {
    return {
      currentlyProcessing: Math.floor(Math.random() * 5),
      completedToday: 156 + Math.floor(Math.random() * 20),
      averageAccuracy: `${94 + Math.floor(Math.random() * 4)}%`,
      activeProviders: 25 + Math.floor(Math.random() * 3),
      dailyRevenue: this.formatCurrency(45000 + Math.random() * 5000),
      serverLoad: Math.random() * 0.3 + 0.1,
      processingQueue: Math.floor(Math.random() * 5),
      timestamp: new Date().toISOString(),
    };
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

export default analyticsService;