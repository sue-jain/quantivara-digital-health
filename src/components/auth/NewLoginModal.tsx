import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface NewLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const NewLoginModal: React.FC<NewLoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
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
    if (error) setError(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <style>
        {`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.3; }
          }
        `}
      </style>
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'yellow', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 999999999,
      padding: '0',
      margin: '0'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0',
        padding: '20px',
        width: '100vw',
        height: '100vh',
        position: 'relative',
        border: '10px solid red',
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {/* Close Button */}
        <button
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'red',
            color: 'white',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            fontWeight: 'bold'
          }}
          onClick={onClose}
        >
          ×
        </button>

        {/* Title */}
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: 'bold', 
          marginBottom: '20px',
          color: 'red',
          textAlign: 'center'
        }}>
          🚨 NEW LOGIN MODAL 🚨
        </h1>

        <p style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          fontSize: '18px',
          color: '#666'
        }}>
          This is a completely new modal component
        </p>

        {/* Debug Message */}
        <div style={{
          backgroundColor: 'yellow',
          border: '4px solid orange',
          padding: '15px',
          marginBottom: '30px',
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          borderRadius: '10px'
        }}>
          🔍 DEBUG: NEW MODAL LOADED! Look for GREEN username field below!
        </div>

        <form onSubmit={handleSubmit}>
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

          {/* Username Field */}
          <div style={{ marginBottom: '50px', width: '80%' }}>
            <label htmlFor="username" style={{ 
              display: 'block', 
              marginBottom: '20px', 
              fontSize: '32px', 
              fontWeight: 'bold', 
              color: 'green',
              textAlign: 'center'
            }}>
              🟢 USERNAME FIELD - TYPE HERE! 🟢
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="TYPE YOUR USERNAME HERE!"
              disabled={isLoading}
              required
              style={{ 
                width: '100%', 
                padding: '30px', 
                border: '8px solid green', 
                borderRadius: '15px', 
                fontSize: '28px',
                display: 'block',
                boxSizing: 'border-box',
                backgroundColor: 'lightgreen',
                fontWeight: 'bold',
                textAlign: 'center',
                animation: 'blink 1s infinite'
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '30px' }}>
            <label htmlFor="password" style={{ 
              display: 'block', 
              marginBottom: '15px', 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: 'purple' 
            }}>
              🟣 PASSWORD FIELD:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Type your password here"
              disabled={isLoading}
              required
              style={{ 
                width: '100%', 
                padding: '20px', 
                border: '4px solid purple', 
                borderRadius: '10px', 
                fontSize: '20px',
                display: 'block',
                boxSizing: 'border-box',
                backgroundColor: 'lightpink',
                fontWeight: 'bold'
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: 'orange',
              color: 'white',
              padding: '20px',
              border: 'none',
              borderRadius: '10px',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              marginBottom: '20px'
            }}
          >
            {isLoading ? 'Signing in...' : '🚀 SIGN IN'}
          </button>
        </form>

        {/* Sign Up Link */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <p style={{ fontSize: '16px', color: '#666' }}>
            Don't have an account?{' '}
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
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
          border: '3px solid #bfdbfe',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <h4 style={{ fontWeight: 'bold', color: '#1e40af', marginBottom: '10px', fontSize: '18px' }}>
            📋 Demo Credentials:
          </h4>
          <div style={{ fontSize: '16px', color: '#1e40af' }}>
            <p style={{ margin: '8px 0' }}><strong>Username:</strong> demo_user</p>
            <p style={{ margin: '8px 0' }}><strong>Password:</strong> demo123</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default NewLoginModal;
