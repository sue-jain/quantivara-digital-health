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
}

const labsService = new LabsService();
export default labsService;


