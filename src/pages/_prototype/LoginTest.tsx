import React, { useState } from 'react';

const LoginTest: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '40px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '3px solid red'
      }}>
        {/* Title */}
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          marginBottom: '20px',
          color: 'red',
          textAlign: 'center'
        }}>
          🔥 LOGIN TEST PAGE 🔥
        </h1>

        <p style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          fontSize: '16px',
          color: '#666'
        }}>
          This is a direct test page to verify input fields work
        </p>

        {/* Username Field */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '10px', 
            fontSize: '18px', 
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
        <div style={{ marginBottom: '25px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '10px', 
            fontSize: '18px', 
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
            alert(`Username: "${username}", Password: "${password}"`);
          }}
        >
          TEST SUBMIT
        </button>

        {/* Debug Info */}
        <div style={{
          backgroundColor: 'yellow',
          padding: '15px',
          borderRadius: '8px',
          fontSize: '16px',
          border: '2px solid orange'
        }}>
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>🔍 Debug Info:</p>
          <p style={{ margin: '5px 0' }}>Username value: <strong>"{username}"</strong></p>
          <p style={{ margin: '5px 0' }}>Password value: <strong>"{password}"</strong></p>
          <p style={{ margin: '5px 0' }}>Page loaded: <strong>{new Date().toLocaleTimeString()}</strong></p>
        </div>

        {/* Back to Home */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a 
            href="/" 
            style={{ 
              color: 'blue', 
              textDecoration: 'underline',
              fontSize: '16px'
            }}
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginTest;
