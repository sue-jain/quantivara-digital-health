import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlaskConical, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import labsService, { LabTestCatalogItem } from '@/services/labs';

type LabTestStatus = 'ordered' | 'pending_review' | 'completed';
interface LabTestItem {
  testId: string;
  name: string;
  orderedBy: 'self' | 'doctor';
  status: LabTestStatus;
  reportId?: string;
  orderedAt: string;
  updatedAt: string;
}

const PatientLabTestsPage: React.FC = () => {
  const [labTests, setLabTests] = useState<LabTestItem[]>([]);
  const [newTestName, setNewTestName] = useState('');
  const [newTestOrderedBy, setNewTestOrderedBy] = useState<'self'|'doctor'>('self');
  const [catalog, setCatalog] = useState<LabTestCatalogItem[]>([]);
  const [openOrdered, setOpenOrdered] = useState(false);
  const [openPending, setOpenPending] = useState(false);
  const [openCompleted, setOpenCompleted] = useState(false);

  const generateId = () => `T-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const addLabTest = () => {
    if (!newTestName.trim()) return;
    const input = newTestName.trim().toLowerCase();
    const byLoinc = catalog.find(c => (c.loincCode || '').toLowerCase() && input.includes((c.loincCode || '').toLowerCase()));
    const byName = catalog.find(c => (c.name || '').toLowerCase() && input.includes((c.name || '').toLowerCase()));
    const resolvedName = byLoinc ? byLoinc.name : byName ? byName.name : newTestName.trim();
    const now = new Date().toISOString();
    const item: LabTestItem = {
      testId: `TEST-${generateId()}`,
      name: resolvedName,
      orderedBy: newTestOrderedBy,
      status: 'ordered',
      orderedAt: now,
      updatedAt: now,
    };
    setLabTests(prev => [item, ...prev]);
    setNewTestName('');
    setNewTestOrderedBy('self');
  };
  const linkReport = (testId: string, reportId: string) => {
    setLabTests(prev => prev.map(t => t.testId === testId ? { ...t, reportId, updatedAt: new Date().toISOString() } : t));
  };
  const moveStatus = (testId: string, status: LabTestStatus) => {
    setLabTests(prev => prev.map(t => t.testId === testId ? { ...t, status, updatedAt: new Date().toISOString() } : t));
  };

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const data = await labsService.getCatalog();
        setCatalog(data);
      } catch {
        // ignore for prototype
      }
    };
    loadCatalog();
  }, []);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-blue-500" /> Lab Tests
          </CardTitle>
          <CardDescription>Order tests, link reports, and track review status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <div className="relative">
              <input
                type="text"
                value={newTestName}
                onChange={(e)=>setNewTestName(e.target.value)}
                placeholder="Search by test name or LOINC code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                list="lab-tests-catalog"
              />
              <datalist id="lab-tests-catalog">
                {catalog.map((t) => {
                  const combined = `${t.name}${t.loincCode ? ` (${t.loincCode})` : ''}`;
                  return (
                    <option key={`${t.id}-combo`} value={combined} />
                  );
                })}
              </datalist>
            </div>
            <select
              value={newTestOrderedBy}
              onChange={(e)=>setNewTestOrderedBy(e.target.value as 'self'|'doctor')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="self">Ordered by: Patient</option>
              <option value="doctor">Ordered by: Doctor</option>
            </select>
            <Button onClick={addLabTest} style={{ backgroundColor: '#BBF1F1', color: '#374151' }}>Add Test</Button>
          </div>

          {/* Ordered */}
          <Card className="mb-4">
            <CardHeader onClick={() => setOpenOrdered(v=>!v)} className="cursor-pointer">
              <CardTitle className="text-gray-900 text-base">Ordered</CardTitle>
              <CardDescription>Awaiting sample/processing</CardDescription>
            </CardHeader>
            {openOrdered && (
              <CardContent>
                <div className="space-y-3">
                  {labTests.filter(t=>t.status==='ordered').length===0 && (<div className="text-sm text-gray-500">No tests yet</div>)}
                  {labTests.filter(t=>t.status==='ordered').map(t=> (
                    <div key={t.testId} className="p-3 border rounded-md flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{t.name}</div>
                        <div className="text-xs text-gray-600">Test ID: {t.testId}</div>
                        <div className="text-xs text-gray-600">Ordered by: {t.orderedBy}</div>
                      </div>
                      <Button variant="outline" size="sm" onClick={()=> moveStatus(t.testId, 'pending_review')}>Mark Done</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Pending Review */}
          <Card className="mb-4">
            <CardHeader onClick={() => setOpenPending(v=>!v)} className="cursor-pointer">
              <CardTitle className="text-gray-900 text-base">Pending Review</CardTitle>
              <CardDescription>Report uploaded; waiting for doctor review</CardDescription>
            </CardHeader>
            {openPending && (
              <CardContent>
                <div className="space-y-3">
                  {labTests.filter(t=>t.status==='pending_review').length===0 && (<div className="text-sm text-gray-500">Nothing pending</div>)}
                  {labTests.filter(t=>t.status==='pending_review').map(t=> (
                    <div key={t.testId} className="p-3 border rounded-md flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{t.name}</div>
                        <div className="text-xs text-gray-600">Test ID: {t.testId}</div>
                        <div className="text-xs text-gray-600">Report: {t.reportId ? t.reportId : 'Not linked'}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={()=> { const id = prompt('Enter Lab Report ID to link', t.reportId || ''); if (id) linkReport(t.testId, id); }} title="Link Lab Report"><LinkIcon className="h-3 w-3 mr-1"/>Link</Button>
                        <Button variant="outline" size="sm" onClick={()=> moveStatus(t.testId, 'completed')}><CheckCircle2 className="h-3 w-3 mr-1"/>Mark Reviewed</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Completed */}
          <Card>
            <CardHeader onClick={() => setOpenCompleted(v=>!v)} className="cursor-pointer">
              <CardTitle className="text-gray-900 text-base">Completed</CardTitle>
              <CardDescription>Reviewed by doctor and finalized</CardDescription>
            </CardHeader>
            {openCompleted && (
              <CardContent>
                <div className="space-y-3">
                  {labTests.filter(t=>t.status==='completed').length===0 && (<div className="text-sm text-gray-500">No completed tests</div>)}
                  {labTests.filter(t=>t.status==='completed').map(t=> (
                    <div key={t.testId} className="p-3 border rounded-md">
                      <div className="font-medium text-gray-900">{t.name}</div>
                      <div className="text-xs text-gray-600">Test ID: {t.testId}</div>
                      {t.reportId && <div className="text-xs text-gray-600">Report ID: {t.reportId}</div>}
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientLabTestsPage;


