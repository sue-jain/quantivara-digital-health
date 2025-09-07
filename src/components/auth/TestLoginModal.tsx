import React, { useState } from 'react';

interface TestLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TestLoginModal: React.FC<TestLoginModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
        width: '400px',
        maxWidth: '90vw',
        position: 'relative',
        border: '3px solid red'
      }}>
        {/* Close Button */}
        <button
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'red',
            color: 'white',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            width: '30px',
            height: '30px',
            borderRadius: '50%'
          }}
          onClick={onClose}
        >
          ×
        </button>

        {/* Title */}
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          marginBottom: '20px',
          color: 'blue',
          textAlign: 'center'
        }}>
          TEST LOGIN MODAL
        </h1>

        {/* Username Field */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            color: 'green' 
          }}>
            USERNAME FIELD:
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Type your username here"
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
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            color: 'purple' 
          }}>
            PASSWORD FIELD:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type your password here"
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
          style={{
            width: '100%',
            backgroundColor: 'orange',
            color: 'white',
            padding: '15px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
          onClick={() => {
            alert(`Username: ${username}, Password: ${password}`);
          }}
        >
          TEST SUBMIT
        </button>

        {/* Debug Info */}
        <div style={{
          backgroundColor: 'yellow',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '14px'
        }}>
          <p><strong>Debug Info:</strong></p>
          <p>Username value: "{username}"</p>
          <p>Password value: "{password}"</p>
          <p>Modal is open: {isOpen ? 'YES' : 'NO'}</p>
        </div>
      </div>
    </div>
  );
};

export default TestLoginModal;
