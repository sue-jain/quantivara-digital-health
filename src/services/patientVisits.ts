const API_BASE_URL = import.meta.env.MODE === 'production' ? '/api/v1' : 'http://localhost:3001/api/v1';

export interface PatientVisit {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  hospitalName?: string;
  date: string;
  type: string;
  chiefComplaint?: string;
  diagnosis?: string;
  treatmentPlan?: string;
  status: 'upcoming' | 'completed';
  notes?: string;
  createdAt: string;
}

class PatientVisitsService {
  async getVisits(patientId: string): Promise<PatientVisit[]> {
    const res = await fetch(`${API_BASE_URL}/patients/${patientId}/visits`);
    if (!res.ok) throw new Error('Failed to fetch patient visits');
    const json = await res.json();
    return json.data as PatientVisit[];
  }
}

const patientVisitsService = new PatientVisitsService();
export default patientVisitsService;
