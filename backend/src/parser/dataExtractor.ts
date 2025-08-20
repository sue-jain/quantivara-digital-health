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
    /Age\/Sex\s*[:]\s*\d+\s*[\/]?\s*(M|F|Male|Female)/i,
    /Age\s*[:]\s*\d+\s*Years?,\s*(Male|Female|M|F)/i
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
  doctorName: [
    /Doctor\s*[:]\s*Dr\.\s*([A-Za-z\s,()]+?)(?:\n|$)/i,
    /Dr\.\s*([A-Za-z\s,()]+?)(?:\n|$)/i
  ],
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
  } else if (extracted.documentType?.toLowerCase().includes('ecg')) {
    extracted.labResults = extractECGVitals(text);
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
  
  // Split text into lines for better parsing
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Pattern 1: "Test Name: Value Unit (Normal: Range) Status"
    // Example: "1. Troponin I: Value: 0.15 ng/mL Normal Range: <0.04 ng/mL Status: ELEVATED"
    const pattern1 = /^(\d+\.\s*)?([A-Za-z][A-Za-z\s\-()]+?):\s*(?:Value:\s*)?([\d.<>]+)\s*([A-Za-z\/μ²]+)?/i;
    let match = line.match(pattern1);
    
    if (match) {
      const testName = match[2].trim();
      const value = match[3];
      const unit = match[4] || '';
      
      // Look for normal range and status in next few lines
      let normalRange = '';
      let status = 'NORMAL';
      
      for (let j = i; j <= Math.min(i + 3, lines.length - 1); j++) {
        const nextLine = lines[j];
        
        // Extract normal range
        const rangeMatch = nextLine.match(/Normal\s*(?:Range)?:\s*([<>]?[\d.-]+(?:\s*-\s*[\d.-]+)?)\s*([A-Za-z\/μ²]*)/i);
        if (rangeMatch) {
          normalRange = rangeMatch[1] + (rangeMatch[2] ? ' ' + rangeMatch[2] : '');
        }
        
        // Extract status
        const statusMatch = nextLine.match(/Status:\s*(NORMAL|ELEVATED|HIGH|LOW|CRITICAL|ABNORMAL)/i);
        if (statusMatch) {
          status = statusMatch[1].toUpperCase();
        }
      }
      
      results[testName.toLowerCase().replace(/\s+/g, '_')] = {
        name: testName,
        value: value,
        unit: unit,
        normalRange: normalRange,
        status: status
      };
      continue;
    }
    
    // Pattern 2: "- Test Name: Value Unit (Normal: Range)"
    // Example: "- Total Cholesterol: 280 mg/dL (Normal: <200)"
    const pattern2 = /^[-•*]\s*([A-Za-z][A-Za-z\s\-()]+?):\s*([\d.<>]+)\s*([A-Za-z\/μ²]+)?\s*(?:\(Normal:\s*([<>]?[\d.-]+(?:\s*-\s*[\d.-]+)?)\))?/i;
    match = line.match(pattern2);
    
    if (match) {
      const testName = match[1].trim();
      const value = match[2];
      const unit = match[3] || '';
      const normalRange = match[4] || '';
      
      const status = determineLabStatus(value, normalRange);
      results[testName.toLowerCase().replace(/\s+/g, '_')] = {
        name: testName,
        value: value,
        unit: unit,
        normalRange: normalRange,
        status: status
      };
      continue;
    }
    
    // Pattern 3: Simple "Test Name: Value Unit"
    // Example: "Heart Rate: 88 bpm"
    const pattern3 = /^([A-Za-z][A-Za-z\s\-()]+?):\s*([\d.<>]+)\s*([A-Za-z\/μ²]+)?/i;
    match = line.match(pattern3);
    
    if (match && !line.includes('Patient') && !line.includes('Date') && !line.includes('Report')) {
      const testName = match[1].trim();
      const value = match[2];
      const unit = match[3] || '';
      
      // Check if next line has normal range
      let normalRange = '';
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        const rangeMatch = nextLine.match(/\(Normal:\s*([<>]?[\d.-]+(?:\s*-\s*[\d.-]+)?)\)/i);
        if (rangeMatch) {
          normalRange = rangeMatch[1];
        }
      }
      
      results[testName.toLowerCase().replace(/\s+/g, '_')] = {
        name: testName,
        value: value,
        unit: unit,
        normalRange: normalRange,
        status: determineLabStatus(value, normalRange)
      };
    }
  }
  
  // Filter out non-medical metadata
  const filteredResults: Record<string, any> = {};
  const metadataKeys = ['age', 'date', 'report_date', 'value', 'normal_range', 'critical_values', 'abnormal_values', 'patient', 'sample_id', 'test_id'];
  
  for (const [key, value] of Object.entries(results)) {
    if (!metadataKeys.includes(key) && value.name && value.value && 
        !value.name.toLowerCase().includes('patient') && 
        !value.name.toLowerCase().includes('date') &&
        value.name.length > 2) {
      filteredResults[key] = value;
    }
  }
  
  return filteredResults;
}

