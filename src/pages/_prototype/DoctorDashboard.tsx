import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Stethoscope, 
  Calendar, 
  Bell, 
  Search,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import Header from '@/components/layout/Header';
import doctorService, { DoctorPatient } from '@/services/doctor';

const DoctorDashboard: React.FC = () => {
  const { user, userType, logout } = useAuth();
  const [patients, setPatients] = useState<DoctorPatient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [drugA, setDrugA] = useState('');
  const [drugB, setDrugB] = useState('');
  const [interaction, setInteraction] = useState<{ interaction: string; severity: string; advisory: string } | null>(null);
  const [checkingInteraction, setCheckingInteraction] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [savingVoice, setSavingVoice] = useState(false);
  const [uiError, setUiError] = useState<string | null>(null);

  if (!user || userType !== 'doctor') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
            <CardDescription className="text-center">
              This page is only accessible to doctors.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const loadPatients = async () => {
      if (!user || userType !== 'doctor') return;
      try {
        const data = await doctorService.getPatients(user.id, 'approved');
        setPatients(data);
        if (data.length > 0) setSelectedPatientId(data[0].patientId);
      } catch (e) {
        console.error('Failed to load patients', e);
      }
    };
    loadPatients();
  }, [user, userType]);

  const handleCheckInteraction = async () => {
    setUiError(null);
    setInteraction(null);
    if (!drugA || !drugB) {
      setUiError('Please enter both medicines');
      return;
    }
    try {
      setCheckingInteraction(true);
      const result = await doctorService.getMedicineInteractions(drugA.trim(), drugB.trim());
      setInteraction(result);
    } catch (e: any) {
      setUiError(e.message || 'Failed to check interactions');
    } finally {
      setCheckingInteraction(false);
    }
  };

  const handleSaveVoice = async () => {
    setUiError(null);
    if (!selectedPatientId) {
      setUiError('Select a patient first');
      return;
    }
    if (!voiceTranscript.trim()) {
      setUiError('Enter a brief transcript/notes');
      return;
    }
    try {
      setSavingVoice(true);
      await doctorService.saveVoiceDiagnosis(user!.id, {
        patientId: selectedPatientId,
        transcript: voiceTranscript.trim(),
      });
      setVoiceTranscript('');
    } catch (e: any) {
      setUiError(e.message || 'Failed to save voice diagnosis');
    } finally {
      setSavingVoice(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, Dr. {user.lastName}
          </h1>
          <p className="text-gray-600">
            {user.specialty} • {user.hospitalName}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">{user.qualification}</Badge>
            <Badge variant="outline">{user.experienceYears} years experience</Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Users className="h-8 w-8 text-blue-600" />
                <Badge variant="secondary">12</Badge>
              </div>
              <CardTitle className="text-lg">My Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                View and manage your patient list
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Search className="h-8 w-8 text-green-600" />
                <Badge variant="secondary">New</Badge>
              </div>
              <CardTitle className="text-lg">Patient Lookup</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Search for patients by ABHA ID
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <FileText className="h-8 w-8 text-purple-600" />
                <Badge variant="secondary">5</Badge>
              </div>
              <CardTitle className="text-lg">Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Review pending consultations
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Stethoscope className="h-8 w-8 text-red-600" />
                <Badge variant="secondary">3</Badge>
              </div>
              <CardTitle className="text-lg">Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create and manage prescriptions
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Patient List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  My Patients
                </CardTitle>
                <CardDescription>
                  Patients who have given consent to share their data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Ramesh Kumar</p>
                        <p className="text-sm text-gray-500">ABHA: 12345678901234</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">Type 2 Diabetes</Badge>
                      <p className="text-sm text-gray-500 mt-1">Last visit: 2 days ago</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Priya Sharma</p>
                        <p className="text-sm text-gray-500">ABHA: 98765432109876</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">Asthma</Badge>
                      <p className="text-sm text-gray-500 mt-1">Last visit: 1 week ago</p>
                    </div>
                  </div>

                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>More patients will appear here as they give consent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Patient Tools & Notifications */}
          <div className="space-y-6">
            {/* Patient Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Patient Tools
                </CardTitle>
                <CardDescription>Select a consented patient and perform quick checks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Patient Select */}
                <div>
                  <Label className="text-sm">Current Patient (consented)</Label>
                  <select
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                  >
                    {patients.length === 0 && <option value="">No consented patients</option>}
                    {patients.map(p => (
                      <option key={p.relationshipId} value={p.patientId}>
                        {p.firstName} {p.lastName}{p.abhaId ? ` (ABHA: ${p.abhaId})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Medicine Interaction Checker */}
                <div className="border rounded-lg p-3">
                  <div className="mb-2 font-medium text-gray-900">Medicine Interaction</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm">Medicine A</Label>
                      <Input value={drugA} onChange={(e) => setDrugA(e.target.value)} className="mt-1" placeholder="e.g. metformin" />
                    </div>
                    <div>
                      <Label className="text-sm">Medicine B</Label>
                      <Input value={drugB} onChange={(e) => setDrugB(e.target.value)} className="mt-1" placeholder="e.g. atorvastatin" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Button onClick={handleCheckInteraction} disabled={checkingInteraction} style={{ backgroundColor: '#BBF1F1', color: '#374151' }}>
                      {checkingInteraction ? 'Checking...' : 'Check Interaction'}
                    </Button>
                    {interaction && (
                      <span className="text-sm text-gray-700">{interaction.interaction} • {interaction.severity}</span>
                    )}
                  </div>
                </div>

                {/* Voice Diagnosis - DEMO-style component */}
                <DoctorVoiceDiagnosis doctorId={user.id} patientId={selectedPatientId || null} />

                {uiError && <div className="text-sm text-red-600">{uiError}</div>}
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Bell className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">New patient consent</p>
                      <p className="text-xs text-gray-500">Suresh Patel has given consent</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <FileText className="h-4 w-4 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Lab results ready</p>
                      <p className="text-xs text-gray-500">Ramesh Kumar's blood test</p>
                    </div>
                  </div>

                  <div className="text-center py-4 text-gray-500">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No more notifications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;

