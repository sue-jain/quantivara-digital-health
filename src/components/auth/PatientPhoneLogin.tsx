import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Phone, Shield, Heart, Stethoscope } from 'lucide-react';
import santhicaLogo from '@/assets/santhica-logo.png';

interface PatientPhoneLoginProps {
  onBack: () => void;
  onSuccess: (phoneNumber: string) => void;
  onDoctor?: () => void;
  onUsernameLogin?: () => void;
  onSignup?: () => void;
}

const PatientPhoneLogin: React.FC<PatientPhoneLoginProps> = ({ onBack, onSuccess, onDoctor, onUsernameLogin, onSignup }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleSendOTP = async () => {
    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSuccess(phoneNumber);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(value);
    if (error) setError(null);
  };

  const demoNumbers = ['9876543210', '9876543211', '9876543212', '9876543213', '9876543214'];
  const demoOptions: Array<{ value: string; label: string }> = [
    { value: '9876543210', label: 'Ramesh Kumar (9876543210)' },
    { value: '9876543211', label: 'Priya Sharma (9876543211)' },
    { value: '9876543212', label: 'Suresh Patel (9876543212)' },
    { value: '9876543213', label: 'Ashok Gupta (9876543213)' },
    { value: '9876543214', label: 'Meera Singh (9876543214)' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Top brand bar */}
        <div className="rounded-t-2xl overflow-hidden">
          <div style={{ backgroundColor: '#BBF1F1' }} className="text-gray-800 px-4 py-3">
            <div className="flex items-center justify-center gap-2">
              <img src={santhicaLogo} alt="Santhica" style={{ height: 24, width: 'auto' }} />
              <div className="font-semibold">Santhica Digital Health Platform</div>
            </div>
            <div className="text-xs opacity-95 text-center">Secure • Private • Trusted</div>
          </div>
        </div>
        <Card className="shadow-xl border-0 rounded-t-none rounded-b-2xl">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center mb-4">
              <div style={{ backgroundColor: '#BBF1F1' }} className="p-3 rounded-full">
                <Heart className="h-8 w-8 text-gray-700" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome to Santhica
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Welcome Message */}
            <div className="text-center">
              <div className="text-4xl mb-3">👋</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Login</h3>
            </div>

            {/* Phone Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📱 Phone Number
                </label>
                <div ref={containerRef} className="relative flex border-2 border-gray-200 rounded-xl overflow-visible focus-within:border-[#BBF1F1] transition-colors">
                  <div className="bg-gray-50 px-4 py-3 border-r border-gray-200 flex items-center">
                    <span className="text-sm font-medium text-gray-700">🇮🇳 +91</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      handlePhoneChange(e);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="9876543210"
                    className="flex-1 px-4 py-3 text-lg outline-none"
                    maxLength={10}
                  />
                  <button
                    type="button"
                    aria-label="Toggle suggestions"
                    onMouseDown={(e) => { e.preventDefault(); setShowSuggestions((v) => !v); }}
                    className="px-3 border-l border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    ▾
                  </button>
                  {showSuggestions && (
                    <div
                      className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-56 overflow-auto"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {demoOptions
                        .filter((opt) => opt.value.includes(phoneNumber))
                        .map((opt) => (
                          <div
                            key={opt.value}
                            className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                              setPhoneNumber(opt.value);
                              setShowSuggestions(false);
                            }}
                          >
                            {opt.label}
                          </div>
                        ))}
                      {demoOptions.filter((opt) => opt.value.includes(phoneNumber)).length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500">No matches</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button
                onClick={handleSendOTP}
                disabled={phoneNumber.length !== 10 || isLoading}
                className="w-full py-3 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] text-gray-800"
                style={{ backgroundColor: '#BBF1F1' }}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    Sending OTP...
                  </div>
                ) : (
                  <>
                    Send OTP →
                  </>
                )}
              </Button>
              {/* Divider */}
              <div className="flex items-center gap-4 my-2 text-gray-400">
                <div className="h-px bg-gray-200 flex-1" />
                <span className="text-xs">or</span>
                <div className="h-px bg-gray-200 flex-1" />
              </div>
              
              {/* Auth action buttons (side-by-side on larger screens) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onUsernameLogin}
                  className="w-full py-3 text-sm font-semibold rounded-xl shadow-sm transition-all duration-200"
                  style={{ backgroundColor: '#BBF1F1', color: '#374151', border: '2px solid #BBF1F1' }}
                >
                  Username & password
                </button>
                <button
                  type="button"
                  onClick={onSignup}
                  className="w-full py-3 text-sm font-semibold rounded-xl shadow-sm transition-all duration-200"
                  style={{ backgroundColor: '#BBF1F1', color: '#374151', border: '2px solid #BBF1F1' }}
                >
                  Patient Sign Up
                </button>
              </div>

              {/* Doctor CTA removed per request; doctor login available from main selection */}
            </div>

            {/* Suggestions appear inline above; no separate demo dropdown needed */}

            {/* Security Note */}
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
              <Shield className="h-4 w-4" />
              <span>Your phone number is encrypted and secure</span>
            </div>

            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={onBack}
              className="w-full flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login Options
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientPhoneLogin;