function extractECGVitals(text: string): Record<string, any> {
  const vitals: Record<string, any> = {};
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  for (const line of lines) {
    // Pattern for ECG measurements like "1. Heart Rate: 88 bpm (Normal: 60-100)"
    const vitalPattern = /^(?:\d+\.\s*)?([A-Za-z][A-Za-z\s\-()]+?):\s*([\d.<>]+(?:\.\d+)?)\s*([A-Za-z\/°]+)?\s*(?:\(Normal:\s*([<>]?[\d.-]+(?:\s*-\s*[\d.-]+)?)\))?/i;
    const match = line.match(vitalPattern);
    
    if (match && !line.includes('Patient') && !line.includes('Date') && !line.includes('ID')) {
      const vitalName = match[1].trim();
      const value = match[2];
      const unit = match[3] || '';
      const normalRange = match[4] || '';
      
      // Only include actual vital signs/measurements
      const vitalKeywords = ['heart rate', 'pr interval', 'qrs duration', 'qt interval', 'axis', 'blood pressure', 'temperature', 'rate', 'interval', 'duration'];
      if (vitalKeywords.some(keyword => vitalName.toLowerCase().includes(keyword))) {
        const vitalKey = vitalName.toLowerCase().replace(/[^a-z0-9]/g, '');
        vitals[vitalKey] = {
          name: vitalName,
          value: value,
          unit: unit,
          normalRange: normalRange,
          status: determineLabStatus(value, normalRange)
        };
      }
    }
  }
  
  return vitals;
}

function extractMedications(text: string): Array<{ name: string; dosage?: string; frequency?: string }> {
  const medications: Array<{ name: string; dosage?: string; frequency?: string }> = [];
  
  // Split text into lines for better parsing
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Frequency patterns to extract from subsequent lines
  const frequencyPatterns = [
    /(?:once|one time?)\s+daily/gi,
    /(?:twice|two times?)\s+daily/gi,
    /(?:thrice|three times?)\s+daily/gi,
    /(?:four times?)\s+daily/gi,
    /(\d+)\s*times?\s+(?:a\s+)?day/gi,
    /(\d+)-(\d+)-(\d+)/g, // Pattern like 1-0-1
    /(?:morning|evening|night|afternoon)/gi,
    /(?:before|after)\s+(?:food|meal|breakfast|lunch|dinner)/gi,
    /every\s+(\d+)\s+hours?/gi,
    /as\s+(?:needed|required|directed)/gi,
    /sos/gi
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Enhanced medication patterns
    const medPatterns = [
      // Pattern 1: Numbered with Tab/Cap/Syp etc
      /^\d+\.\s*(?:Tab|Cap|Syp|Inj|Drops?)\.?\s+([A-Za-z][A-Za-z\s\d\+]*?)(?:\s+([\d.]+\s*(?:mg|ml|gm|mcg|IU|drops?)))?$/i,
      // Pattern 2: Numbered medication without Tab/Cap prefix (e.g., "2. Sucralfate + Simethicone 10ml")
      /^\d+\.\s+([A-Za-z][A-Za-z\s\d\+]*?)(?:\s+([\d.]+\s*(?:mg|ml|gm|mcg|IU|drops?)))?$/i,
      // Pattern 3: Direct Tab/Cap/Syp
      /^(?:Tab|Cap|Syp|Inj|Drops?)\.?\s+([A-Za-z][A-Za-z\s\d\+]*?)(?:\s+([\d.]+\s*(?:mg|ml|gm|mcg|IU|drops?)))?$/i,
      // Pattern 4: Medicine name with dosage
      /^([A-Za-z][A-Za-z\s\d\+]*?)\s+([\d.]+\s*(?:mg|ml|gm|mcg|IU|drops?))$/i
    ];
    
    for (const pattern of medPatterns) {
      const match = line.match(pattern);
      if (match) {
        const name = match[1].trim().replace(/\s+/g, ' ');
        const dosage = match[2] ? match[2].trim() : undefined;
        
        // Look for frequency in the next 2-3 lines
        let frequency = extractFrequencyFromLines(lines, i + 1, i + 4);
        
        // Avoid duplicates
        if (!medications.some(med => med.name.toLowerCase() === name.toLowerCase())) {
          medications.push({
            name: name,
            dosage: dosage,
            frequency: frequency || undefined
          });
        }
        break;
      }
    }
  }
  
  return medications;
}

