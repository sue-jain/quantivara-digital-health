import { API_BASE_URL } from '@/config/api';
import authService from './auth';

export interface ABHALookupResult {
  found: boolean;
  abhaId?: string;
  name?: string;
  dateOfBirth?: string;
  gender?: string;
  mobile?: string;
  email?: string;
  isDemoPatient?: boolean;
  isLinked?: boolean;
  aadharId?: string;
}

export interface ABHACreateData {
  aadharId: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  mobile?: string;
  email?: string;
}

export interface ABHAProfile {
  abhaId: string;
  aadharId: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup?: string;
  heightCm?: number;
  weightKg?: number;
  emergencyContact?: any;
  medicalConditions: string[];
  allergies: string[];
  currentMedications: string[];
  address?: any;
  linkedDate: string;
  verificationStatus: string;
}

class ABHAService {
  // Lookup ABHA ID by AADHAR
  async lookupABHA(aadharId: string): Promise<ABHALookupResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/abha/lookup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aadharId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'ABHA lookup failed');
      }

      return result.data;
    } catch (error) {
      console.error('ABHA lookup error:', error);
      throw error;
    }
  }

  // Create new ABHA ID
  async createABHA(data: ABHACreateData): Promise<ABHALookupResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/abha/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'ABHA creation failed');
      }

      return {
        found: true,
        abhaId: result.data.abhaId,
        name: result.data.name,
        dateOfBirth: result.data.dateOfBirth,
        gender: result.data.gender,
        mobile: result.data.mobile,
        email: result.data.email,
        isDemoPatient: false,
        isLinked: false
      };
    } catch (error) {
      console.error('ABHA creation error:', error);
      throw error;
    }
  }

  // Link ABHA ID to user
  async linkABHA(userId: string, abhaId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/abha/link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        body: JSON.stringify({ userId, abhaId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'ABHA linking failed');
      }
    } catch (error) {
      console.error('ABHA linking error:', error);
      throw error;
    }
  }

  // Get user's ABHA profile
  async getABHAProfile(userId: string): Promise<ABHAProfile> {
    try {
      const response = await fetch(`${API_BASE_URL}/abha/profile/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch ABHA profile');
      }

      return result.data;
    } catch (error) {
      console.error('Get ABHA profile error:', error);
      throw error;
    }
  }

  // Unlink ABHA ID from user
  async unlinkABHA(userId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/abha/unlink/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'ABHA unlinking failed');
      }
    } catch (error) {
      console.error('ABHA unlinking error:', error);
      throw error;
    }
  }

  // Format ABHA ID for display
  formatABHAId(abhaId: string): string {
    if (!abhaId || abhaId.length !== 14) {
      return abhaId;
    }
    
    return `${abhaId.slice(0, 4)}-${abhaId.slice(4, 8)}-${abhaId.slice(8, 12)}-${abhaId.slice(12, 14)}`;
  }

  // Clean ABHA ID (remove dashes)
  cleanABHAId(abhaId: string): string {
    return abhaId.replace(/\D/g, '');
  }

  // Validate AADHAR ID format
  validateAadharId(aadharId: string): boolean {
    const clean = aadharId.replace(/\D/g, '');
    return clean.length === 12;
  }

  // Validate ABHA ID format
  validateABHAId(abhaId: string): boolean {
    const clean = abhaId.replace(/\D/g, '');
    return clean.length === 14;
  }
}

// Create singleton instance
const abhaService = new ABHAService();
export default abhaService;
