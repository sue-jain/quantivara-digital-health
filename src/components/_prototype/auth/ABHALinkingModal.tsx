import React, { useState } from 'react';
import { X, Loader2, CheckCircle, AlertCircle, User, Calendar, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import abhaService, { ABHALookupResult } from '@/services/abha';
import { useToast } from '@/hooks/use-toast';

interface ABHALinkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  prefillData?: {
    name?: string;
    dateOfBirth?: string;
    gender?: string;
    mobile?: string;
    email?: string;
  };
}

const ABHALinkingModal: React.FC<ABHALinkingModalProps> = ({ isOpen, onClose, onSuccess, prefillData }) => {
  const [step, setStep] = useState<'lookup' | 'create' | 'link' | 'success'>('lookup');
  const [aadharId, setAadharId] = useState('');
  const [lookupResult, setLookupResult] = useState<ABHALookupResult | null>(null);
  const [createData, setCreateData] = useState({
    name: prefillData?.name || '',
    dateOfBirth: prefillData?.dateOfBirth || '',
    gender: prefillData?.gender || '',
    mobile: prefillData?.mobile || '',
    email: prefillData?.email || '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAadharLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await abhaService.lookupABHA(aadharId);
      setLookupResult(result);

      if (result.found) {
        if (result.isLinked) {
          setError('This ABHA ID is already linked to another account');
        } else {
          setStep('link');
        }
      } else {
        setStep('create');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to lookup ABHA ID');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateABHA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await abhaService.createABHA({
        aadharId,
        ...createData,
      });
      setLookupResult(result);
      setStep('link');
    } catch (error: any) {
      setError(error.message || 'Failed to create ABHA ID');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkABHA = async () => {
    if (!user || !lookupResult?.abhaId) return;

    setError(null);
    setIsLoading(true);

    try {
      await abhaService.linkABHA(user.id, lookupResult.abhaId);
      setStep('success');
      toast({
        title: "ABHA ID linked successfully",
        description: "Your health profile is now connected!",
      });
      // Broadcast immediate ABHA status update
      window.dispatchEvent(new CustomEvent('abha:updated'));
    } catch (error: any) {
      setError(error.message || 'Failed to link ABHA ID');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('lookup');
    setAadharId('');
    setLookupResult(null);
    setCreateData({
      name: prefillData?.name || '',
      dateOfBirth: prefillData?.dateOfBirth || '',
      gender: prefillData?.gender || '',
      mobile: prefillData?.mobile || '',
      email: prefillData?.email || '',
    });
    setError(null);
    onClose();
  };

  const handleSuccess = () => {
    handleClose();
    onSuccess();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl">Link Your ABHA ID</CardTitle>
          <CardDescription>
            Connect your health profile to access personalized features
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'lookup' && (
            <form onSubmit={handleAadharLookup} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="aadharId">AADHAR ID</Label>
                <Input
                  id="aadharId"
                  type="text"
                  value={aadharId}
                  onChange={(e) => setAadharId(e.target.value)}
                  placeholder="Enter your 12-digit AADHAR ID"
                  disabled={isLoading}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter your 12-digit AADHAR ID to find or create your ABHA ID
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !aadharId}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Search ABHA ID'
                )}
              </Button>
            </form>
          )}

          {step === 'create' && (
            <form onSubmit={handleCreateABHA} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No ABHA ID found for this AADHAR. Let's create one for you.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={createData.name}
                  onChange={(e) => setCreateData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={createData.dateOfBirth}
                    onChange={(e) => setCreateData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <select
                    id="gender"
                    value={createData.gender}
                    onChange={(e) => setCreateData(prev => ({ ...prev, gender: e.target.value }))}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={createData.mobile}
                  onChange={(e) => setCreateData(prev => ({ ...prev, mobile: e.target.value }))}
                  placeholder="+91 9876543210"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={createData.email}
                  onChange={(e) => setCreateData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  disabled={isLoading}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep('lookup')}
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading || !createData.name || !createData.dateOfBirth || !createData.gender}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create ABHA ID'
                  )}
                </Button>
              </div>
            </form>
          )}

          {step === 'link' && lookupResult && (
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  ABHA ID found! Review the details and link to your account.
                </AlertDescription>
              </Alert>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{lookupResult.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{lookupResult.dateOfBirth}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Gender:</span>
                      <span>{lookupResult.gender}</span>
                    </div>
                    {lookupResult.mobile && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{lookupResult.mobile}</span>
                      </div>
                    )}
                    {lookupResult.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-xs">{lookupResult.email}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t">
                      <Badge variant="secondary" className="text-sm">
                        ABHA ID: {abhaService.formatABHAId(lookupResult.abhaId!)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep('lookup')}
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  onClick={handleLinkABHA}
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Linking...
                    </>
                  ) : (
                    'Link ABHA ID'
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">ABHA ID Linked Successfully!</h3>
                <p className="text-muted-foreground">
                  Your health profile is now connected. You can access all personalized features.
                </p>
              </div>
              <Button onClick={handleSuccess} className="w-full">
                Continue to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ABHALinkingModal;