function extractFrequencyFromLines(lines: string[], startIndex: number, endIndex: number): string | null {
  const frequencyPatterns = [
    { pattern: /once\s+daily/gi, replacement: 'Once daily' },
    { pattern: /twice\s+daily/gi, replacement: 'Twice daily' },
    { pattern: /thrice\s+daily/gi, replacement: 'Thrice daily' },
    { pattern: /three\s+times?\s+daily/gi, replacement: 'Three times daily' },
    { pattern: /(\d+)\s*times?\s+(?:a\s+)?day/gi, replacement: '$1 times daily' },
    { pattern: /\(1-1-1\)/g, replacement: 'Three times daily' },
    { pattern: /\(1-0-1\)/g, replacement: 'Twice daily' },
    { pattern: /\((\d+)-(\d+)-(\d+)\)/g, replacement: '$1-$2-$3' },
    { pattern: /(\d+)-(\d+)-(\d+)/g, replacement: '$1-$2-$3' },
    { pattern: /every\s+(\d+)\s+hours?/gi, replacement: 'Every $1 hours' },
    { pattern: /as\s+(?:needed|required|directed)/gi, replacement: 'As directed' },
    { pattern: /sos/gi, replacement: 'SOS' },
    { pattern: /morning/gi, replacement: 'Morning' },
    { pattern: /evening/gi, replacement: 'Evening' },
    { pattern: /night/gi, replacement: 'Night' },
    { pattern: /before\s+(?:food|meal|breakfast|lunch|dinner)/gi, replacement: 'Before meals' },
    { pattern: /after\s+(?:food|meal|breakfast|lunch|dinner)/gi, replacement: 'After meals' }
  ];
  
  for (let i = startIndex; i < Math.min(endIndex, lines.length); i++) {
    const line = lines[i];
    
    for (const { pattern, replacement } of frequencyPatterns) {
      const match = line.match(pattern);
      if (match) {
        // Replace numbered groups in replacement string
        let result = replacement;
        for (let j = 1; j < match.length; j++) {
          result = result.replace(new RegExp(`\\$${j}`, 'g'), match[j]);
        }
        return result;
      }
    }
  }
  
  return null;
}

function extractDiagnosis(text: string): string[] {
  const diagnoses: string[] = [];
  
  // Find the DIAGNOSIS section
  const diagnosisMatch = text.match(/(?:DIAGNOSIS|Clinical\s*Diagnosis|Provisional\s*Diagnosis)\s*[:]\s*\n?/i);
  if (!diagnosisMatch) return [];
  
  // Get text after DIAGNOSIS header
  const afterDiagnosis = text.substring(diagnosisMatch.index! + diagnosisMatch[0].length);
  
  // Split into lines and extract diagnosis items
  const lines = afterDiagnosis.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Stop if we hit another section
    if (trimmedLine.match(/^(MEDICATIONS?|ADVICE|TREATMENT|FOLLOW|INSTRUCTIONS?)[:]/i)) {
      break;
    }
    
    // Skip empty lines
    if (trimmedLine.length === 0) continue;
    
    // Extract diagnosis items (lines starting with -, numbers, or containing diagnosis-like text)
    if (trimmedLine.match(/^[-•*]\s*(.+)/) || 
        trimmedLine.match(/^\d+\.\s*(.+)/) ||
        (trimmedLine.length > 3 && !trimmedLine.includes(':') && trimmedLine.match(/[A-Za-z]/))) {
      diagnoses.push(trimmedLine);
    }
  }
  
  return diagnoses.filter(d => d.length > 0);
}

function extractDoctorInfo(text: string): ExtractedData['doctorInfo'] | undefined {
  for (const pattern of PATTERNS.doctorName) {
    const match = text.match(pattern);
    if (match) {
      return { name: match[1].trim() };
    }
  }
  return undefined;
}

function determineLabStatus(value: string, normalRange: string): string {
  if (!value || !normalRange) return 'NORMAL';
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return 'NORMAL';
  
  // Handle different range formats
  if (normalRange.startsWith('<')) {
    const threshold = parseFloat(normalRange.substring(1));
    return numValue < threshold ? 'NORMAL' : 'HIGH';
  }
  
  if (normalRange.startsWith('>')) {
    const threshold = parseFloat(normalRange.substring(1));
    return numValue > threshold ? 'NORMAL' : 'LOW';
  }
  
  // Handle range like "70-100" or "0.7-1.3"
  const rangeMatch = normalRange.match(/^([\d.]+)\s*-\s*([\d.]+)$/);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[2]);
    if (numValue < min) return 'LOW';
    if (numValue > max) return 'HIGH';
    return 'NORMAL';
  }
  
  return 'NORMAL';
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