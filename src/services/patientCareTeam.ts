const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api/v1' 
  : 'http://localhost:3001/api/v1';

export interface CareTeamMember {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  hospitalName: string;
  qualification: string;
  experienceYears: number;
  nmrUid: string;
  consentStatus: 'pending' | 'approved' | 'revoked';
  consentDate: string;
  consentExpiryDate: string;
  accessLevel: 'read' | 'write' | 'full';
  relationshipType: 'primary' | 'consultant' | 'specialist';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AvailableDoctor {
  id: string;
  nmrUid: string;
  name: string;
  specialty: string;
  hospitalName: string;
  qualification: string;
  experienceYears: number;
  displayName: string;
}

export interface AddDoctorRequest {
  doctorId: string;
  relationshipType?: 'primary' | 'consultant' | 'specialist';
  notes?: string;
}

export interface UpdateCareTeamRequest {
  accessLevel?: 'read' | 'write' | 'full';
  relationshipType?: 'primary' | 'consultant' | 'specialist';
  notes?: string;
}

class PatientCareTeamService {
  async getCareTeam(userId: string): Promise<CareTeamMember[]> {
    const response = await fetch(`${API_BASE_URL}/patient/${userId}/care-team`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch care team');
    }

    const result = await response.json();
    return result.data;
  }

  async getAvailableDoctors(): Promise<AvailableDoctor[]> {
    const response = await fetch(`${API_BASE_URL}/patient/available-doctors`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch available doctors');
    }

    const result = await response.json();
    return result.data;
  }

  async addDoctorToCareTeam(userId: string, request: AddDoctorRequest): Promise<{ message: string; data: any }> {
    const response = await fetch(`${API_BASE_URL}/patient/${userId}/care-team`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add doctor to care team');
    }

    const result = await response.json();
    return { message: result.message, data: result.data };
  }

  async removeDoctorFromCareTeam(userId: string, relationshipId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/patient/${userId}/care-team/${relationshipId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to remove doctor from care team');
    }

    const result = await response.json();
    return { message: result.message };
  }

  async updateCareTeamMember(userId: string, relationshipId: string, request: UpdateCareTeamRequest): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/patient/${userId}/care-team/${relationshipId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update care team member');
    }

    const result = await response.json();
    return { message: result.message };
  }

  async approveConsent(userId: string, relationshipId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/patient/${userId}/care-team/${relationshipId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to approve consent');
    }
    return { message: result.message };
  }

  async rejectConsent(userId: string, relationshipId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/patient/${userId}/care-team/${relationshipId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to reject consent');
    }
    return { message: result.message };
  }
}

const patientCareTeamService = new PatientCareTeamService();
export default patientCareTeamService;
