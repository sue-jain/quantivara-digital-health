// Patient Service for ABHA ID lookups and patient data

import apiClient, { API_ENDPOINTS, ApiResponse } from '@/config/api';

export interface PatientAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface PatientProfile {
  abhaId: string;
  personalInfo: {
    name: string;
    dateOfBirth: string;
    gender: string;
    phone: string;
    address: PatientAddress | null;
  };
  medicalInfo: {
    bloodGroup: string;
    height: number;
    weight: number;
    emergencyContact: EmergencyContact | null;
    conditions: string[];
    allergies: string[];
    currentMedications: string[];
  };
  responseTime: string;
}

export interface EmergencyProfile {
  patient: {
    name: string;
    age: number | null;
    gender: string;
    bloodGroup: string;
    phone: string;
  };
  emergencyContact: EmergencyContact | null;
  criticalInfo: {
    conditions: string[];
    allergies: string[];
    currentMedications: string[];
  };
  recentDocuments: Array<{
    type: string;
    date: string;
    provider: string;
    accuracy: number;
  }>;
  totalDocuments: number;
  responseTime: string;
  lookupSuccess: boolean;
}

export interface MedicalTimeline {
  abhaId: string;
  patientName: string;
  totalDocuments: number;
  timeline: Array<{
    id: string;
    type: string;
    date: string;
    provider: string;
    providerType: string;
    doctor: string | null;
    accuracy: number;
    status: string;
    summary: any;
  }>;
  responseTime: string;
}

class PatientService {
  // Get patient profile by ABHA ID
  async getPatientProfile(abhaId: string): Promise<PatientProfile> {
    const startTime = Date.now();
    
    try {
      const response = await apiClient<PatientProfile>(
        API_ENDPOINTS.patients.profile(abhaId)
      );
      
      console.log(`Patient profile fetched in ${Date.now() - startTime}ms`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient profile:', error);
      throw error;
    }
  }
  
  // Emergency profile lookup (3-second demo)
  async getEmergencyProfile(abhaId: string): Promise<EmergencyProfile> {
    const startTime = Date.now();
    
    try {
      const response = await apiClient<EmergencyProfile>(
        API_ENDPOINTS.patients.emergencyProfile(abhaId)
      );
      
      const responseTime = Date.now() - startTime;
      console.log(`Emergency profile fetched in ${responseTime}ms`);
      
      // For demo purposes, ensure it appears to take ~3 seconds
      if (responseTime < 3000) {
        await new Promise(resolve => setTimeout(resolve, 3000 - responseTime));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching emergency profile:', error);
      throw error;
    }
  }
  
  // Get patient medical timeline
  async getMedicalTimeline(abhaId: string): Promise<MedicalTimeline> {
    try {
      const response = await apiClient<MedicalTimeline>(
        API_ENDPOINTS.patients.timeline(abhaId)
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching medical timeline:', error);
      throw error;
    }
  }
  
  // Format ABHA ID for display
  formatAbhaId(abhaId: string): string {
    // Format as XXXX-XXXX-XXXX-XX
    return abhaId.replace(/(\d{4})(\d{4})(\d{4})(\d{2})/, '$1-$2-$3-$4');
  }
  
  // Validate ABHA ID format
  validateAbhaId(abhaId: string): boolean {
    // Remove any hyphens or spaces
    const cleanedId = abhaId.replace(/[-\s]/g, '');
    
    // Check if it's exactly 14 digits
    return /^\d{14}$/.test(cleanedId);
  }
  
  // Clean ABHA ID for API calls
  cleanAbhaId(abhaId: string): string {
    return abhaId.replace(/[-\s]/g, '');
  }
}

// Create singleton instance
const patientService = new PatientService();

export default patientService;