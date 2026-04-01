import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SimpleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const SimpleLoginModal: React.FC<SimpleLoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(username, password);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      onClose();
      setUsername('');
      setPassword('');
    } catch (error: any) {
      setError(error.message || 'Login failed');
      toast({
        title: "Login failed",
        description: error.message || 'Please check your credentials',
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 999999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        width: '400px',
        maxWidth: '90vw',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        position: 'relative'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '600', 
          marginBottom: '8px',
          color: '#1f2937',
          textAlign: 'center'
        }}>
          Welcome Back
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          Sign in to your healthcare dashboard
        </p>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '2px solid #fecaca',
            color: '#dc2626',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '16px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151' 
            }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={isLoading}
              required
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px', 
                fontSize: '16px',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151' 
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              required
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px', 
                fontSize: '16px',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              marginBottom: '24px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = '#2563eb')}
            onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = '#3b82f6')}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Don't have an account?{' '}
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                textDecoration: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
              onClick={onSwitchToRegister}
              disabled={isLoading}
              onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.target.style.textDecoration = 'none'}
            >
              Sign up
            </button>
          </p>
        </div>

        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <h4 style={{ 
            fontWeight: '500', 
            color: '#1e293b', 
            marginBottom: '8px',
            fontSize: '14px'
          }}>
            Demo Credentials
          </h4>
          <div style={{ fontSize: '13px', color: '#475569' }}>
            <p style={{ margin: '4px 0' }}><strong>Username:</strong> demo_user</p>
            <p style={{ margin: '4px 0' }}><strong>Password:</strong> demo123</p>
          </div>
        </div>

        <button
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            color: '#6b7280',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s'
          }}
          onClick={onClose}
          onMouseOver={(e) => e.target.style.color = '#374151'}
          onMouseOut={(e) => e.target.style.color = '#6b7280'}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default SimpleLoginModal;
