import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Scanner from '../components/Scanner';
import { mockLocations } from '../data/mockData';
import './LocationScan.css';

function LocationScan({ onLocationSelect }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLocationScan = (scannedId) => {
    const location = mockLocations.find(l => l.id === scannedId);
    if (location) {
      onLocationSelect(location);
      navigate('/dashboard');
    } else {
      setError('Location not found. Please scan a valid location QR code.');
    }
  };

  const handleLocationClick = (location) => {
    onLocationSelect(location);
    navigate('/dashboard');
  };

  return (
    <div className="location-page">
      <div className="location-container">
        <div className="location-header">
          <h1>Select Your Location</h1>
          <p>Scan location QR code or select from the list below</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="scan-section">
          <Scanner 
            onScan={handleLocationScan}
            placeholder="Enter Location ID (e.g., LOC001)"
            scanType="location"
          />
        </div>

        <div className="locations-list">
          <h3>Available Locations</h3>
          <div className="location-grid">
            {mockLocations.map(location => (
              <button
                key={location.id}
                className={`location-card ${location.type}`}
                onClick={() => handleLocationClick(location)}
              >
                <div className="location-icon">
                  {location.type === 'receiving' && '📥'}
                  {location.type === 'storage' && '📦'}
                  {location.type === 'dispatch' && '📤'}
                  {location.type === 'loading' && '🚛'}
                </div>
                <div className="location-details">
                  <span className="location-name">{location.name}</span>
                  <span className="location-id">{location.id}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationScan;
