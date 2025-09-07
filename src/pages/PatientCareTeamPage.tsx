import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import patientCareTeamService, { CareTeamMember, AvailableDoctor } from '@/services/patientCareTeam';
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

  useEffect(() => {
    fetchCareTeam();
    fetchAvailableDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
                  <CardDescription>{category==='doctor' ? 'Manage your doctors and their access' : 'Manage connected labs (coming soon)'}</CardDescription>
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">Select Doctor</label>
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
                    ) : (
                      <Button variant="outline" onClick={() => setShowAddDoctor(true)}>Add New Care Team Member</Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-6 text-sm text-gray-600">Lab care team management is coming soon.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientCareTeamPage;


