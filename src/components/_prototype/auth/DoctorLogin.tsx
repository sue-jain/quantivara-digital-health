import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Stethoscope, Shield, Eye, EyeOff } from 'lucide-react';
import santhicaLogo from '@/assets/santhica-logo.png';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface DoctorLoginProps {
  onBack: () => void;
}

const DoctorLogin: React.FC<DoctorLoginProps> = ({ onBack }) => {
  const [nmrId, setNmrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showIdSuggestions, setShowIdSuggestions] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nmrId.trim() || !password.trim()) {
      setError('Please enter both HPR ID and password');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await login(nmrId.trim(), password, 'doctor');
      navigate('/doctor');
    } catch (err: any) {
      setError(err.message || 'Invalid HPR ID or password');
    } finally {
      setIsLoading(false);
    }
  };

  const demoNMRIds = [
    '12345678-MH',
    '87654321-MH', 
    '11223344-MH',
    '99887766-MH',
    '55667788-MH'
  ];

  const demoOptions: Array<{ value: string; label: string }> = [
    { value: '12345678-MH', label: 'Dr. Shubham Nimesh — General Physician (12345678-MH)' },
    { value: '87654321-MH', label: 'Dr. Meera Patel — Cardiologist (87654321-MH)' },
    { value: '11223344-MH', label: 'Dr. Rajesh Verma — Cardiologist (11223344-MH)' },
    { value: '99887766-MH', label: 'Dr. Anita Desai — Internal Medicine (99887766-MH)' },
    { value: '55667788-MH', label: 'Dr. Priya Sharma — Endocrinologist (55667788-MH)' }
  ];

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
                <Stethoscope className="h-8 w-8 text-gray-700" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Doctor Login
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Professional access to healthcare platform
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Welcome Message */}
            <div className="text-center">
              <div className="text-4xl mb-3">👨‍⚕️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Welcome, Doctor
              </h3>
              <p className="text-sm text-gray-600">
                Access your practice dashboard securely
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🆔 HPR ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={nmrId}
                    onChange={(e) => {
                      setNmrId(e.target.value);
                      if (error) setError(null);
                    }}
                    onFocus={() => setShowIdSuggestions(true)}
                    placeholder="12345678-MH"
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-[#BBF1F1] focus:outline-none transition-colors pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    aria-label="Toggle HPR suggestions"
                    onMouseDown={(e) => { e.preventDefault(); setShowIdSuggestions((v) => !v); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  >
                    ▾
                  </button>
                  {showIdSuggestions && (
                    <div
                      className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-56 overflow-auto"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {demoOptions
                        .filter((opt) => opt.value.includes(nmrId))
                        .map((opt) => (
                          <div
                            key={opt.value}
                            className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                              setNmrId(opt.value);
                              setPassword('demo123');
                              setShowIdSuggestions(false);
                            }}
                          >
                            {opt.label}
                          </div>
                        ))}
                      {demoOptions.filter((opt) => opt.value.includes(nmrId)).length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500">No matches</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔒 Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-12 text-lg border-2 border-gray-200 rounded-xl focus:border-[#BBF1F1] focus:outline-none transition-colors"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={!nmrId.trim() || !password.trim() || isLoading}
                className="w-full py-3 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] text-gray-800"
                style={{ backgroundColor: '#BBF1F1' }}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    Signing in...
                  </div>
                ) : (
                  <>
                    Login as Doctor →
                  </>
                )}
              </Button>
            </form>

            {/* Demo suggestions are integrated into the NMR field above */}

            {/* Removed text list of demo doctors; info included in dropdown above */}

            {/* Security Note */}
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
              <Shield className="h-4 w-4" />
              <span>Professional-grade security with encrypted authentication</span>
            </div>

            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={onBack}
              className="w-full flex items-center gap-2 text-gray-600 hover:text-gray-800"
              type="button"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login Options
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Secure access for healthcare professionals.<br />
            Your credentials are encrypted and protected.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
