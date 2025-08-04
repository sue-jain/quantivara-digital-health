import { logger } from '../utils/logger';

// Common medical document patterns
const PATTERNS = {
  // Patient information patterns
  patientName: [
    /Patient\s*Name\s*[:]\s*([A-Za-z\s]+?)(?:\n|$)/i,
    /Name\s*[:]\s*([A-Za-z\s]+?)(?:\n|$)/i,
    /Patient\s*[:]\s*([A-Za-z\s]+?)(?:\n|$)/i,
    /(?:Mr\.|Mrs\.|Ms\.|Dr\.)\s+([A-Za-z\s]+?)(?:\n|,|$)/i
  ],
  
  age: [
    /Age\s*[:]\s*(\d+)\s*(years?|yrs?)?/i,
    /(\d+)\s*(years?|yrs?)\s*old/i,
    /Age\/Sex\s*[:]\s*(\d+)/i
  ],
  
  gender: [
    /Gender\s*[:]\s*(Male|Female|M|F)/i,
    /Sex\s*[:]\s*(Male|Female|M|F)/i,
    /Age\/Sex\s*[:]\s*\d+\s*[\/]?\s*(M|F|Male|Female)/i
  ],
  
  date: [
    /Date\s*[:]\s*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
    /Report\s*Date\s*[:]\s*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
    /Collection\s*Date\s*[:]\s*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i
  ],
  
  // Lab test patterns
  labTests: {
    // Common test patterns with units
    hemoglobin: /Hemoglobin\s*[:]\s*([\d.]+)\s*(g\/dL|gm\/dl)?/i,
    glucose: /(?:Glucose|Blood\s*Sugar|FBS)\s*[:]\s*([\d.]+)\s*(mg\/dL|mg\/dl)?/i,
    cholesterol: /Total\s*Cholesterol\s*[:]\s*([\d.]+)\s*(mg\/dL|mg\/dl)?/i,
    uricacid: /Uric\s*Acid\s*[:]\s*([\d.]+)\s*(mg\/dL|mg\/dl)?/i,
    tsh: /TSH\s*[:]\s*([\d.]+)\s*(mIU\/L|μIU\/ml)?/i,
    t3: /T3\s*[:]\s*([\d.]+)\s*(ng\/dL|ng\/dl)?/i,
    t4: /T4\s*[:]\s*([\d.]+)\s*(μg\/dL|ug\/dl)?/i,
  },
  
  // Prescription patterns
  medications: /(?:Rx|Prescription|Medicines?)[\s\S]*?(?=\n\n|$)/i,
  diagnosis: /(?:Diagnosis|Clinical\s*Diagnosis|Provisional\s*Diagnosis)\s*[:]\s*([^\n]+)/i,
  doctorName: /Dr\.\s*([A-Za-z\s,]+?)(?:\n|$)/i,
};

export interface ExtractedData {
  documentType?: string;
  patientInfo?: {
    name?: string;
    age?: string;
    gender?: string;
  };
  date?: string;
  labResults?: Record<string, { value: string; unit?: string; normalRange?: string }>;
  medications?: Array<{ name: string; dosage?: string; frequency?: string }>;
  diagnosis?: string[];
  doctorInfo?: {
    name?: string;
  };
  rawText?: string;
}

export function extractMedicalData(text: string, documentType?: string): ExtractedData {
  const extracted: ExtractedData = {
    rawText: text.substring(0, 1000) // Store first 1000 chars for debugging
  };
  
  // Detect document type if not provided
  if (!documentType) {
    extracted.documentType = detectDocumentType(text);
  } else {
    extracted.documentType = documentType;
  }
  
  // Extract patient information
  extracted.patientInfo = extractPatientInfo(text);
  
  // Extract date
  extracted.date = extractDate(text);
  
  // Extract based on document type
  if (extracted.documentType?.toLowerCase().includes('lab')) {
    extracted.labResults = extractLabResults(text);
  } else if (extracted.documentType?.toLowerCase().includes('prescription')) {
    extracted.medications = extractMedications(text);
    extracted.diagnosis = extractDiagnosis(text);
    extracted.doctorInfo = extractDoctorInfo(text);
  }
  
  logger.info(`Extracted data for ${extracted.documentType}: ${JSON.stringify({
    patientName: extracted.patientInfo?.name,
    testsFound: Object.keys(extracted.labResults || {}).length,
    medicationsFound: extracted.medications?.length || 0
  })}`);
  
  return extracted;
}

