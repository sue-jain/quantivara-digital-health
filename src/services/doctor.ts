const API_BASE_URL = import.meta.env.MODE === 'production' ? '/api/v1' : 'http://localhost:3001/api/v1';

export interface DoctorProfile {
  id: string;
  nmrUid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialty: string;
  stateCode: string;
  hospitalId?: string | null;
  hospitalName?: string | null;
  licenseNumber?: string | null;
  qualification?: string | null;
  experienceYears?: number;
  isActive: number | boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorPatient {
  relationshipId: string;
  consentStatus: 'pending' | 'approved' | 'revoked';
  consentDate?: string | null;
  accessLevel: 'read' | 'write' | 'full';
  relationshipType: 'primary' | 'consultant' | 'specialist';
  patientId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  abhaId?: string | null;
}

class DoctorService {
  async getProfile(doctorId: string): Promise<DoctorProfile> {
    const res = await fetch(`${API_BASE_URL}/doctor-profile/${doctorId}`);
    if (!res.ok) throw new Error('Failed to fetch doctor profile');
    const json = await res.json();
    return json.data as DoctorProfile;
  }

  async updateProfile(doctorId: string, payload: Partial<DoctorProfile>): Promise<DoctorProfile> {
    const res = await fetch(`${API_BASE_URL}/doctor-profile/${doctorId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update doctor profile');
    const json = await res.json();
    return json.data as DoctorProfile;
  }

  async getPatients(doctorId: string, consent?: 'pending' | 'approved' | 'revoked'): Promise<DoctorPatient[]> {
    const url = new URL(`${API_BASE_URL}/doctor/${doctorId}/patients`);
    if (consent) url.searchParams.set('consent', consent);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch doctor patients');
    const json = await res.json();
    return json.data as DoctorPatient[];
  }

  async searchPatients(doctorId: string, q: string): Promise<any[]> {
    const url = new URL(`${API_BASE_URL}/doctor/${doctorId}/patients/search`);
    url.searchParams.set('q', q);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to search patients');
    const json = await res.json();
    return json.data as any[];
  }

  async createPatient(doctorId: string, payload: { firstName: string; lastName: string; phone: string; email?: string; }): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/doctor/${doctorId}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create patient');
    const json = await res.json();
    return json.data;
  }

  async saveVoiceDiagnosis(doctorId: string, payload: { patientId: string; audioBase64?: string; transcript?: string; }): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/doctor/${doctorId}/voice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to save voice diagnosis');
    const json = await res.json();
    return json.data;
  }

  async getMedicineInteractions(drugA: string, drugB: string): Promise<{ interaction: string; severity: string; advisory: string; }> {
    const url = new URL(`${API_BASE_URL}/doctor/medicine-interactions`);
    url.searchParams.set('drugA', drugA);
    url.searchParams.set('drugB', drugB);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to check medicine interactions');
    const json = await res.json();
    return json.data;
  }

  async requestConsent(doctorId: string, patientId: string, scopes: { labReports: boolean; prescriptions: boolean; pastHistory: boolean }): Promise<{ relationshipId: string; consentStatus: string; }> {
    const res = await fetch(`${API_BASE_URL}/doctor/${doctorId}/consent-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, scopes })
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to request consent');
    return json.data;
  }

  async getPatientSummary(doctorId: string, patientId: string): Promise<{ name: string; consentStatus: string; allowed: { labReports: boolean; prescriptions: boolean; pastHistory: boolean }, sections: any }>{
    const res = await fetch(`${API_BASE_URL}/doctor/${doctorId}/patient/${patientId}/summary`);
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to load summary');
    return json.data;
  }
}

const doctorService = new DoctorService();
export default doctorService;


