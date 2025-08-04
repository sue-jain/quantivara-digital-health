import Tesseract from 'tesseract.js';
import { logger } from '../utils/logger';

export interface OCRResult {
  text: string;
  confidence: number;
}

export async function parseImage(filePath: string): Promise<OCRResult> {
  try {
    logger.info(`Starting OCR for image: ${filePath}`);
    
    const result = await Tesseract.recognize(
      filePath,
      'eng', // English language
      {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            logger.debug(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      }
    );
    
    logger.info(`OCR completed with confidence: ${result.data.confidence}%`);
    
    return {
      text: result.data.text,
      confidence: result.data.confidence
    };
  } catch (error) {
    logger.error('OCR error:', error);
    throw new Error(`Failed to perform OCR: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Preprocess text from OCR (clean up common OCR errors)
export function cleanOCRText(text: string): string {
  return text
    // Fix common OCR errors
    .replace(/[|]/g, 'I') // Pipe often misread as I
    .replace(/[0]/g, 'O') // Zero often misread as O in names
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}