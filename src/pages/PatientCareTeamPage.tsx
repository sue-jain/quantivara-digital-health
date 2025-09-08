import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import patientCareTeamService, { CareTeamMember, AvailableDoctor, AvailableLab } from '@/services/patientCareTeam';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Info, MessageCircle, Trash2, FlaskConical, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const PatientCareTeamPage: React.FC = () => {
  const { user } = useAuth();
  const [careTeam, setCareTeam] = useState<CareTeamMember[]>([]);
  const [availableDoctors, setAvailableDoctors] = useState<AvailableDoctor[]>([]);
  const [revokedMembers, setRevokedMembers] = useState<CareTeamMember[]>([]);
  const [showStatusInfo, setShowStatusInfo] = useState<string | boolean | null>(null);
  const [showAddDoctor, setShowAddDoctor] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [availableLabs, setAvailableLabs] = useState<AvailableLab[]>([]);
  const [selectedLab, setSelectedLab] = useState('');
  const [careTeamLabs, setCareTeamLabs] = useState<Array<{ id: string; labId: string; labName: string; hfrUid?: string; consentStatus: string; consentDate?: string }>>([]);
  const [showLabConsent, setShowLabConsent] = useState(false);
  const [addingDoctor, setAddingDoctor] = useState(false);
  const [addDoctorStep, setAddDoctorStep] = useState<'select' | 'consent'>('select');
  const [consentScopes, setConsentScopes] = useState<{ labReports: boolean; prescriptions: boolean; pastHistory: boolean }>({ labReports: true, prescriptions: true, pastHistory: false });
  const [category, setCategory] = useState<'doctor' | 'lab'>('doctor');
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string | null>(null);

  const fetchCareTeam = async () => {
    if (!user) return;
    try {
      const teamData = await patientCareTeamService.getCareTeam(user.id);
      const activeOrPending = (teamData || []).filter(m => m.consentStatus !== 'revoked');
      const revoked = (teamData || []).filter(m => m.consentStatus === 'revoked');
      // Backend already orders newest first by consent_date DESC
      setCareTeam(activeOrPending);
      setRevokedMembers(revoked);
    } catch (e) {
      // ignore
    }
  };
  const fetchAvailableDoctors = async () => {
    try {
      const doctors = await patientCareTeamService.getAvailableDoctors();
      setAvailableDoctors(doctors);
    } catch (e) {
      // ignore
    }
  };
  const fetchAvailableLabs = async () => {
    try {
      const labs = await patientCareTeamService.getAvailableLabs();
      setAvailableLabs(labs);
    } catch (e) {
      // ignore
    }
  };
  const fetchCareTeamLabs = async () => {
    if (!user) return;
    try {
      const labs = await patientCareTeamService.listCareTeamLabs(user.id);
      setCareTeamLabs(labs);
    } catch {}
  };

  useEffect(() => {
    fetchCareTeam();
    fetchAvailableDoctors();
    fetchAvailableLabs();
    fetchCareTeamLabs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Auto-refresh labs list when a lab consent may change from other tabs/windows
  useEffect(() => {
    const handler = () => {
      fetchCareTeamLabs();
    };
    window.addEventListener('lab-consent-updated', handler);
    return () => window.removeEventListener('lab-consent-updated', handler);
  }, []);

  // Polling as fallback to catch status changes if event missed
  useEffect(() => {
    const id = setInterval(() => { fetchCareTeamLabs(); }, 5000);
    return () => clearInterval(id);
  }, [user?.id]);

  const handleRemoveDoctor = async (relationshipId: string, doctorName: string) => {
    if (!user) return;
    if (!confirm(`Remove ${doctorName} from your care team?`)) return;
    try {
      const result = await patientCareTeamService.removeDoctorFromCareTeam(user.id, relationshipId);
      toast({ title: 'Success', description: result.message });
      await fetchCareTeam();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to remove', variant: 'destructive' });
    }
  };

  const handleAddDoctor = async () => {
    if (!selectedDoctor) return;
    setAddDoctorStep('consent');
  };
  const handleConfirmConsent = async () => {
    if (!user || !selectedDoctor) return;
    setAddingDoctor(true);
    try {
      if (selectedRelationshipId) {
        // Reinstate existing revoked relationship by approving consent again
        await patientCareTeamService.approveConsent(user.id, selectedRelationshipId);
        // Update notes/scopes for the reinstated relationship
        await patientCareTeamService.updateCareTeamMember(user.id, selectedRelationshipId, {
          notes: JSON.stringify({ scopes: consentScopes })
        });
        toast({ title: 'Consent granted', description: 'Access restored for the doctor.' });
      } else {
        const result = await patientCareTeamService.addDoctorToCareTeam(user.id, {
          doctorId: selectedDoctor,
          relationshipType: 'consultant',
          notes: JSON.stringify({ scopes: consentScopes })
        });
        toast({ title: 'Doctor added', description: result.message });
      }
      await fetchCareTeam();
      setShowAddDoctor(false);
      setSelectedDoctor('');
      setSelectedRelationshipId(null);
      setAddDoctorStep('select');
      setConsentScopes({ labReports: true, prescriptions: true, pastHistory: false });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to add doctor', variant: 'destructive' });
    } finally {
      setAddingDoctor(false);
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <aside className="md:col-span-3 bg-white border rounded-lg p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-gray-800 flex items-center gap-2"><Users className="h-4 w-4 text-green-600"/> Your Care Team</div>
            <Button variant="outline" size="sm" onClick={()=>setShowAddDoctor(true)} title="Add"><Plus className="h-4 w-4"/></Button>
          </div>
          <div className="space-y-1">
            <button onClick={()=>setCategory('doctor')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm ${category==='doctor'?'bg-gray-100 text-gray-900':'text-gray-700 hover:bg-gray-50'}`}>
              <Users className="h-4 w-4"/> Doctors
            </button>
            <button onClick={()=>setCategory('lab')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm ${category==='lab'?'bg-gray-100 text-gray-900':'text-gray-700 hover:bg-gray-50'}`}>
              <FlaskConical className="h-4 w-4"/> Lab
            </button>
          </div>
        </aside>
        <div className="md:col-span-9">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900">{category==='doctor' ? 'Doctors' : 'Lab'}</CardTitle>
                  <CardDescription>{category==='doctor' ? 'Manage your doctors and their access' : 'Manage connected labs and their access'}</CardDescription>
                </div>
                <div className="relative">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowStatusInfo(showStatusInfo === true ? null : true)} title="Status Information">
                    <Info className="h-4 w-4 text-gray-500" />
                  </Button>
                  {showStatusInfo === true && (
                    <div className="absolute right-0 top-10 z-10 w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Status Legend</h4>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div><span className="font-medium text-green-700">Active:</span> Can view your medical data</div>
                        <div><span className="font-medium text-yellow-700">Pending:</span> Waiting for your consent</div>
                        <div><span className="font-medium text-gray-700">Revoked:</span> Access has been revoked</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {category==='doctor' ? (
                <>
                  <div className="space-y-4">
                    {careTeam.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No care team members yet</h3>
                        <p className="text-gray-600 mb-4">Add doctors to your care team to share your medical information</p>
                      </div>
                    ) : (
                      careTeam.map((member) => (
                        <div key={member.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{member.doctorName}</h4>
                              <p className="text-sm text-gray-600">{member.specialty}</p>
                              <p className="text-xs text-gray-500">{member.hospitalName}</p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowStatusInfo(showStatusInfo === member.id ? null : member.id)} title="View Status">
                                <Info className={`h-4 w-4 ${member.consentStatus === 'approved' ? 'text-green-600' : member.consentStatus === 'pending' ? 'text-yellow-600' : 'text-gray-600'}`} />
                              </Button>
                              {showStatusInfo === member.id && (
                                <div className="relative">
                                  <div className="absolute right-0 top-8 z-20 w-48 p-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                                    <div className="text-xs font-medium text-gray-900">{member.consentStatus === 'approved' ? 'Active Access' : member.consentStatus === 'pending' ? 'Pending Consent' : 'Access Revoked'}</div>
                                    <div className="text-xs text-gray-600 mt-1">{member.consentStatus === 'approved' ? 'Can view your medical data' : member.consentStatus === 'pending' ? 'Waiting for your consent' : 'Access has been revoked'}</div>
                                  </div>
                                </div>
                              )}
                              {member.consentStatus === 'pending' && (
                                <>
                                  <Button size="sm" variant="ghost" className="h-8 px-2 hover:bg-green-50" title="Approve Consent" onClick={async () => { try { await patientCareTeamService.approveConsent(user!.id, member.id); toast({ title: 'Consent approved' }); await fetchCareTeam(); } catch (e: any) { toast({ title: 'Error', description: e.message || 'Failed to approve', variant: 'destructive' }); } }}>Approve</Button>
                                  <Button size="sm" variant="ghost" className="h-8 px-2 hover:bg-red-50" title="Reject Consent" onClick={async () => { try { await patientCareTeamService.rejectConsent(user!.id, member.id); toast({ title: 'Consent rejected' }); await fetchCareTeam(); } catch (e: any) { toast({ title: 'Error', description: e.message || 'Failed to reject', variant: 'destructive' }); } }}>Reject</Button>
                                </>
                              )}
                              {member.consentStatus === 'approved' && (
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-red-50" title="Remove Doctor" onClick={() => handleRemoveDoctor(member.id, member.doctorName)}>
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {revokedMembers.length > 0 && (
                    <div className="mt-8">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><Info className="h-4 w-4 text-gray-500" /> Revoked Access</h4>
                      <div className="space-y-3">
                        {revokedMembers.map((member) => (
                          <div key={`revoked-${member.id}`} className="p-3 border rounded-md bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900">{member.doctorName}</div>
                                <div className="text-xs text-gray-600">{member.specialty} • {member.hospitalName}</div>
                                <div className="text-xs text-gray-500">Status: Access Revoked</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => { setSelectedDoctor(member.doctorId); setSelectedRelationshipId(member.id); setShowAddDoctor(true); setAddDoctorStep('consent'); }}>Re-add</Button>
                                <Info className="h-4 w-4 text-gray-500" title="Access Revoked" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-4 border-t">
                    {showAddDoctor ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Select and add Doctor</label>
                          <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Choose a doctor...</option>
                            {availableDoctors.filter(doctor => !careTeam.some(member => member.doctorId === doctor.id)).map((doctor) => (
                              <option key={doctor.id} value={doctor.id}>{doctor.displayName}</option>
                            ))}
                          </select>
                        </div>
                        {addDoctorStep === 'select' ? (
                          <div className="flex gap-2">
                            <Button onClick={handleAddDoctor} disabled={!selectedDoctor || addingDoctor} style={{ backgroundColor: '#BBF1F1', color: '#374151' }}>Next</Button>
                            <Button variant="outline" onClick={() => { setShowAddDoctor(false); setSelectedDoctor(''); }}>Cancel</Button>
                          </div>
                        ) : (
                          <div className="mt-3 p-3 rounded-md border bg-gray-50">
                            <div className="font-medium text-gray-900 mb-2">Consent Scopes</div>
                            <div className="space-y-2 mb-3">
                              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={consentScopes.labReports} onChange={(e)=>setConsentScopes(prev=>({...prev, labReports: e.target.checked}))} /> Lab reports</label>
                              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={consentScopes.prescriptions} onChange={(e)=>setConsentScopes(prev=>({...prev, prescriptions: e.target.checked}))} /> Prescriptions</label>
                              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={consentScopes.pastHistory} onChange={(e)=>setConsentScopes(prev=>({...prev, pastHistory: e.target.checked}))} /> Past history</label>
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={handleConfirmConsent} disabled={addingDoctor} style={{ backgroundColor: '#BBF1F1', color: '#374151' }}>{addingDoctor ? 'Confirming...' : 'Confirm'}</Button>
                              <Button variant="outline" onClick={() => { setAddDoctorStep('select'); }}>Back</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><FlaskConical className="h-4 w-4"/> Connected Labs</h4>
                    {careTeamLabs.length === 0 ? (
                      <div className="text-sm text-gray-600">No labs added yet.</div>
                    ) : (
                      <div className="space-y-2">
                        {careTeamLabs.map(lab => (
                          <div key={lab.id} className="p-3 border rounded-md bg-white flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">{lab.labName}</div>
                              <div className="text-xs text-gray-600">HFR: {lab.hfrUid}</div>
                              <div className="text-xs text-gray-500">Status: {lab.consentStatus}</div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              {lab.consentStatus === 'approved' ? (
                                <>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowStatusInfo(showStatusInfo === lab.id ? null : lab.id)} title="View Status">
                                    <Info className={`h-4 w-4 ${lab.consentStatus === 'approved' ? 'text-green-600' : lab.consentStatus === 'pending' ? 'text-yellow-600' : 'text-gray-600'}`} />
                                  </Button>
                                  {showStatusInfo === lab.id && (
                                    <div className="relative">
                                      <div className="absolute right-0 top-8 z-20 w-48 p-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                                        <div className="text-xs font-medium text-gray-900">Active Access</div>
                                        <div className="text-xs text-gray-600 mt-1">Can access ordered lab tests</div>
                                      </div>
                                    </div>
                                  )}
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50" title="Revoke Access" onClick={async()=>{ if(!user) return; try { const r = await patientCareTeamService.removeLabFromCareTeam(user.id, lab.id); toast({ title:'Access revoked', description:r.message }); await fetchCareTeamLabs(); } catch(e:any){ toast({ title:'Error', description:e.message||'Failed to revoke lab', variant:'destructive' }); } }}>
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </>
                              ) : lab.consentStatus === 'pending' ? (
                                <>
                                  <Button variant="outline" size="sm" onClick={async()=>{ if(!user) return; try { await patientCareTeamService.approveLabAccess(user.id, lab.id); toast({ title:'Consent approved' }); await fetchCareTeamLabs(); } catch(e:any){ toast({ title:'Error', description:e.message||'Failed to approve', variant:'destructive' }); } }}>Approve</Button>
                                  <Button variant="ghost" size="sm" onClick={async()=>{ if(!user) return; try { const r = await patientCareTeamService.removeLabFromCareTeam(user.id, lab.id); toast({ title:'Consent rejected', description:r.message }); await fetchCareTeamLabs(); } catch(e:any){ toast({ title:'Error', description:e.message||'Failed to reject', variant:'destructive' }); } }}>Reject</Button>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowStatusInfo(showStatusInfo === lab.id ? null : lab.id)} title="View Status">
                                    <Info className="h-4 w-4 text-yellow-600" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button variant="outline" size="sm" onClick={async()=>{ if(!user) return; try { const r = await patientCareTeamService.approveLabAccess(user.id, lab.id); toast({ title:'Access restored', description:r.message }); await fetchCareTeamLabs(); } catch(e:any){ toast({ title:'Error', description:e.message||'Failed to restore access', variant:'destructive' }); } }}>Re-add</Button>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowStatusInfo(showStatusInfo === lab.id ? null : lab.id)} title="View Status">
                                    <Info className={`h-4 w-4 ${lab.consentStatus === 'pending' ? 'text-yellow-600' : 'text-gray-600'}`} />
                                  </Button>
                                  {showStatusInfo === lab.id && (
                                    <div className="relative">
                                      <div className="absolute right-0 top-8 z-20 w-48 p-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                                        <div className="text-xs font-medium text-gray-900">Access Revoked</div>
                                        <div className="text-xs text-gray-600 mt-1">Access has been revoked</div>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-4 border-t">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select and add Lab</label>
                        <select value={selectedLab} onChange={(e)=>setSelectedLab(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="">Choose a lab...</option>
                          {availableLabs.map(lab => (
                            <option key={lab.id} value={lab.id}>{lab.name} ({lab.hfrUid})</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={()=> setShowLabConsent(true)} disabled={!selectedLab} style={{ backgroundColor: '#BBF1F1', color: '#374151' }}>Next</Button>
                        <Button variant="outline" onClick={()=>setSelectedLab('')}>Cancel</Button>
                      </div>

                      {showLabConsent && (
                        <div className="mt-3 p-3 rounded-md border bg-gray-50">
                          <div className="font-medium text-gray-900 mb-2">Consent Scopes</div>
                          <div className="text-sm text-gray-700 mb-3">Labs can only access: Ordered Lab tests</div>
                          <div className="flex gap-2">
                            <Button onClick={async()=>{ if(!user||!selectedLab) return; try { const r = await patientCareTeamService.addLabToCareTeam(user.id, selectedLab, JSON.stringify({ scopes: { orderedLabTests: true } })); toast({ title:'Consent granted', description:r.message }); setSelectedLab(''); setShowLabConsent(false); await fetchCareTeamLabs(); } catch(e:any){ toast({ title:'Error', description:e.message||'Failed to add lab', variant:'destructive' }); } }} style={{ backgroundColor: '#BBF1F1', color: '#374151' }}>Confirm</Button>
                            <Button variant="outline" onClick={()=> setShowLabConsent(false)}>Back</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientCareTeamPage;


