import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import userDocumentService from '@/services/userDocuments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface DocItem {
  id: string;
  documentType: string;
  fileName: string;
  createdAt: string;
  status: string;
  extractionAccuracy?: number;
  content?: any;
  metadata?: any;
}

const PatientDocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [expandedInsightDocId, setExpandedInsightDocId] = useState<string | null>(null);
  const [highlightDocId, setHighlightDocId] = useState<string | null>(null);

  const getDisplayName = (name: string) => name.replace(/\.[^./\\]+$/, '');

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const docs = await userDocumentService.getUserDocuments(user.id);
        setDocuments(docs as any);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  // Handle jump to a specific document via query param docId
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const target = params.get('docId');
    if (target) {
      setSelectedDocId(target);
      setExpandedInsightDocId(null);
      setHighlightDocId(target);
      window.setTimeout(() => setHighlightDocId(null), 1200);
    }
  }, [location.search]);

  const handleDelete = async (id: string) => {
    try {
      await userDocumentService.deleteDocument(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
      if (selectedDocId === id) setSelectedDocId(null);
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
                <div key={doc.id} className={`p-3 border rounded-lg hover:bg-gray-50 transition-colors ${highlightDocId === doc.id ? 'ring-2 ring-yellow-300 bg-yellow-50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{getDisplayName(doc.fileName)}</p>
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
                      <Button variant="outline" size="sm" onClick={() => setSelectedDocId(prev => prev === doc.id ? null : doc.id)}>View</Button>
                      <Button variant="outline" size="sm" onClick={() => setExpandedInsightDocId(prev => prev === doc.id ? null : doc.id)}>AI Insights</Button>
                      <button className="p-2 rounded-md hover:bg-red-50" title="Delete" onClick={() => handleDelete(doc.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-red-600"><path d="M3 6h18M9 6v12m6-12v12M10 6V4h4v2"/><path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14"/></svg>
                      </button>
                    </div>
                  </div>

                  {selectedDocId === doc.id && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <div className="text-sm text-gray-700 mb-2">Document Preview</div>
                      <div className="text-xs text-gray-600 mb-2">
                        <div><span className="font-medium">Type:</span> {doc.documentType}</div>
                        {doc.extractionAccuracy !== undefined && (
                          <div><span className="font-medium">Extraction Accuracy:</span> {doc.extractionAccuracy}%</div>
                        )}
                        {doc.metadata?.fileSize && (
                          <div><span className="font-medium">Size:</span> {(doc.metadata.fileSize/1024).toFixed(1)} KB</div>
                        )}
                      </div>
                      {doc.id && (
                        <div className="border rounded bg-white">
                          <iframe title="doc-viewer" src={userDocumentService.getDocumentFileUrl(doc.id)} className="w-full h-96" />
                        </div>
                      )}
                    </div>
                  )}

                  {expandedInsightDocId === doc.id && (
                    <div className="mt-3 p-3 bg-white border rounded-md">
                      <div className="text-sm font-medium text-gray-900 mb-2">AI Insights (from this document)</div>
                      {doc.content ? (
                        <div className="space-y-2 text-sm text-gray-700">
                          {Array.isArray(doc.content?.diagnosis) && doc.content.diagnosis.length > 0 && (
                            <div>
                              <div className="font-semibold mb-1">Diagnoses</div>
                              <ul className="list-disc ml-5">
                                {doc.content.diagnosis.map((d: string, idx: number) => (<li key={idx}>{d}</li>))}
                              </ul>
                            </div>
                          )}
                          {Array.isArray(doc.content?.medications) && doc.content.medications.length > 0 && (
                            <div>
                              <div className="font-semibold mb-1">Medications</div>
                              <ul className="list-disc ml-5">
                                {doc.content.medications.map((m: any, idx: number) => (<li key={idx}>{m.name} {m.dosage ? `- ${m.dosage}`: ''} {m.frequency ? `(${m.frequency})` : ''}</li>))}
                              </ul>
                            </div>
                          )}
                          {Array.isArray(doc.content?.tests) && doc.content.tests.length > 0 && (
                            <div>
                              <div className="font-semibold mb-1">Lab Results</div>
                              <ul className="list-disc ml-5">
                                {doc.content.tests.map((t: any, idx: number) => (<li key={idx}>{t.name}: {t.value}{t.unit ? ` ${t.unit}` : ''} {t.status ? `(${t.status})` : ''}</li>))}
                              </ul>
                            </div>
                          )}
                          {Array.isArray(doc.content?.advice) && doc.content.advice.length > 0 && (
                            <div>
                              <div className="font-semibold mb-1">Advice</div>
                              <ul className="list-disc ml-5">
                                {doc.content.advice.map((a: string, idx: number) => (<li key={idx}>{a}</li>))}
                              </ul>
                            </div>
                          )}
                          {!doc.content?.diagnosis && !doc.content?.medications && !doc.content?.tests && (
                            <div className="text-sm text-gray-600">No structured insights extracted.</div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600">No extracted content found.</div>
                      )}
                    </div>
                  )}
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


