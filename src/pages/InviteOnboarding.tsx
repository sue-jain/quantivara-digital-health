import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authService from '@/services/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import labsService from '@/services/labs';

const InviteOnboarding: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState<string>('');
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [labId, setLabId] = useState<string>('');
  const [inviteId, setInviteId] = useState<string>('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.code) setInviteCode(params.code);
  }, [params.code]);

  const handleVerify = async () => {
    try {
      setVerifying(true);
      setError(null);
      await authService.verifyInviteOtp(inviteCode, otp);
    } catch (e: any) {
      setError(e.message || 'Invalid OTP');
    } finally {
      setVerifying(false);
    }
  };

  const handleComplete = async () => {
    try {
      setVerifying(true);
      setError(null);
      const res = await authService.registerFromInvite(inviteCode, username, password);
      navigate('/user');
    } catch (e: any) {
      setError(e.message || 'Failed to complete');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-gray-900">Continue Invite</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invite Code</label>
              <input value={inviteCode} onChange={(e)=>setInviteCode(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="INV-7X3Q" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
              <input type="password" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={otp} onChange={(e)=>setOtp(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="******" />
            </div>
            <div className="pt-2 border-t">
              <div className="text-sm font-medium text-gray-900 mb-2">Create Credentials</div>
              <input value={username} onChange={(e)=>setUsername(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2" placeholder="Choose username" />
              <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Choose password" />
            </div>
            {error && <div className="text-xs text-red-600">{error}</div>}
            <div className="flex gap-2">
              <Button onClick={handleVerify} disabled={!inviteCode || otp.length!==6 || verifying} variant="outline">Verify OTP</Button>
              <Button onClick={handleComplete} disabled={!inviteCode || !otp || !username || !password || verifying} style={{ backgroundColor: '#BBF1F1', color: '#374151' }}>{verifying ? 'Finishing…' : 'Finish & Login'}</Button>
              <Button variant="outline" onClick={()=>navigate('/login')}>Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InviteOnboarding;
