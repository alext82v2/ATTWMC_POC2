import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

function Header({ user, location: warehouseLocation, onLogout }) {
  const navigate = useNavigate();
  const currentLocation = useLocation();
  
  const getPageTitle = () => {
    const path = currentLocation.pathname;
    const titles = {
      '/': 'Warehouse Scanner',
      '/login': 'Login',
      '/location-scan': 'Select Location',
      '/dashboard': 'Dashboard',
      '/receiving': 'Receiving',
      '/transfers': 'Warehouse Transfers',
      '/stock-taking': 'Stock Taking',
      '/dispatch': 'Dispatch Management',
      '/truck-loading': 'Truck Loading',
      '/delivery': 'Delivery'
    };
    return titles[path] || 'Warehouse Scanner';
  };

  const showBackButton = currentLocation.pathname !== '/dashboard' && 
                          currentLocation.pathname !== '/login' && 
                          currentLocation.pathname !== '/';

  return (
    <header className="header">
      <div className="header-left">
        {showBackButton && (
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>
        )}
        <h1 className="header-title">{getPageTitle()}</h1>
      </div>
      
      <div className="header-right">
        {user && (
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            {warehouseLocation && (
              <span className="location-badge">{warehouseLocation.name}</span>
            )}
            <button className="logout-button" onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
