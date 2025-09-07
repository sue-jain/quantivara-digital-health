import { API_BASE_URL } from '@/config/api';

export interface LabTestCatalogItem {
  id: string;
  name: string;
  loincCode?: string;
}

class LabsService {
  async getCatalog(): Promise<LabTestCatalogItem[]> {
    const res = await fetch(`${API_BASE_URL}/labs/tests/catalog`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to load lab tests');
    return json.data || [];
  }
}

const labsService = new LabsService();
export default labsService;


