import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import doctorService, { DoctorProfile } from '@/services/doctor';
import Header from '@/components/layout/Header';

const DoctorProfilePage: React.FC = () => {
  const { user, userType, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!isAuthenticated || userType !== 'doctor' || !user) return;
      try {
        const data = await doctorService.getProfile(user.id);
        setProfile(data);
      } catch (e: any) {
        setError(e.message || 'Failed to load doctor profile');
      }
    };
    load();
  }, [isAuthenticated, userType, user]);

  const handleChange = (key: keyof DoctorProfile, value: any) => {
    setProfile(prev => prev ? { ...prev, [key]: value } : prev);
  };

  const handleSave = async () => {
    if (!profile || !user) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await doctorService.updateProfile(user.id, {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        specialty: profile.specialty,
        stateCode: profile.stateCode,
        hospitalId: profile.hospitalId,
        hospitalName: profile.hospitalName,
        licenseNumber: profile.licenseNumber,
        qualification: profile.qualification,
        experienceYears: profile.experienceYears,
      });
      setProfile(updated);
      setSuccess('Profile saved');
    } catch (e: any) {
      setError(e.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated || userType !== 'doctor') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">Only doctors can view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Doctor Profile</h1>

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 text-sm text-red-600">{error}</div>
            )}
            {success && (
              <div className="mb-4 text-sm text-green-600">{success}</div>
            )}
            {!profile ? (
              <div className="text-gray-600">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">HPR ID</Label>
                  <Input value={profile.nmrUid} disabled className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm">Email</Label>
                  <Input value={profile.email || ''} onChange={(e) => handleChange('email', e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm">First Name</Label>
                  <Input value={profile.firstName || ''} onChange={(e) => handleChange('firstName', e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm">Last Name</Label>
                  <Input value={profile.lastName || ''} onChange={(e) => handleChange('lastName', e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm">Phone</Label>
                  <Input value={profile.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm">Specialty</Label>
                  <Input value={profile.specialty || ''} onChange={(e) => handleChange('specialty', e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm">State Code</Label>
                  <Input value={profile.stateCode || ''} onChange={(e) => handleChange('stateCode', e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm">Hospital Name</Label>
                  <Input value={profile.hospitalName || ''} onChange={(e) => handleChange('hospitalName', e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm">License Number</Label>
                  <Input value={profile.licenseNumber || ''} onChange={(e) => handleChange('licenseNumber', e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm">Qualification</Label>
                  <Input value={profile.qualification || ''} onChange={(e) => handleChange('qualification', e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm">Experience (years)</Label>
                  <Input type="number" value={profile.experienceYears || 0} onChange={(e) => handleChange('experienceYears', Number(e.target.value))} className="mt-1" />
                </div>
              </div>
            )}

            <div className="mt-6">
              <Button onClick={handleSave} disabled={saving || !profile} style={{ backgroundColor: '#BBF1F1', color: '#374151' }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorProfilePage;



