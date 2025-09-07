import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Building2, CreditCard, Plus, Search, CheckCircle, AlertCircle } from 'lucide-react';
import santhicaLogo from '@/assets/santhica-logo.png';

interface ABHALinkingFlowProps {
  phoneNumber: string;
  onBack: () => void;
  onSuccess: (abhaId: string) => void;
  onSkip: () => void;
}

type ABHAScenario = 'choose' | 'know_abha' | 'forgot_abha' | 'create_abha' | 'success';

const ABHALinkingFlow: React.FC<ABHALinkingFlowProps> = ({
  phoneNumber,
  onBack,
  onSuccess,
  onSkip
}) => {
  const [scenario, setScenario] = useState<ABHAScenario>('choose');
  const [abhaId, setAbhaId] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundAbhaId, setFoundAbhaId] = useState<string | null>(null);

  // Demo data for different phone numbers
  const DEMO_DATA: Record<string, any> = {
    '9876543210': {
      name: 'Ramesh Kumar',
      aadhar: '1234-5678-9012',
      existing_abha: '12-3456-7890-1234',
      scenario: 'has_abha_knows_id'
    },
    '9876543211': {
      name: 'Priya Sharma',
      aadhar: '2345-6789-0123',
      existing_abha: '98-7654-3210-9876',
      scenario: 'has_abha_forgot_id'
    },
    '9876543212': {
      name: 'Suresh Patel',
      aadhar: '3456-7890-1234',
      existing_abha: null,
      scenario: 'needs_new_abha'
    },
    '9876543213': {
      name: 'Ashok Gupta',
      aadhar: '4567-8901-2345',
      existing_abha: '11-2233-4455-6677',
      scenario: 'has_abha_knows_id'
    },
    '9876543214': {
      name: 'Meera Singh',
      aadhar: '5678-9012-3456',
      existing_abha: '22-3344-5566-7788',
      scenario: 'has_abha_forgot_id'
    }
  };

  const demoData = DEMO_DATA[phoneNumber] || DEMO_DATA['9876543210'];

  const handleKnowABHA = async () => {
    if (abhaId.replace(/[-\s]/g, '').length !== 14) {
      setError('Please enter a valid 14-digit ABHA ID');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate ABHA ID validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const cleanAbhaId = abhaId.replace(/[-\s]/g, '');
      const formattedAbhaId = `${cleanAbhaId.slice(0, 2)}-${cleanAbhaId.slice(2, 6)}-${cleanAbhaId.slice(6, 10)}-${cleanAbhaId.slice(10, 14)}`;
      
      setScenario('success');
      setTimeout(() => onSuccess(formattedAbhaId), 1500);
    } catch (err) {
      setError('ABHA ID not found. Please check and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindABHA = async () => {
    if (aadharNumber.replace(/[-\s]/g, '').length !== 12) {
      setError('Please enter a valid 12-digit Aadhar number');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate ABHA ID lookup by Aadhar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (demoData.existing_abha) {
        setFoundAbhaId(demoData.existing_abha);
      } else {
        setError('No ABHA ID found for this Aadhar number. Please create a new one.');
      }
    } catch (err) {
      setError('Failed to find ABHA ID. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateABHA = async () => {
    if (aadharNumber.replace(/[-\s]/g, '').length !== 12) {
      setError('Please enter a valid 12-digit Aadhar number');
      return;
    }
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!dateOfBirth) {
      setError('Please enter your date of birth');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate ABHA ID generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a new ABHA ID
      const newAbhaId = `${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`;
      
      setFoundAbhaId(newAbhaId);
      setScenario('success');
      setTimeout(() => onSuccess(newAbhaId), 1500);
    } catch (err) {
      setError('Failed to create ABHA ID. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatAadhar = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
  };

  const formatABHA = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4');
  };

  if (scenario === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0">
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ABHA ID Linked Successfully!
              </h2>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
                <p className="text-sm text-green-800 font-medium">
                  Your ABHA ID: <span className="font-bold">{foundAbhaId || abhaId}</span>
                </p>
              </div>
              <p className="text-gray-600 mb-6">
                Your health records are now connected across all healthcare providers in India.
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-3">
                Redirecting to dashboard...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-t-2xl overflow-hidden">
          <div style={{ backgroundColor: '#BBF1F1' }} className="text-gray-800 px-4 py-3">
            <div className="flex items-center justify-center gap-2">
              <img src={santhicaLogo} alt="Santhica" style={{ height: 24, width: 'auto' }} />
              <div className="font-semibold">Santhica Digital Health Platform</div>
            </div>
          </div>
        </div>
        <Card className="shadow-xl border-0 rounded-t-none rounded-b-2xl">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center mb-4">
              <div style={{ backgroundColor: '#BBF1F1' }} className="p-3 rounded-full">
                <Building2 className="h-8 w-8 text-gray-700" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Link your ABHA ID
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Connect your health records for better care
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {scenario === 'choose' && (
              <>
                <div className="text-center">
                  <div className="text-4xl mb-3">🏥</div>
                  <p className="text-sm text-gray-600">
                    ABHA ID helps you access your medical records across all healthcare providers
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => setScenario('know_abha')}
                    variant="outline"
                    className="w-full p-4 h-auto border-2 hover:border-[#BBF1F1] hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-gray-600" />
                      <div className="text-left">
                        <div className="font-semibold">I know my ABHA ID</div>
                        <div className="text-sm text-gray-500">Enter your 14-digit ABHA ID</div>
                      </div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => setScenario('forgot_abha')}
                    variant="outline"
                    className="w-full p-4 h-auto border-2 hover:border-[#BBF1F1] hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Search className="h-6 w-6 text-gray-600" />
                      <div className="text-left">
                        <div className="font-semibold">I have ABHA but forgot ID</div>
                        <div className="text-sm text-gray-500">Find using Aadhar number</div>
                      </div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => setScenario('create_abha')}
                    variant="outline"
                    className="w-full p-4 h-auto border-2 hover:border-[#BBF1F1] hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Plus className="h-6 w-6 text-gray-600" />
                      <div className="text-left">
                        <div className="font-semibold">I need to create ABHA ID</div>
                        <div className="text-sm text-gray-500">Generate new ABHA ID</div>
                      </div>
                    </div>
                  </Button>
                </div>

                <div className="text-center">
                  <Button variant="ghost" onClick={onSkip} className="text-gray-500">
                    Skip for now
                  </Button>
                </div>
              </>
            )}

            {scenario === 'know_abha' && (
              <>
                <div className="text-center">
                  <div className="text-4xl mb-3">🆔</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Enter your ABHA ID
                  </h3>
                  <p className="text-sm text-gray-600">
                    Enter your 14-digit ABHA ID
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ABHA ID
                    </label>
                    <input
                      type="text"
                      value={abhaId}
                      onChange={(e) => {
                        const formatted = formatABHA(e.target.value);
                        if (formatted.replace(/\D/g, '').length <= 14) {
                          setAbhaId(formatted);
                        }
                        if (error) setError(null);
                      }}
                      placeholder="12-3456-7890-1234"
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-[#BBF1F1] focus:outline-none transition-colors text-center tracking-wider"
                      maxLength={17}
                    />
                  </div>

                  {/* Demo ABHA ID */}
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">
                      🎬 Demo ABHA ID: <span className="font-bold">{demoData.existing_abha || '12-3456-7890-1234'}</span>
                    </p>
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <Button
                    onClick={handleKnowABHA}
                    disabled={abhaId.replace(/\D/g, '').length !== 14 || isLoading}
                    className="w-full py-3 text-lg font-semibold rounded-xl text-gray-800"
                    style={{ backgroundColor: '#BBF1F1' }}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        Linking ABHA ID...
                      </div>
                    ) : (
                      'Link ABHA ID →'
                    )}
                  </Button>
                </div>
              </>
            )}

            {scenario === 'forgot_abha' && (
              <>
                <div className="text-center">
                  <div className="text-4xl mb-3">🔍</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Find your ABHA ID
                  </h3>
                  <p className="text-sm text-gray-600">
                    Enter your Aadhar number to retrieve your ABHA ID
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aadhar Number
                    </label>
                    <input
                      type="text"
                      value={aadharNumber}
                      onChange={(e) => {
                        const formatted = formatAadhar(e.target.value);
                        if (formatted.replace(/\D/g, '').length <= 12) {
                          setAadharNumber(formatted);
                        }
                        if (error) setError(null);
                      }}
                      placeholder="1234-5678-9012"
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-[#BBF1F1] focus:outline-none transition-colors text-center tracking-wider"
                      maxLength={14}
                    />
                  </div>

                  {/* Demo Aadhar */}
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">
                      🎬 Demo Aadhar: <span className="font-bold">{demoData.aadhar}</span>
                    </p>
                  </div>

                  {foundAbhaId && (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-green-800">ABHA ID Found!</span>
                      </div>
                      <p className="text-sm text-green-700">
                        Your ABHA ID: <span className="font-bold">{foundAbhaId}</span>
                      </p>
                      <Button
                        onClick={() => {
                          setScenario('success');
                          setTimeout(() => onSuccess(foundAbhaId), 1500);
                        }}
                        className="w-full mt-3 text-gray-800"
                        style={{ backgroundColor: '#BBF1F1' }}
                      >
                        Link this ABHA ID →
                      </Button>
                    </div>
                  )}

                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  {!foundAbhaId && (
                    <Button
                      onClick={handleFindABHA}
                      disabled={aadharNumber.replace(/\D/g, '').length !== 12 || isLoading}
                      className="w-full py-3 text-lg font-semibold rounded-xl text-gray-800"
                      style={{ backgroundColor: '#BBF1F1' }}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                          Searching...
                        </div>
                      ) : (
                        'Find ABHA ID →'
                      )}
                    </Button>
                  )}
                </div>
              </>
            )}

            {scenario === 'create_abha' && (
              <>
                <div className="text-center">
                  <div className="text-4xl mb-3">➕</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Create new ABHA ID
                  </h3>
                  <p className="text-sm text-gray-600">
                    Enter your details to generate a new ABHA ID
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aadhar Number
                    </label>
                    <input
                      type="text"
                      value={aadharNumber}
                      onChange={(e) => {
                        const formatted = formatAadhar(e.target.value);
                        if (formatted.replace(/\D/g, '').length <= 12) {
                          setAadharNumber(formatted);
                        }
                        if (error) setError(null);
                      }}
                      placeholder="1234-5678-9012"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#BBF1F1] focus:outline-none transition-colors text-center tracking-wider"
                      maxLength={14}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#BBF1F1] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => {
                        setDateOfBirth(e.target.value);
                        if (error) setError(null);
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#BBF1F1] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Demo Data */}
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium mb-1">🎬 Demo Data:</p>
                    <p className="text-xs text-blue-700">
                      Aadhar: {demoData.aadhar}<br />
                      Name: {demoData.name}<br />
                      DOB: 15/08/1985
                    </p>
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <Button
                    onClick={handleCreateABHA}
                    disabled={!aadharNumber || !fullName || !dateOfBirth || isLoading}
                    className="w-full py-3 text-lg font-semibold rounded-xl text-gray-800"
                    style={{ backgroundColor: '#BBF1F1' }}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        Creating ABHA ID...
                      </div>
                    ) : (
                      'Generate ABHA ID →'
                    )}
                  </Button>
                </div>
              </>
            )}

            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => scenario === 'choose' ? onBack() : setScenario('choose')}
              className="w-full flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              {scenario === 'choose' ? 'Back to OTP' : 'Back to Options'}
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            ABHA ID is issued by the National Health Authority, Government of India.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ABHALinkingFlow;