function detectDocumentType(text: string): string {
  const textLower = text.toLowerCase();
  
  if (textLower.includes('lab report') || textLower.includes('pathology') || 
      textLower.includes('blood test') || textLower.includes('diagnostic')) {
    return 'Lab Report';
  } else if (textLower.includes('prescription') || textLower.includes('rx') || 
             textLower.includes('medicines')) {
    return 'Prescription';
  } else if (textLower.includes('ecg') || textLower.includes('ekg')) {
    return 'ECG Report';
  } else if (textLower.includes('x-ray') || textLower.includes('xray')) {
    return 'X-Ray Report';
  }
  
  return 'Medical Document';
}

function extractPatientInfo(text: string): ExtractedData['patientInfo'] {
  const info: ExtractedData['patientInfo'] = {};
  
  // Extract name
  for (const pattern of PATTERNS.patientName) {
    const match = text.match(pattern);
    if (match) {
      info.name = match[1].trim();
      break;
    }
  }
  
  // Extract age
  for (const pattern of PATTERNS.age) {
    const match = text.match(pattern);
    if (match) {
      info.age = match[1] + ' years';
      break;
    }
  }
  
  // Extract gender
  for (const pattern of PATTERNS.gender) {
    const match = text.match(pattern);
    if (match) {
      const gender = match[1].toUpperCase();
      info.gender = (gender === 'M' || gender === 'MALE') ? 'Male' : 'Female';
      break;
    }
  }
  
  return info;
}

function extractDate(text: string): string | undefined {
  for (const pattern of PATTERNS.date) {
    const match = text.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return undefined;
}

function extractLabResults(text: string): Record<string, any> {
  const results: Record<string, any> = {};
  
  // Extract individual test results
  for (const [testName, pattern] of Object.entries(PATTERNS.labTests)) {
    const match = text.match(pattern);
    if (match) {
      results[testName] = {
        value: match[1],
        unit: match[2] || getDefaultUnit(testName)
      };
      
      // Try to find normal range (usually after the value)
      const rangePattern = new RegExp(
        `${testName}[^\\n]*?(?:Normal|Reference|Range)[^\\n]*?([\\d.-]+\\s*-\\s*[\\d.-]+)`,
        'i'
      );
      const rangeMatch = text.match(rangePattern);
      if (rangeMatch) {
        results[testName].normalRange = rangeMatch[1];
      }
    }
  }
  
  // Try to extract any other test results in table format
  const tablePattern = /([A-Za-z\s]+?)\s{2,}([\d.]+)\s+([A-Za-z\/]+)\s+([\d.-]+\s*-\s*[\d.-]+)/g;
  let match;
  while ((match = tablePattern.exec(text)) !== null) {
    const testName = match[1].trim().toLowerCase().replace(/\s+/g, '');
    if (!results[testName] && testName.length > 2) { // Skip headers like "Test Name"
      results[testName] = {
        value: match[2],
        unit: match[3],
        normalRange: match[4]
      };
    }
  }
  
  return results;
}

function extractMedications(text: string): Array<{ name: string; dosage?: string; frequency?: string }> {
  const medications: Array<{ name: string; dosage?: string; frequency?: string }> = [];
  
  // Common medication pattern
  const medPattern = /(?:Tab|Cap|Syp|Inj)\.?\s+([A-Za-z\s]+?)\s+([\d.]+\s*(?:mg|ml|gm)?)\s*(?:-\s*)?([A-Za-z0-9\s-]*?)(?:\n|$)/gi;
  let match;
  
  while ((match = medPattern.exec(text)) !== null) {
    medications.push({
      name: match[1].trim(),
      dosage: match[2].trim(),
      frequency: match[3].trim() || undefined
    });
  }
  
  return medications;
}

function extractDiagnosis(text: string): string[] {
  const match = text.match(PATTERNS.diagnosis);
  if (match) {
    return match[1].split(/[,;]/).map(d => d.trim()).filter(d => d.length > 0);
  }
  return [];
}

function extractDoctorInfo(text: string): ExtractedData['doctorInfo'] | undefined {
  const match = text.match(PATTERNS.doctorName);
  if (match) {
    return { name: match[1].trim() };
  }
  return undefined;
}

function getDefaultUnit(testName: string): string {
  const units: Record<string, string> = {
    hemoglobin: 'g/dL',
    glucose: 'mg/dL',
    cholesterol: 'mg/dL',
    uricAcid: 'mg/dL',
    tsh: 'mIU/L',
    t3: 'ng/dL',
    t4: 'μg/dL'
  };
  return units[testName] || '';
}