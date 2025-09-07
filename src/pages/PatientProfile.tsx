import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Save, AlertTriangle, Building2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import santhicaLogo from '@/assets/santhica-logo.png';
import patientProfileService, { PatientProfile, UpdateProfileData, ABHAStatus } from '@/services/patientProfile';
import { toast } from '@/hooks/use-toast';

const PatientProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [abhaStatus, setAbhaStatus] = useState<ABHAStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showABHAPrompt, setShowABHAPrompt] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    height: '',
    weight: '',
    emergencyContact: '',
    medicalConditions: '',
    allergies: '',
    currentMedications: '',
    address: ''
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    fetchProfile();
    checkABHAStatus();
  }, [isAuthenticated, user, navigate]);

  const fetchProfile = async () => {
    try {
      const profileData = await patientProfileService.getProfile(user!.id);
      setProfile(profileData);
      
      // Populate form with existing data
      setFormData({
        email: profileData.user.email,
        phone: profileData.user.phone,
        firstName: profileData.user.firstName,
        lastName: profileData.user.lastName,
        dateOfBirth: profileData.user.dateOfBirth,
        gender: profileData.user.gender,
        bloodGroup: profileData.abhaProfile?.bloodGroup || '',
        height: profileData.abhaProfile?.height?.toString() || '',
        weight: profileData.abhaProfile?.weight?.toString() || '',
        emergencyContact: profileData.abhaProfile?.emergencyContact || '',
        medicalConditions: '',
        allergies: '',
        currentMedications: '',
        address: profileData.abhaProfile?.address || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkABHAStatus = async () => {
    try {
      const status = await patientProfileService.getABHAStatus(user!.id);
      setAbhaStatus(status);
      setShowABHAPrompt(status.needsLinking);
    } catch (error) {
      console.error('Error checking ABHA status:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData: UpdateProfileData = {
        email: formData.email,
        phone: formData.phone,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        height: formData.height ? parseInt(formData.height) : undefined,
        weight: formData.weight ? parseInt(formData.weight) : undefined,
        emergencyContact: formData.emergencyContact,
        // Removed medical conditions, allergies, current medications from editable profile
        address: formData.address
      };

      await patientProfileService.updateProfile(user!.id, updateData);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      // Refresh profile data
      await fetchProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLinkABHA = () => {
    // Navigate to ABHA linking flow
    navigate('/login'); // This would trigger the ABHA linking flow
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <img src={santhicaLogo} alt="Santhica" className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          </div>
        </div>

        {/* ABHA Linking Prompt */}
        {showABHAPrompt && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-orange-600 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-800 mb-2">
                    ABHA ID Not Linked
                  </h3>
                  <p className="text-sm text-orange-700 mb-4">
                    Link your ABHA ID to access your complete health records across all healthcare providers in India.
                  </p>
                  <Button
                    onClick={handleLinkABHA}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Link ABHA ID Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your basic profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="House/Street, City, State"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Information (trimmed) */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
              <CardDescription>
                Health-related details and emergency contact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact
                </label>
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Removed Medical Conditions, Allergies, Current Medications sections per request */}
            </CardContent>
          </Card>
        </div>

        

        {/* ABHA Information (Read-only) */}
        {profile?.abhaProfile && (
          <Card className="mt-6 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Building2 className="h-5 w-5" />
                ABHA ID Information
              </CardTitle>
              <CardDescription className="text-green-700">
                System-generated health ID (cannot be modified)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-1">
                    ABHA ID
                  </label>
                  <input
                    type="text"
                    value={profile.abhaProfile.abhaId}
                    disabled
                    className="w-full px-3 py-2 bg-green-100 border border-green-300 rounded-md text-green-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-1">
                    Verification Status
                  </label>
                  <input
                    type="text"
                    value={profile.abhaProfile.verificationStatus}
                    disabled
                    className="w-full px-3 py-2 bg-green-100 border border-green-300 rounded-md text-green-800 capitalize"
                  />
                </div>
              </div>
              {profile.abhaRegistry && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">
                      Aadhar ID (Masked)
                    </label>
                    <input
                      type="text"
                      value={`****-****-${profile.abhaRegistry.aadharId.slice(-4)}`}
                      disabled
                      className="w-full px-3 py-2 bg-green-100 border border-green-300 rounded-md text-green-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">
                      Linked Date
                    </label>
                    <input
                      type="text"
                      value={new Date(profile.abhaProfile.linkedDate).toLocaleDateString()}
                      disabled
                      className="w-full px-3 py-2 bg-green-100 border border-green-300 rounded-md text-green-800"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="px-8"
            style={{ backgroundColor: '#BBF1F1', color: '#374151' }}
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                Saving...
              </div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientProfilePage;

