import React, { useState } from 'react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(formData.username, formData.password);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      onClose();
      setFormData({ username: '', password: '' });
    } catch (error: any) {
      setError(error.message || 'Login failed');
      toast({
        title: "Login failed",
        description: error.message || 'Please check your credentials',
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  if (!isOpen) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 99999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '30px',
        width: '100%',
        maxWidth: '500px',
        position: 'relative',
        border: '3px solid red'
      }}>
        {/* Close Button */}
        <button
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer'
          }}
          onClick={onClose}
        >
          ×
        </button>

        {/* Title */}
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px', color: 'red', textAlign: 'center' }}>🚨 EMERGENCY TEST MODAL 🚨</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>
          Sign in to your account to access your health dashboard
        </p>
        
        {/* Debug Message */}
        <div style={{
          backgroundColor: 'yellow',
          border: '3px solid orange',
          padding: '10px',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          🔍 DEBUG: If you see this, the modal is updated! Look for GREEN username field below!
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          {/* Username Field */}
          <div style={{ marginBottom: '25px' }}>
            <label htmlFor="username" style={{ 
              display: 'block', 
              marginBottom: '10px', 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: 'green' 
            }}>
              USERNAME FIELD:
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              disabled={isLoading}
              required
              style={{ 
                width: '100%', 
                padding: '15px', 
                border: '3px solid green', 
                borderRadius: '8px', 
                fontSize: '18px',
                display: 'block',
                boxSizing: 'border-box',
                backgroundColor: 'lightgreen'
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '25px' }}>
            <label htmlFor="password" style={{ 
              display: 'block', 
              marginBottom: '10px', 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: 'purple' 
            }}>
              PASSWORD FIELD:
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              disabled={isLoading}
              required
              style={{ 
                width: '100%', 
                padding: '15px', 
                border: '3px solid purple', 
                borderRadius: '8px', 
                fontSize: '18px',
                display: 'block',
                boxSizing: 'border-box',
                backgroundColor: 'lightpink'
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '12px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              marginBottom: '16px'
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Sign Up Link */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Don't have an account?{' '}
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              onClick={onSwitchToRegister}
              disabled={isLoading}
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Demo Credentials */}
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          padding: '16px',
          borderRadius: '6px'
        }}>
          <h4 style={{ fontWeight: '600', color: '#1e40af', marginBottom: '8px' }}>
            Demo Credentials:
          </h4>
          <div style={{ fontSize: '14px', color: '#1e40af' }}>
            <p style={{ margin: '4px 0' }}><strong>Username:</strong> demo_user</p>
            <p style={{ margin: '4px 0' }}><strong>Password:</strong> demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
