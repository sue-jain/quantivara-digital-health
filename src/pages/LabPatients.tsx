import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import labsService from '@/services/labs';

interface ConsentedPatient {
  patientId: string;
  name: string;
  abhaId?: string;
}

interface OrderedTest {
  testId: string;
  name: string;
  status: 'ordered' | 'pending_review' | 'completed';
  orderedAt: string;
  updatedAt: string;
}

const LabPatients: React.FC = () => {
  const [patients, setPatients] = useState<ConsentedPatient[]>([]);
  const [activePatientId, setActivePatientId] = useState<string>('');
  const [tests, setTests] = useState<OrderedTest[]>([]);
  const [labId, setLabId] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        const labRaw = localStorage.getItem('lab_info');
        if (!labRaw) return;
        const lab = JSON.parse(labRaw);
        setLabId(lab.id);
        const list = await labsService.listConsentedPatients(lab.id);
        setPatients(list);
      } catch {}
    };
    load();
  }, []);

  useEffect(() => {
    const fetchTests = async () => {
      if (!labId || !activePatientId) { setTests([]); return; }
      try {
        const rows = await labsService.getOrderedTests(labId, activePatientId);
        const mapped: OrderedTest[] = rows.map((r: any) => ({
          testId: r.id,
          name: r.testName || r.test_name || 'Test',
          status: r.status,
          orderedAt: r.created_at,
          updatedAt: r.updated_at,
        }));
        setTests(mapped);
      } catch {
        setTests([]);
      }
    };
    fetchTests();
  }, [labId, activePatientId]);

  const reload = async () => {
    if (!labId || !activePatientId) return;
    const rows = await labsService.getOrderedTests(labId, activePatientId);
    const mapped: OrderedTest[] = rows.map((r: any) => ({
      testId: r.id,
      name: r.testName || r.test_name || 'Test',
      status: r.status,
      orderedAt: r.created_at,
      updatedAt: r.updated_at,
    }));
    setTests(mapped);
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Patients</CardTitle>
          <CardDescription>Consented patients and ordered tests only</CardDescription>
        </CardHeader>
        <CardContent>
          {patients.length === 0 ? (
            <div className="text-sm text-gray-600">No consented patients yet.</div>
          ) : (
            <div className="space-y-3">
              <div>
                <select className="w-full md:w-80 px-3 py-2 border border-gray-300 rounded-md" value={activePatientId} onChange={(e)=> setActivePatientId(e.target.value)}>
                  <option value="">Select patient…</option>
                  {patients.map(p => (<option key={p.patientId} value={p.patientId}>{p.name}{p.abhaId ? ` (${p.abhaId})` : ''}</option>))}
                </select>
              </div>

              {!activePatientId ? (
                <div className="text-sm text-gray-600">Select a patient to view ordered tests.</div>
              ) : (
                <div className="space-y-2">
                  {tests.filter(t=>t.status==='ordered').length===0 && (<div className="text-sm text-gray-600">No ordered tests.</div>)}
                  {tests.filter(t=>t.status==='ordered').map(t => (
                    <div key={t.testId} className="p-3 border rounded-md flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{t.name}</div>
                        <div className="text-xs text-gray-600">Test ID: {t.testId} • Ordered: {new Date(t.orderedAt).toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={async ()=>{ const id = prompt('Enter Report ID'); if (!id) return; await labsService.updateOrderedTest(labId, activePatientId, t.testId, { reportId: id, status: 'pending_review' }); await reload(); }}>Upload Report</Button>
                        <Button variant="outline" size="sm" onClick={async ()=>{ await labsService.updateOrderedTest(labId, activePatientId, t.testId, { status: 'pending_review' }); await reload(); }}>Mark Ready</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LabPatients;


