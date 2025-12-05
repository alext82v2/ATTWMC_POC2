import { useState } from 'react';
import Scanner from '../components/Scanner';
import { mockDispatchOrders, getTyreById } from '../data/mockData';
import './Dispatch.css';

function Dispatch() {
  const [step, setStep] = useState('list'); // 'list', 'order', 'picking', 'complete'
  const [orders, setOrders] = useState(mockDispatchOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pickingItems, setPickingItems] = useState([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });

  const selectOrder = (order) => {
    setSelectedOrder(order);
    setStep('order');
  };

  const startPicking = () => {
    setPickingItems(selectedOrder.items.map(item => ({ ...item })));
    setCurrentItemIndex(0);
    setStep('picking');
    setMessage({ type: '', text: '' });
  };

  const handleItemScan = (scannedId) => {
    const currentItem = pickingItems[currentItemIndex];
    const tyre = getTyreById(currentItem.tyreId);
    
    if (scannedId === currentItem.tyreId || scannedId === tyre?.sku) {
      const updatedItems = [...pickingItems];
      if (updatedItems[currentItemIndex].pickedQty < updatedItems[currentItemIndex].quantity) {
        updatedItems[currentItemIndex].pickedQty += 1;
        setPickingItems(updatedItems);
        
        if (updatedItems[currentItemIndex].pickedQty >= updatedItems[currentItemIndex].quantity) {
          setMessage({ type: 'success', text: `✓ Item complete! (${updatedItems[currentItemIndex].pickedQty}/${updatedItems[currentItemIndex].quantity})` });
          setTimeout(() => {
            if (currentItemIndex < pickingItems.length - 1) {
              setCurrentItemIndex(currentItemIndex + 1);
              setMessage({ type: '', text: '' });
            } else {
              completePicking();
            }
          }, 1000);
        } else {
          setMessage({ type: 'success', text: `✓ Picked ${updatedItems[currentItemIndex].pickedQty}/${updatedItems[currentItemIndex].quantity}` });
        }
      }
    } else {
      setMessage({ type: 'error', text: 'Wrong item scanned. Please scan the correct tyre.' });
    }
  };

  const completePicking = () => {
    const updatedOrders = orders.map(o => 
      o.id === selectedOrder.id ? { ...o, status: 'ready_to_load', items: pickingItems } : o
    );
    setOrders(updatedOrders);
    setStep('complete');
  };

  const resetDispatch = () => {
    setStep('list');
    setSelectedOrder(null);
    setPickingItems([]);
    setCurrentItemIndex(0);
    setMessage({ type: '', text: '' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f97316';
      case 'picking': return '#3b82f6';
      case 'ready_to_load': return '#22c55e';
      default: return '#718096';
    }
  };

  const renderOrderList = () => (
    <div className="dispatch-section">
      <h2>Dispatch Orders</h2>
      
      <div className="order-filters">
        <button className="filter-btn active">All</button>
        <button className="filter-btn">Pending</button>
        <button className="filter-btn">Picking</button>
        <button className="filter-btn">Ready</button>
      </div>

      <div className="orders-list">
        {orders.map(order => {
          const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);
          const pickedItems = order.items.reduce((sum, i) => sum + i.pickedQty, 0);
          const progress = (pickedItems / totalItems) * 100;
          
          return (
            <div 
              key={order.id} 
              className={`order-card ${order.status}`}
              onClick={() => selectOrder(order)}
            >
              <div className="order-header">
                <span className="order-id">{order.id}</span>
                <span 
                  className="order-status"
                  style={{ background: `${getStatusColor(order.status)}20`, color: getStatusColor(order.status) }}
                >
                  {order.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="order-customer">
                <span className="customer-name">{order.customerName}</span>
                <span className="customer-address">{order.customerAddress}</span>
              </div>
              
              <div className="order-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${progress}%`, background: getStatusColor(order.status) }}
                  ></div>
                </div>
                <span className="progress-text">{pickedItems}/{totalItems} items picked</span>
              </div>
              
              <div className="order-dates">
                <span>Required: {order.requiredDate}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderOrderDetails = () => {
    const totalItems = selectedOrder.items.reduce((sum, i) => sum + i.quantity, 0);
    const pickedItems = selectedOrder.items.reduce((sum, i) => sum + i.pickedQty, 0);
    
    return (
      <div className="dispatch-section">
        <div className="order-detail-header">
          <h2>{selectedOrder.id}</h2>
          <span 
            className="order-status"
            style={{ background: `${getStatusColor(selectedOrder.status)}20`, color: getStatusColor(selectedOrder.status) }}
          >
            {selectedOrder.status.replace('_', ' ')}
          </span>
        </div>

        <div className="customer-card">
          <div className="customer-icon">🏢</div>
          <div className="customer-info">
            <span className="customer-name">{selectedOrder.customerName}</span>
            <span className="customer-address">{selectedOrder.customerAddress}</span>
          </div>
        </div>

        <div className="order-dates-detail">
          <div className="date-item">
            <span className="date-label">Order Date</span>
            <span className="date-value">{selectedOrder.orderDate}</span>
          </div>
          <div className="date-item">
            <span className="date-label">Required Date</span>
            <span className="date-value highlight">{selectedOrder.requiredDate}</span>
          </div>
        </div>

        <h3>Order Items</h3>
        <div className="order-items-list">
          {selectedOrder.items.map((item, idx) => {
            const tyre = getTyreById(item.tyreId);
            const complete = item.pickedQty >= item.quantity;
            return (
              <div key={idx} className={`order-item ${complete ? 'complete' : ''}`}>
                <div className="item-icon">🛞</div>
                <div className="item-details">
                  <span className="item-name">{tyre?.brand} {tyre?.model}</span>
                  <span className="item-sku">{tyre?.sku} • {tyre?.size}</span>
                </div>
                <div className="item-progress">
                  <span className={`pick-count ${complete ? 'complete' : ''}`}>
                    {item.pickedQty}/{item.quantity}
                  </span>
                  {complete && <span className="check-mark">✓</span>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="order-summary">
          <span>Total Progress:</span>
          <span className="summary-count">{pickedItems}/{totalItems} items</span>
        </div>

        {selectedOrder.status !== 'ready_to_load' && (
          <button className="primary-button" onClick={startPicking}>
            {selectedOrder.status === 'picking' ? 'Continue Picking' : 'Start Picking'}
          </button>
        )}
        
        {selectedOrder.status === 'ready_to_load' && (
          <div className="ready-badge">
            <span className="ready-icon">✓</span>
            <span>Ready for Loading</span>
          </div>
        )}
        
        <button className="secondary-button" onClick={resetDispatch}>
          Back to Orders
        </button>
      </div>
    );
  };

  const renderPicking = () => {
    const currentItem = pickingItems[currentItemIndex];
    const tyre = getTyreById(currentItem.tyreId);
    const totalPicked = pickingItems.reduce((sum, i) => sum + i.pickedQty, 0);
    const totalItems = pickingItems.reduce((sum, i) => sum + i.quantity, 0);
    
    return (
      <div className="dispatch-section">
        <div className="picking-header">
          <div className="order-badge">
            <span className="badge-icon">📦</span>
            <span className="badge-text">{selectedOrder.id}</span>
          </div>
          <span className="picking-progress">{totalPicked}/{totalItems}</span>
        </div>

        <div className="progress-bar large">
          <div 
            className="progress-fill"
            style={{ width: `${(totalPicked / totalItems) * 100}%` }}
          ></div>
        </div>

        <div className="pick-card">
          <div className="pick-item-header">
            <span className="item-number">Item {currentItemIndex + 1} of {pickingItems.length}</span>
          </div>
          
          <div className="pick-item-info">
            <div className="pick-icon">🛞</div>
            <h3>{tyre?.brand} {tyre?.model}</h3>
            <p className="pick-sku">{tyre?.sku}</p>
            <p className="pick-size">{tyre?.size}</p>
          </div>

          <div className="pick-counter">
            <span className="picked-count">{currentItem.pickedQty}</span>
            <span className="pick-divider">/</span>
            <span className="required-count">{currentItem.quantity}</span>
          </div>
          <p className="pick-remaining">
            {currentItem.quantity - currentItem.pickedQty} remaining
          </p>
        </div>

        <Scanner 
          onScan={handleItemScan}
          placeholder={`Scan ${tyre?.sku}`}
          scanType="tyre"
        />

        <div className="picking-nav">
          <button 
            className="nav-btn prev"
            onClick={() => {
              if (currentItemIndex > 0) {
                setCurrentItemIndex(currentItemIndex - 1);
                setMessage({ type: '', text: '' });
              }
            }}
            disabled={currentItemIndex === 0}
          >
            ← Prev
          </button>
          <button 
            className="nav-btn next"
            onClick={() => {
              if (currentItemIndex < pickingItems.length - 1) {
                setCurrentItemIndex(currentItemIndex + 1);
                setMessage({ type: '', text: '' });
              }
            }}
            disabled={currentItemIndex === pickingItems.length - 1}
          >
            Next →
          </button>
        </div>

        <button className="secondary-button" onClick={() => setStep('order')}>
          Pause Picking
        </button>
      </div>
    );
  };

  const renderComplete = () => (
    <div className="dispatch-section complete-section">
      <div className="success-icon">✅</div>
      <h2>Picking Complete!</h2>
      <p>Order {selectedOrder.id} is ready for loading</p>

      <div className="complete-summary">
        <div className="customer-summary">
          <span className="customer-name">{selectedOrder.customerName}</span>
          <span className="customer-address">{selectedOrder.customerAddress}</span>
        </div>
        
        <div className="items-summary">
          {pickingItems.map((item, idx) => {
            const tyre = getTyreById(item.tyreId);
            return (
              <div key={idx} className="summary-item">
                <span>{tyre?.brand} {tyre?.model}</span>
                <span className="summary-qty">× {item.pickedQty}</span>
              </div>
            );
          })}
        </div>
      </div>

      <button className="primary-button" onClick={resetDispatch}>
        Back to Orders
      </button>
    </div>
  );

  return (
    <div className="dispatch-page">
      <div className="dispatch-container">
        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}
        
        {step === 'list' && renderOrderList()}
        {step === 'order' && renderOrderDetails()}
        {step === 'picking' && renderPicking()}
        {step === 'complete' && renderComplete()}
      </div>
    </div>
  );
}

export default Dispatch;
