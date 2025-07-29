import express, { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { db } from '../config/sqlite';
import { webSocketManager } from '../websocket/server';
import { logger } from '../utils/logger';

const router = express.Router();

// Initiate document processing via WebSocket
router.post('/initiate', asyncHandler(async (req: Request, res: Response) => {
  const { patientId, providerId, documentType, fileName } = req.body;

  if (!patientId || !providerId || !documentType || !fileName) {
    throw new AppError('Missing required fields: patientId, providerId, documentType, fileName', 400, 'MISSING_FIELDS');
  }

  try {
    // Validate patient exists
    const patient = db.prepare('SELECT id FROM patients WHERE id = ?').get(patientId);
    if (!patient) {
      throw new AppError('Patient not found', 404, 'PATIENT_NOT_FOUND');
    }

    // Validate provider exists
    const provider = db.prepare('SELECT id, name, type FROM healthcare_providers WHERE id = ?').get(providerId) as any;
    if (!provider) {
      throw new AppError('Healthcare provider not found', 404, 'PROVIDER_NOT_FOUND');
    }

    // Create initial document record
    const documentResult = db.prepare(`
      INSERT INTO medical_documents 
      (patient_id, provider_id, document_type, status, file_name, uploaded_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      patientId,
      providerId,
      documentType,
      'queued',
      fileName,
      new Date().toISOString()
    );

    const documentId = documentResult.lastInsertRowid.toString();

    // Broadcast processing initiation to all connected WebSocket clients
    webSocketManager.broadcast({
      type: 'processing_queue_update',
      data: {
        message: 'New document added to processing queue',
        documentId,
        documentType,
        providerName: provider.name,
        queuePosition: 1,
        estimatedWaitTime: '2-5 seconds'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Document processing initiated successfully',
      data: {
        documentId,
        status: 'queued',
        documentType,
        fileName,
        provider: {
          id: provider.id,
          name: provider.name,
          type: provider.type
        },
        websocketEndpoint: `ws://localhost:${process.env.PORT || 3001}/ws`,
        instructions: {
          connect: 'Connect to WebSocket endpoint for real-time updates',
          message: {
            type: 'start_document_processing',
            data: {
              documentId,
              patientId,
              providerId,
              documentType,
              fileName
            }
          }
        }
      }
    });

    logger.info(`Document processing initiated: ${documentId} for patient ${patientId}`);

  } catch (error) {
    logger.error('Document processing initiation failed:', error);
    throw error;
  }
}));

// Get processing status
router.get('/status/:documentId', asyncHandler(async (req: Request, res: Response) => {
  const { documentId } = req.params;

  try {
    const document = db.prepare(`
      SELECT 
        md.id, md.document_type, md.status, md.file_name, md.extraction_accuracy,
        md.uploaded_at, md.processing_completed_at, md.extracted_data,
        hp.name as provider_name, hp.type as provider_type,
        p.id as patient_id
      FROM medical_documents md
      LEFT JOIN healthcare_providers hp ON md.provider_id = hp.id
      LEFT JOIN patients p ON md.patient_id = p.id
      WHERE md.id = ?
    `).get(documentId) as any;

    if (!document) {
      throw new AppError('Document not found', 404, 'DOCUMENT_NOT_FOUND');
    }

    const statusData = {
      documentId: document.id,
      documentType: document.document_type,
      fileName: document.file_name,
      status: document.status,
      provider: {
        name: document.provider_name,
        type: document.provider_type
      },
      patientId: document.patient_id,
      uploadedAt: document.uploaded_at,
      processingCompletedAt: document.processing_completed_at,
      extractionAccuracy: document.extraction_accuracy,
      extractedData: document.extracted_data ? JSON.parse(document.extracted_data) : null,
      processingTime: document.processing_completed_at && document.uploaded_at ? 
        new Date(document.processing_completed_at).getTime() - new Date(document.uploaded_at).getTime() : null
    };

    res.json({
      success: true,
      message: 'Document status retrieved successfully',
      data: statusData
    });

  } catch (error) {
    logger.error(`Failed to get status for document ${documentId}:`, error);
    throw error;
  }
}));

// Get processing queue status
router.get('/queue', asyncHandler(async (req: Request, res: Response) => {
  try {
    const queueQuery = `
      SELECT 
        md.id, md.document_type, md.file_name, md.status, md.uploaded_at,
        hp.name as provider_name, hp.type as provider_type,
        p.id as patient_id
      FROM medical_documents md
      LEFT JOIN healthcare_providers hp ON md.provider_id = hp.id
      LEFT JOIN patients p ON md.patient_id = p.id
      WHERE md.status IN ('queued', 'processing')
      ORDER BY md.uploaded_at ASC
    `;

    const queuedDocuments = db.prepare(queueQuery).all() as any[];

    const queueStats = {
      queueLength: queuedDocuments.length,
      averageProcessingTime: '15-30 seconds',
      systemLoad: `${Math.floor(Math.random() * 30 + 15)}%`,
      processingCapacity: '10 documents/minute',
      currentlyProcessing: queuedDocuments.filter(doc => doc.status === 'processing').length,
      queuedDocuments: queuedDocuments.map(doc => ({
        documentId: doc.id,
        documentType: doc.document_type,
        fileName: doc.file_name,
        status: doc.status,
        provider: doc.provider_name,
        providerType: doc.provider_type,
        queueTime: new Date().getTime() - new Date(doc.uploaded_at).getTime(),
        estimatedCompletion: doc.status === 'processing' ? '10-20 seconds' : '30-60 seconds'
      }))
    };

    res.json({
      success: true,
      message: 'Processing queue status retrieved',
      data: queueStats
    });

  } catch (error) {
    logger.error('Failed to get processing queue status:', error);
    throw error;
  }
}));

// WebSocket connection statistics
router.get('/websocket/stats', asyncHandler(async (req: Request, res: Response) => {
  try {
    const stats = webSocketManager.getStats();
    
    res.json({
      success: true,
      message: 'WebSocket statistics retrieved',
      data: {
        ...stats,
        endpoint: `ws://localhost:${process.env.PORT || 3001}/ws`,
        supportedEvents: [
          'start_document_processing',
          'get_live_analytics',
          'subscribe_to_updates',
          'ping'
        ],
        subscriptionTypes: [
          'network_effects',
          'revenue_stream',
          'processing_queue'
        ]
      }
    });

  } catch (error) {
    logger.error('Failed to get WebSocket stats:', error);
    throw error;
  }
}));

export default router;