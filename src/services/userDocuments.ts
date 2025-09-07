import { API_BASE_URL } from '@/config/api';

export interface UserDocument {
  id: string;
  documentType: string;
  fileName: string;
  status: string;
  extractionAccuracy: number;
  createdAt: string;
  content: any;
  metadata: any;
}

export interface UserDocumentUploadData {
  file: File;
  userId: string;
  documentType?: string;
}

export interface UserDocumentResponse {
  success: boolean;
  data: {
    documentId: string;
    userId: string;
    abhaId: string | null;
    documentType: string;
    extractedData: any;
    extractionAccuracy: number;
    fileName: string;
    userInfo: {
      username: string;
      firstName: string;
      lastName: string;
    };
  };
}

class UserDocumentService {
  private baseUrl = `${API_BASE_URL}/user-documents`;

  async uploadDocument(data: UserDocumentUploadData): Promise<UserDocumentResponse> {
    const formData = new FormData();
    formData.append('document', data.file);
    formData.append('userId', data.userId);
    if (data.documentType) {
      formData.append('documentType', data.documentType);
    }

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload document');
    }

    return response.json();
  }

  async getUserDocuments(userId: string): Promise<UserDocument[]> {
    const response = await fetch(`${this.baseUrl}/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch documents');
    }

    const result = await response.json();
    return result.data.documents;
  }

  async deleteDocument(documentId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to delete document');
    }
  }

  getDocumentFileUrl(documentId: string): string {
    return `${this.baseUrl}/${documentId}/file`;
  }

  async getConsolidatedInsights(userId: string): Promise<{
    diagnoses: Array<{ sourceId: string; text: string; date?: string }>,
    medications: Array<{ sourceId: string; name: string; dosage?: string; frequency?: string; duration?: string; instructions?: string }>,
    labResults: Array<{ sourceId: string; name: string; value?: string; unit?: string; status?: string; critical?: boolean }>,
    advice: Array<{ sourceId: string; text: string }>,
    latestUpdatedAt: string | null
  }> {
    const res = await fetch(`${this.baseUrl}/${userId}/insights`, { method: 'GET' });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to fetch insights');
    return json.data;
  }

  detectDocumentType(fileName: string): string {
    const lowerName = fileName.toLowerCase();
    
    if (lowerName.includes('prescription') || lowerName.includes('rx')) {
      return 'Prescription';
    } else if (lowerName.includes('lab') || lowerName.includes('test') || lowerName.includes('report')) {
      return 'Lab Report';
    } else if (lowerName.includes('ecg') || lowerName.includes('ekg')) {
      return 'ECG Report';
    } else if (lowerName.includes('xray') || lowerName.includes('x-ray')) {
      return 'X-Ray Report';
    } else if (lowerName.includes('discharge')) {
      return 'Discharge Summary';
    } else if (lowerName.includes('ayurveda') || lowerName.includes('ayush')) {
      return 'AYUSH Prescription';
    }
    
    return 'Medical Document';
  }
}

export default new UserDocumentService();
