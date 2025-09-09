import React, { useEffect, useState } from 'react';
// import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import doctorService, { DoctorPatient } from '@/services/doctor';
import userDocumentService from '@/services/userDocuments';
import patientCareTeamService from '@/services/patientCareTeam';
import DoctorVoiceDiagnosis from '@/components/doctor/DoctorVoiceDiagnosis';
import patientService from '@/services/patients';
import labsService from '@/services/labs';

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
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  type LabTestStatus = 'ordered' | 'pending_review' | 'completed';
  interface LabTestItem { testId: string; name: string; status: LabTestStatus; reportId?: string; orderedAt: string; updatedAt: string; orderedBy: 'self' | 'doctor'; }
  const [labTests, setLabTests] = useState<LabTestItem[]>([]);
  const [openOrdered, setOpenOrdered] = useState(true);
  const [openPending, setOpenPending] = useState(false);
  const [openCompleted, setOpenCompleted] = useState(false);
  const [consentedQuery, setConsentedQuery] = useState('');
  const [showConsentedDropdown, setShowConsentedDropdown] = useState(false);
  const [abhaSearch, setAbhaSearch] = useState('');
  const [lookupFirstName, setLookupFirstName] = useState('');
  const [lookupLastName, setLookupLastName] = useState('');
  const [lookupDob, setLookupDob] = useState('');
  const [lookupResult, setLookupResult] = useState<{ name: string; abhaId: string; consented: boolean; patientId?: string } | null>(null);
  // Consultation state
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const [diagText, setDiagText] = useState('');
  const [medsText, setMedsText] = useState('');
  const [savingConsult, setSavingConsult] = useState(false);
  // Test catalog for adding ordered tests (as doctor)
  const [catalog, setCatalog] = useState<Array<{ id: string; name: string; loincCode?: string }>>([]);
  const [testQuery, setTestQuery] = useState('');
  const [addingTest, setAddingTest] = useState(false);
  const [testAddError, setTestAddError] = useState<string | null>(null);
  // Invite state (doctor-initiated)
  const [inviteFirstName, setInviteFirstName] = useState('');
  const [inviteLastName, setInviteLastName] = useState('');
  const [inviteDob, setInviteDob] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteId, setInviteId] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [inviteOtp, setInviteOtp] = useState<string | null>(null);
  const [inviteOtpValue, setInviteOtpValue] = useState('');
  const [inviteVerifying, setInviteVerifying] = useState(false);
  const [inviteVerified, setInviteVerified] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

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
      // Load lab tests for the selected patient
      try {
        const rows = await patientCareTeamService.listPatientOrderedTests(patientId);
        const mapped: LabTestItem[] = rows.map((r: any) => ({
          testId: r.id,
          name: r.testName,
          status: (r.status as LabTestStatus) || 'ordered',
          reportId: r.reportId,
          orderedAt: r.createdAt,
          updatedAt: r.updatedAt || r.createdAt,
          orderedBy: (r.orderedBy as 'self'|'doctor') || 'self',
        }));
        setLabTests(mapped);
      } catch {}
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

  const markReviewed = async (testId: string) => {
    if (!selectedPatientId) return;
    try {
      await patientCareTeamService.updatePatientOrderedTest(selectedPatientId, testId, { status: 'completed' });
      setLabTests(prev => prev.map(t => t.testId === testId ? { ...t, status: 'completed', updatedAt: new Date().toISOString() } : t));
    } catch {}
  };

  useEffect(() => {
    // load lab tests catalog for test suggestions
    (async () => {
      try {
        const items = await labsService.getCatalog();
        setCatalog(items || []);
      } catch {}
    })();
  }, []);

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Patients</h1>

        {/* Patient Tools card (mirrors Lab Patients) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Patient Tools</CardTitle>
            <CardDescription>Consented list and lookups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consented Patients</label>
                  <div className="relative w-full md:w-80">
                    <input
                      value={consentedQuery}
                      onChange={(e)=> { setConsentedQuery(e.target.value); setShowConsentedDropdown(true); }}
                      onFocus={()=> setShowConsentedDropdown(true)}
                      placeholder="Search by name or ABHA"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600" onMouseDown={(e)=>{ e.preventDefault(); setShowConsentedDropdown(v=>!v); }}>▾</button>
                    {showConsentedDropdown && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-56 overflow-auto" onMouseDown={(e)=> e.preventDefault()}>
                        {(patients.filter(p => {
                          const q = consentedQuery.trim().toLowerCase();
                          if (!q) return true;
                          const name = `${p.firstName || ''} ${p.lastName || ''}`.trim().toLowerCase();
                          return (name.includes(q) || (p.abhaId || '').toLowerCase().includes(q));
                        })).map(p => (
                          <div key={p.relationshipId} className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer" onClick={()=>{ setSelectedPatientId(p.patientId); setConsentedQuery(`${p.firstName} ${p.lastName}${p.abhaId ? ` (${p.abhaId})` : ''}`); setShowConsentedDropdown(false); handleView(p.patientId); }}>
                            <div className="font-medium">{p.firstName} {p.lastName}</div>
                            <div className="text-xs text-gray-500">{p.abhaId || 'No ABHA'}</div>
                          </div>
                        ))}
                        {patients.filter(p => {
                          const q = consentedQuery.trim().toLowerCase();
                          if (!q) return true;
                          const name = `${p.firstName || ''} ${p.lastName || ''}`.trim().toLowerCase();
                          return (name.includes(q) || (p.abhaId || '').toLowerCase().includes(q));
                        }).length === 0 && (
                          <div className="px-3 py-2 text-sm text-gray-500">No matches</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {!selectedPatientId && (
                  <div className="text-xs text-gray-600">Select a consented patient to view the profile below.</div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lookup by ABHA ID</label>
                  <div className="flex gap-2 items-stretch min-w-0">
                    <input value={abhaSearch} onChange={(e)=>setAbhaSearch(e.target.value)} placeholder="14-digit ABHA ID" className="flex-1 min-w-0 px-3 py-2 h-10 border border-gray-300 rounded-md" />
                    <Button className="h-10 shrink-0" variant="outline" onClick={async()=>{
                      if (!user) return;
                      const normalized = abhaSearch.replace(/\D/g, '');
                      if (!normalized) return;
                      setLoading(true);
                      try {
                        const list = await doctorService.searchPatients(user.id, normalized);
                        setResults(list);
                      } finally { setLoading(false); }
                    }}>Search</Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lookup by Patient Details</label>
                  <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-2 items-stretch min-w-0">
                    <input value={lookupFirstName} onChange={(e)=>setLookupFirstName(e.target.value)} placeholder="First name" className="w-full min-w-0 h-10 px-3 py-2 border border-gray-300 rounded-md" />
                    <input value={lookupLastName} onChange={(e)=>setLookupLastName(e.target.value)} placeholder="Last name" className="w-full min-w-0 h-10 px-3 py-2 border border-gray-300 rounded-md" />
                    <input value={lookupDob} onChange={(e)=>setLookupDob(e.target.value)} type="date" className="w-full min-w-0 h-10 px-3 py-2 border border-gray-300 rounded-md" />
                    <Button variant="outline" className="h-10 shrink-0" onClick={async()=>{
                      if (!lookupFirstName.trim() || !lookupLastName.trim() || !lookupDob || !user) return;
                      try {
                        const res = await patientService.lookupAbhaIdByNameAndDOB(lookupFirstName, lookupLastName, lookupDob);
                        setLookupResult({ name: `${lookupFirstName} ${lookupLastName}`, abhaId: (res as any).abhaId, consented: false });
                        const found = await doctorService.searchPatients(user.id, (res as any).abhaId);
                        setResults(found);
                      } catch {
                        setLookupResult(null);
                        setResults([]);
                      }
                    }}>Search</Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Create new patient (Invite)</label>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    <input value={inviteFirstName} onChange={(e)=>setInviteFirstName(e.target.value)} placeholder="First name" className="px-3 py-2 border border-gray-300 rounded-md" />
                    <input value={inviteLastName} onChange={(e)=>setInviteLastName(e.target.value)} placeholder="Last name" className="px-3 py-2 border border-gray-300 rounded-md" />
                    <input value={inviteDob} onChange={(e)=>setInviteDob(e.target.value)} type="date" className="px-3 py-2 border border-gray-300 rounded-md" />
                    <input value={invitePhone} onChange={(e)=>setInvitePhone(e.target.value)} placeholder="Mobile number" className="px-3 py-2 border border-gray-300 rounded-md" />
                    <Button variant="outline" onClick={async()=>{
                      if (!user) return;
                      try {
                        const data = await doctorService.createPatientInvite(user.id, { firstName: inviteFirstName, lastName: inviteLastName, dateOfBirth: inviteDob, phone: invitePhone });
                        setInviteId(data.inviteId);
                        setInviteCode(data.inviteCode);
                        setInviteOtp(data.otp);
                        setInviteVerified(false);
                        setInviteError(null);
                      } catch (e:any) {
                        setInviteError(e?.message || 'Failed to create invite');
                      }
                    }}>Send invite</Button>
                  </div>
                  {inviteId && (
                    <div className="mt-2 text-xs text-gray-600">Invite Code: <span className="font-mono text-gray-800">{inviteCode}</span> • OTP: <span className="font-mono text-gray-800">{inviteOtp}</span> {inviteVerified && <span className="text-green-700 ml-2">Verified</span>}</div>
                  )}
                  {inviteId && (
                    <div className="mt-2 flex items-center gap-2">
                      <input type="password" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={inviteOtpValue} onChange={(e)=> setInviteOtpValue(e.target.value)} placeholder="******" className="px-3 py-2 border border-gray-300 rounded-md w-32 tracking-widest" />
                      <Button size="sm" disabled={inviteVerifying || inviteOtpValue.length !== 6} onClick={async()=>{
                        if (!user || !inviteId) return;
                        try {
                          setInviteVerifying(true);
                          setInviteError(null);
                          const res = await doctorService.verifyPatientInvite(user.id, inviteId, inviteOtpValue);
                          setInviteVerified(true);
                          setSelectedPatientId(res.userId);
                          await handleView(res.userId);
                        } catch (e:any) {
                          setInviteError(e?.message || 'Invalid or expired OTP.');
                        } finally {
                          setInviteVerifying(false);
                        }
                      }}>{inviteVerifying ? 'Verifying…' : 'Verify Invite'}</Button>
                    </div>
                  )}
                  {inviteError && <div className="text-xs text-red-600 mt-1">{inviteError}</div>}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="mt-4 space-y-2">
              {results.map((r, idx) => (
                <div key={idx} className="p-3 border rounded-md flex items-center justify-between">
                  <div>
                    <div className="font-medium">{r.firstName} {r.lastName}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={()=> handleView(r.patientId)}>View</Button>
                    <Button variant="outline" onClick={()=> { setSelectedPatientId(r.patientId); setConsentOpen(true); }}>Request Consent</Button>
                  </div>
                </div>
              ))}
              {results.length === 0 && <div className="text-sm text-gray-500">No results</div>}
            </div>

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

        {/* Bottom Patient Profile */}
        {summaryLoading && <div className="mt-4 text-sm text-gray-600">Loading summary…</div>}
        {summaryError && <div className="mt-2 text-sm text-red-600">{summaryError}</div>}
        {summary && (
          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Patient Profile • {summary.name}</CardTitle>
                <CardDescription>Details and labs</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Tabs: Show Current Consultation always; other tabs require consent */}
                <Tabs defaultValue={summary.consentStatus !== 'approved' ? 'consult' : 'critical'} className="w-full">
                  <TabsList>
                    {summary.consentStatus === 'approved' && (
                      <>
                        <TabsTrigger value="critical">Critical</TabsTrigger>
                        <TabsTrigger value="ai">AI Insights</TabsTrigger>
                        <TabsTrigger value="labs">Lab Tests</TabsTrigger>
                      </>
                    )}
                    <TabsTrigger value="consult">Current Consultation</TabsTrigger>
                  </TabsList>
                  {summary.consentStatus === 'approved' && (
                    <TabsContent value="critical" className="mt-4">
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium">Medical Conditions</div>
                          <div className="text-xs text-gray-600">Hidden by default (demo)</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Allergies</div>
                          <div className="text-xs text-gray-600">Hidden by default (demo)</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Emergency Contact</div>
                          <div className="text-xs text-gray-600">Spouse: +91-98xxxxxxx</div>
                        </div>
                        <div className="pt-3 border-t">
                          <div className="text-sm font-medium mb-2">Upload Document to Patient</div>
                          <div className="flex items-center gap-2">
                            <input type="file" onChange={(e)=> setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)} />
                            <Button variant="outline" disabled={!file || uploading} onClick={async ()=>{
                              if (!user || !selectedPatientId || !file) return;
                              try {
                                setUploading(true);
                                await userDocumentService.uploadDocument({ file, userId: selectedPatientId });
                                setFile(null);
                              } finally { setUploading(false); }
                            }}>{uploading ? 'Uploading...' : 'Upload'}</Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  )}
                  {summary.consentStatus === 'approved' && (
                    <TabsContent value="ai" className="mt-4">
                      <div className="text-sm text-gray-600">Consolidated AI insights (demo)</div>
                    </TabsContent>
                  )}
                  {summary.consentStatus === 'approved' && (
                    <TabsContent value="labs" className="mt-4 space-y-4">
                      {/* Add Lab Test */}
                      <div className="p-3 border rounded-md">
                        <div className="text-sm font-medium text-gray-900 mb-2">Add Lab Test (Ordered)</div>
                        <div className="flex items-stretch gap-2">
                          <input value={testQuery} onChange={(e)=> { setTestQuery(e.target.value); setTestAddError(null); }} placeholder="Search by name or LOINC (e.g., HbA1c or 4548-4)" className="flex-1 px-3 py-2 border border-gray-300 rounded-md" />
                          <Button variant="outline" disabled={!selectedPatientId || !testQuery.trim() || addingTest} onClick={async()=>{
                            if (!user || !selectedPatientId) return;
                            const q = testQuery.trim().toLowerCase();
                            let match = catalog.find(t => (t.name||'').toLowerCase()===q || (t.loincCode||'').toLowerCase()===q) || null;
                            if (!match) {
                              const paren = testQuery.match(/\(([^)]+)\)\s*$/);
                              if (paren && paren[1]) match = catalog.find(t => (t.loincCode||'').toLowerCase() === paren[1].trim().toLowerCase()) || null;
                            }
                            if (!match) {
                              const candidates = catalog.filter(t => (t.name||'').toLowerCase().includes(q) || (t.loincCode||'').toLowerCase().includes(q));
                              if (candidates.length === 1) match = candidates[0];
                            }
                            if (!match) { setTestAddError('Select a valid test'); return; }
                            try {
                              setAddingTest(true);
                              const labId = 'DOCTOR';
                              await fetch(`${import.meta.env.MODE === 'production' ? '/api/v1' : 'http://localhost:3001/api/v1'}/labs/${labId}/patient/${selectedPatientId}/tests`, {
                                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ testId: match.id, testName: match.name + (match.loincCode ? ` (${match.loincCode})` : ''), orderedBy: 'doctor' })
                              });
                              setTestQuery(''); setTestAddError(null);
                              const rows = await labsService.getOrderedTests(labId, selectedPatientId);
                              const mapped: any[] = rows.map((r: any) => ({ testId: r.id, name: r.testName || r.test_name || 'Test', status: r.status, orderedAt: r.created_at, updatedAt: r.updated_at }));
                              setLabTests(mapped as any);
                            } finally { setAddingTest(false); }
                          }}>{addingTest ? 'Adding…' : 'Add'}</Button>
                        </div>
                        {testAddError && <div className="text-xs text-red-600 mt-1">{testAddError}</div>}
                      </div>
                      <div className="space-y-6">
                        <Card>
                          <CardHeader onClick={()=> setOpenOrdered(v=>!v)} className="cursor-pointer">
                            <CardTitle className="text-gray-900 text-base">Ordered</CardTitle>
                            <CardDescription>Awaiting processing</CardDescription>
                          </CardHeader>
                          {openOrdered && (
                            <CardContent>
                              <div className="space-y-3">
                                {labTests.filter(t=>t.status==='ordered').length===0 && (<div className="text-sm text-gray-500">No ordered tests</div>)}
                                {labTests.filter(t=>t.status==='ordered').map(t => (
                                  <div key={t.testId} className="p-3 border rounded-md">
                                    <div className="font-medium text-gray-900">{t.name}</div>
                                    <div className="text-xs text-gray-600">Test ID: {t.testId}</div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          )}
                        </Card>
                        <Card>
                          <CardHeader onClick={()=> setOpenPending(v=>!v)} className="cursor-pointer">
                            <CardTitle className="text-gray-900 text-base">Pending Review</CardTitle>
                            <CardDescription>Report uploaded; doctor to review</CardDescription>
                          </CardHeader>
                          {openPending && (
                            <CardContent>
                              <div className="space-y-3">
                                {labTests.filter(t=>t.status==='pending_review').length===0 && (<div className="text-sm text-gray-500">Nothing pending</div>)}
                                {labTests.filter(t=>t.status==='pending_review').map(t => (
                                  <div key={t.testId} className="p-3 border rounded-md flex items-center justify-between">
                                    <div>
                                      <div className="font-medium text-gray-900">{t.name}</div>
                                      <div className="text-xs text-gray-600">Test ID: {t.testId}</div>
                                      <div className="text-xs text-gray-600">Report: {t.reportId || 'Not linked'}</div>
                                    </div>
                                    <div>
                                      <Button variant="outline" size="sm" onClick={()=> markReviewed(t.testId)}>Mark Reviewed</Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          )}
                        </Card>
                        <Card>
                          <CardHeader onClick={()=> setOpenCompleted(v=>!v)} className="cursor-pointer">
                            <CardTitle className="text-gray-900 text-base">Completed</CardTitle>
                            <CardDescription>Reviewed and finalized</CardDescription>
                          </CardHeader>
                          {openCompleted && (
                            <CardContent>
                              <div className="space-y-3">
                                {labTests.filter(t=>t.status==='completed').length===0 && (<div className="text-sm text-gray-500">No completed tests</div>)}
                                {labTests.filter(t=>t.status==='completed').map(t => (
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
                      </div>
                    </TabsContent>
                  )}
                  <TabsContent value="consult" className="mt-4">
                    <div className="p-3 border rounded-md">
                      <div className="text-sm font-medium text-gray-900 mb-2">Current Consultation</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <div className="text-xs text-gray-700 mb-1">Diagnosis / Notes</div>
                          <textarea value={diagText} onChange={(e)=> setDiagText(e.target.value)} className="w-full min-h-[90px] px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter diagnosis/notes" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-700 mb-1">Medications (one per line)</div>
                          <textarea value={medsText} onChange={(e)=> setMedsText(e.target.value)} className="w-full min-h-[90px] px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., Atorvastatin 10mg, once daily" />
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <Button variant="outline" disabled={savingConsult || !selectedPatientId} onClick={async ()=>{
                          if (!user || !selectedPatientId) return;
                          try {
                            setSavingConsult(true);
                            if (!consultationId) {
                              const res = await fetch(`${import.meta.env.MODE === 'production' ? '/api/v1' : 'http://localhost:3001/api/v1'}/doctor/${user.id}/consultations`, {
                                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ patientId: selectedPatientId, diagnosis: diagText || undefined, medicines: medsText ? medsText.split('\\n') : undefined })
                              });
                              const json = await res.json();
                              if (res.ok && json.success) setConsultationId(json.data.consultationId);
                            } else {
                              await fetch(`${import.meta.env.MODE === 'production' ? '/api/v1' : 'http://localhost:3001/api/v1'}/doctor/${user.id}/consultations/${consultationId}`, {
                                method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ diagnosis: diagText || undefined, medicines: medsText ? medsText.split('\\n') : undefined })
                              });
                            }
                          } finally { setSavingConsult(false); }
                        }}>{savingConsult ? 'Saving…' : 'Save Consultation'}</Button>
                        <DoctorVoiceDiagnosis doctorId={user.id} patientId={selectedPatientId || ''} />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPatients;


