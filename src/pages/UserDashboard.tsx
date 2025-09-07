import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Heart, Pill, Brain, Building2, Info, Phone, AlertTriangle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import santhicaLogo from '@/assets/santhica-logo.png';
import userDocumentService from '@/services/userDocuments';
import patientCareTeamService, { CareTeamMember, AvailableDoctor } from '@/services/patientCareTeam';
import patientProfileService from '@/services/patientProfile';
import labsService, { LabTestCatalogItem } from '@/services/labs';
import { toast } from '@/hooks/use-toast';
import { useAbhaStatus } from '@/hooks/useAbhaStatus';
import ABHALinkingModal from '@/components/auth/ABHALinkingModal';

const UserDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('critical');
  const [medicalHistory, setMedicalHistory] = useState({
    diagnoses: [],
    documents: [],
    conditions: [],
    medications: [],
    aiInsights: [],
    careTeam: []
  });
  const [careTeam, setCareTeam] = useState<CareTeamMember[]>([]);
  const [availableDoctors, setAvailableDoctors] = useState<AvailableDoctor[]>([]);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [addDoctorStep, setAddDoctorStep] = useState<'select' | 'consent'>('select');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [addingDoctor, setAddingDoctor] = useState(false);
  const [consentScopes, setConsentScopes] = useState<{ labReports: boolean; prescriptions: boolean; pastHistory: boolean }>({ labReports: true, prescriptions: true, pastHistory: false });
  const [showStatusInfo, setShowStatusInfo] = useState<string | boolean | null>(null);
  const { hasAbhaLinked, needsLinking, refreshAbhaStatus } = useAbhaStatus();
  const [showAbhaModal, setShowAbhaModal] = useState(false);

  // Lab tests state (prototype, client-side)
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
  const [labTests, setLabTests] = useState<LabTestItem[]>([]);
  const [newTestName, setNewTestName] = useState('');
  const [newTestOrderedBy, setNewTestOrderedBy] = useState<'self'|'doctor'>('self');
  const [catalog, setCatalog] = useState<LabTestCatalogItem[]>([]);
  const [openOrdered, setOpenOrdered] = useState(true);
  const [openPending, setOpenPending] = useState(true);
  const [openCompleted, setOpenCompleted] = useState(true);
  const [openCriticalConditions, setOpenCriticalConditions] = useState(false);
  const [openCriticalAllergies, setOpenCriticalAllergies] = useState(false);
  const [insights, setInsights] = useState<{ diagnoses: any[]; medications: any[]; labResults: any[]; advice: any[]; latestUpdatedAt: string | null } | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const generateId = () => `T-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const addLabTest = () => {
    if (!newTestName.trim()) return;
    // Normalize: if user typed a LOINC code, convert to the catalog name
    const byLoinc = catalog.find(c => (c.loincCode || '').toLowerCase() === newTestName.trim().toLowerCase());
    const resolvedName = byLoinc ? byLoinc.name : newTestName.trim();
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
      } catch (e) {
        // ignore for prototype
      }
    };
    loadCatalog();
  }, []);

  // Sync tab with route (documents and lab-tests moved to dedicated pages)
  useEffect(() => {
    setActiveTab('critical');
  }, [location.pathname]);

  // Load consolidated AI insights when Insights tab is active
  useEffect(() => {
    const fetchInsights = async () => {
      if (!user) return;
      try {
        setInsightsLoading(true);
        setInsightsError(null);
        const data = await userDocumentService.getConsolidatedInsights(user.id);
        setInsights(data);
      } catch (e: any) {
        setInsightsError(e.message || 'Failed to load AI insights');
        setInsights(null);
      } finally {
        setInsightsLoading(false);
      }
    };
    if (activeTab === 'ai-insights' && user) {
      fetchInsights();
    }
  }, [activeTab, user]);


  // Fetch care team data
  const fetchCareTeam = async () => {
    try {
      const teamData = await patientCareTeamService.getCareTeam(user!.id);
      console.log('🏥 Care team data:', teamData);
      console.log('🏥 Care team doctor IDs:', teamData.map(m => m.doctorId));
      setCareTeam(teamData);
    } catch (error) {
      console.error('Error fetching care team:', error);
    }
  };

  // Fetch available doctors
  const fetchAvailableDoctors = async () => {
    try {
      console.log('🔍 Fetching available doctors...');
      const doctors = await patientCareTeamService.getAvailableDoctors();
      console.log('👥 Available doctors:', doctors);
      console.log('👥 Available doctor count:', doctors.length);
      setAvailableDoctors(doctors);
    } catch (error) {
      console.error('❌ Error fetching available doctors:', error);
      toast({
        title: "Error",
        description: "Failed to load available doctors",
        variant: "destructive",
      });
    }
  };

  // Step 1: proceed to consent
  const handleAddDoctor = async () => {
    if (!selectedDoctor) return;
    setAddDoctorStep('consent');
  };

  // Step 2: confirm with scopes
  const handleConfirmConsent = async () => {
    if (!selectedDoctor) return;
    setAddingDoctor(true);
    try {
      const result = await patientCareTeamService.addDoctorToCareTeam(user!.id, {
        doctorId: selectedDoctor,
        relationshipType: 'consultant',
        notes: JSON.stringify({ scopes: consentScopes })
      });
      toast({ title: 'Doctor added', description: result.message });
      await fetchCareTeam();
      setShowAddDoctor(false);
      setSelectedDoctor('');
      setAddDoctorStep('select');
      setConsentScopes({ labReports: true, prescriptions: true, pastHistory: false });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to add doctor', variant: 'destructive' });
    } finally {
      setAddingDoctor(false);
    }
  };

  // Remove doctor from care team
  const handleRemoveDoctor = async (relationshipId: string, doctorName: string) => {
    if (!confirm(`Remove ${doctorName} from your care team?`)) return;
    
    try {
      const result = await patientCareTeamService.removeDoctorFromCareTeam(user!.id, relationshipId);
      
      toast({
        title: "Success",
        description: result.message,
      });
      
      // Refresh care team
      await fetchCareTeam();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove doctor",
        variant: "destructive",
      });
    }
  };

  // Fetch medical history data
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          console.log('🔍 Fetching documents for user:', user.id);
          // Fetch user's documents from the new API
          const userDocuments = await userDocumentService.getUserDocuments(user.id);
          console.log('📄 Received documents:', userDocuments);
          
          // Convert API documents to the format expected by the UI
          const documents = userDocuments.map(doc => ({
            id: doc.id,
            type: doc.documentType,
            title: doc.fileName,
            date: doc.createdAt,
            status: doc.status
          }));
          console.log('📋 Converted documents:', documents);
          
          // Get user's medical data from database - in real app, this would be API calls
          const mockMedicalData = {
            diagnoses: [
              { id: '1', name: 'Type 2 Diabetes Mellitus', date: '2018-01-15', doctor: 'Dr. Sample Doctor', status: 'active', severity: 'moderate' },
              { id: '2', name: 'Hypertension', date: '2020-03-20', doctor: 'Dr. Sample Doctor', status: 'active', severity: 'mild' }
            ],
            documents: documents, // Real documents from API
            conditions: ['Type 2 Diabetes Mellitus', 'Hypertension'], // From user's medical profile
            medications: [
              { id: '1', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', startDate: '2018-01-15', doctor: 'Dr. Sample Doctor', status: 'active' },
              { id: '2', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', startDate: '2020-03-20', doctor: 'Dr. Sample Doctor', status: 'active' },
              { id: '3', name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', startDate: '2021-06-10', doctor: 'Dr. Sample Doctor', status: 'active' }
            ],
            aiInsights: [], // Start empty - insights will be generated when documents are processed
            careTeam: [
              { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Endocrinologist', email: 'sarah.johnson@hospital.com', status: 'active', role: 'primary' },
              { id: '2', name: 'Dr. Michael Chen', specialty: 'Cardiologist', email: 'michael.chen@hospital.com', status: 'active', role: 'consultant' }
            ]
          };
          setMedicalHistory(mockMedicalData);
        } catch (error) {
          console.error('❌ Error fetching user documents:', error);
          console.error('Error details:', error);
          // Fallback to empty documents if API fails
          const mockMedicalData = {
            diagnoses: [
              { id: '1', name: 'Type 2 Diabetes Mellitus', date: '2018-01-15', doctor: 'Dr. Sample Doctor', status: 'active', severity: 'moderate' },
              { id: '2', name: 'Hypertension', date: '2020-03-20', doctor: 'Dr. Sample Doctor', status: 'active', severity: 'mild' }
            ],
            documents: [], // Empty if API fails
            conditions: ['Type 2 Diabetes Mellitus', 'Hypertension'],
            medications: [
              { id: '1', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', startDate: '2018-01-15', doctor: 'Dr. Sample Doctor', status: 'active' },
              { id: '2', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', startDate: '2020-03-20', doctor: 'Dr. Sample Doctor', status: 'active' },
              { id: '3', name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', startDate: '2021-06-10', doctor: 'Dr. Sample Doctor', status: 'active' }
            ],
            aiInsights: [],
            careTeam: [
              { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Endocrinologist', email: 'sarah.johnson@hospital.com', status: 'active', role: 'primary' },
              { id: '2', name: 'Dr. Michael Chen', specialty: 'Cardiologist', email: 'michael.chen@hospital.com', status: 'active', role: 'consultant' }
            ]
          };
          setMedicalHistory(mockMedicalData);
          
          // Fetch care team data
          await fetchCareTeam();
          await fetchAvailableDoctors();
        }
      };
      
      fetchUserData();
    }
  }, [user]);

  // Separate effect for fetching care team data to ensure it loads
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🔄 Care team useEffect triggered');
      fetchCareTeam();
      fetchAvailableDoctors();
    }
  }, [isAuthenticated, user]);

  // Close status info when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showStatusInfo && !(event.target as Element).closest('.status-info-container')) {
        setShowStatusInfo(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusInfo]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Please log in to access your dashboard.</p>
          <Link to="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.firstName || user.username}!
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your health records and insights
              </p>
            </div>
            <div className="flex items-center space-x-4" />
          </div>
        </div>
      </div>

      {/* ABHA Linking Prompt */}
      {needsLinking && (
        <div className="bg-orange-50 border-b border-orange-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-orange-800">
                    ABHA ID Not Linked
                  </h3>
                  <p className="text-sm text-orange-700">
                    Link your ABHA ID to access your complete health records across all healthcare providers in India.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={() => setShowAbhaModal(true)}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Link ABHA ID
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => refreshAbhaStatus()}
                  className="text-orange-600 hover:text-orange-700"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1">
        
        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab('critical')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'critical'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <AlertTriangle className="h-4 w-4 inline mr-2" />
                Critical
              </button>
              <button
                onClick={() => setActiveTab('medical')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'medical'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Heart className="h-4 w-4 inline mr-2" />
                Medical History
              </button>
              <button
                onClick={() => setActiveTab('medications')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'medications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Pill className="h-4 w-4 inline mr-2" />
                Medications
              </button>
              <button
                onClick={() => setActiveTab('ai-insights')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'ai-insights'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Brain className="h-4 w-4 inline mr-2" />
                AI Insights
              </button>
              <button
                onClick={() => setActiveTab('emergency')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'emergency'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Phone className="h-4 w-4 inline mr-2" />
                Emergency Contact
              </button>
              
              

            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'critical' && (
          <div className="space-y-6">
            {/* Medical Conditions (collapsible) */}
            <Card>
              <CardHeader onClick={() => setOpenCriticalConditions(v=>!v)} className="cursor-pointer flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Medical Conditions</CardTitle>
                <Heart className="h-4 w-4 text-red-500" />
              </CardHeader>
              {openCriticalConditions && (
                <CardContent>
                  <div className="space-y-2">
                    {medicalHistory.conditions.length === 0 ? (
                      <div className="text-sm text-gray-500">No recorded conditions</div>
                    ) : (
                      medicalHistory.conditions.map((condition, idx) => (
                        <div key={idx} className="flex items-center p-2 bg-red-50 rounded border border-red-200">
                          <Heart className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-sm text-red-800">{condition}</span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Allergies (collapsible) */}
            <Card>
              <CardHeader onClick={() => setOpenCriticalAllergies(v=>!v)} className="cursor-pointer flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Allergies</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              {openCriticalAllergies && (
                <CardContent>
                  <div className="space-y-2">
                    {/* Placeholder as allergies are currently trimmed from editable profile */}
                    <div className="text-sm text-gray-500">No known allergies</div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        )}

        {/* Medical History Tab */}
        {activeTab === 'medical' && (
          <div className="space-y-6">
            
            {/* Current Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Current Medical Conditions
                </CardTitle>
                <CardDescription>
                  Your active medical conditions and diagnoses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {medicalHistory.conditions.map((condition, index) => (
                    <div key={index} className="flex items-center p-3 bg-red-50 rounded-lg border border-red-200">
                      <Heart className="h-4 w-4 text-red-500 mr-3" />
                      <span className="font-medium text-red-800">{condition}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Medical Diagnoses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Medical Diagnoses
                </CardTitle>
                <CardDescription>
                  Detailed diagnosis history with dates and doctors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medicalHistory.diagnoses.map((diagnosis) => (
                    <div key={diagnosis.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{diagnosis.name}</h4>
                          <p className="text-sm text-gray-600">Diagnosed on {new Date(diagnosis.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">By {diagnosis.doctor}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            diagnosis.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {diagnosis.status}
                          </span>
                          <p className="text-sm text-gray-600 mt-1">Severity: {diagnosis.severity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>



          </div>
        )}

        {/* Medications Tab */}
        {activeTab === 'medications' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-blue-500" />
                  Current Medications
                </CardTitle>
                <CardDescription>
                  Your active medications and prescriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medicalHistory.medications.map((medication) => (
                    <div key={medication.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{medication.name}</h4>
                          <p className="text-sm text-gray-600">Dosage: {medication.dosage}</p>
                          <p className="text-sm text-gray-600">Frequency: {medication.frequency}</p>
                          <p className="text-sm text-gray-600">Started: {new Date(medication.startDate).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">Prescribed by: {medication.doctor}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            medication.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {medication.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI Insights Tab */}
        {activeTab === 'ai-insights' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  AI-Generated Insights
                </CardTitle>
                <CardDescription>
                  Consolidated summary from all uploaded documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                {insightsLoading ? (
                  <div className="text-sm text-gray-600">Loading insights…</div>
                ) : insightsError ? (
                  <div className="text-sm text-red-600">{insightsError}</div>
                ) : !insights || (
                  (insights.diagnoses?.length || 0) + (insights.medications?.length || 0) + (insights.labResults?.length || 0) + (insights.advice?.length || 0)
                ) === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No AI insights yet</h3>
                    <p className="text-gray-600 mb-4">Upload medical documents to generate AI-powered health insights</p>
                    <Link to="/processor">
                      <Button variant="outline">Upload Document</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Diagnoses</h4>
                      <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                        {insights.diagnoses.map((d:any, idx:number) => (
                          <li key={idx} className="flex items-start justify-between gap-3">
                            <span>{d.text}</span>
                            {d.sourceId && (
                              <button className="text-xs text-blue-600 hover:underline" onClick={()=> navigate(`/user/documents?docId=${d.sourceId}`)}>View source</button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Medications</h4>
                      <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                        {insights.medications.map((m:any, idx:number) => (
                          <li key={idx} className="flex items-start justify-between gap-3">
                            <span>{m.name}{m.dosage ? ` - ${m.dosage}` : ''}{m.frequency ? ` (${m.frequency})` : ''}</span>
                            {m.sourceId && (
                              <button className="text-xs text-blue-600 hover:underline" onClick={()=> navigate(`/user/documents?docId=${m.sourceId}`)}>View source</button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Lab Results</h4>
                      <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                        {insights.labResults.map((t:any, idx:number) => (
                          <li key={idx} className="flex items-start justify-between gap-3">
                            <span>{t.name}: {t.value}{t.unit ? ` ${t.unit}` : ''} {t.status ? `(${t.status})` : ''}</span>
                            {t.sourceId && (
                              <button className="text-xs text-blue-600 hover:underline" onClick={()=> navigate(`/user/documents?docId=${t.sourceId}`)}>View source</button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Advice</h4>
                      <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                        {insights.advice.map((a:any, idx:number) => (
                          <li key={idx} className="flex items-start justify-between gap-3">
                            <span>{a.text}</span>
                            {a.sourceId && (
                              <button className="text-xs text-blue-600 hover:underline" onClick={()=> navigate(`/user/documents?docId=${a.sourceId}`)}>View source</button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Emergency Contact Tab */}
        {activeTab === 'emergency' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-500" />
                  Emergency Contact
                </CardTitle>
                <CardDescription>
                  Primary contact to reach in case of emergency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 min-w-40">Relationship</span>
                    <span className="text-sm font-medium text-gray-900">Spouse</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 min-w-40">Phone</span>
                    <span className="text-sm font-medium text-gray-900">+91 98765 43210</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        

        

          </div>

          {/* Right Sidebar removed: Care Team moved to dedicated page */}
        </div>
      </div>
      {/* ABHA Linking Modal */}
      {showAbhaModal && (
        <ABHALinkingModal
          isOpen={showAbhaModal}
          onClose={() => setShowAbhaModal(false)}
          onSuccess={async () => {
            setShowAbhaModal(false);
            await refreshAbhaStatus();
          }}
        />
      )}
    </div>
  );
};

export default UserDashboard;

