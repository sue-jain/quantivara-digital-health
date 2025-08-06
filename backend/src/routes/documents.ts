import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler } from '../middleware/errorHandler';
import { documentProcessor, DocumentProcessor } from '../services/documentProcessor';
import { logger } from '../utils/logger';
import { db } from '../config/sqlite';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 
      'image/png', 
      'image/jpg', 
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      'text/plain' // .txt files
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, PDF, Word documents, and text files are allowed.'));
    }
  }
});

// Document upload endpoint
router.post('/upload', upload.single('document'), asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
    return;
  }
  
  try {
    // In demo mode, use demo IDs
    const patientId = req.body.patientId || 'demo-patient-001';
    const providerId = req.body.providerId || 'demo-provider-001';
    const documentType = req.body.documentType; // Allow frontend to specify type
    
    logger.info(`📄 Processing document: ${req.file.originalname}`);
    logger.info(`🔍 Document type: ${documentType || 'auto-detected'}`);
    
    // Process the document
    const result = await documentProcessor.processDocument(
      req.file,
      patientId,
      providerId,
      documentType
    );
    
    logger.info(`✅ Document processed successfully: ${result.documentId}`);
    if (result.linkedAbhaId && result.linkedAbhaId !== patientId) {
      logger.info(`🔗 Document linked to ABHA ID: ${result.linkedAbhaId}`);
    }
    
    res.json({
      success: true,
      message: 'Document uploaded and processed successfully',
      data: {
        ...result,
        demoInfo: {
          originalPatientId: patientId,
          linkedAbhaId: result.linkedAbhaId,
          patientName: result.extractedData?.patientInfo?.name || 'Unknown',
          linkingSuccess: result.linkedAbhaId !== patientId
        }
      }
    });
  } catch (error) {
    logger.error('Document upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process document',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

// Document processing status
router.get('/:documentId/status', asyncHandler(async (req: Request, res: Response) => {
  const { documentId } = req.params;
  
  try {
    const status = await documentProcessor.getDocumentStatus(documentId);
    
    res.json({
      success: true,
      message: 'Document status retrieved',
      data: status
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'Document not found',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

// Document results (alias for status)
router.get('/:documentId/results', asyncHandler(async (req: Request, res: Response) => {
  const { documentId } = req.params;
  
  try {
    const status = await documentProcessor.getDocumentStatus(documentId);
    
    res.json({
      success: true,
      message: 'Document results retrieved',
      data: status
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'Document not found',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

// List recent documents
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  
  try {
    const documents = await documentProcessor.getRecentDocuments(limit);
    
    res.json({
      success: true,
      message: 'Recent documents retrieved',
      data: documents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve documents',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

// Demo endpoint to test ABHA linking functionality
router.post('/demo-abha-linking', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { documentType, patientName } = req.body;
  
  if (!documentType) {
    res.status(400).json({
      success: false,
      message: 'Document type is required'
    });
    return;
  }
  
  // Create a mock file object for demo
  const mockFile = {
    fieldname: 'document',
    originalname: `${documentType}-demo.jpg`,
    encoding: '7bit',
    mimetype: 'image/jpeg',
    destination: path.join(__dirname, '../../../uploads'),
    filename: `demo-${Date.now()}.jpg`,
    path: path.join(__dirname, '../../../uploads', `demo-${Date.now()}.jpg`),
    size: 1024 * 100 // 100KB mock size
  } as Express.Multer.File;
  
  try {
    logger.info(`🧪 Demo ABHA linking test for: ${documentType}`);
    logger.info(`👤 Patient name: ${patientName || 'auto-extracted'}`);
    
    // Process the document normally
    let result = await documentProcessor.processDocument(
      mockFile,
      'demo-patient-001', // Original demo ID
      'demo-provider-001',
      documentType
    );
    
    // If patientName is provided, override the extracted patient name for demo purposes
    if (patientName && result.extractedData?.patientInfo) {
      result.extractedData.patientInfo.name = patientName;
      
      // Re-run ABHA ID lookup with the provided patient name
      const demoAbhaIds = ['12345678901234', '98765432109876', '45678901234567', '11112222333344', '55556666777788'];
      const query = `
        SELECT abha_id FROM users 
        WHERE first_name = ? AND last_name = ? AND role = 'patient'
        ORDER BY CASE 
          WHEN abha_id IN (${demoAbhaIds.map(() => '?').join(',')}) THEN 0 
          ELSE 1 
        END, abha_id
      `;
      
      const nameParts = patientName.trim().split(' ');
      if (nameParts.length >= 2) {
        const firstName = nameParts[0];
        const lastName = nameParts[nameParts.length - 1];
        
        const patient = db.prepare(query).get(firstName, lastName, ...demoAbhaIds) as any;
        if (patient && patient.abha_id) {
          result.linkedAbhaId = patient.abha_id;
          logger.info(`✅ Found ABHA ID ${patient.abha_id} for patient: ${patientName}`);
        }
      }
    }
    
    const demoResult = {
      documentId: result.documentId,
      documentType: result.documentType,
      extractedPatientName: result.extractedData?.patientInfo?.name,
      originalPatientId: 'demo-patient-001',
      linkedAbhaId: result.linkedAbhaId,
      linkingSuccess: result.linkedAbhaId !== 'demo-patient-001',
      accuracy: result.accuracy,
      demoMessage: result.linkedAbhaId !== 'demo-patient-001' 
        ? `✅ Successfully linked to ABHA ID: ${result.linkedAbhaId}`
        : `⚠️ No ABHA ID found, using demo-patient-001`
    };
    
    logger.info(`🎯 Demo result: ${demoResult.demoMessage}`);
    
    res.json({
      success: true,
      message: 'Demo ABHA linking test completed',
      data: demoResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process demo document',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

// Demo endpoint to test with sample files
router.post('/demo-upload', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { sampleFile } = req.body;
  
  if (!sampleFile) {
    res.status(400).json({
      success: false,
      message: 'No sample file specified'
    });
    return;
  }
  
  // Map sample file to actual file in sample-data folder
  const sampleFiles: Record<string, string> = {
    'handwritten-prescription': '54d882c7-5030-479c-9a66-d0dfce2d57c4.JPG',
    'lab-report': '2ad62dbc-668e-45a9-bc66-1e5eeaaa195d.JPG',
    'ecg-report': '3fd9e03e-965b-4075-98ad-755a019a1eee.JPG'
  };
  
  const actualFile = sampleFiles[sampleFile];
  if (!actualFile) {
    res.status(400).json({
      success: false,
      message: 'Invalid sample file'
    });
    return;
  }
  
  // Create a mock file object
  const samplePath = path.join(__dirname, '../../../sample-data/user-uploads', actualFile);
  const mockFile = {
    fieldname: 'document',
    originalname: sampleFile + '.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    destination: path.join(__dirname, '../../../uploads'),
    filename: actualFile,
    path: samplePath,
    size: 1024 * 100 // 100KB mock size
  } as Express.Multer.File;
  
  try {
    const result = await documentProcessor.processDocument(
      mockFile,
      'demo-patient-001',
      'demo-provider-001'
    );
    
    res.json({
      success: true,
      message: 'Demo document processed successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process demo document',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

export default router;