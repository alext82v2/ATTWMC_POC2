import { useState } from 'react';
import './Scanner.css';

function Scanner({ onScan, placeholder = 'Scan QR Code or Enter ID', scanType = 'qr' }) {
  const [manualInput, setManualInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScan(manualInput.trim());
      setManualInput('');
    }
  };

  const simulateScan = () => {
    setIsScanning(true);
    // Simulate scanning delay
    setTimeout(() => {
      setIsScanning(false);
      // Generate a mock scan result based on type
      const mockResults = {
        qr: 'USR001',
        location: 'LOC001',
        tyre: 'TYR001',
        bin: 'BIN-A1-01',
        shipment: 'SHIP001'
      };
      onScan(mockResults[scanType] || 'SCAN-RESULT-001');
    }, 1500);
  };

  return (
    <div className="scanner-container">
      <div className={`scanner-viewport ${isScanning ? 'scanning' : ''}`}>
        {isScanning ? (
          <div className="scanning-animation">
            <div className="scan-line"></div>
            <p>Scanning...</p>
          </div>
        ) : (
          <div className="scanner-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 3H5a2 2 0 0 0-2 2v2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
              <path d="M17 21h2a2 2 0 0 0 2-2v-2" />
              <rect x="7" y="7" width="10" height="10" rx="1" />
            </svg>
          </div>
        )}
      </div>
      
      <button 
        className="scan-button" 
        onClick={simulateScan}
        disabled={isScanning}
      >
        {isScanning ? 'Scanning...' : 'Tap to Scan'}
      </button>

      <div className="manual-entry">
        <p className="or-divider">or enter manually</p>
        <form onSubmit={handleManualSubmit}>
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder={placeholder}
            className="manual-input"
          />
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Scanner;
