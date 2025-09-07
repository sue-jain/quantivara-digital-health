import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlaskConical, LogOut, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LabDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [labName, setLabName] = useState<string>('');
  const [hfrUid, setHfrUid] = useState<string>('');

  useEffect(() => {
    try {
      const infoRaw = localStorage.getItem('lab_info');
      if (infoRaw) {
        const info = JSON.parse(infoRaw);
        setLabName(info.name);
        setHfrUid(info.hfrUid);
      }
    } catch {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('lab_session_token');
    localStorage.removeItem('lab_info');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div style={{ backgroundColor: '#BBF1F1' }} className="p-3 rounded-full">
              <FlaskConical className="h-7 w-7 text-gray-700" />
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900">{labName || 'Lab'}</div>
              <div className="text-sm text-gray-600">HFR ID: {hfrUid}</div>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2"/>Logout</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Incoming Orders</CardTitle>
              <CardDescription>Prototype placeholder</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">No orders yet.</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Upload Report</CardTitle>
              <CardDescription>Attach a processed lab report</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" style={{ backgroundColor: '#BBF1F1', color: '#374151' }}><FileText className="h-4 w-4 mr-2"/>Upload</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Completed</CardTitle>
              <CardDescription>Recently uploaded reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">Nothing to show.</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LabDashboard;


