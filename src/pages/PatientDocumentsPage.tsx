import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import userDocumentService from '@/services/userDocuments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DocItem {
  id: string;
  documentType: string;
  fileName: string;
  createdAt: string;
  status: string;
}

const PatientDocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const docs = await userDocumentService.getUserDocuments(user.id);
        setDocuments(docs);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await userDocumentService.deleteDocument(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (e) {
      // ignore for prototype
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-500" /> Medical Documents
          </CardTitle>
          <CardDescription>Your prescriptions, lab reports, and records</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
              <p className="text-gray-600 mb-4">Upload your first medical document to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{doc.fileName}</p>
                      <p className="text-sm text-gray-600">
                        {doc.documentType} • {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      doc.status === 'processed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {doc.status}
                    </span>
                    <Button variant="outline" size="sm">View</Button>
                    <button className="p-2 rounded-md hover:bg-red-50" title="Delete" onClick={() => handleDelete(doc.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-red-600"><path d="M3 6h18M9 6v12m6-12v12M10 6V4h4v2"/><path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 pt-4 border-t">
            <Link to="/processor">
              <Button className="w-full"><CheckCircle className="mr-2 h-4 w-4"/> Upload New Document</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDocumentsPage;


