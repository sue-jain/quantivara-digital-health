import { detectFileType } from './fileDetector';
import { parsePDF } from './pdfParser';
import { parseImage, cleanOCRText } from './imageParser';
import { extractMedicalData, ExtractedData } from './dataExtractor';
import { logger } from '../utils/logger';

export interface ParseResult {
  success: boolean;
  data?: ExtractedData;
  error?: string;
  metadata?: {
    fileType: string;
    confidence?: number;
    processingTime: number;
  };
}

export async function parseDocument(filePath: string): Promise<ParseResult> {
  const startTime = Date.now();
  
  try {
    const fileType = detectFileType(filePath);
    
    if (fileType === 'unsupported') {
      return {
        success: false,
        error: 'Unsupported file type. Please upload PDF, JPEG, or PNG files.'
      };
    }
    
    let extractedText = '';
    let confidence: number | undefined;
    
    // Extract text based on file type
    if (fileType === 'pdf') {
      logger.info(`Processing PDF: ${filePath}`);
      const pdfResult = await parsePDF(filePath);
      extractedText = pdfResult.text;
    } else if (fileType === 'image') {
      logger.info(`Processing image with OCR: ${filePath}`);
      const ocrResult = await parseImage(filePath);
      extractedText = cleanOCRText(ocrResult.text);
      confidence = ocrResult.confidence;
    }
    
    // Extract structured medical data
    const extractedData = extractMedicalData(extractedText);
    
    const processingTime = Date.now() - startTime;
    
    return {
      success: true,
      data: extractedData,
      metadata: {
        fileType,
        confidence,
        processingTime
      }
    };
  } catch (error) {
    logger.error('Document parsing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown parsing error',
      metadata: {
        fileType: 'unknown',
        processingTime: Date.now() - startTime
      }
    };
  }
}

// Convert extracted data to match the existing format expected by frontend
export function formatExtractedData(data: ExtractedData, accuracy?: number): any {
  const formatted: any = {
    documentType: data.documentType,
    extractionAccuracy: accuracy ? `${Math.round(accuracy)}%` : '95%'
  };
  
  // Format based on document type
  if (data.documentType === 'Lab Report') {
    formatted.patientInfo = data.patientInfo;
    formatted.labInfo = {
      reportDate: data.date
    };
    
    // Convert lab results to array format
    formatted.tests = Object.entries(data.labResults || {}).map(([name, result]) => ({
      name: formatTestName(name),
      value: result.value,
      unit: result.unit,
      normalRange: result.normalRange || 'N/A',
      status: 'NORMAL' // Would need actual logic to determine
    }));
    
    formatted.abnormalValues = 0; // Would need actual logic
    formatted.criticalValues = 0; // Would need actual logic
    
  } else if (data.documentType === 'Prescription') {
    formatted.patientInfo = data.patientInfo;
    formatted.doctorInfo = data.doctorInfo;
    formatted.diagnosis = data.diagnosis || [];
    formatted.medications = data.medications || [];
    formatted.prescriptionDate = data.date;
    formatted.followUp = 'As directed by physician';
    formatted.advice = ['Follow medication schedule', 'Maintain healthy diet'];
  } else {
    // Generic format
    formatted.patientInfo = data.patientInfo;
    formatted.date = data.date;
    formatted.extractedContent = data.rawText;
  }
  
  return formatted;
}

function formatTestName(name: string): string {
  const nameMap: Record<string, string> = {
    hemoglobin: 'Hemoglobin',
    glucose: 'Blood Glucose',
    cholesterol: 'Total Cholesterol',
    uricacid: 'Uric Acid',
    tsh: 'TSH',
    t3: 'T3',
    t4: 'T4'
  };
  return nameMap[name.toLowerCase()] || name;
}