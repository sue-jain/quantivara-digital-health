import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Stethoscope, FlaskConical } from 'lucide-react';
import PatientAuthFlow from '@/components/auth/PatientAuthFlow';
import DoctorLogin from '@/components/auth/DoctorLogin';
import LabLogin from '@/components/auth/LabLogin';
import santhicaLogo from '@/assets/santhica-logo.png';

type LoginType = 'select' | 'patient' | 'doctor' | 'lab';

const LoginSelection: React.FC = () => {
  const [loginType, setLoginType] = useState<LoginType>('select');

  if (loginType === 'patient') return <PatientAuthFlow onBack={() => setLoginType('select')} />;
  if (loginType === 'doctor') return <DoctorLogin onBack={() => setLoginType('select')} />;
  if (loginType === 'lab') return <LabLogin onBack={() => setLoginType('select')} />;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
            <CardTitle className="text-2xl font-bold text-gray-900">Select Login</CardTitle>
            <CardDescription className="text-gray-600 mt-2">Choose your role to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLoginType('patient')}>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: '#BBF1F1' }}>
                    <Heart className="h-6 w-6 text-gray-800" />
                  </div>
                  <CardTitle>Patients</CardTitle>
                  <CardDescription>Sign in to manage your health</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-xs text-gray-500">Phone + OTP or account login</CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLoginType('doctor')}>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: '#BBF1F1' }}>
                    <Stethoscope className="h-6 w-6 text-gray-800" />
                  </div>
                  <CardTitle>Doctor</CardTitle>
                  <CardDescription>Sign in with HPR ID</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-xs text-gray-500">Professional access</CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLoginType('lab')}>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: '#BBF1F1' }}>
                    <FlaskConical className="h-6 w-6 text-gray-800" />
                  </div>
                  <CardTitle>Lab</CardTitle>
                  <CardDescription>Sign in to upload results</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-xs text-gray-500">Coming soon (prototype)</CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
};

export default LoginSelection;
