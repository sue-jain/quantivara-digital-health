import { parseDocument, formatExtractedData } from '../../src/parser/documentParser';
import { detectFileType } from '../../src/parser/fileDetector';
import { parsePDF } from '../../src/parser/pdfParser';
import { parseImage, cleanOCRText } from '../../src/parser/imageParser';
import { extractMedicalData } from '../../src/parser/dataExtractor';

// Mock all dependencies
jest.mock('../../src/parser/fileDetector');
jest.mock('../../src/parser/pdfParser');
jest.mock('../../src/parser/imageParser');
jest.mock('../../src/parser/dataExtractor');
jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

describe('documentParser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('parseDocument', () => {
    it('should handle unsupported file types', async () => {
      (detectFileType as jest.Mock).mockReturnValue('unsupported');

      const result = await parseDocument('/path/to/file.txt');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unsupported file type. Please upload PDF, JPEG, or PNG files.');
      expect(result.metadata).toBeUndefined();
    });

    it('should successfully parse PDF files', async () => {
      const mockPdfResult = {
        text: 'Patient Name: John Doe\nAge: 45 years',
        pages: 2,
        info: {}
      };
      const mockExtractedData = {
        documentType: 'Medical Document',
        patientInfo: { name: 'John Doe', age: '45 years' }
      };

      (detectFileType as jest.Mock).mockReturnValue('pdf');
      (parsePDF as jest.Mock).mockResolvedValue(mockPdfResult);
      (extractMedicalData as jest.Mock).mockReturnValue(mockExtractedData);

      const startTime = Date.now();
      const result = await parseDocument('/path/to/document.pdf');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockExtractedData);
      expect(result.metadata).toMatchObject({
        fileType: 'pdf',
        confidence: undefined,
        processingTime: expect.any(Number)
      });
      expect(result.metadata!.processingTime).toBeGreaterThanOrEqual(0);
      expect(parsePDF).toHaveBeenCalledWith('/path/to/document.pdf');
      expect(extractMedicalData).toHaveBeenCalledWith('Patient Name: John Doe\nAge: 45 years');
    });

    it('should successfully parse image files with OCR', async () => {
      const mockOcrResult = {
        text: 'LAB REPORT\nPatient: Jane Smith',
        confidence: 87.5
      };
      const mockExtractedData = {
        documentType: 'Lab Report',
        patientInfo: { name: 'Jane Smith' }
      };

      (detectFileType as jest.Mock).mockReturnValue('image');
      (parseImage as jest.Mock).mockResolvedValue(mockOcrResult);
      (cleanOCRText as jest.Mock).mockReturnValue('LAB REPORT\nPatient: Jane Smith');
      (extractMedicalData as jest.Mock).mockReturnValue(mockExtractedData);

      const result = await parseDocument('/path/to/lab-report.jpg');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockExtractedData);
      expect(result.metadata).toMatchObject({
        fileType: 'image',
        confidence: 87.5,
        processingTime: expect.any(Number)
      });
      expect(parseImage).toHaveBeenCalledWith('/path/to/lab-report.jpg');
      expect(cleanOCRText).toHaveBeenCalledWith('LAB REPORT\nPatient: Jane Smith');
    });

    it('should handle PDF parsing errors', async () => {
      (detectFileType as jest.Mock).mockReturnValue('pdf');
      (parsePDF as jest.Mock).mockRejectedValue(new Error('PDF corrupted'));

      const result = await parseDocument('/path/to/corrupt.pdf');

      expect(result.success).toBe(false);
      expect(result.error).toBe('PDF corrupted');
      expect(result.metadata).toMatchObject({
        fileType: 'unknown',
        processingTime: expect.any(Number)
      });
    });

    it('should handle OCR errors', async () => {
      (detectFileType as jest.Mock).mockReturnValue('image');
      (parseImage as jest.Mock).mockRejectedValue(new Error('OCR failed'));

      const result = await parseDocument('/path/to/blurry.jpg');

      expect(result.success).toBe(false);
      expect(result.error).toBe('OCR failed');
    });

    it('should handle non-Error exceptions', async () => {
      (detectFileType as jest.Mock).mockReturnValue('pdf');
      (parsePDF as jest.Mock).mockRejectedValue('String error');

      const result = await parseDocument('/path/to/file.pdf');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unknown parsing error');
    });
  });

  describe('formatExtractedData', () => {
    it('should format lab report data correctly', () => {
      const extractedData = {
        documentType: 'Lab Report',
        patientInfo: { name: 'John Doe', age: '45 years', gender: 'Male' },
        date: '2024-01-28',
        labResults: {
          hemoglobin: { value: '13.5', unit: 'g/dL', normalRange: '12-15' },
          glucose: { value: '95', unit: 'mg/dL' }
        }
      };

      const formatted = formatExtractedData(extractedData, 92);

      expect(formatted.documentType).toBe('Lab Report');
      expect(formatted.extractionAccuracy).toBe('92%');
      expect(formatted.patientInfo).toEqual(extractedData.patientInfo);
      expect(formatted.labInfo.reportDate).toBe('2024-01-28');
      expect(formatted.tests).toHaveLength(2);
      expect(formatted.tests[0]).toEqual({
        name: 'Hemoglobin',
        value: '13.5',
        unit: 'g/dL',
        normalRange: '12-15',
        status: 'NORMAL'
      });
      expect(formatted.tests[1]).toEqual({
        name: 'Blood Glucose',
        value: '95',
        unit: 'mg/dL',
        normalRange: 'N/A',
        status: 'NORMAL'
      });
      expect(formatted.abnormalValues).toBe(0);
      expect(formatted.criticalValues).toBe(0);
    });

    it('should format prescription data correctly', () => {
      const extractedData = {
        documentType: 'Prescription',
        patientInfo: { name: 'Jane Smith' },
        doctorInfo: { name: 'Dr. Brown' },
        diagnosis: ['Hypertension', 'Diabetes'],
        medications: [
          { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' }
        ],
        date: '2024-01-28'
      };

      const formatted = formatExtractedData(extractedData);

      expect(formatted.documentType).toBe('Prescription');
      expect(formatted.extractionAccuracy).toBe('95%');
      expect(formatted.patientInfo).toEqual(extractedData.patientInfo);
      expect(formatted.doctorInfo).toEqual(extractedData.doctorInfo);
      expect(formatted.diagnosis).toEqual(['Hypertension', 'Diabetes']);
      expect(formatted.medications).toEqual(extractedData.medications);
      expect(formatted.prescriptionDate).toBe('2024-01-28');
      expect(formatted.followUp).toBe('As directed by physician');
      expect(formatted.advice).toEqual(['Follow medication schedule', 'Maintain healthy diet']);
    });

    it('should handle prescription data with missing diagnosis and medications', () => {
      const extractedData = {
        documentType: 'Prescription',
        patientInfo: { name: 'John Doe' }
      };

      const formatted = formatExtractedData(extractedData);

      expect(formatted.diagnosis).toEqual([]);
      expect(formatted.medications).toEqual([]);
    });

    it('should format generic document data', () => {
      const extractedData = {
        documentType: 'Medical Document',
        patientInfo: { name: 'Patient Name' },
        date: '2024-01-28',
        rawText: 'Some medical text'
      };

      const formatted = formatExtractedData(extractedData, 85);

      expect(formatted.documentType).toBe('Medical Document');
      expect(formatted.extractionAccuracy).toBe('85%');
      expect(formatted.patientInfo).toEqual(extractedData.patientInfo);
      expect(formatted.date).toBe('2024-01-28');
      expect(formatted.extractedContent).toBe('Some medical text');
    });

    it('should handle missing data gracefully', () => {
      const extractedData = {
        documentType: 'Lab Report'
      };

      const formatted = formatExtractedData(extractedData);

      expect(formatted.documentType).toBe('Lab Report');
      expect(formatted.extractionAccuracy).toBe('95%');
      expect(formatted.patientInfo).toBeUndefined();
      expect(formatted.tests).toEqual([]);
    });

    it('should format test names correctly', () => {
      const extractedData = {
        documentType: 'Lab Report',
        labResults: {
          hemoglobin: { value: '13.5' },
          glucose: { value: '95' },
          cholesterol: { value: '180' },
          uricacid: { value: '5.2' },
          tsh: { value: '2.5' },
          t3: { value: '120' },
          t4: { value: '8.5' },
          unknowntest: { value: '100' }
        }
      };

      const formatted = formatExtractedData(extractedData);

      const testNames = formatted.tests.map((t: any) => t.name);
      expect(testNames).toContain('Hemoglobin');
      expect(testNames).toContain('Blood Glucose');
      expect(testNames).toContain('Total Cholesterol');
      expect(testNames).toContain('Uric Acid');
      expect(testNames).toContain('TSH');
      expect(testNames).toContain('T3');
      expect(testNames).toContain('T4');
      expect(testNames).toContain('unknowntest');
    });
  });
});