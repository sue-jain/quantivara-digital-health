import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import patientProfileService from '@/services/patientProfile';

interface AbhaStatus {
  hasAbhaLinked: boolean;
  needsLinking: boolean;
  abhaId?: string;
  verificationStatus?: string;
  linkedDate?: string;
  loading: boolean;
}

export const useAbhaStatus = () => {
  const { user, isAuthenticated, userType } = useAuth();
  const [abhaStatus, setAbhaStatus] = useState<AbhaStatus>({
    hasAbhaLinked: false,
    needsLinking: false,
    loading: true
  });

  useEffect(() => {
    const checkAbhaStatus = async () => {
      // Only check for patients, not doctors
      if (!isAuthenticated || !user || userType !== 'patient') {
        setAbhaStatus({
          hasAbhaLinked: false,
          needsLinking: false,
          loading: false
        });
        return;
      }

      try {
        setAbhaStatus(prev => ({ ...prev, loading: true }));
        const status = await patientProfileService.getABHAStatus(user.id);
        setAbhaStatus({
          ...status,
          loading: false
        });
      } catch (error) {
        console.error('Error checking ABHA status:', error);
        setAbhaStatus({
          hasAbhaLinked: false,
          needsLinking: false,
          loading: false
        });
      }
    };

    checkAbhaStatus();
  }, [user, isAuthenticated, userType]);

  // Listen for global ABHA updates to refresh immediately (e.g., after linking)
  useEffect(() => {
    const onAbhaUpdated = async (_e: Event) => {
      if (!isAuthenticated || !user || userType !== 'patient') return;
      try {
        setAbhaStatus(prev => ({ ...prev, loading: true }));
        const status = await patientProfileService.getABHAStatus(user.id);
        setAbhaStatus({ ...status, loading: false });
      } catch (err) {
        setAbhaStatus(prev => ({ ...prev, loading: false }));
      }
    };
    window.addEventListener('abha:updated', onAbhaUpdated as EventListener);
    return () => {
      window.removeEventListener('abha:updated', onAbhaUpdated as EventListener);
    };
  }, [isAuthenticated, user, userType]);

  const refreshAbhaStatus = async () => {
    if (!isAuthenticated || !user || userType !== 'patient') return;
    
    try {
      setAbhaStatus(prev => ({ ...prev, loading: true }));
      const status = await patientProfileService.getABHAStatus(user.id);
      setAbhaStatus({
        ...status,
        loading: false
      });
    } catch (error) {
      console.error('Error refreshing ABHA status:', error);
      setAbhaStatus(prev => ({ ...prev, loading: false }));
    }
  };

  return {
    ...abhaStatus,
    refreshAbhaStatus
  };
};

