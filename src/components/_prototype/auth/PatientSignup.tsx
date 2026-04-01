import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, UserPlus } from 'lucide-react';
import santhicaLogo from '@/assets/santhica-logo.png';
import { useAuth } from '@/contexts/AuthContext';

interface PatientSignupProps {
  onBack: () => void;
  onSuccess: () => void; // Called after successful signup+login to move to ABHA linking
}

const PatientSignup: React.FC<PatientSignupProps> = ({ onBack, onSuccess }) => {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim() || phone.replace(/\D/g, '').length !== 10 || !dateOfBirth || !username.trim() || !password.trim()) {
      setError('Please complete all fields with valid values');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        username,
        password,
        phone: phone.replace(/\D/g, ''),
        firstName,
        lastName,
        dateOfBirth,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

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
                <UserPlus className="h-8 w-8 text-gray-700" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Create Patient Account</CardTitle>
            <CardDescription className="text-gray-600 mt-2">Sign up to access your health records</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-[#BBF1F1] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-[#BBF1F1] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-[#BBF1F1] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <div className="flex border-2 border-gray-200 rounded-xl overflow-visible focus-within:border-[#BBF1F1] transition-colors">
                  <div className="bg-gray-50 px-4 py-3 border-r border-gray-200 flex items-center">
                    <span className="text-sm font-medium text-gray-700">🇮🇳 +91</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    className="flex-1 px-4 py-3 text-lg outline-none"
                    maxLength={10}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Choose Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your_username"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-[#BBF1F1] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Choose Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-[#BBF1F1] focus:outline-none transition-colors"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 text-gray-800"
                style={{ backgroundColor: '#BBF1F1' }}
              >
                {isLoading ? 'Creating account…' : 'Create Account'}
              </Button>

              <Button
                variant="ghost"
                onClick={onBack}
                className="w-full flex items-center gap-2 text-gray-600 hover:text-gray-800"
                type="button"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login Options
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">After signup, we will guide you to link your ABHA ID.</p>
        </div>
      </div>
    </div>
  );
};

export default PatientSignup;


