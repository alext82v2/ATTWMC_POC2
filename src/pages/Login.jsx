import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Scanner from '../components/Scanner';
import { mockUsers } from '../data/mockData';
import './Login.css';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [step, setStep] = useState('qr'); // 'qr' or 'pin'
  const [scannedUser, setScannedUser] = useState(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleQRScan = (scannedId) => {
    const user = mockUsers.find(u => u.id === scannedId);
    if (user) {
      setScannedUser(user);
      setStep('pin');
      setError('');
    } else {
      setError('User not found. Please scan a valid QR code.');
    }
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (scannedUser && pin === scannedUser.pin) {
      onLogin(scannedUser);
      navigate('/location-scan');
    } else {
      setError('Invalid PIN. Please try again.');
      setPin('');
    }
  };

  const handlePinInput = (digit) => {
    if (pin.length < 4) {
      setPin(prev => prev + digit);
    }
  };

  const handlePinDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <h1>ATT Warehouse</h1>
          <p className="subtitle">Tyre Management System</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {step === 'qr' ? (
          <div className="qr-scan-section">
            <h2>Scan Your ID Badge</h2>
            <Scanner 
              onScan={handleQRScan} 
              placeholder="Enter User ID (e.g., USR001)"
              scanType="qr"
            />
            <div className="demo-hint">
              <p>Demo users: USR001, USR002, USR003</p>
              <p>PIN: 1234, 5678, 9999</p>
            </div>
          </div>
        ) : (
          <div className="pin-section">
            <h2>Welcome, {scannedUser?.name}</h2>
            <p className="role-label">{scannedUser?.role}</p>
            
            <form onSubmit={handlePinSubmit}>
              <div className="pin-display">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className={`pin-dot ${pin.length > i ? 'filled' : ''}`}>
                    {pin.length > i ? '•' : ''}
                  </div>
                ))}
              </div>

              <div className="pin-keypad">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((key, index) => (
                  <button
                    key={index}
                    type={key === '' ? 'button' : (typeof key === 'number' ? 'button' : 'button')}
                    className={`pin-key ${key === '' ? 'empty' : ''} ${key === 'del' ? 'delete' : ''}`}
                    onClick={() => {
                      if (typeof key === 'number') handlePinInput(key.toString());
                      else if (key === 'del') handlePinDelete();
                    }}
                    disabled={key === ''}
                  >
                    {key === 'del' ? '⌫' : key}
                  </button>
                ))}
              </div>

              <button 
                type="submit" 
                className="login-button"
                disabled={pin.length !== 4}
              >
                Login
              </button>
            </form>

            <button 
              className="back-link" 
              onClick={() => { setStep('qr'); setScannedUser(null); setPin(''); setError(''); }}
            >
              ← Scan different badge
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
