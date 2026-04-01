import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Loader2, AlertCircle, CheckCircle, User, Phone, Calendar, Heart, Pill, FileText, Clock, Home, Brain, Activity, TrendingUp, AlertTriangle, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import patientService, { EmergencyProfile } from '@/services/patients';
import { demoMedicationsStore } from './VoicePatientLookupDemo';

const ABHALookup: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [abhaId, setAbhaId] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<EmergencyProfile | null>(null);
  const [aiProfile, setAiProfile] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lookupTime, setLookupTime] = useState<number | null>(null);
  const { toast } = useToast();

  // Handle URL parameter for ABHA ID
  useEffect(() => {
    const urlAbhaId = searchParams.get('abhaId');
    if (urlAbhaId) {
      setAbhaId(patientService.formatAbhaId(urlAbhaId));
      // Automatically trigger lookup after a short delay
      setTimeout(() => {
        handleLookupWithId(urlAbhaId);
      }, 100);
    }
  }, [searchParams]);


  
  const handleLookupWithId = async (id: string) => {
    const cleanedId = patientService.cleanAbhaId(id);
    
    if (!patientService.validateAbhaId(cleanedId)) {
      setError('Please enter a valid 14-digit ABHA ID');
      return;
    }
    
    setLoading(true);
    setError(null);
    setProfile(null);
    const startTime = Date.now();
    
    try {
      const data = await patientService.getEmergencyProfile(cleanedId);
      const totalTime = Date.now() - startTime;
      setLookupTime(totalTime);
      setProfile(data);
      
      // Fetch AI profile data
      await fetchAIProfile(cleanedId);
      
      toast({
        title: "Patient Found",
        description: `Emergency profile retrieved in ${totalTime}ms`,
      });
    } catch (err) {
      const totalTime = Date.now() - startTime;
      setLookupTime(totalTime);
      setError('Patient not found or server error');
      
      toast({
        title: "Lookup Failed",
        description: "Unable to retrieve patient information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = async () => {
    await handleLookupWithId(abhaId);
  };

  const fetchAIProfile = async (abhaId: string) => {
    setAiLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/v1/patients/${abhaId}/ai-profile`);
      if (response.ok) {
        const data = await response.json();
        
        // Deduplicate data to prevent duplicate entries
        const deduplicatedData = {
          ...data.data,
          medications: {
            ...data.data.medications,
            items: data.data.medications.items.filter((med: any, index: number, self: any[]) => 
              index === self.findIndex((m: any) => 
                m.medication_name === med.medication_name && 
                m.dosage === med.dosage &&
                m.frequency === med.frequency
              )
            )
          },
          labResults: {
            ...data.data.labResults,
            items: data.data.labResults.items.filter((lab: any, index: number, self: any[]) => 
              index === self.findIndex((l: any) => 
                l.test_name === lab.test_name && 
                l.value === lab.value &&
                l.unit === lab.unit
              )
            )
          },
          vitalSigns: {
            ...data.data.vitalSigns,
            items: data.data.vitalSigns.items.filter((vital: any, index: number, self: any[]) => 
              index === self.findIndex((v: any) => 
                v.vital_type === vital.vital_type && 
                v.value === vital.value &&
                v.unit === vital.unit
              )
            )
          },
          criticalAlerts: {
            ...data.data.criticalAlerts,
            items: data.data.criticalAlerts.items.filter((alert: any, index: number, self: any[]) => 
              index === self.findIndex((a: any) => 
                a.alert_type === alert.alert_type && 
                a.message === alert.message
              )
            )
          }
        };
        
        // Update counts after deduplication
        deduplicatedData.medications.count = deduplicatedData.medications.items.length;
        deduplicatedData.medications.active = deduplicatedData.medications.items.filter((m: any) => m.is_active === 1).length;
        deduplicatedData.labResults.count = deduplicatedData.labResults.items.length;
        deduplicatedData.labResults.abnormal = deduplicatedData.labResults.items.filter((l: any) => l.status !== 'NORMAL').length;
        deduplicatedData.vitalSigns.count = deduplicatedData.vitalSigns.items.length;
        deduplicatedData.criticalAlerts.count = deduplicatedData.criticalAlerts.items.length;
        deduplicatedData.criticalAlerts.highSeverity = deduplicatedData.criticalAlerts.items.filter((c: any) => c.severity === 'high').length;
        
        setAiProfile(deduplicatedData);
      } else {
        console.warn('AI profile not available');
        setAiProfile(null);
      }
    } catch (error) {
      console.warn('Error fetching AI profile:', error);
      setAiProfile(null);
    } finally {
      setAiLoading(false);
    }
  };

  // Helper functions for lab results styling (matching LabReportResult format)
  const getStatusColor = (status: string) => {
    if (status === 'HIGH') return 'bg-orange-100 text-orange-800 border-orange-200';
    if (status === 'LOW') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'NORMAL') return <CheckCircle className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };
  

  
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">ABHA ID Emergency Lookup</h1>
            <p className="text-muted-foreground mb-4">
              Lightning-fast patient information retrieval for emergency situations
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
            <Button
              onClick={() => navigate('/demo')}
              variant="outline"
              className="flex items-center gap-2 hover:bg-green-50 hover:border-green-300"
            >
              <Grid3X3 className="h-4 w-4" />
              Back to Demo Hub
            </Button>
          </div>
        </div>
        
        {/* Demo Alert */}
        <Alert className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Investor Demo Feature</AlertTitle>
          <AlertDescription>
            This demonstrates our <strong>3-second emergency lookup</strong> capability. 
            In real emergencies, every second counts. Our system retrieves complete patient 
            history instantly using ABHA ID integration.
          </AlertDescription>
        </Alert>
      </div>
      
      {/* Search Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Enter ABHA ID</CardTitle>
          <CardDescription>
            14-digit unique health identifier for instant patient lookup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="XXXX-XXXX-XXXX-XX"
              value={abhaId}
              onChange={(e) => setAbhaId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
              className="text-lg font-mono"
              disabled={loading}
            />
            <Button 
              onClick={handleLookup} 
              disabled={loading || !abhaId}
              size="lg"
              className="min-w-[120px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Lookup
                </>
              )}
            </Button>
          </div>
          
          {/* Demo ABHA IDs Dropdown */}
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">Try with demo ABHA IDs:</p>
            <select 
              className="w-full p-2 border rounded-md bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              style={{ 
                backgroundColor: 'white !important', 
                color: '#111827 !important',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none'
              }}
              onChange={(e) => {
                if (e.target.value) {
                  setAbhaId(patientService.formatAbhaId(e.target.value));
                }
              }}
              disabled={loading}
            >
              <option value="">Select a demo ABHA ID...</option>
              <option value="12345678901234">1234-5678-9012-34 (Ramesh - Diabetes)</option>
              <option value="98765432109876">9876-5432-1098-76 (Priya - Asthma)</option>
              <option value="45678901234567">4567-8901-2345-67 (Suresh - Heart)</option>
              <option value="11112222333344">1111-2222-3333-44 (Ashok - Hypertension)</option>
              <option value="55556666777788">5555-6666-7777-88 (Meera - Thyroid)</option>
            </select>
          </div>
        </CardContent>
      </Card>
      
      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Loading Animation */}
      {loading && (
        <Card className="mb-6">
          <CardContent className="py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Retrieving Patient Information</h3>
              <p className="text-muted-foreground">Accessing ABHA central database...</p>
              <div className="mt-4 flex justify-center gap-2">
                <Badge variant="secondary" className="animate-pulse">Connecting</Badge>
                <Badge variant="secondary" className="animate-pulse delay-75">Authenticating</Badge>
                <Badge variant="secondary" className="animate-pulse delay-150">Fetching Data</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Results Display */}
      {profile && !loading && (
        <div className="space-y-6">
          {/* Performance Metric */}
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Lightning Fast Retrieval</AlertTitle>
            <AlertDescription className="text-green-700">
              Patient emergency profile retrieved in <strong>{profile.responseTime}</strong> 
              {lookupTime && lookupTime > 3000 && ' (includes 3-second demo delay)'}
            </AlertDescription>
          </Alert>
          
          {/* Patient Summary Card */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <User className="h-6 w-6" />
                    {profile.patient.name}
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    {profile.patient.age} years • {profile.patient.gender} • Blood Group: {profile.patient.bloodGroup}
                  </CardDescription>
                </div>
                <Badge variant="success" className="text-base px-3 py-1">
                  <Heart className="h-4 w-4 mr-1" />
                  Emergency Profile
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <Tabs defaultValue="critical" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="critical">Critical Info</TabsTrigger>
                  <TabsTrigger value="medications">Medications</TabsTrigger>
                  <TabsTrigger value="documents">Recent Docs</TabsTrigger>
                  <TabsTrigger value="contact">Emergency Contact</TabsTrigger>
                  <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
                </TabsList>
                
                <TabsContent value="critical" className="space-y-4 mt-6">
                  {/* Medical Conditions */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      Medical Conditions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.criticalInfo.conditions.length > 0 ? (
                        profile.criticalInfo.conditions.map((condition, index) => (
                          <Badge key={index} variant="destructive">
                            {condition}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">No chronic conditions</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Allergies */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      Allergies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.criticalInfo.allergies.length > 0 ? (
                        profile.criticalInfo.allergies.map((allergy, index) => (
                          <Badge key={index} variant="outline" className="border-orange-500 text-orange-700">
                            {allergy}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">No known allergies</span>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="medications" className="mt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Pill className="h-4 w-4" />
                    Current Medications
                  </h4>
                  
                  {/* Demo store medications (newly added via voice commands) */}
                  {(() => {
                    const demoMeds = demoMedicationsStore.get(abhaId) || [];
                    const cleanedAbhaId = patientService.cleanAbhaId(abhaId);
                    const formattedAbhaId = patientService.formatAbhaId(abhaId);
                    const allDemoKeys = Array.from(demoMedicationsStore.keys());
                    
                    console.log('🔍 Debug medication lookup:', {
                      abhaId,
                      cleanedAbhaId,
                      formattedAbhaId,
                      allDemoKeys,
                      demoMeds,
                      storeSize: demoMedicationsStore.size
                    });
                    
                    // Try multiple ABHA ID formats to find medications
                    let foundMeds = demoMeds;
                    if (foundMeds.length === 0) {
                      foundMeds = demoMedicationsStore.get(cleanedAbhaId) || [];
                    }
                    if (foundMeds.length === 0) {
                      foundMeds = demoMedicationsStore.get(formattedAbhaId) || [];
                    }
                    
                    return foundMeds.length > 0 ? (
                      <div className="mb-6">
                        <h5 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                          💊 Current Medications ({foundMeds.length})
                        </h5>
                        <div className="space-y-3">
                          {foundMeds.map((med, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                              <div className="flex items-center gap-3">
                                <Pill className="h-4 w-4 text-green-600" />
                                <div>
                                  <p className="font-medium text-green-900">{med.name} {med.dosage}</p>
                                  <p className="text-sm text-green-700">{med.frequency}</p>
                                </div>
                              </div>
                              <div className="text-right text-xs text-green-600">
                                <p>Added: {med.addedAt}</p>
                                <p>By: {med.addedBy}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })()}
                  
                  {/* Original profile medications */}
                  {profile.criticalInfo.currentMedications.length > 0 ? (
                    <div>
                      <h5 className="font-medium text-blue-700 mb-3 flex items-center gap-2">
                        📋 Profile Medications
                      </h5>
                      <div className="space-y-2">
                        {profile.criticalInfo.currentMedications.map((med, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                            <Pill className="h-4 w-4 text-blue-600" />
                            <span className="text-blue-900">{med}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No profile medications on file</p>
                  )}
                  
                  {/* Summary */}
                  {(() => {
                    const demoMeds = demoMedicationsStore.get(abhaId) || [];
                    const cleanedAbhaId = patientService.cleanAbhaId(abhaId);
                    const formattedAbhaId = patientService.formatAbhaId(abhaId);
                    
                    // Try multiple ABHA ID formats to find medications
                    let foundMeds = demoMeds;
                    if (foundMeds.length === 0) {
                      foundMeds = demoMedicationsStore.get(cleanedAbhaId) || [];
                    }
                    if (foundMeds.length === 0) {
                      foundMeds = demoMedicationsStore.get(formattedAbhaId) || [];
                    }
                    
                    const totalMeds = foundMeds.length + profile.criticalInfo.currentMedications.length;
                    return totalMeds > 0 ? (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          Total medications: <span className="font-medium">{totalMeds}</span>
                          {foundMeds.length > 0 && (
                            <span className="ml-2 text-green-600">
                              (including {foundMeds.length} added via voice commands)
                            </span>
                          )}
                        </p>
                      </div>
                    ) : null;
                  })()}
                </TabsContent>
                
                <TabsContent value="documents" className="mt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Recent Medical Documents ({profile.totalDocuments} total)
                  </h4>
                  {profile.recentDocuments.length > 0 ? (
                    <div className="space-y-2">
                      {profile.recentDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-gray-600" />
                            <div>
                              <p className="font-medium">{doc.fileName || doc.type}</p>
                              <p className="text-sm text-muted-foreground">
                                {doc.provider} • {new Date(doc.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {doc.accuracy}% accuracy
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No recent documents</p>
                  )}
                </TabsContent>
                
                <TabsContent value="contact" className="mt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Emergency Contact
                  </h4>
                  {profile.emergencyContact ? (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <p className="text-lg font-medium">{profile.emergencyContact.name}</p>
                          <p className="text-muted-foreground">{profile.emergencyContact.relationship}</p>
                          <p className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${profile.emergencyContact.phone}`} className="text-primary hover:underline">
                              {profile.emergencyContact.phone}
                            </a>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <p className="text-muted-foreground">No emergency contact on file</p>
                  )}
                  
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Patient Contact:</p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${profile.patient.phone}`} className="text-primary hover:underline">
                        {profile.patient.phone}
                      </a>
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="ai-insights" className="mt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    AI Processing Results
                  </h4>
                  
                  {aiLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                      <p className="text-muted-foreground">Analyzing AI-extracted data...</p>
                    </div>
                  ) : aiProfile ? (
                    <div className="space-y-4">
                      {/* Summary Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Pill className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold text-blue-800">Medications</span>
                          </div>
                          <p className="text-2xl font-bold text-blue-900">{aiProfile.medications.count}</p>
                          <p className="text-sm text-blue-700">{aiProfile.medications.active} active</p>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Activity className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-green-800">Lab Results</span>
                          </div>
                          <p className="text-2xl font-bold text-green-900">{aiProfile.labResults.count}</p>
                          <p className="text-sm text-green-700">{aiProfile.labResults.abnormal} abnormal</p>
                        </div>
                        
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                            <span className="font-semibold text-purple-800">Vital Signs</span>
                          </div>
                          <p className="text-2xl font-bold text-purple-900">{aiProfile.vitalSigns.count}</p>
                          <p className="text-sm text-purple-700">Latest readings</p>
                        </div>
                        
                        <div className="bg-red-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="font-semibold text-red-800">Alerts</span>
                          </div>
                          <p className="text-2xl font-bold text-red-900">{aiProfile.criticalAlerts.count}</p>
                          <p className="text-sm text-red-700">{aiProfile.criticalAlerts.highSeverity} high severity</p>
                        </div>
                      </div>
                      
                      {/* Nested Tabs for AI Data */}
                      <Tabs defaultValue="medications" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="medications" className="flex items-center gap-2">
                            <Pill className="h-3 w-3" />
                            Medications
                          </TabsTrigger>
                          <TabsTrigger value="lab-results" className="flex items-center gap-2">
                            <Activity className="h-3 w-3" />
                            Lab Results
                          </TabsTrigger>
                          <TabsTrigger value="vital-signs" className="flex items-center gap-2">
                            <TrendingUp className="h-3 w-3" />
                            Vital Signs
                          </TabsTrigger>
                          <TabsTrigger value="alerts" className="flex items-center gap-2">
                            <AlertTriangle className="h-3 w-3" />
                            Alerts
                          </TabsTrigger>
                        </TabsList>
                        
                        {/* Medications Tab */}
                        <TabsContent value="medications" className="mt-4">
                          {aiProfile.medications.items.length > 0 ? (
                            <div className="space-y-3">
                              {aiProfile.medications.items.map((med: any, index: number) => (
                                <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                  <div className="flex justify-between items-start mb-3">
                                    <span className="font-semibold text-blue-900 text-lg">{med.medication_name}</span>
                                    <Badge variant="secondary" className="text-xs">
                                      {med.dosage}
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-blue-700 space-y-2">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <span className="font-medium">Frequency:</span>
                                        <p className="text-blue-800">{med.frequency}</p>
                                      </div>
                                      <div>
                                        <span className="font-medium">Duration:</span>
                                        <p className="text-blue-800">{med.duration}</p>
                                      </div>
                                    </div>
                                    {med.instructions && (
                                      <div>
                                        <span className="font-medium">Instructions:</span>
                                        <p className="text-blue-800">{med.instructions}</p>
                                      </div>
                                    )}
                                    <div className="text-xs text-blue-600 mt-3 pt-2 border-t border-blue-200">
                                      Prescribed: {new Date(med.prescribed_date).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <Pill className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                              <p className="text-muted-foreground">No medications extracted</p>
                            </div>
                          )}
                        </TabsContent>
                        
                        {/* Lab Results Tab */}
                        <TabsContent value="lab-results" className="mt-4">
                          {aiProfile.labResults.items.length > 0 ? (
                            <div className="space-y-6">
                              {/* Patient Information Card */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Patient Information
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                      <p className="text-sm text-muted-foreground">Patient</p>
                                      <p className="font-medium">{profile?.patient.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Age/Gender</p>
                                      <p className="font-medium">{profile?.patient.age || 'N/A'} Years, {profile?.patient.gender || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Sample ID</p>
                                      <p className="font-medium text-blue-600">LAB-{Date.now()}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Report Date</p>
                                      <p className="font-medium text-green-600">{new Date().toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Test Results Table */}
                              <Card>
                                <CardHeader>
                                  <CardTitle>Test Results</CardTitle>
                                  <CardDescription>AI extracted laboratory parameters</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="overflow-x-auto">
                                    <table className="w-full">
                                      <thead>
                                        <tr className="border-b">
                                          <th className="text-left py-3 px-4 font-semibold">Test</th>
                                          <th className="text-left py-3 px-4 font-semibold">Value</th>
                                          <th className="text-left py-3 px-4 font-semibold">Normal Range</th>
                                          <th className="text-left py-3 px-4 font-semibold">Status</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {aiProfile.labResults.items.map((lab: any, index: number) => (
                                          <tr key={index} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 font-medium">{lab.test_name}</td>
                                            <td className="py-3 px-4">{lab.value} {lab.unit}</td>
                                            <td className="py-3 px-4 text-muted-foreground">{lab.normal_range}</td>
                                            <td className="py-3 px-4">
                                              <Badge 
                                                className={`${getStatusColor(lab.status)} flex items-center gap-1 w-fit`}
                                              >
                                                {getStatusIcon(lab.status)}
                                                {lab.status}
                                              </Badge>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Summary Footer */}
                              <Card>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-center">
                                    <div className="flex gap-6">
                                      <div className="text-center">
                                        <div className="text-2xl font-bold text-red-600">0</div>
                                        <div className="text-sm text-muted-foreground">Critical Values</div>
                                      </div>
                                      <div className="text-center">
                                        <div className="text-2xl font-bold text-orange-600">{aiProfile.labResults.abnormal}</div>
                                        <div className="text-sm text-muted-foreground">Abnormal Values</div>
                                      </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      Extracted: {new Date(aiProfile.labResults.items[0]?.created_at || Date.now()).toLocaleDateString()}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                              <p className="text-muted-foreground">No lab results extracted</p>
                            </div>
                          )}
                        </TabsContent>
                        
                        {/* Vital Signs Tab */}
                        <TabsContent value="vital-signs" className="mt-4">
                          {aiProfile.vitalSigns.items.length > 0 ? (
                            <div className="space-y-3">
                              {aiProfile.vitalSigns.items.map((vital: any, index: number) => (
                                <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                  <div className="flex justify-between items-start mb-3">
                                    <span className="font-semibold text-purple-900 text-lg">{vital.vital_type}</span>
                                    <Badge variant="secondary" className="text-lg font-semibold">
                                      {vital.value} {vital.unit}
                                    </Badge>
                                  </div>
                                  <div className="text-xs text-purple-600 mt-3 pt-2 border-t border-purple-200">
                                    Recorded: {new Date(vital.created_at).toLocaleDateString()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                              <p className="text-muted-foreground">No vital signs extracted</p>
                            </div>
                          )}
                        </TabsContent>
                        
                        {/* Alerts Tab */}
                        <TabsContent value="alerts" className="mt-4">
                          {aiProfile.criticalAlerts.items.length > 0 ? (
                            <div className="space-y-3">
                              {aiProfile.criticalAlerts.items.map((alert: any, index: number) => (
                                <div key={index} className="p-4 bg-red-50 rounded-lg border border-red-200">
                                  <div className="flex justify-between items-start mb-3">
                                    <span className="font-semibold text-red-900 text-lg">{alert.alert_type}</span>
                                    <Badge variant="destructive">
                                      {alert.severity}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-red-700 mb-3 leading-relaxed">{alert.message}</p>
                                  <div className="text-xs text-red-600 mt-3 pt-2 border-t border-red-200">
                                    Generated: {new Date(alert.created_at).toLocaleDateString()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                              <p className="text-muted-foreground">No critical alerts generated</p>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No AI processing results available</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        AI insights will appear here when documents are processed
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Additional Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold mb-1">Need full medical history?</h4>
                  <p className="text-sm text-muted-foreground">
                    Access complete timeline, all reports, and treatment history
                  </p>
                </div>
                <Button>
                  <Clock className="mr-2 h-4 w-4" />
                  View Full Timeline
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ABHALookup;