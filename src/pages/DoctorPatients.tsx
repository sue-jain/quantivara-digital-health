import React, { useEffect, useState, useRef } from 'react';
// import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronRight } from 'lucide-react';
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
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [diagText, setDiagText] = useState('');
  const [medsText, setMedsText] = useState('');
  const [savingConsult, setSavingConsult] = useState(false);
  // Test catalog for adding ordered tests (as doctor)
  const [catalog, setCatalog] = useState<Array<{ id: string; name: string; loincCode?: string }>>([]);
  const [testQuery, setTestQuery] = useState('');
  const [showTestDropdown, setShowTestDropdown] = useState(false);
  const testBoxRef = useRef<HTMLDivElement | null>(null);
  const [addingTest, setAddingTest] = useState(false);
  const [testAddError, setTestAddError] = useState<string | null>(null);
  const [testAdded, setTestAdded] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  // Temporary lab tests for current consultation (not persisted until save)
  const [tempLabTests, setTempLabTests] = useState<Array<{ id: string; name: string; loincCode?: string }>>([]);
  // Voice diagnosis section state
  const [voiceDiagnosisExpanded, setVoiceDiagnosisExpanded] = useState(false);
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

  // Close the test dropdown on outside click or Escape
  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      const el = testBoxRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setShowTestDropdown(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowTestDropdown(false);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  // Hide dropdown when patient changes
  useEffect(() => { 
    setShowTestDropdown(false); 
    setTempLabTests([]); // Clear temp tests when patient changes
  }, [selectedPatientId]);

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
                    <div className="space-y-6">
                      {/* Consultation Header */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Current Consultation</h3>
                        <p className="text-sm text-blue-700">Record diagnosis, medications, and lab orders for this patient</p>
                      </div>

                      {/* Consultation Details Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Chief Complaint */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Chief Complaint</label>
                          <textarea 
                            value={chiefComplaint} 
                            onChange={(e)=> setChiefComplaint(e.target.value)} 
                            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="Enter chief complaint and presenting symptoms..."
                          />
                        </div>

                        {/* Diagnosis & Clinical Notes */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Diagnosis & Clinical Notes</label>
                          <textarea 
                            value={diagText} 
                            onChange={(e)=> setDiagText(e.target.value)} 
                            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="Enter detailed diagnosis and clinical findings..."
                          />
                        </div>
                      </div>

                      {/* Medications Section */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Medications & Prescriptions</label>
                        <textarea 
                          value={medsText} 
                          onChange={(e)=> setMedsText(e.target.value)} 
                          className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                          placeholder="Enter medications (one per line):&#10;e.g., Atorvastatin 10mg, once daily&#10;Metformin 500mg, twice daily"
                        />
                      </div>

                      {/* Lab Tests Section */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Lab Tests Ordered</label>
                        <div className="border rounded-md p-3" ref={testBoxRef}>
                          <div className="relative flex items-center gap-2">
                            <input
                              value={testQuery}
                              onChange={(e)=> { setTestQuery(e.target.value); setSelectedTestId(null); setShowTestDropdown(true); }}
                              onFocus={()=> setShowTestDropdown(true)}
                              onBlur={()=> setTimeout(()=> setShowTestDropdown(false), 100)}
                              placeholder="Search test by name or LOINC (e.g., HbA1c or 4548-4)"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Button
                              variant="outline"
                              disabled={!testQuery.trim() || !selectedPatientId || addingTest}
                              onClick={async()=>{
                                setTestAddError(null); setTestAdded(false);
                                let match = null as | { id: string; name: string; loincCode?: string } | null;
                                // 1) Prefer explicitly selected test from dropdown
                                if (selectedTestId) {
                                  match = catalog.find(t => t.id === selectedTestId) || null;
                                }
                                // 2) Try to parse "Name (CODE)" pattern and match by code
                                if (!match) {
                                  const raw = testQuery.trim();
                                  const codeInParens = raw.match(/\(([^)]+)\)\s*$/);
                                  if (codeInParens && codeInParens[1]) {
                                    const code = codeInParens[1].trim().toLowerCase();
                                    match = catalog.find(t => (t.loincCode || '').toLowerCase() === code) || null;
                                  }
                                }
                                // 3) Exact name or exact code
                                if (!match) {
                                  const q = testQuery.trim().toLowerCase();
                                  match = catalog.find(t => (t.name || '').toLowerCase() === q || (t.loincCode || '').toLowerCase() === q) || null;
                                }
                                // 4) Fallback: first fuzzy match by includes
                                if (!match) {
                                  const q = testQuery.trim().toLowerCase();
                                  const candidates = catalog.filter(t => (t.name || '').toLowerCase().includes(q) || (t.loincCode || '').toLowerCase().includes(q));
                                  if (candidates.length === 1) match = candidates[0];
                                }
                                if (!match) { setTestAddError('Select a valid test from the list'); return; }
                                if (!selectedPatientId) { setTestAddError('No active patient'); return; }
                                try {
                                  setAddingTest(true);
                                  // Add to temporary list (not persisted until save consultation)
                                  setTempLabTests(prev => [...prev, match!]);
                                  setTestQuery(''); setSelectedTestId(null); setShowTestDropdown(false); setTestAdded(true);
                                  setTimeout(()=> setTestAdded(false), 2000);
                                } catch (e:any) {
                                  setTestAddError(e?.message || 'Failed to add test');
                                } finally {
                                  setAddingTest(false);
                                }
                              }}
                            >{addingTest ? 'Adding…' : 'Add'}</Button>
                            {showTestDropdown && (
                              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-56 overflow-auto" onMouseDown={(e)=> e.preventDefault()}>
                                {catalog.filter(t => {
                                  const q = testQuery.trim().toLowerCase();
                                  if (!q) return true;
                                  return (t.name||'').toLowerCase().includes(q) || (t.loincCode||'').toLowerCase().includes(q);
                                }).map(t => (
                                  <div key={t.id} className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer" onClick={()=>{ setSelectedTestId(t.id); setTestQuery(t.name + (t.loincCode ? ` (${t.loincCode})` : '')); setShowTestDropdown(false); }}>
                                    <div className="font-medium">{t.name}</div>
                                    <div className="text-xs text-gray-500">{t.loincCode || 'No LOINC'}</div>
                                  </div>
                                ))}
                                {catalog.filter(t => {
                                  const q = testQuery.trim().toLowerCase();
                                  if (!q) return true;
                                  return (t.name||'').toLowerCase().includes(q) || (t.loincCode||'').toLowerCase().includes(q);
                                }).length === 0 && (
                                  <div className="px-3 py-2 text-sm text-gray-500">No matches</div>
                                )}
                              </div>
                            )}
                          </div>
                          {testAddError && <div className="text-sm text-red-600 mt-1">{testAddError}</div>}
                          {testAdded && <div className="text-sm text-green-700 mt-1">Test added to consultation</div>}
                        </div>
                        
                        {/* Temporary Tests List (not yet saved) */}
                        {tempLabTests.length > 0 && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                            <div className="text-sm font-medium text-yellow-800 mb-2">Tests to be ordered (will be saved with consultation):</div>
                            <div className="space-y-1">
                              {tempLabTests.map((test, index) => (
                                <div key={index} className="flex items-center justify-between bg-white border border-yellow-200 rounded px-3 py-2">
                                  <span className="text-sm text-gray-900">{test.name}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-yellow-600">Pending Save</span>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      onClick={() => setTempLabTests(prev => prev.filter((_, i) => i !== index))}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Voice Diagnosis Section - Collapsible */}
                      <div className="space-y-3">
                        <div 
                          className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
                          onClick={() => setVoiceDiagnosisExpanded(!voiceDiagnosisExpanded)}
                        >
                          <div className="flex items-center gap-2">
                            {voiceDiagnosisExpanded ? (
                              <ChevronDown className="h-4 w-4 text-gray-600" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-600" />
                            )}
                            <label className="text-sm font-medium text-gray-700 cursor-pointer">🎤 Voice Diagnosis</label>
                          </div>
                          <div className="text-xs text-gray-500">
                            {voiceDiagnosisExpanded ? 'Click to collapse' : 'Click to expand'}
                          </div>
                        </div>
                        
                        {voiceDiagnosisExpanded && (
                          <div className="border border-gray-200 rounded-md p-4 bg-white">
                            <DoctorVoiceDiagnosis doctorId={user.id} patientId={selectedPatientId || ''} />
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                        <Button 
                          variant="outline" 
                          disabled={savingConsult || !selectedPatientId} 
                          onClick={async ()=>{
                          if (!user || !selectedPatientId) return;
                          try {
                            setSavingConsult(true);
                              
                              // First, save the consultation
                              let consultationIdToUse = consultationId;
                              if (!consultationIdToUse) {
                              const res = await fetch(`${import.meta.env.MODE === 'production' ? '/api/v1' : 'http://localhost:3001/api/v1'}/doctor/${user.id}/consultations`, {
                                  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ 
                                    patientId: selectedPatientId, 
                                    chiefComplaint: chiefComplaint || undefined,
                                    diagnosis: diagText || undefined, 
                                    treatmentPlan: medsText ? medsText.split('\\n') : undefined,
                                    status: 'completed'
                                  })
                              });
                              const json = await res.json();
                                if (res.ok && json.success) {
                                  consultationIdToUse = json.data.consultationId;
                                  setConsultationId(consultationIdToUse);
                                }
                            } else {
                                await fetch(`${import.meta.env.MODE === 'production' ? '/api/v1' : 'http://localhost:3001/api/v1'}/doctor/${user.id}/consultations/${consultationIdToUse}`, {
                                  method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ 
                                    chiefComplaint: chiefComplaint || undefined,
                                    diagnosis: diagText || undefined, 
                                    treatmentPlan: medsText ? medsText.split('\\n') : undefined,
                                    status: 'completed'
                                  })
                                });
                              }

                              // Then, save all the lab tests
                              if (tempLabTests.length > 0) {
                                const labId = 'DOCTOR';
                                for (const test of tempLabTests) {
                                  try {
                                    await fetch(`${import.meta.env.MODE === 'production' ? '/api/v1' : 'http://localhost:3001/api/v1'}/labs/${labId}/patient/${selectedPatientId}/tests`, {
                                      method: 'POST', 
                                      headers: { 'Content-Type': 'application/json' }, 
                                      body: JSON.stringify({ 
                                        testId: test.id, 
                                        testName: test.name + (test.loincCode ? ` (${test.loincCode})` : ''), 
                                        orderedBy: 'doctor' 
                                      })
                                    });
                                  } catch (e) {
                                    console.error('Failed to save lab test:', test.name, e);
                                  }
                                }
                                
                                // Clear temporary tests after successful save
                                setTempLabTests([]);
                                
                                // Refresh the lab tests list
                                try {
                                  const rows = await labsService.getOrderedTests(labId, selectedPatientId);
                                  const mapped: any[] = rows.map((r: any) => ({ 
                                    testId: r.id, 
                                    name: r.testName || r.test_name || 'Test', 
                                    status: r.status, 
                                    orderedAt: r.created_at, 
                                    updatedAt: r.updated_at,
                                    orderedBy: r.orderedBy || 'doctor'
                                  }));
                                  setLabTests(mapped as any);
                                } catch (e) {
                                  console.error('Failed to refresh lab tests:', e);
                                }
                              }
                          } finally { setSavingConsult(false); }
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {savingConsult ? 'Saving…' : 'Save Consultation'}
                        </Button>
                        <div className="text-sm text-gray-500">
                          {tempLabTests.length > 0 
                            ? `Consultation will be saved with diagnosis, medications, and ${tempLabTests.length} lab test(s)`
                            : 'Consultation will be saved with diagnosis and medications'
                          }
                        </div>
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


