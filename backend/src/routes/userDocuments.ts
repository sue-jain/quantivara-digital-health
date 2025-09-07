import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler } from '../middleware/errorHandler';
import { documentProcessor, DocumentProcessor } from '../services/documentProcessor';
import { logger } from '../utils/logger';
import { db } from '../config/sqlite';

interface AppUser {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface AbhaProfile {
  abha_id: string;
}

interface UserDocument {
  id: string;
  document_type: string;
  file_name: string;
  status: string;
  extraction_accuracy: number;
  created_at: string;
  content: string;
  metadata: string;
}

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
      cb(new Error('Invalid file type. Only images, PDFs, and text files are allowed.'));
    }
  }
});

// Document upload endpoint for authenticated users
router.post('/upload', upload.single('document'), asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
    return;
  }
  
  try {
    const userId = req.body.userId;
    const documentType = req.body.documentType;
    
    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
      return;
    }
    
    // Verify user exists in new authentication system
    const user = db.prepare('SELECT * FROM app_users WHERE id = ?').get(userId) as AppUser;
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    logger.info(`📄 Processing document for user ${user.username}: ${req.file.originalname}`);
    logger.info(`🔍 Document type: ${documentType || 'auto-detected'}`);
    
    // Process the document using the existing document processor
    const result = await documentProcessor.processDocument(
      req.file,
      userId, // Use user ID instead of patient ID
      'app-provider-001', // Use app provider ID
      documentType,
      {
        forcedAbhaId: (db.prepare('SELECT abha_id FROM app_user_abha_profiles WHERE user_id = ?').get(userId) as any)?.abha_id || undefined,
        expectedPatientName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username
      }
    );
    
    // Save to new authentication system table
    const documentId = uuidv4();
    const insertDoc = db.prepare(`
      INSERT INTO app_user_medical_documents (
        id, user_id, abha_id, document_type, file_name, content, 
        metadata, extraction_accuracy, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    // Get user's ABHA ID
    const abhaProfile = db.prepare('SELECT abha_id FROM app_user_abha_profiles WHERE user_id = ?').get(userId) as AbhaProfile;
    const abhaId = abhaProfile?.abha_id || null;
    
    insertDoc.run(
      documentId,
      userId,
      abhaId,
      result.documentType || documentType || 'unknown',
      req.file.originalname,
      JSON.stringify(result.extractedData || {}),
      JSON.stringify({
        filePath: req.file.path,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        originalName: req.file.originalname
      }),
      result.extractionAccuracy || 85,
      'processed',
      new Date().toISOString(),
      new Date().toISOString()
    );
    
    logger.info(`✅ Document saved to user profile: ${documentId}`);
    
    res.json({
      success: true,
      message: 'Document uploaded and linked to user profile successfully',
      data: {
        documentId,
        userId,
        abhaId,
        documentType: result.documentType || documentType,
        extractedData: result.extractedData,
        extractionAccuracy: result.extractionAccuracy,
        fileName: req.file.originalname,
        userInfo: {
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name
        }
      }
    });
  } catch (error) {
    logger.error('User document upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process document',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

// Get user's documents
router.get('/:userId', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  
  try {
    // Verify user exists
    const user = db.prepare('SELECT * FROM app_users WHERE id = ?').get(userId) as AppUser;
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    // Get user's documents with deduplication (keep only the latest version of each file)
    const documents = db.prepare(`
      SELECT * FROM app_user_medical_documents 
      WHERE user_id = ? 
      AND id IN (
        SELECT MAX(id) 
        FROM app_user_medical_documents 
        WHERE user_id = ? 
        GROUP BY file_name
      )
      ORDER BY created_at DESC
    `).all(userId, userId) as UserDocument[];
    
    res.json({
      success: true,
      data: {
        documents: documents.map(doc => ({
          id: doc.id,
          documentType: doc.document_type,
          fileName: doc.file_name,
          status: doc.status,
          extractionAccuracy: doc.extraction_accuracy,
          createdAt: doc.created_at,
          content: doc.content || null,
          metadata: doc.metadata ? JSON.parse(doc.metadata) : null
        })),
        userInfo: {
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching user documents:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch documents',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

// Delete a user's document by ID
router.delete('/:documentId', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { documentId } = req.params;
  try {
    const existing = db.prepare('SELECT id FROM app_user_medical_documents WHERE id = ?').get(documentId) as any;
    if (!existing) {
      res.status(404).json({ success: false, message: 'Document not found' });
      return;
    }

    db.prepare('DELETE FROM app_user_medical_documents WHERE id = ?').run(documentId);
    res.json({ success: true, message: 'Document deleted' });
  } catch (error) {
    logger.error('Error deleting user document:', error);
    res.status(500).json({ success: false, message: 'Failed to delete document' });
  }
}));

export default router;
