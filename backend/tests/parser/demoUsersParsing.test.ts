import { extractMedicalData } from '../../src/parser/dataExtractor';
import * as fs from 'fs';
import * as path from 'path';

// Mock the logger
jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

describe('Demo Users Parsing Validation', () => {
  const sampleDocsPath = '../../../public/sample-documents';

  /**
   * Helper function to read sample document
   */
  const readSampleDocument = (filename: string): string => {
    const filePath = path.join(__dirname, sampleDocsPath, filename);
    return fs.readFileSync(filePath, 'utf8');
  };

  describe('Ramesh Kumar (ABHA: 1234-5678-9012-34)', () => {
    it('should extract all medications from prescription correctly', () => {
      const text = readSampleDocument('ramesh-kumar-prescription.txt');
      const result = extractMedicalData(text, 'Prescription');

      expect(result.documentType).toBe('Prescription');
      expect(result.patientInfo?.name).toBe('Ramesh Kumar');
      expect(result.patientInfo?.age).toBe('45 years');
      expect(result.patientInfo?.gender).toBe('Male');

      // Should extract all 3 medications
      expect(result.medications).toHaveLength(3);
      
      const medications = result.medications!;
      expect(medications[0]).toEqual({
        name: 'Omeprazole',
        dosage: '20mg',
        frequency: 'Twice daily'
      });
      
      expect(medications[1]).toEqual({
        name: 'Sucralfate + Simethicone',
        dosage: '10ml',
        frequency: 'Three times daily'
      });
      
      expect(medications[2]).toEqual({
        name: 'Loperamide',
        frequency: 'As directed'
      });

      // Should extract all diagnoses
      expect(result.diagnosis).toHaveLength(2);
      expect(result.diagnosis).toContain('- Acute Gastroenteritis');
      expect(result.diagnosis).toContain('- Mild Dehydration');

      // Should extract doctor info
      expect(result.doctorInfo?.name).toBe('Shubham Nimesh, MBBS');
    });

    it('should extract vital signs from ECG report correctly', () => {
      const text = readSampleDocument('ramesh-kumar-ecg-report.txt');
      const result = extractMedicalData(text, 'ECG Report');

      expect(result.documentType).toBe('ECG Report');
      expect(result.patientInfo?.name).toBe('Ramesh Kumar');
      expect(result.patientInfo?.age).toBe('52 years');

      // Should extract ECG vital signs
      expect(result.labResults).toBeDefined();
      const vitals = result.labResults!;
      
      expect(vitals.heartrate).toEqual({
        name: 'Heart Rate',
        value: '88',
        unit: 'bpm',
        normalRange: '60-100',
        status: 'HIGH'
      });

      expect(vitals.printerval).toEqual({
        name: 'PR Interval',
        value: '0.18',
        unit: 'seconds',
        normalRange: '0.12-0.20',
        status: 'HIGH'
      });

      expect(vitals.qrsduration).toEqual({
        name: 'QRS Duration',
        value: '0.08',
        unit: 'seconds',
        normalRange: '<0.12',
        status: 'HIGH'
      });

      expect(vitals.qtinterval).toEqual({
        name: 'QT Interval',
        value: '0.44',
        unit: 'seconds',
        normalRange: '<0.44',
        status: 'HIGH'
      });
    });

    it('should extract lab results from lab report correctly', () => {
      const text = readSampleDocument('ramesh-kumar-lab-report.txt');
      const result = extractMedicalData(text, 'Lab Report');

      expect(result.documentType).toBe('Lab Report');
      expect(result.patientInfo?.name).toBe('Ramesh Kumar');

      // Should extract lab results
      expect(result.labResults).toBeDefined();
      const labs = result.labResults!;

      // Check for Total Cholesterol
      expect(labs.total_cholesterol).toEqual({
        name: 'Total Cholesterol',
        value: '245',
        unit: 'mg/dL',
        normalRange: '<200',
        status: 'HIGH'
      });
    });
  });

  describe('Priya Sharma (ABHA: 9876-5432-1098-76)', () => {
    it('should extract all medications from prescription correctly', () => {
      const text = readSampleDocument('priya-sharma-prescription.txt');
      const result = extractMedicalData(text, 'Prescription');

      expect(result.documentType).toBe('Prescription');
      expect(result.patientInfo?.name).toBe('Priya Sharma');
      expect(result.patientInfo?.age).toBe('38 years');
      expect(result.patientInfo?.gender).toBe('Female');

      // Should extract all 4 medications
      expect(result.medications).toHaveLength(4);
      
      const medications = result.medications!;
      expect(medications[0]).toEqual({
        name: 'Amlodipine',
        dosage: '5mg',
        frequency: 'Once daily'
      });
      
      expect(medications[1]).toEqual({
        name: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'Once daily'
      });
      
      expect(medications[2]).toEqual({
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily'
      });
      
      expect(medications[3]).toEqual({
        name: 'Aspirin',
        dosage: '75mg',
        frequency: 'Once daily'
      });

      // Should extract all diagnoses
      expect(result.diagnosis).toHaveLength(3);
      expect(result.diagnosis).toContain('- Hypertension');
      expect(result.diagnosis).toContain('- Hyperlipidemia');
      expect(result.diagnosis).toContain('- Pre-diabetes');

      // Should extract doctor info
      expect(result.doctorInfo?.name).toBe('Meera Patel, MD (Cardiology)');
    });

    it('should extract lab results from lab report correctly', () => {
      const text = readSampleDocument('priya-sharma-lab-report.txt');
      const result = extractMedicalData(text, 'Lab Report');

      expect(result.documentType).toBe('Lab Report');
      expect(result.patientInfo?.name).toBe('Priya Sharma');

      // Should extract lab results
      expect(result.labResults).toBeDefined();
    });

    it('should extract ECG data correctly', () => {
      const text = readSampleDocument('priya-sharma-ecg-report.txt');
      const result = extractMedicalData(text, 'ECG Report');

      expect(result.documentType).toBe('ECG Report');
      expect(result.patientInfo?.name).toBe('Priya Sharma');

      // Should extract ECG vital signs
      expect(result.labResults).toBeDefined();
    });
  });

  describe('Suresh Patel (ABHA: 4567-8901-2345-67)', () => {
    it('should extract all medications from prescription correctly', () => {
      const text = readSampleDocument('suresh-patel-prescription.txt');
      const result = extractMedicalData(text, 'Prescription');

      expect(result.documentType).toBe('Prescription');
      expect(result.patientInfo?.name).toBe('Suresh Patel');
      expect(result.patientInfo?.age).toBe('65 years');
      expect(result.patientInfo?.gender).toBe('Male');

      // Should extract all 6 medications
      expect(result.medications).toHaveLength(6);
      
      const medications = result.medications!;
      expect(medications[0]).toEqual({
        name: 'Aspirin',
        dosage: '100mg',
        frequency: 'Once daily'
      });
      
      expect(medications[1]).toEqual({
        name: 'Clopidogrel',
        dosage: '75mg',
        frequency: 'Once daily'
      });
      
      expect(medications[2]).toEqual({
        name: 'Atorvastatin',
        dosage: '40mg',
        frequency: 'Once daily'
      });
      
      expect(medications[3]).toEqual({
        name: 'Metoprolol',
        dosage: '50mg',
        frequency: 'Twice daily'
      });
      
      expect(medications[4]).toEqual({
        name: 'Ramipril',
        dosage: '5mg',
        frequency: 'Once daily'
      });
      
      expect(medications[5]).toEqual({
        name: 'Isosorbide Mononitrate',
        dosage: '30mg',
        frequency: 'Once daily'
      });

      // Should extract all diagnoses
      expect(result.diagnosis).toHaveLength(4);
      expect(result.diagnosis).toContain('- Coronary Artery Disease');
      expect(result.diagnosis).toContain('- Post-Myocardial Infarction');
      expect(result.diagnosis).toContain('- Hypertension');
      expect(result.diagnosis).toContain('- Hyperlipidemia');

      // Should extract doctor info
      expect(result.doctorInfo?.name).toBe('Rajesh Verma, MD (Cardiology)');
    });

    it('should extract all lab results from cardiac biomarkers report correctly', () => {
      const text = readSampleDocument('suresh-patel-lab-report.txt');
      const result = extractMedicalData(text, 'Lab Report');

      expect(result.documentType).toBe('Lab Report');
      expect(result.patientInfo?.name).toBe('Suresh Patel');
      expect(result.patientInfo?.age).toBe('65 years');

      // Should extract lab results
      expect(result.labResults).toBeDefined();
      const labs = result.labResults!;

      // Critical cardiac biomarkers
      expect(labs.total_cholesterol).toEqual({
        name: 'Total Cholesterol',
        value: '280',
        unit: 'mg/dL',
        normalRange: '<200',
        status: 'HIGH'
      });

      expect(labs.ldl_cholesterol).toEqual({
        name: 'LDL Cholesterol',
        value: '180',
        unit: 'mg/dL',
        normalRange: '<100',
        status: 'HIGH'
      });

      expect(labs.hdl_cholesterol).toEqual({
        name: 'HDL Cholesterol',
        value: '35',
        unit: 'mg/dL',
        normalRange: '>40',
        status: 'LOW'
      });

      expect(labs.triglycerides).toEqual({
        name: 'Triglycerides',
        value: '320',
        unit: 'mg/dL',
        normalRange: '<150',
        status: 'HIGH'
      });

      // Liver enzymes
      expect(labs.ast).toEqual({
        name: 'AST',
        value: '85',
        unit: 'U/L',
        normalRange: '8-48',
        status: 'HIGH'
      });

      expect(labs.alt).toEqual({
        name: 'ALT',
        value: '65',
        unit: 'U/L',
        normalRange: '7-55',
        status: 'HIGH'
      });

      // Kidney function
      expect(labs.serum_creatinine).toEqual({
        name: 'Serum Creatinine',
        value: '1.9',
        unit: 'mg/dL',
        normalRange: '0.7-1.3',
        status: 'HIGH'
      });

      // Inflammatory markers
      expect(labs.crp).toEqual({
        name: 'CRP',
        value: '15',
        unit: 'mg/L',
        normalRange: '<3',
        status: 'HIGH'
      });

      // Should have at least 8 meaningful lab results
      expect(Object.keys(labs).length).toBeGreaterThanOrEqual(8);
    });
  });

  describe('Ashok Gupta (ABHA: 1111-2222-3333-44)', () => {
    it('should extract all medications from prescription correctly', () => {
      const text = readSampleDocument('ashok-gupta-prescription.txt');
      const result = extractMedicalData(text, 'Prescription');

      expect(result.documentType).toBe('Prescription');
      expect(result.patientInfo?.name).toBe('Ashok Gupta');
      expect(result.patientInfo?.age).toBe('58 years');
      expect(result.patientInfo?.gender).toBe('Male');

      // Should extract all 5 medications
      expect(result.medications).toHaveLength(5);
      
      const medications = result.medications!;
      expect(medications[0]).toEqual({
        name: 'Amlodipine',
        dosage: '10mg',
        frequency: 'Once daily'
      });
      
      expect(medications[1]).toEqual({
        name: 'Telmisartan',
        dosage: '80mg',
        frequency: 'Once daily'
      });
      
      expect(medications[2]).toEqual({
        name: 'Hydrochlorothiazide',
        dosage: '25mg',
        frequency: 'Once daily'
      });
      
      expect(medications[3]).toEqual({
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily'
      });
      
      expect(medications[4]).toEqual({
        name: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'Once daily'
      });

      // Should extract all diagnoses
      expect(result.diagnosis).toHaveLength(4);
      expect(result.diagnosis).toContain('- Essential Hypertension (Stage 2)');
      expect(result.diagnosis).toContain('- Pre-diabetes');
      expect(result.diagnosis).toContain('- Obesity');
      expect(result.diagnosis).toContain('- Sleep Apnea');

      // Should extract doctor info
      expect(result.doctorInfo?.name).toBe('Anita Desai, MD (Internal Medicine)');
    });

    it('should extract lab results from lab report correctly', () => {
      const text = readSampleDocument('ashok-gupta-lab-report.txt');
      const result = extractMedicalData(text, 'Lab Report');

      expect(result.documentType).toBe('Lab Report');
      expect(result.patientInfo?.name).toBe('Ashok Gupta');

      // Should extract lab results
      expect(result.labResults).toBeDefined();
    });
  });

  describe('Meera Singh (ABHA: 5555-6666-7777-88)', () => {
    it('should extract all medications from prescription correctly', () => {
      const text = readSampleDocument('meera-singh-prescription.txt');
      const result = extractMedicalData(text, 'Prescription');

      expect(result.documentType).toBe('Prescription');
      expect(result.patientInfo?.name).toBe('Meera Singh');
      expect(result.patientInfo?.age).toBe('42 years');
      expect(result.patientInfo?.gender).toBe('Female');

      // Should extract all 5 medications
      expect(result.medications).toHaveLength(5);
      
      const medications = result.medications!;
      expect(medications[0]).toEqual({
        name: 'Levothyroxine',
        dosage: '100mcg',
        frequency: 'Once daily'
      });
      
      expect(medications[1]).toEqual({
        name: 'Calcium Carbonate',
        dosage: '500mg',
        frequency: 'Twice daily'
      });
      
      expect(medications[2]).toEqual({
        name: 'Vitamin D3',
        dosage: '1000 IU',
        frequency: 'Once daily'
      });
      
      expect(medications[3]).toEqual({
        name: 'Ferrous Sulfate',
        dosage: '325mg',
        frequency: 'Twice daily'
      });
      
      expect(medications[4]).toEqual({
        name: 'Selenium',
        dosage: '100mcg',
        frequency: 'Once daily'
      });

      // Should extract all diagnoses
      expect(result.diagnosis).toHaveLength(4);
      expect(result.diagnosis).toContain('- Hypothyroidism (Primary)');
      expect(result.diagnosis).toContain('- Autoimmune Thyroiditis');
      expect(result.diagnosis).toContain('- Vitamin D Deficiency');
      expect(result.diagnosis).toContain('- Iron Deficiency Anemia');

      // Should extract doctor info
      expect(result.doctorInfo?.name).toBe('Priya Sharma, MD (Endocrinology)');
    });

    it('should extract lab results from lab report correctly', () => {
      const text = readSampleDocument('meera-singh-lab-report.txt');
      const result = extractMedicalData(text, 'Lab Report');

      expect(result.documentType).toBe('Lab Report');
      expect(result.patientInfo?.name).toBe('Meera Singh');

      // Should extract lab results
      expect(result.labResults).toBeDefined();
    });
  });

  describe('Cross-User Validation', () => {
    it('should extract unique patient names correctly', () => {
      const expectedPatients = [
        { file: 'ramesh-kumar-prescription.txt', name: 'Ramesh Kumar', age: '45 years' },
        { file: 'priya-sharma-prescription.txt', name: 'Priya Sharma', age: '38 years' },
        { file: 'suresh-patel-prescription.txt', name: 'Suresh Patel', age: '65 years' },
        { file: 'ashok-gupta-prescription.txt', name: 'Ashok Gupta', age: '58 years' },
        { file: 'meera-singh-prescription.txt', name: 'Meera Singh', age: '42 years' }
      ];

      expectedPatients.forEach(({ file, name, age }) => {
        const text = readSampleDocument(file);
        const result = extractMedicalData(text, 'Prescription');
        
        expect(result.patientInfo?.name).toBe(name);
        expect(result.patientInfo?.age).toBe(age);
      });
    });

    it('should extract total expected medications across all users', () => {
      const expectedMedicationCounts = [
        { file: 'ramesh-kumar-prescription.txt', count: 3 },
        { file: 'priya-sharma-prescription.txt', count: 4 },
        { file: 'suresh-patel-prescription.txt', count: 6 },
        { file: 'ashok-gupta-prescription.txt', count: 5 },
        { file: 'meera-singh-prescription.txt', count: 5 }
      ];

      let totalMedications = 0;
      expectedMedicationCounts.forEach(({ file, count }) => {
        const text = readSampleDocument(file);
        const result = extractMedicalData(text, 'Prescription');
        
        expect(result.medications).toHaveLength(count);
        totalMedications += count;
      });

      // Total medications across all 5 users should be 23
      expect(totalMedications).toBe(23);
    });

    it('should extract total expected diagnoses across all users', () => {
      const expectedDiagnosisCounts = [
        { file: 'ramesh-kumar-prescription.txt', count: 2 },
        { file: 'priya-sharma-prescription.txt', count: 3 },
        { file: 'suresh-patel-prescription.txt', count: 4 },
        { file: 'ashok-gupta-prescription.txt', count: 4 },
        { file: 'meera-singh-prescription.txt', count: 4 }
      ];

      let totalDiagnoses = 0;
      expectedDiagnosisCounts.forEach(({ file, count }) => {
        const text = readSampleDocument(file);
        const result = extractMedicalData(text, 'Prescription');
        
        expect(result.diagnosis).toHaveLength(count);
        totalDiagnoses += count;
      });

      // Total diagnoses across all 5 users should be 17
      expect(totalDiagnoses).toBe(17);
    });
  });
});
