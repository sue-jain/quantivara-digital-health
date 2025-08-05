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

export interface PatientLookupResult {
  abhaId: string;
  patientInfo: {
    name: string;
    dateOfBirth: string;
    gender: string;
    phone: string;
    email: string;
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
  // NEW: Lookup ABHA ID by name and DOB
  async lookupAbhaIdByNameAndDOB(
    firstName: string, 
    lastName: string, 
    dateOfBirth: string
  ): Promise<PatientLookupResult> {
    const startTime = Date.now();
    
    try {
      const params = new URLSearchParams({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateOfBirth: dateOfBirth
      });
      
      const response = await apiClient<PatientLookupResult>(
        `${API_ENDPOINTS.patients.lookupAbhaId}?${params.toString()}`
      );
      
      console.log(`ABHA ID lookup by name/DOB completed in ${Date.now() - startTime}ms`);
      return response.data;
    } catch (error) {
      console.error('Error looking up ABHA ID by name and DOB:', error);
      throw error;
    }
  }

  // EXISTING: Get patient profile by ABHA ID (UNCHANGED)
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
  
  // EXISTING: Emergency profile lookup (UNCHANGED)
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
  
  // EXISTING: Get patient medical timeline (UNCHANGED)
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
  
  // EXISTING: Format ABHA ID for display (UNCHANGED)
  formatAbhaId(abhaId: string): string {
    // Format as XXXX-XXXX-XXXX-XX
    return abhaId.replace(/(\d{4})(\d{4})(\d{4})(\d{2})/, '$1-$2-$3-$4');
  }
  
  // EXISTING: Validate ABHA ID format (UNCHANGED)
  validateAbhaId(abhaId: string): boolean {
    // Remove any hyphens or spaces
    const cleanedId = abhaId.replace(/[-\s]/g, '');
    
    // Check if it's exactly 14 digits
    return /^\d{14}$/.test(cleanedId);
  }
  
  // EXISTING: Clean ABHA ID for API calls (UNCHANGED)
  cleanAbhaId(abhaId: string): string {
    return abhaId.replace(/[-\s]/g, '');
  }

  // NEW: Validate date of birth format
  validateDateOfBirth(dateOfBirth: string): boolean {
    // Check if it's a valid date in YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateOfBirth)) return false;
    
    const date = new Date(dateOfBirth);
    return !isNaN(date.getTime()) && date.toISOString().split('T')[0] === dateOfBirth;
  }

  // NEW: Format date for display
  formatDateOfBirth(dateOfBirth: string): string {
    const date = new Date(dateOfBirth);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

// Create singleton instance
const patientService = new PatientService();

export default patientService;