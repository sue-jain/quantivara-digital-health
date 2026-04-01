import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, AlertCircle, CheckCircle, User, Calendar, Phone, Mail, ExternalLink, Home, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import patientService, { PatientLookupResult } from '@/services/patients';

const PatientLookup: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PatientLookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lookupTime, setLookupTime] = useState<number | null>(null);
  const { toast } = useToast();

  const handleLookup = async () => {
    // Validate inputs
    if (!firstName.trim() || !lastName.trim() || !dateOfBirth.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!patientService.validateDateOfBirth(dateOfBirth)) {
      setError('Please enter a valid date of birth (YYYY-MM-DD)');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    const startTime = Date.now();

    try {
      const data = await patientService.lookupAbhaIdByNameAndDOB(
        firstName.trim(),
        lastName.trim(),
        dateOfBirth
      );
      
      const totalTime = Date.now() - startTime;
      setLookupTime(totalTime);
      setResult(data);
      
      toast({
        title: "Patient Found",
        description: `ABHA ID: ${patientService.formatAbhaId(data.abhaId)}`,
      });
    } catch (err: unknown) {
      const totalTime = Date.now() - startTime;
      setLookupTime(totalTime);
      
      if (err instanceof Error && err.message?.includes('404')) {
        setError('No patient found with the provided details');
      } else {
        setError('Error looking up patient. Please try again.');
      }
      
      toast({
        title: "Lookup Failed",
        description: "Unable to find patient with the provided details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };



  const handleAbhaIdClick = (abhaId: string) => {
    // Navigate to the existing ABHA lookup page with the ABHA ID
    navigate(`/demo/abha-lookup?abhaId=${abhaId}`);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Patient ABHA ID Lookup
            </h1>
            <p className="text-gray-600">
              Find patient ABHA ID using name and date of birth
            </p>
          </div>
          <div className="flex gap-3">
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
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Lookup Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Patient Lookup
            </CardTitle>
            <CardDescription>
              Enter patient details to find their ABHA ID
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Date of Birth</label>
              <Input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Format: YYYY-MM-DD</p>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleLookup} 
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Looking up...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Find ABHA ID
                  </>
                )}
              </Button>
            </div>

            {/* Demo Patient Dropdown */}
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Quick demo patients:</p>
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
                  const selectedValue = e.target.value;
                  if (selectedValue === 'ramesh') {
                    setFirstName('Ramesh');
                    setLastName('Kumar');
                    setDateOfBirth('1975-03-15');
                  } else if (selectedValue === 'priya') {
                    setFirstName('Priya');
                    setLastName('Sharma');
                    setDateOfBirth('1988-07-22');
                  } else if (selectedValue === 'suresh') {
                    setFirstName('Suresh');
                    setLastName('Patel');
                    setDateOfBirth('1965-11-08');
                  } else if (selectedValue === 'ashok') {
                    setFirstName('Ashok');
                    setLastName('Gupta');
                    setDateOfBirth('1980-01-30');
                  } else if (selectedValue === 'meera') {
                    setFirstName('Meera');
                    setLastName('Singh');
                    setDateOfBirth('1992-09-14');
                  }
                }}
                disabled={loading}
              >
                <option value="">Select a demo patient...</option>
                <option value="ramesh">Ramesh Kumar (1975-03-15) - Diabetes</option>
                <option value="priya">Priya Sharma (1988-07-22) - Asthma</option>
                <option value="suresh">Suresh Patel (1965-11-08) - Heart Disease</option>
                <option value="ashok">Ashok Gupta (1980-01-30) - Hypertension</option>
                <option value="meera">Meera Singh (1992-09-14) - Thyroid</option>
              </select>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Lookup Results
            </CardTitle>
            <CardDescription>
              Patient information and ABHA ID
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">Patient Found</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        ABHA ID
                      </Badge>
                      <button
                        onClick={() => handleAbhaIdClick(result.abhaId)}
                        className="group flex items-center gap-2 p-2 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <p className="font-mono text-lg font-bold text-green-700 group-hover:text-green-800">
                          {patientService.formatAbhaId(result.abhaId)}
                        </p>
                        <ExternalLink className="h-4 w-4 text-green-600 group-hover:text-green-700" />
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        Click to view full patient details
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{result.patientInfo.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{patientService.formatDateOfBirth(result.patientInfo.dateOfBirth)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Gender:</span>
                        <span>{result.patientInfo.gender}</span>
                      </div>
                      {result.patientInfo.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{result.patientInfo.phone}</span>
                        </div>
                      )}
                      {result.patientInfo.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-xs">{result.patientInfo.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {lookupTime && (
                  <div className="text-xs text-gray-500 text-center">
                    Lookup completed in {lookupTime}ms
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Enter patient details to find their ABHA ID</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Information Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">1. Enter Details</h4>
              <p className="text-gray-600">
                Provide the patient's first name, last name, and date of birth in the exact format.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Database Lookup</h4>
              <p className="text-gray-600">
                The system searches the database using optimized indexes for fast retrieval.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Get ABHA ID</h4>
              <p className="text-gray-600">
                If found, the patient's ABHA ID and basic information are displayed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientLookup; 