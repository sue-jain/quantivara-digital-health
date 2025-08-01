// Document Processing Service

import apiClient, { API_ENDPOINTS, uploadFile, ApiResponse } from '@/config/api';
import webSocketService from './websocket';

export interface DocumentUploadData {
  patientId: string;
  providerId: string;
  documentType: string;
  file: File;
}

export interface DocumentStatus {
  documentId: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number;
  message?: string;
}

export interface DocumentResult {
  documentId: string;
  documentType: string;
  extractedData: any;
  extractionAccuracy: number;
  processingTime: number;
  aiInsights?: string[];
}

export interface ProcessingSimulation {
  patientId: string;
  providerId: string;
  documentType: string;
  fileName: string;
  simulatedAccuracy?: number;
}

class DocumentService {
  private processingCallbacks: Map<string, (update: any) => void> = new Map();
  
  constructor() {
    // Register WebSocket handlers
    this.setupWebSocketHandlers();
  }
  
  private setupWebSocketHandlers() {
    // Handle processing started
    webSocketService.on('processing_started', (data) => {
      const callback = this.processingCallbacks.get(data.documentId);
      if (callback) {
        callback({
          status: 'processing',
          progress: 0,
          message: data.message,
        });
      }
    });
    
    // Handle processing progress
    webSocketService.on('processing_progress', (data) => {
      const callback = this.processingCallbacks.get(data.documentId);
      if (callback) {
        callback({
          status: 'processing',
          progress: data.progress,
          message: data.message,
          currentStep: data.step,
        });
      }
    });
    
    // Handle processing complete
    webSocketService.on('processing_complete', (data) => {
      const callback = this.processingCallbacks.get(data.documentId);
      if (callback) {
        callback({
          status: 'completed',
          progress: 100,
          result: data.result,
          processingTime: data.processingTime,
        });
        
        // Clean up callback
        this.processingCallbacks.delete(data.documentId);
      }
    });
    
    // Handle processing error
    webSocketService.on('processing_error', (data) => {
      const callback = this.processingCallbacks.get(data.documentId);
      if (callback) {
        callback({
          status: 'error',
          error: data.error,
          message: data.message,
        });
        
        // Clean up callback
        this.processingCallbacks.delete(data.documentId);
      }
    });
  }
  
  // Upload document via HTTP
  async uploadDocument(data: DocumentUploadData): Promise<string> {
    try {
      const response = await uploadFile(
        API_ENDPOINTS.documents.upload,
        data.file,
        {
          patientId: data.patientId,
          providerId: data.providerId,
          documentType: data.documentType,
        }
      );
      
      return response.data.documentId;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }
  
  // Start document processing via WebSocket
  startProcessing(
    documentId: string,
    patientId: string,
    providerId: string,
    documentType: string,
    fileName: string,
    onUpdate: (update: any) => void
  ) {
    // Store callback for updates
    this.processingCallbacks.set(documentId, onUpdate);
    
    // Ensure WebSocket is connected
    if (!webSocketService.isConnected()) {
      webSocketService.connect({
        onOpen: () => {
          // Send processing request once connected
          webSocketService.startDocumentProcessing(
            patientId,
            providerId,
            documentType,
            fileName
          );
        },
      });
    } else {
      // Send processing request immediately
      webSocketService.startDocumentProcessing(
        patientId,
        providerId,
        documentType,
        fileName
      );
    }
  }
  
  // Simulate document processing (for demo without file upload)
  async simulateProcessing(data: ProcessingSimulation): Promise<ApiResponse> {
    try {
      const response = await apiClient(
        API_ENDPOINTS.processing.simulate,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      
      return response;
    } catch (error) {
      console.error('Error simulating document processing:', error);
      throw error;
    }
  }
  
  // Get document processing status
  async getDocumentStatus(documentId: string): Promise<DocumentStatus> {
    try {
      const response = await apiClient<DocumentStatus>(
        API_ENDPOINTS.documents.status(documentId)
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching document status:', error);
      throw error;
    }
  }
  
  // Get document results
  async getDocumentResults(documentId: string): Promise<DocumentResult> {
    try {
      const response = await apiClient<DocumentResult>(
        API_ENDPOINTS.documents.results(documentId)
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching document results:', error);
      throw error;
    }
  }
  
  // Detect document type from filename or content
  detectDocumentType(filename: string): string {
    const name = filename.toLowerCase();
    
    if (name.includes('prescription') || name.includes('rx')) {
      return 'prescription';
    }
    if (name.includes('lab') || name.includes('blood') || name.includes('pathology')) {
      return 'lab_report';
    }
    if (name.includes('ecg') || name.includes('ekg') || name.includes('cardiac')) {
      return 'ecg_report';
    }
    if (name.includes('xray') || name.includes('x-ray') || name.includes('radiology')) {
      return 'xray_report';
    }
    if (name.includes('discharge') || name.includes('summary')) {
      return 'discharge_summary';
    }
    if (name.includes('ayurveda') || name.includes('ayush')) {
      return 'ayush_prescription';
    }
    
    return 'medical_document';
  }
  
  // Clean up any pending callbacks
  cleanup() {
    this.processingCallbacks.clear();
  }
}

// Create singleton instance
const documentService = new DocumentService();

export default documentService;