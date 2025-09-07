import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PatientPhoneLogin from './PatientPhoneLogin';
import PatientOTPVerification from './PatientOTPVerification';
import ABHALinkingFlow from './ABHALinkingFlow';
import DoctorLogin from './DoctorLogin';
import PatientUsernameLogin from './PatientUsernameLogin';
import PatientSignup from './PatientSignup';

interface PatientAuthFlowProps {
  onBack: () => void;
}

type AuthStep = 'phone' | 'otp' | 'abha' | 'doctor' | 'username' | 'signup' | 'complete';

const PatientAuthFlow: React.FC<PatientAuthFlowProps> = ({ onBack }) => {
  const [step, setStep] = useState<AuthStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [abhaId, setAbhaId] = useState('');
  const [isNewSignup, setIsNewSignup] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePhoneSuccess = (phone: string) => {
    setPhoneNumber(phone);
    setStep('otp');
  };

  const handleOTPSuccess = async (phone: string) => {
    try {
      // Check if user needs ABHA linking
      const needsABHALinking = await checkABHALinkingStatus(phone);
      
      if (needsABHALinking) {
        setStep('abha');
      } else {
        // User already has ABHA linked, login directly
        await loginPatient(phone);
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
    }
  };

  const handleABHASuccess = async (linkedAbhaId: string) => {
    setAbhaId(linkedAbhaId);
    if (isNewSignup) {
      // Already logged in via signup; just proceed
      window.dispatchEvent(new CustomEvent('abha:updated'));
      navigate('/user');
    } else {
      await loginPatient(phoneNumber, linkedAbhaId);
    }
  };

  const handleABHASkip = async () => {
    if (isNewSignup) {
      // Keep current new user session
      window.dispatchEvent(new CustomEvent('abha:updated'));
      navigate('/user');
    } else {
      await loginPatient(phoneNumber);
    }
  };

  const checkABHALinkingStatus = async (phone: string): Promise<boolean> => {
    // Demo logic: Check if user needs ABHA linking based on phone number
    const DEMO_USERS_WITH_ABHA = [
      '9876543210', // ramesh_kumar
      '9876543211', // priya_sharma
      '9876543212', // suresh_patel
      '9876543213', // ashok_gupta
      '9876543214'  // meera_singh
    ]; // Users who already have ABHA linked
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // If phone number is not in the "already linked" list, they need ABHA linking
    return !DEMO_USERS_WITH_ABHA.includes(phone);
  };

  const loginPatient = async (phone: string, linkedAbhaId?: string) => {
    try {
      // Map phone number to existing demo user credentials
      const PHONE_TO_USER: Record<string, { username: string; password: string }> = {
        '9876543210': { username: 'ramesh_kumar', password: 'demo123' },
        '9876543211': { username: 'priya_sharma', password: 'demo123' },
        '9876543212': { username: 'suresh_patel', password: 'demo123' },
        '9876543213': { username: 'ashok_gupta', password: 'demo123' },
        '9876543214': { username: 'meera_singh', password: 'demo123' }
      };

      const userCreds = PHONE_TO_USER[phone] || PHONE_TO_USER['9876543210'];
      
      // Login using existing auth system
      await login(userCreds.username, userCreds.password, 'patient');
      
      // If ABHA was linked, store it (in real implementation, this would be saved to backend)
      if (linkedAbhaId) {
        console.log(`ABHA ID ${linkedAbhaId} linked to user ${userCreds.username}`);
      }
      
      // Navigate to Patient Shell after login
      navigate('/user');
      
    } catch (error) {
      console.error('Patient login failed:', error);
    }
  };

  if (step === 'phone') {
    return (
      <PatientPhoneLogin
        onBack={onBack}
        onSuccess={handlePhoneSuccess}
        onDoctor={() => setStep('doctor')}
        onUsernameLogin={() => setStep('username')}
        onSignup={() => setStep('signup')}
      />
    );
  }

  if (step === 'otp') {
    return (
      <PatientOTPVerification
        phoneNumber={phoneNumber}
        onBack={() => setStep('phone')}
        onSuccess={handleOTPSuccess}
      />
    );
  }

  if (step === 'abha') {
    return (
      <ABHALinkingFlow
        phoneNumber={phoneNumber}
        onBack={() => setStep('otp')}
        onSuccess={handleABHASuccess}
        onSkip={handleABHASkip}
      />
    );
  }

  if (step === 'doctor') {
    return (
      <DoctorLogin onBack={() => setStep('phone')} />
    );
  }

  if (step === 'username') {
    return (
      <PatientUsernameLogin onBack={() => setStep('phone')} />
    );
  }

  if (step === 'signup') {
    return (
      <PatientSignup onBack={() => setStep('phone')} onSuccess={() => { setIsNewSignup(true); setStep('abha'); }} />
    );
  }

  return null;
};

export default PatientAuthFlow;
