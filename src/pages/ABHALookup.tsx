import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Loader2, AlertCircle, CheckCircle, User, Phone, Calendar, Heart, Pill, FileText, Clock, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import patientService, { EmergencyProfile } from '@/services/patients';

const ABHALookup: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [abhaId, setAbhaId] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<EmergencyProfile | null>(null);
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
              onClick={() => navigate('/demo/patient-lookup')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Back to Patient Lookup
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Home
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
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="critical">Critical Info</TabsTrigger>
                  <TabsTrigger value="medications">Medications</TabsTrigger>
                  <TabsTrigger value="documents">Recent Docs</TabsTrigger>
                  <TabsTrigger value="contact">Emergency Contact</TabsTrigger>
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
                  {profile.criticalInfo.currentMedications.length > 0 ? (
                    <div className="space-y-2">
                      {profile.criticalInfo.currentMedications.map((med, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <Pill className="h-4 w-4 text-gray-600" />
                          <span>{med}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No current medications</p>
                  )}
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