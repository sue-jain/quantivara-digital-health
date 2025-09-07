// API Configuration for Quantivara Digital Health Platform

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Backend configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  API_PREFIX: '/api/v1',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:3001/ws',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Export API_BASE_URL for backward compatibility
export const API_BASE_URL = API_CONFIG.BASE_URL + API_CONFIG.API_PREFIX;

// Full API endpoint URL builder
export const getApiUrl = (endpoint: string) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}${cleanEndpoint}`;
};

// WebSocket URL builder
export const getWsUrl = () => {
  return API_CONFIG.WS_URL;
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
    refresh: '/auth/refresh',
    verify: '/auth/verify',
  },
  
  // Patient endpoints
  patients: {
    lookupAbhaId: '/patients/lookup/abha-id',
    profile: (abhaId: string) => `/patients/${abhaId}/profile`,
    emergencyProfile: (abhaId: string) => `/patients/${abhaId}/emergency-profile`,
    timeline: (abhaId: string) => `/patients/${abhaId}/timeline`,
    addMedication: (abhaId: string) => `/patients/${abhaId}/medications`,
  },
  
  // Document endpoints
  documents: {
    upload: '/documents/upload',
    status: (documentId: string) => `/documents/${documentId}/status`,
    results: (documentId: string) => `/documents/${documentId}/results`,
    list: '/documents',
  },
  
  // Processing endpoints
  processing: {
    start: '/processing/start',
    simulate: '/processing/simulate',
  },
  
  // Analytics endpoints
  analytics: {
    dashboard: '/analytics/dashboard',
    revenue: '/analytics/revenue',
    networkEffects: '/analytics/network-effects',
    performance: '/analytics/performance',
  },
  
  // Lab endpoints
  labs: {
    list: '/labs',
    details: (labId: string) => `/labs/${labId}`,
    revenue: (labId: string) => `/labs/${labId}/revenue`,
  },
  
  // Hospital endpoints
  hospitals: {
    list: '/hospitals',
    details: (hospitalId: string) => `/hospitals/${hospitalId}`,
    revenue: (hospitalId: string) => `/hospitals/${hospitalId}/revenue`,
  },
  
  // Demo endpoints
  demo: {
    reset: '/demo/reset',
    status: '/demo/status',
  },
};

// Request headers builder
export const getRequestHeaders = (includeAuth = true) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };
  
  if (includeAuth) {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Error response types
export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
  details?: any;
}

// Generic API response type
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: ApiError;
}

// API client with retry logic
export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<ApiResponse<T>> {
  const url = getApiUrl(endpoint);
  const defaultOptions: RequestInit = {
    headers: getRequestHeaders(),
    ...options,
  };
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    
    const response = await fetch(url, {
      ...defaultOptions,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'An error occurred',
        statusCode: response.status,
      }));
      
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (retryCount < API_CONFIG.RETRY_ATTEMPTS) {
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
      return apiClient(endpoint, options, retryCount + 1);
    }
    
    throw error;
  }
}

// File upload helper
export async function uploadFile(
  endpoint: string,
  file: File,
  additionalData?: Record<string, any>
): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append('document', file);
  
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }
  
  const url = getApiUrl(endpoint);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': getRequestHeaders().Authorization || '',
    },
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }
  
  return response.json();
}

export default apiClient;