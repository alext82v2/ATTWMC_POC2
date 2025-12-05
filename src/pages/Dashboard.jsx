import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'receiving',
      title: 'Receiving',
      description: 'Receive new tyres into warehouse',
      icon: '📥',
      color: '#3b82f6',
      path: '/receiving'
    },
    {
      id: 'transfers',
      title: 'WH Transfers',
      description: 'Transfer stock between bins',
      icon: '🔄',
      color: '#22c55e',
      path: '/transfers'
    },
    {
      id: 'stocktaking',
      title: 'Stock Taking',
      description: 'Cycle counting & inventory',
      icon: '📋',
      color: '#f59e0b',
      path: '/stock-taking'
    },
    {
      id: 'dispatch',
      title: 'Dispatch',
      description: 'Manage stock for dispatch',
      icon: '📦',
      color: '#f97316',
      path: '/dispatch'
    },
    {
      id: 'loading',
      title: 'Truck Loading',
      description: 'Load orders onto trucks',
      icon: '🚛',
      color: '#a855f7',
      path: '/truck-loading'
    },
    {
      id: 'delivery',
      title: 'Delivery',
      description: 'Deliver to customers',
      icon: '📍',
      color: '#e94560',
      path: '/delivery'
    }
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h2 className="welcome-text">What would you like to do?</h2>
        
        <div className="menu-grid">
          {menuItems.map(item => (
            <button
              key={item.id}
              className="menu-card"
              style={{ '--card-color': item.color }}
              onClick={() => navigate(item.path)}
            >
              <div className="menu-icon">{item.icon}</div>
              <div className="menu-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <div className="menu-arrow">→</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
