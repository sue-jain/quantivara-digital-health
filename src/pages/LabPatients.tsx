import React, { useEffect, useState } from 'react';
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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [lookupResult, setLookupResult] = useState<{ name: string; abhaId: string; consented: boolean; patientId?: string } | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [fileByTest, setFileByTest] = useState<Record<string, File | undefined>>({});
  const [otpCareTeamId, setOtpCareTeamId] = useState<string | null>(null);
  const [otpValue, setOtpValue] = useState('');
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [requestingConsent, setRequestingConsent] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const [inviteId, setInviteId] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [inviteOtp, setInviteOtp] = useState<string | null>(null);
  const [consentedQuery, setConsentedQuery] = useState('');
  const [showConsentedDropdown, setShowConsentedDropdown] = useState(false);

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

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lookup by ABHA ID</label>
                <div className="flex gap-2">
                  <input value={abhaSearch} onChange={(e)=>setAbhaSearch(e.target.value)} placeholder="14-digit ABHA ID" className="flex-1 px-3 py-2 border border-gray-300 rounded-md" />
                  <Button variant="outline" disabled={requestingConsent} onClick={async()=>{
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
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                  <input value={firstName} onChange={(e)=>setFirstName(e.target.value)} placeholder="First name" className="px-3 py-2 border border-gray-300 rounded-md" />
                  <input value={lastName} onChange={(e)=>setLastName(e.target.value)} placeholder="Last name" className="px-3 py-2 border border-gray-300 rounded-md" />
                  <input value={dob} onChange={(e)=>setDob(e.target.value)} type="date" className="px-3 py-2 border border-gray-300 rounded-md" />
                  <Button variant="outline" onClick={async()=>{
                    if (!firstName.trim() || !lastName.trim() || !dob) return;
                    try {
                      const res = await patientService.lookupAbhaIdByNameAndDOB(firstName, lastName, dob);
                      const match = patients.find(p => p.abhaId === (res as any).abhaId);
                      setLookupResult({ name: `${firstName} ${lastName}`, abhaId: (res as any).abhaId, consented: !!match, patientId: match?.patientId });
                    } catch {
                      setLookupResult(null);
                    }
                  }}>Search</Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Create new patient (Invite)</label>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  <input value={firstName} onChange={(e)=>setFirstName(e.target.value)} placeholder="First name" className="px-3 py-2 border border-gray-300 rounded-md" />
                  <input value={lastName} onChange={(e)=>setLastName(e.target.value)} placeholder="Last name" className="px-3 py-2 border border-gray-300 rounded-md" />
                  <input value={dob} onChange={(e)=>setDob(e.target.value)} type="date" className="px-3 py-2 border border-gray-300 rounded-md" />
                  <input value={invitePhone} onChange={(e)=>setInvitePhone(e.target.value)} placeholder="Mobile number" className="px-3 py-2 border border-gray-300 rounded-md" />
                  <Button variant="outline" onClick={async()=>{
                    try {
                      const infoRaw = localStorage.getItem('lab_info');
                      if (!infoRaw) return;
                      const lab = JSON.parse(infoRaw);
                      const data = await labsService.createPatientInvite(lab.id, { firstName, lastName, dateOfBirth: dob, phone: invitePhone });
                      setInviteId(data.inviteId);
                      setInviteCode(data.inviteCode);
                      setInviteOtp(data.otp);
                      setOtpVisible(true);
                      setOtpCareTeamId(null);
                      setLookupResult({ name: `${firstName || 'Patient'} ${lastName || ''}`.trim(), abhaId: '', consented: false });
                    } catch (e) {
                      setOtpError('Failed to create invite');
                    }
                  }}>Send invite</Button>
                </div>
                {inviteId && (
                  <div className="mt-2 text-xs text-gray-600">Invite Code: <span className="font-mono text-gray-800">{inviteCode}</span> • OTP: <span className="font-mono text-gray-800">{inviteOtp}</span></div>
                )}
                {inviteId && (
                  <div className="mt-2 flex items-center gap-2">
                    <input type="password" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={otpValue} onChange={(e)=> setOtpValue(e.target.value)} placeholder="******" className="px-3 py-2 border border-gray-300 rounded-md w-32 tracking-widest" />
                    <Button size="sm" disabled={otpVerifying || otpValue.length !== 6} onClick={async()=>{
                      try {
                        setOtpVerifying(true);
                        setOtpError(null);
                        const infoRaw = localStorage.getItem('lab_info');
                        if (!infoRaw || !inviteId) return;
                        const lab = JSON.parse(infoRaw);
                        const res = await labsService.verifyPatientInvite(lab.id, inviteId, otpValue);
                        // After invite verification, keep flow simple: set active patient and show ordered tests
                        setActivePatientId(res.userId);
                        setActivePatientName(`${firstName || 'Patient'} ${lastName || ''}`.trim());
                        window.dispatchEvent(new CustomEvent('lab-consent-updated'));
                      } catch {
                        setOtpError('Invalid or expired OTP.');
                      } finally {
                        setOtpVerifying(false);
                      }
                    }}>{otpVerifying ? 'Verifying…' : 'Verify Invite'}</Button>
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
                          value={otpValue}
                          onChange={(e)=> setOtpValue(e.target.value)}
                          placeholder="******"
                          className="px-3 py-2 border border-gray-300 rounded-md w-32 tracking-widest"
                        />
                        <Button size="sm" disabled={otpVerifying || otpValue.length !== 6 || !otpCareTeamId} onClick={async()=>{
                          try {
                            setOtpVerifying(true);
                            setOtpError(null);
                            const infoRaw = localStorage.getItem('lab_info');
                            if (!infoRaw) return;
                            const lab = JSON.parse(infoRaw);
                            const res = await labsService.verifyConsentOtp(lab.id, otpCareTeamId!, otpValue);
                            // refresh patients and set active to verified user
                            const updated = await labsService.listConsentedPatients(lab.id);
                            setPatients(updated);
                            setLookupResult({ name: lookupResult.name, abhaId: lookupResult.abhaId, consented: true, patientId: res.userId });
                            setActivePatientId(res.userId);
                            window.dispatchEvent(new CustomEvent('lab-consent-updated'));
                          } catch (err: any) {
                            setOtpError('Invalid or expired OTP.');
                          } finally {
                            setOtpVerifying(false);
                          }
                        }}>{otpVerifying ? 'Verifying…' : 'Verify OTP'}</Button>
                        <Button size="sm" variant="ghost" onClick={()=>{ setOtpVisible(false); setOtpCareTeamId(null); setOtpValue(''); setOtpError(null); }}>Cancel</Button>
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


