import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import doctorService, { DoctorPatient } from '@/services/doctor';
import DoctorVoiceDiagnosis from '@/components/doctor/DoctorVoiceDiagnosis';

const DoctorPatients: React.FC = () => {
  const { user, userType } = useAuth();
  const [activeTab, setActiveTab] = useState<'lookup' | 'abha' | 'voice'>('lookup');
  const [patients, setPatients] = useState<DoctorPatient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [aadhar, setAadhar] = useState('');
  const [abhaLookupResult, setAbhaLookupResult] = useState<any | null>(null);
  const [abhaError, setAbhaError] = useState<string | null>(null);
  const [consentOpen, setConsentOpen] = useState(false);
  const [consentScopes, setConsentScopes] = useState({ labReports: true, prescriptions: true, pastHistory: false });
  const [summary, setSummary] = useState<any | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user || userType !== 'doctor') return;
      try {
        const approved = await doctorService.getPatients(user.id, 'approved');
        setPatients(approved);
        if (approved.length > 0) setSelectedPatientId(approved[0].patientId);
      } catch (e) {}
    };
    load();
  }, [user, userType]);

  const doSearch = async () => {
    if (!user || !q.trim()) return;
    setLoading(true);
    try {
      const data = await doctorService.searchPatients(user.id, q.trim());
      setResults(data);
    } finally {
      setLoading(false);
    }
  };

  const requestConsent = async () => {
    if (!user || !selectedPatientId) return;
    try {
      await doctorService.requestConsent(user.id, selectedPatientId, consentScopes);
      setConsentOpen(false);
    } catch (e) {
      // no-op for prototype
    }
  };

  const handleView = async (patientId: string) => {
    if (!user) return;
    setSelectedPatientId(patientId);
    setSummaryLoading(true);
    setSummaryError(null);
    setSummary(null);
    try {
      const s = await doctorService.getPatientSummary(user.id, patientId);
      setSummary(s);
      if (s.consentStatus !== 'approved') {
        // prompt to request consent if not yet approved
        setConsentOpen(true);
      }
    } catch (e: any) {
      setSummaryError(e.message || 'Failed to load summary');
    } finally {
      setSummaryLoading(false);
    }
  };

  const doAbhaLookup = async () => {
    setAbhaError(null);
    setAbhaLookupResult(null);
    try {
      const res = await fetch(`${import.meta.env.MODE === 'production' ? '/api/v1' : 'http://localhost:3001/api/v1'}/abha/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadharId: aadhar.trim() })
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Lookup failed');
      setAbhaLookupResult(json.data);
    } catch (e: any) {
      setAbhaError(e.message || 'Failed to lookup ABHA');
    }
  };

  if (!user || userType !== 'doctor') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Access Denied</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <div>
            <select
              className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
            >
              {patients.map(p => (
                <option key={p.relationshipId} value={p.patientId}>
                  {p.firstName} {p.lastName}{p.abhaId ? ` (ABHA: ${p.abhaId})` : ''}
                </option>
              ))}
              {patients.length === 0 && <option value="">No consented patients</option>}
            </select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
          <TabsList>
            <TabsTrigger value="lookup">Lookup</TabsTrigger>
            <TabsTrigger value="abha">ABHA ID</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger>
          </TabsList>

          <TabsContent value="lookup" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Lookup</CardTitle>
                <CardDescription>Search by name, phone, username, or ABHA</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <Label className="text-sm">Search</Label>
                    <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Priya, 98765, ramesh_kumar, 1234..." />
                  </div>
                  <Button onClick={doSearch} style={{ backgroundColor: '#BBF1F1', color: '#374151' }}>{loading ? 'Searching...' : 'Search'}</Button>
                </div>

                <div className="mt-4 space-y-2">
                  {results.map((r, idx) => (
                    <div key={idx} className="p-3 border rounded-md flex items-center justify-between">
                      <div>
                        <div className="font-medium">{r.firstName} {r.lastName}</div>
                        <div className="text-xs text-gray-600">{r.username} • {r.phone}</div>
                        {r.abhaId && <div className="text-xs text-gray-600">ABHA: {r.abhaId}</div>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={async () => {
                          if (!user) return;
                          setSelectedPatientId(r.patientId);
                          setSummaryLoading(true);
                          setSummaryError(null);
                          setSummary(null);
                          try {
                            const s = await doctorService.getPatientSummary(user.id, r.patientId);
                            setSummary(s);
                            if (s.consentStatus !== 'approved') {
                              setConsentOpen(true);
                            }
                          } catch (e: any) {
                            setSummaryError(e.message || 'Failed to load summary');
                          } finally {
                            setSummaryLoading(false);
                          }
                        }}>View</Button>
                        <Button variant="outline" onClick={() => { setSelectedPatientId(r.patientId); setConsentOpen(true); }}>Request Consent</Button>
                      </div>
                    </div>
                  ))}
                  {results.length === 0 && <div className="text-sm text-gray-500">No results</div>}
                </div>

                {summaryLoading && <div className="mt-4 text-sm text-gray-600">Loading summary…</div>}
                {summaryError && <div className="mt-2 text-sm text-red-600">{summaryError}</div>}
                {summary && (
                  <div className="mt-4 p-4 border rounded-md">
                    <div className="font-medium text-gray-900 mb-2">Patient: {summary.name}</div>
                    {summary.consentStatus !== 'approved' ? (
                      <div className="text-sm text-gray-600">No consent. Request consent to view details.</div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium">Lab Reports {summary.allowed.labReports ? '' : '(not permitted)'}</div>
                          {summary.allowed.labReports ? (
                            <div className="text-xs text-gray-600">No lab data (demo placeholder)</div>
                          ) : null}
                        </div>
                        <div>
                          <div className="text-sm font-medium">Prescriptions {summary.allowed.prescriptions ? '' : '(not permitted)'}</div>
                          {summary.allowed.prescriptions ? (
                            <div className="text-xs text-gray-600">No prescription data (demo placeholder)</div>
                          ) : null}
                        </div>
                        <div>
                          <div className="text-sm font-medium">Past History {summary.allowed.pastHistory ? '' : '(not permitted)'}</div>
                          {summary.allowed.pastHistory ? (
                            <div className="text-xs text-gray-600">No past history data (demo placeholder)</div>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {consentOpen && (
                  <div className="mt-4 p-4 border rounded-md bg-gray-50">
                    <div className="font-medium mb-2">Request Consent Scopes</div>
                    <div className="space-y-2 mb-3">
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={consentScopes.labReports} onChange={(e)=>setConsentScopes(prev=>({...prev, labReports: e.target.checked}))}/> Lab reports</label>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={consentScopes.prescriptions} onChange={(e)=>setConsentScopes(prev=>({...prev, prescriptions: e.target.checked}))}/> Prescriptions</label>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={consentScopes.pastHistory} onChange={(e)=>setConsentScopes(prev=>({...prev, pastHistory: e.target.checked}))}/> Past history</label>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={requestConsent} style={{ backgroundColor: '#BBF1F1', color: '#374151' }}>Send Request</Button>
                      <Button variant="outline" onClick={()=>setConsentOpen(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="abha" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>ABHA ID Lookup / Create</CardTitle>
                <CardDescription>Use Aadhar to retrieve or create ABHA ID</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <Label className="text-sm">Aadhar ID</Label>
                    <Input value={aadhar} onChange={(e) => setAadhar(e.target.value)} placeholder="12-digit Aadhar" />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={doAbhaLookup} style={{ backgroundColor: '#BBF1F1', color: '#374151' }}>Lookup</Button>
                  </div>
                </div>
                {abhaError && <div className="text-sm text-red-600 mt-2">{abhaError}</div>}
                {abhaLookupResult && (
                  <div className="mt-3 p-3 border rounded-md">
                    <div className="font-medium">Result</div>
                    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(abhaLookupResult, null, 2)}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voice" className="mt-4">
            <DoctorVoiceDiagnosis doctorId={user.id} patientId={selectedPatientId || null} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorPatients;


