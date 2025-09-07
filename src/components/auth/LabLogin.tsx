import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlaskConical } from 'lucide-react';

interface LabLoginProps {
  onBack: () => void;
}

const LabLogin: React.FC<LabLoginProps> = ({ onBack }) => {
  const [labId, setLabId] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 rounded-2xl">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center mb-4">
              <div style={{ backgroundColor: '#BBF1F1' }} className="p-3 rounded-full">
                <FlaskConical className="h-8 w-8 text-gray-700" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Lab Login (Prototype)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lab ID</label>
              <input
                type="text"
                value={labId}
                onChange={(e) => setLabId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. LAB-12345"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
            <Button className="w-full" style={{ backgroundColor: '#BBF1F1', color: '#374151' }}>Sign in</Button>
            <Button variant="ghost" className="w-full" onClick={onBack}>Back to Login Options</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LabLogin;
