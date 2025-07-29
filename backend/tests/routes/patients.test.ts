import request from 'supertest';
import express from 'express';
import patientRoutes from '../../src/routes/patients';

// Mock the database and logger
const mockGet = jest.fn();
const mockAll = jest.fn();
const mockPrepare = jest.fn(() => ({
  get: mockGet,
  all: mockAll
}));

jest.mock('../../src/config/sqlite', () => ({
  db: {
    prepare: () => ({
      get: mockGet,
      all: mockAll
    })
  }
}));

jest.mock('../../src/utils/logger', () => ({
  logMedicalAccess: jest.fn(),
  performanceLogger: {
    info: jest.fn()
  }
}));

const app = express();
app.use(express.json());
app.use('/patients', patientRoutes);

describe('Patient Routes', () => {
  const mockPatientData = {
    user_id: 1,
    abha_id: 'ABHA123456789',
    first_name: 'John',
    last_name: 'Doe',
    date_of_birth: '1990-01-01',
    gender: 'Male',
    phone: '+91-9876543210',
    address: '{"street": "123 Main St", "city": "Mumbai", "state": "Maharashtra"}',
    blood_group: 'O+',
    height_cm: 175,
    weight_kg: 70,
    emergency_contact: '{"name": "Jane Doe", "phone": "+91-9876543211"}',
    medical_conditions: '["Hypertension"]',
    allergies: '["Penicillin"]',
    current_medications: '["Lisinopril 10mg"]'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockReset();
    mockAll.mockReset();
    mockPrepare.mockClear();
  });

  describe('GET /patients/:abhaId/profile', () => {
    it('should return patient profile successfully', async () => {
      mockGet.mockReturnValue(mockPatientData);

      const response = await request(app)
        .get('/patients/ABHA123456789/profile');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Patient profile retrieved successfully');
      expect(response.body.data.abhaId).toBe('ABHA123456789');
      expect(response.body.data.personalInfo.name).toBe('John Doe');
      expect(response.body.data.medicalInfo.bloodGroup).toBe('O+');
    });

    it('should return 404 when patient not found', async () => {
      mockGet.mockReturnValue(null);

      const response = await request(app)
        .get('/patients/INVALID_ABHA/profile');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should handle database errors', async () => {
      mockGet.mockImplementation(() => {
        throw new Error('Database error');
      });

      const response = await request(app)
        .get('/patients/ABHA123456789/profile');

      expect(response.status).toBe(500);
    });
  });

  describe('GET /patients/:abhaId/emergency-profile', () => {
    const mockEmergencyData = {
      ...mockPatientData,
      total_documents: 5,
      recent_documents: JSON.stringify([
        {
          type: 'lab_report',
          date: '2024-01-15',
          provider: 'City Hospital',
          accuracy: 0.95
        }
      ])
    };

    it('should return emergency profile successfully', async () => {
      mockGet.mockReturnValue(mockEmergencyData);

      const response = await request(app)
        .get('/patients/ABHA123456789/emergency-profile');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Emergency profile retrieved successfully');
      expect(response.body.data.patient.name).toBe('John Doe');
      expect(response.body.data.patient.bloodGroup).toBe('O+');
      expect(response.body.data.totalDocuments).toBe(5);
      expect(response.body.data.lookupSuccess).toBe(true);
      expect(response.body.data.responseTime).toMatch(/\d+ms/);
    });

    it('should return 404 when patient not found for emergency profile', async () => {
      mockGet.mockReturnValue(null);

      const response = await request(app)
        .get('/patients/INVALID_ABHA/emergency-profile');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should handle null JSON fields gracefully', async () => {
      const mockDataWithNulls = {
        ...mockEmergencyData,
        emergency_contact: null,
        medical_conditions: null,
        allergies: null,
        current_medications: null,
        recent_documents: null
      };

      mockGet.mockReturnValue(mockDataWithNulls);

      const response = await request(app)
        .get('/patients/ABHA123456789/emergency-profile');

      expect(response.status).toBe(200);
      expect(response.body.data.emergencyContact).toBeNull();
      expect(response.body.data.criticalInfo.conditions).toEqual([]);
      expect(response.body.data.recentDocuments).toEqual([]);
    });
  });

  describe('GET /patients/:abhaId/timeline', () => {
    const mockTimelineData = [
      {
        id: 1,
        document_type: 'lab_report',
        created_at: '2024-01-15T10:30:00Z',
        extraction_accuracy: 0.95,
        extracted_data: '{"findings": "Normal CBC"}',
        status: 'processed',
        provider_name: 'City Hospital',
        provider_type: 'hospital',
        doctor_first_name: 'Jane',
        doctor_last_name: 'Smith'
      }
    ];

    it('should return medical timeline successfully', async () => {
      mockGet.mockReturnValueOnce({ 
        patient_id: 1, 
        first_name: 'John', 
        last_name: 'Doe' 
      });
      mockAll.mockReturnValue(mockTimelineData);

      const response = await request(app)
        .get('/patients/ABHA123456789/timeline');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Medical timeline retrieved successfully');
      expect(response.body.data.abhaId).toBe('ABHA123456789');
      expect(response.body.data.patientName).toBe('John Doe');
      expect(response.body.data.totalDocuments).toBe(1);
      expect(response.body.data.timeline).toHaveLength(1);
      expect(response.body.data.timeline[0].type).toBe('lab_report');
      expect(response.body.data.timeline[0].doctor).toBe('Dr. Jane Smith');
    });

    it('should return 404 when patient not found for timeline', async () => {
      mockGet.mockReturnValue(null);

      const response = await request(app)
        .get('/patients/INVALID_ABHA/timeline');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should return empty timeline when no documents exist', async () => {
      mockGet.mockReturnValueOnce({ 
        patient_id: 1, 
        first_name: 'John', 
        last_name: 'Doe' 
      });
      mockAll.mockReturnValue([]);

      const response = await request(app)
        .get('/patients/ABHA123456789/timeline');

      expect(response.status).toBe(200);
      expect(response.body.data.totalDocuments).toBe(0);
      expect(response.body.data.timeline).toEqual([]);
    });
  });

  describe('Performance and Logging', () => {
    it('should log medical access for profile lookup', async () => {
      const { logMedicalAccess } = require('../../src/utils/logger');
      
      mockGet.mockReturnValue(mockPatientData);

      await request(app)
        .get('/patients/ABHA123456789/profile');

      expect(logMedicalAccess).toHaveBeenCalledWith(
        'system',
        1,
        'profile_access',
        expect.objectContaining({
          ip: expect.any(String)
        })
      );
    });

    it('should log performance metrics', async () => {
      const { performanceLogger } = require('../../src/utils/logger');
      
      mockGet.mockReturnValue(mockPatientData);

      await request(app)
        .get('/patients/ABHA123456789/emergency-profile');

      expect(performanceLogger.info).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: 'emergency_profile_lookup',
          duration: expect.any(Number),
          success: true,
          abhaId: 'ABHA123456789'
        })
      );
    });
  });
});