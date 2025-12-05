import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import LocationScan from './pages/LocationScan';
import Dashboard from './pages/Dashboard';
import Receiving from './pages/Receiving';
import Transfers from './pages/Transfers';
import StockTaking from './pages/StockTaking';
import Dispatch from './pages/Dispatch';
import TruckLoading from './pages/TruckLoading';
import Delivery from './pages/Delivery';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
  };

  const handleLogout = () => {
    setUser(null);
    setLocation(null);
  };

  // Protected wrapper for authenticated pages
  const renderProtected = (children) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    if (!location) {
      return <Navigate to="/location-scan" replace />;
    }
    return (
      <>
        <Header user={user} location={location} onLogout={handleLogout} />
        {children}
      </>
    );
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/location-scan" replace /> : <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/location-scan" 
            element={
              !user ? <Navigate to="/login" replace /> : 
              location ? <Navigate to="/dashboard" replace /> :
              <>
                <Header user={user} onLogout={handleLogout} />
                <LocationScan onLocationSelect={handleLocationSelect} />
              </>
            } 
          />
          <Route path="/dashboard" element={renderProtected(<Dashboard />)} />
          <Route path="/receiving" element={renderProtected(<Receiving />)} />
          <Route path="/transfers" element={renderProtected(<Transfers />)} />
          <Route path="/stock-taking" element={renderProtected(<StockTaking />)} />
          <Route path="/dispatch" element={renderProtected(<Dispatch />)} />
          <Route path="/truck-loading" element={renderProtected(<TruckLoading />)} />
          <Route path="/delivery" element={renderProtected(<Delivery />)} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
