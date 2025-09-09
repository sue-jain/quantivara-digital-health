import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import labsService from '@/services/labs';
import patientService from '@/services/patients';
import userDocumentService from '@/services/userDocuments';

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
  const [activePatientName, setActivePatientName] = useState<string>('');
  const [tests, setTests] = useState<OrderedTest[]>([]);
  const [labId, setLabId] = useState<string>('');
  const [abhaSearch, setAbhaSearch] = useState('');
  // Lookup by patient details (isolated state)
  const [lookupFirstName, setLookupFirstName] = useState('');
  const [lookupLastName, setLookupLastName] = useState('');
  const [lookupDob, setLookupDob] = useState('');
  // Invite section (separate state so typing does not cross-fill)
  const [inviteFirstName, setInviteFirstName] = useState('');
  const [inviteLastName, setInviteLastName] = useState('');
  const [inviteDob, setInviteDob] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [lookupResult, setLookupResult] = useState<{ name: string; abhaId: string; consented: boolean; patientId?: string } | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [fileByTest, setFileByTest] = useState<Record<string, File | undefined>>({});
  const [otpCareTeamId, setOtpCareTeamId] = useState<string | null>(null);
  // Separate OTP inputs for invite and consent to prevent cross-filling
  const [inviteOtpValue, setInviteOtpValue] = useState('');
  const [inviteVerifying, setInviteVerifying] = useState(false);
  const [consentOtpValue, setConsentOtpValue] = useState('');
  const [consentVerifying, setConsentVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [requestingConsent, setRequestingConsent] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const [inviteId, setInviteId] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [inviteOtp, setInviteOtp] = useState<string | null>(null);
  const [inviteVerified, setInviteVerified] = useState(false);
  const [consentedQuery, setConsentedQuery] = useState('');
  const [showConsentedDropdown, setShowConsentedDropdown] = useState(false);
  const [openConsented, setOpenConsented] = useState(true);
  const [openAbha, setOpenAbha] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openInvite, setOpenInvite] = useState(false);
  // Lab test catalog for adding new ordered tests
  const [catalog, setCatalog] = useState<Array<{ id: string; name: string; loincCode?: string }>>([]);
  const [testQuery, setTestQuery] = useState('');
  const [showTestDropdown, setShowTestDropdown] = useState(false);
  const testBoxRef = useRef<HTMLDivElement | null>(null);
  const [addingTest, setAddingTest] = useState(false);
  const [testAddError, setTestAddError] = useState<string | null>(null);
  const [testAdded, setTestAdded] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

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

  // Load catalog once
  useEffect(() => {
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
  useEffect(() => { setShowTestDropdown(false); }, [activePatientId]);

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
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Patients</CardTitle>
          <CardDescription>Consented patients and lookup</CardDescription>
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
                        return ((p.name || '').toLowerCase().includes(q) || (p.abhaId || '').toLowerCase().includes(q));
                      })).map(p => (
                        <div key={p.patientId} className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer" onClick={()=>{ setActivePatientId(p.patientId); setActivePatientName(p.name); setConsentedQuery(`${p.name}${p.abhaId ? ` (${p.abhaId})` : ''}`); setShowConsentedDropdown(false); }}>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-gray-500">{p.abhaId || 'No ABHA'}</div>
                        </div>
                      ))}
                      {patients.filter(p => {
                        const q = consentedQuery.trim().toLowerCase();
                        if (!q) return true;
                        return ((p.name || '').toLowerCase().includes(q) || (p.abhaId || '').toLowerCase().includes(q));
                      }).length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500">No matches</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {!activePatientId && (
                <div className="text-xs text-gray-600">Select a consented patient to manage ordered tests below.</div>
              )}
            </div>

            <div className="space-y-4 min-w-0">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lookup by ABHA ID</label>
                <div className="flex gap-2 items-stretch min-w-0">
                  <input value={abhaSearch} onChange={(e)=>setAbhaSearch(e.target.value)} placeholder="14-digit ABHA ID" className="flex-1 min-w-0 px-3 py-2 h-10 border border-gray-300 rounded-md" />
                  <Button className="h-10 shrink-0" variant="outline" disabled={requestingConsent} onClick={async()=>{
                    const normalized = abhaSearch.replace(/\D/g, '');
                    if (!normalized) return;
                    const match = patients.find(p => (p.abhaId || '').replace(/\D/g, '') === normalized);
                    if (match) {
                      setLookupResult({ name: match.name, abhaId: match.abhaId || normalized, consented: true, patientId: match.patientId });
                    } else {
                      try {
                        setRequestingConsent(true);
                        const infoRaw = localStorage.getItem('lab_info');
                        if (!infoRaw) return;
                        const lab = JSON.parse(infoRaw);
                        setOtpVisible(true); // show OTP UI immediately
                        const r = await labsService.requestConsent(lab.id, { abhaId: normalized });
                        setOtpCareTeamId(r.careTeamId);
                        setOtpValue('');
                        setOtpError(null);
                        window.dispatchEvent(new CustomEvent('lab-consent-updated'));
                        setLookupResult({ name: 'Patient', abhaId: normalized, consented: false });
                      } catch (e) {
                        setOtpError('Could not create consent request. Check ABHA ID.');
                        setOtpCareTeamId(null);
                        setLookupResult({ name: 'Patient', abhaId: normalized, consented: false });
                      } finally {
                        setRequestingConsent(false);
                      }
                    }
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
                    if (!lookupFirstName.trim() || !lookupLastName.trim() || !lookupDob) return;
                    try {
                      const res = await patientService.lookupAbhaIdByNameAndDOB(lookupFirstName, lookupLastName, lookupDob);
                      const match = patients.find(p => p.abhaId === (res as any).abhaId);
                      setLookupResult({ name: `${lookupFirstName} ${lookupLastName}`, abhaId: (res as any).abhaId, consented: !!match, patientId: match?.patientId });
                    } catch {
                      setLookupResult(null);
                    }
                  }}>Search</Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Create new patient (Invite)</label>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  <input value={inviteFirstName} onChange={(e)=>setInviteFirstName(e.target.value)} placeholder="First name" className="px-3 py-2 border border-gray-300 rounded-md" />
                  <input value={inviteLastName} onChange={(e)=>setInviteLastName(e.target.value)} placeholder="Last name" className="px-3 py-2 border border-gray-300 rounded-md" />
                  <input value={inviteDob} onChange={(e)=>setInviteDob(e.target.value)} type="date" className="px-3 py-2 border border-gray-300 rounded-md" />
                  <input value={invitePhone} onChange={(e)=>setInvitePhone(e.target.value)} placeholder="Mobile number" className="px-3 py-2 border border-gray-300 rounded-md" />
                  <Button variant="outline" onClick={async()=>{
                    try {
                      const infoRaw = localStorage.getItem('lab_info');
                      if (!infoRaw) return;
                      const lab = JSON.parse(infoRaw);
                      const data = await labsService.createPatientInvite(lab.id, { firstName: inviteFirstName, lastName: inviteLastName, dateOfBirth: inviteDob, phone: invitePhone });
                      setInviteId(data.inviteId);
                      setInviteCode(data.inviteCode);
                      setInviteOtp(data.otp);
                      setInviteVerified(false);
                      // Do not show consent OTP yet; wait until invite verification
                      setOtpCareTeamId(null);
                    } catch (e) {
                      setOtpError('Failed to create invite');
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
                      try {
                        setInviteVerifying(true);
                        setOtpError(null);
                        const infoRaw = localStorage.getItem('lab_info');
                        if (!infoRaw || !inviteId) return;
                        const lab = JSON.parse(infoRaw);
                        const res = await labsService.verifyPatientInvite(lab.id, inviteId, inviteOtpValue);
                        // After invite verification, keep flow simple: set active patient and show ordered tests
                        setActivePatientId(res.userId);
                        setActivePatientName(`${inviteFirstName || 'Patient'} ${inviteLastName || ''}`.trim());
                        setInviteVerified(true);
                        window.dispatchEvent(new CustomEvent('lab-consent-updated'));
                      } catch {
                        setOtpError('Invalid or expired OTP.');
                      } finally {
                        setInviteVerifying(false);
                      }
                    }}>{inviteVerifying ? 'Verifying…' : 'Verify Invite'}</Button>
                  </div>
                )}
              </div>

              {lookupResult && (
                <div className="p-3 border rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{lookupResult.name}</div>
                      <div className="text-xs text-gray-600">ABHA: {lookupResult.abhaId}</div>
                    </div>
                    {lookupResult.consented && lookupResult.patientId ? (
                      <Button size="sm" onClick={()=> { setActivePatientId(lookupResult.patientId!); setActivePatientName(lookupResult.name); }}>View Profile</Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled={requestingConsent} onClick={async()=>{
                        try {
                          setRequestingConsent(true);
                          setOtpVisible(true); // show OTP UI immediately
                          const infoRaw = localStorage.getItem('lab_info');
                          if (!infoRaw || !lookupResult?.abhaId) return;
                          const lab = JSON.parse(infoRaw);
                          const r = await labsService.requestConsent(lab.id, { abhaId: lookupResult.abhaId.replace(/\D/g, '') });
                          setOtpCareTeamId(r.careTeamId);
                          setOtpValue('');
                          setOtpError(null);
                          window.dispatchEvent(new CustomEvent('lab-consent-updated'));
                        } catch (e) {
                          setOtpError('Could not create consent request. Please try again.');
                        } finally {
                          setRequestingConsent(false);
                        }
                      }}>{requestingConsent ? 'Sending…' : 'Request Consent'}</Button>
                    )}
                  </div>
                  {!lookupResult.consented && otpCareTeamId && (
                    <div className="mt-1 text-right">
                      <Button variant="ghost" size="sm" onClick={async()=>{ try { const infoRaw = localStorage.getItem('lab_info'); if(!infoRaw || !otpCareTeamId) return; const lab = JSON.parse(infoRaw); await labsService.cancelConsentRequest(lab.id, otpCareTeamId); setOtpCareTeamId(null); setOtpVisible(false); setOtpValue(''); setOtpError(null); } catch {} }}>🗑️ Cancel request</Button>
                    </div>
                  )}
                  {!lookupResult.consented && otpVisible && (
                    <div className="mt-2 text-xs text-gray-600">OTP sent to patient’s mobile (demo)</div>
                  )}
                  {!lookupResult.consented && otpVisible && (
                    <div className="mt-3">
                      {inviteId ? (
                        <div className="mb-2 text-xs text-gray-600">Invite Code: <span className="font-mono text-gray-800">{inviteCode}</span> • OTP: <span className="font-mono text-gray-800">{inviteOtp}</span></div>
                      ) : null}
                      <div className="text-xs text-gray-600 mb-1">Enter OTP sent to patient (masked)</div>
                      <div className="flex items-center gap-2">
                        <input
                          type="password"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={6}
                          value={consentOtpValue}
                          onChange={(e)=> setConsentOtpValue(e.target.value)}
                          placeholder="******"
                          className="px-3 py-2 border border-gray-300 rounded-md w-32 tracking-widest"
                        />
                        <Button size="sm" disabled={consentVerifying || consentOtpValue.length !== 6 || !otpCareTeamId} onClick={async()=>{
                          try {
                            setConsentVerifying(true);
                            setOtpError(null);
                            const infoRaw = localStorage.getItem('lab_info');
                            if (!infoRaw) return;
                            const lab = JSON.parse(infoRaw);
                            const res = await labsService.verifyConsentOtp(lab.id, otpCareTeamId!, consentOtpValue);
                            // refresh patients and set active to verified user
                            const updated = await labsService.listConsentedPatients(lab.id);
                            setPatients(updated);
                            setLookupResult({ name: lookupResult.name, abhaId: lookupResult.abhaId, consented: true, patientId: res.userId });
                            setActivePatientId(res.userId);
                            setActivePatientName(lookupResult.name);
                            window.dispatchEvent(new CustomEvent('lab-consent-updated'));
                          } catch (err: any) {
                            setOtpError('Invalid or expired OTP.');
                          } finally {
                            setConsentVerifying(false);
                          }
                        }}>{consentVerifying ? 'Verifying…' : 'Verify OTP'}</Button>
                        <Button size="sm" variant="ghost" onClick={()=>{ setOtpVisible(false); setOtpCareTeamId(null); setConsentOtpValue(''); setOtpError(null); }}>Cancel</Button>
                      </div>
                      {otpError && <div className="text-xs text-red-600 mt-1">{otpError}</div>}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Patient Ordered Tests {activePatientName ? `• ${activePatientName}` : ''}</CardTitle>
          <CardDescription>Visible for the selected patient</CardDescription>
        </CardHeader>
        <CardContent>
          {!activePatientId ? (
            <div className="text-sm text-gray-600">Select a consented patient on the left or via lookup to view ordered tests.</div>
          ) : (
            <div className="space-y-6">
              {/* Add ordered test */}
              <div className="border rounded-md p-3" ref={testBoxRef}>
                <div className="text-sm font-medium text-gray-900 mb-2">Add a test</div>
                <div className="relative flex items-center gap-2">
                  <input
                    value={testQuery}
                    onChange={(e)=> { setTestQuery(e.target.value); setSelectedTestId(null); setShowTestDropdown(true); }}
                    onFocus={()=> setShowTestDropdown(true)}
                    onBlur={()=> setTimeout(()=> setShowTestDropdown(false), 100)}
                    placeholder="Search test by name or LOINC (e.g., HbA1c or 4548-4)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <Button
                    variant="outline"
                    disabled={!testQuery.trim() || !activePatientId || addingTest}
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
                      if (!activePatientId || !labId) { setTestAddError('No active patient'); return; }
                      try {
                        setAddingTest(true);
                        await labsService.addOrderedTest(labId, activePatientId, { testId: match.id, testName: match.name + (match.loincCode ? ` (${match.loincCode})` : ''), orderedBy: 'doctor' });
                        setTestQuery(''); setSelectedTestId(null); setShowTestDropdown(false); setTestAdded(true);
                        await reload();
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
                {testAddError && <div className="text-xs text-red-600 mt-1">{testAddError}</div>}
                {testAdded && <div className="text-xs text-green-700 mt-1">Test added to Ordered</div>}
              </div>
              {/* Ordered (Labs can only view/manage Ordered) */}
              <div>
                <div className="text-sm font-medium text-gray-900 mb-2">Ordered</div>
                {tests.filter(t=>t.status==='ordered').length===0 && (<div className="text-sm text-gray-600">No ordered tests.</div>)}
                {tests.filter(t=>t.status==='ordered').map(t => (
                  <div key={t.testId} className="p-3 border rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{t.name}</div>
                        <div className="text-xs text-gray-600">Test ID: {t.testId} • Ordered: {new Date(t.orderedAt).toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Hidden file input per test */}
                        <input
                          id={`file-input-${t.testId}`}
                          type="file"
                          className="hidden"
                          onChange={async (e)=>{
                            const file = e.target.files && e.target.files[0] ? e.target.files[0] : undefined;
                            if (!file || !activePatientId) return;
                            try {
                              setUploadingId(t.testId);
                              const resp = await userDocumentService.uploadDocument({ file, userId: activePatientId, documentType: 'Lab Report' });
                              await labsService.updateOrderedTest(labId, activePatientId, t.testId, { reportId: resp.data.documentId, status: 'pending_review' });
                              await reload();
                            } finally {
                              setUploadingId(null);
                              // reset input so same file can be chosen again if needed
                              const inputEl = document.getElementById(`file-input-${t.testId}`) as HTMLInputElement | null;
                              if (inputEl) inputEl.value = '';
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={uploadingId === t.testId}
                          onClick={()=>{
                            const inputEl = document.getElementById(`file-input-${t.testId}`) as HTMLInputElement | null;
                            inputEl?.click();
                          }}
                        >{uploadingId === t.testId ? 'Uploading…' : 'Upload Report'}</Button>
                        <Button variant="outline" size="sm" onClick={async ()=>{ await labsService.updateOrderedTest(labId, activePatientId, t.testId, { status: 'pending_review' }); await reload(); }}>Mark Done</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LabPatients;


