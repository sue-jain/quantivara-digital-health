import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlaskConical } from 'lucide-react';
import labsService, { DemoLabItem } from '@/services/labs';
import { useNavigate } from 'react-router-dom';

interface LabLoginProps {
  onBack: () => void;
}

const LabLogin: React.FC<LabLoginProps> = ({ onBack }) => {
  const [labId, setLabId] = useState('');
  const [password, setPassword] = useState('');
  const [labs, setLabs] = useState<DemoLabItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await labsService.listLabs();
        setLabs(list);
      } catch {}
    };
    load();
  }, []);

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
              <label className="block text-sm font-medium text-gray-700 mb-1">HFR ID</label>
              <div ref={containerRef} className="relative">
                <input
                  type="text"
                  value={labId}
                  onChange={(e) => { setLabId(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. HFR-MUM-001"
                />
                <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600" onMouseDown={(e)=>{e.preventDefault(); setShowDropdown(v=>!v);}}>▾</button>
                {showDropdown && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-56 overflow-auto" onMouseDown={(e)=>e.preventDefault()}>
                    {labs.filter(l=> l.hfrUid.toLowerCase().includes(labId.toLowerCase()) || l.name.toLowerCase().includes(labId.toLowerCase())).map(lab => (
                      <div key={lab.id} className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer" onClick={() => { setLabId(lab.hfrUid); setPassword('demo123'); setShowDropdown(false); }}>
                        <div className="font-medium">{lab.name}</div>
                        <div className="text-xs text-gray-500">HFR: {lab.hfrUid} • {lab.city || 'Mumbai'}</div>
                      </div>
                    ))}
                    {labs.length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500">No labs</div>
                    )}
                  </div>
                )}
              </div>
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
            <Button className="w-full" disabled={!labId || !password || submitting} onClick={async ()=>{ try { setSubmitting(true); const data = await labsService.login(labId, password); localStorage.setItem('lab_session_token', data.token); localStorage.setItem('lab_info', JSON.stringify(data.lab)); navigate('/lab'); } catch (e) { /* TODO toast */ } finally { setSubmitting(false); } }} style={{ backgroundColor: '#BBF1F1', color: '#374151' }}>{submitting ? 'Signing in...' : 'Sign in'}</Button>
            <Button variant="ghost" className="w-full" onClick={onBack}>Back to Login Options</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LabLogin;
