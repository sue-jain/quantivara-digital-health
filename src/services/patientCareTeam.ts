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

export interface AvailableLab {
  id: string;
  hfrUid: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  stateCode?: string;
  licenseNumber?: string;
  displayName?: string;
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

  async getAvailableLabs(): Promise<AvailableLab[]> {
    const response = await fetch(`${API_BASE_URL}/patient/available-labs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch available labs');
    }

    const result = await response.json();
    return result.data;
  }

  async listCareTeamLabs(userId: string): Promise<Array<{ id: string; labId: string; labName: string; hfrUid?: string; consentStatus: string; consentDate?: string }>> {
    const response = await fetch(`${API_BASE_URL}/patient/${userId}/care-team/labs`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch labs in care team');
    }
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

  async addLabToCareTeam(userId: string, labId: string, notes?: string): Promise<{ message: string; data: any }> {
    const response = await fetch(`${API_BASE_URL}/patient/${userId}/care-team/labs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ labId, notes }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to add lab to care team');
    }
    return { message: result.message, data: result.data };
  }

  async removeLabFromCareTeam(userId: string, id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/patient/${userId}/care-team/labs/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to remove lab from care team');
    }
    return { message: result.message };
  }

  async approveLabAccess(userId: string, id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/patient/${userId}/care-team/labs/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to approve lab access');
    }
    return { message: result.message };
  }
}

const patientCareTeamService = new PatientCareTeamService();
export default patientCareTeamService;
