import { API_BASE_URL } from '@/config/api';

export interface LabTestCatalogItem {
  id: string;
  name: string;
  loincCode?: string;
}

export interface DemoLabItem {
  id: string;
  hfrUid: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  stateCode?: string;
  licenseNumber?: string;
}

class LabsService {
  async getCatalog(): Promise<LabTestCatalogItem[]> {
    const res = await fetch(`${API_BASE_URL}/labs/tests/catalog`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to load lab tests');
    return json.data || [];
  }

  async listLabs(): Promise<DemoLabItem[]> {
    const res = await fetch(`${API_BASE_URL}/labs/list`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to load labs');
    return json.data || [];
  }

  async login(hfrUid: string, password: string): Promise<{ token: string; lab: { id: string; hfrUid: string; name: string } }> {
    const res = await fetch(`${API_BASE_URL}/labs/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hfrUid, password })
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Lab login failed');
    return json.data;
  }

  async listConsentedPatients(labId: string): Promise<Array<{ patientId: string; name: string; abhaId?: string }>> {
    const res = await fetch(`${API_BASE_URL}/labs/${labId}/patients`);
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to load lab patients');
    return json.data || [];
  }

  async getOrderedTests(labId: string, userId: string): Promise<Array<{ id: string; testId: string; testName: string; status: string; orderedBy: string; reportId?: string }>> {
    const res = await fetch(`${API_BASE_URL}/labs/${labId}/patient/${userId}/tests`);
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to load tests');
    return json.data || [];
  }

  async addOrderedTest(labId: string, userId: string, payload: { testId: string; testName: string; orderedBy: 'self'|'doctor' }): Promise<string> {
    const res = await fetch(`${API_BASE_URL}/labs/${labId}/patient/${userId}/tests`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to add test');
    return json.data.id as string;
  }

  async updateOrderedTest(labId: string, userId: string, id: string, payload: { status?: 'ordered'|'pending_review'|'completed'; reportId?: string }): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/labs/${labId}/patient/${userId}/tests/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to update test');
  }

  async requestConsent(labId: string, payload: { userId?: string; abhaId?: string }): Promise<{ careTeamId: string }> {
    const res = await fetch(`${API_BASE_URL}/labs/${labId}/consent-requests`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to request consent');
    return { careTeamId: json.data.careTeamId };
  }

  async verifyConsentOtp(labId: string, careTeamId: string, code: string): Promise<{ userId: string }> {
    const res = await fetch(`${API_BASE_URL}/labs/${labId}/consent-requests/${careTeamId}/otp/verify`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code })
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'OTP verification failed');
    return { userId: json.data.userId };
  }

  async createPatientInvite(labId: string, payload: { firstName?: string; lastName?: string; dateOfBirth?: string; phone: string }): Promise<{ inviteId: string; inviteCode: string; otp: string; expiresAt: string }> {
    const res = await fetch(`${API_BASE_URL}/labs/${labId}/patient-invites`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to create invite');
    return json.data;
  }

  async verifyPatientInvite(labId: string, inviteId: string, code: string): Promise<{ userId: string; careTeamId: string }> {
    const res = await fetch(`${API_BASE_URL}/labs/${labId}/patient-invites/${inviteId}/otp/verify`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code })
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Invite verification failed');
    return json.data;
  }

  async cancelConsentRequest(labId: string, careTeamId: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/labs/${labId}/consent-requests/${careTeamId}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to cancel request');
  }
}

const labsService = new LabsService();
export default labsService;


