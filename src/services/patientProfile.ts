const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api/v1' 
  : 'http://localhost:3001/api/v1';

export interface PatientProfile {
  user: {
    id: string;
    username: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    createdAt: string;
    updatedAt: string;
  };
  abhaProfile?: {
    abhaId: string;
    bloodGroup: string;
    height: number;
    weight: number;
    emergencyContact: string;
    medicalConditions: string;
    allergies: string;
    currentMedications: string;
    address: string;
    verificationStatus: string;
    linkedDate: string;
  };
  abhaRegistry?: {
    abhaId: string;
    aadharId: string;
    name: string;
    dateOfBirth: string;
    gender: string;
    mobile: string;
    email: string;
    status: string;
  };
}

export interface UpdateProfileData {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup?: string;
  height?: number;
  weight?: number;
  emergencyContact?: string;
  medicalConditions?: string;
  allergies?: string;
  currentMedications?: string;
  address?: string;
}

export interface ABHAStatus {
  hasAbhaLinked: boolean;
  needsLinking: boolean;
  abhaId?: string;
  verificationStatus?: string;
  linkedDate?: string;
}

class PatientProfileService {
  async getProfile(userId: string): Promise<PatientProfile> {
    const response = await fetch(`${API_BASE_URL}/patient-profile/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch profile');
    }

    const result = await response.json();
    return result.data;
  }

  async updateProfile(userId: string, profileData: UpdateProfileData): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/patient-profile/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  async getABHAStatus(userId: string): Promise<ABHAStatus> {
    const response = await fetch(`${API_BASE_URL}/patient-profile/${userId}/abha-status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to check ABHA status');
    }

    const result = await response.json();
    return result.data;
  }
}

const patientProfileService = new PatientProfileService();
export default patientProfileService;

