import { useState } from 'react';
import Scanner from '../components/Scanner';
import { mockTrucks, mockDispatchOrders, getTyreById } from '../data/mockData';
import './TruckLoading.css';

function TruckLoading() {
  const [step, setStep] = useState('trucks'); // 'trucks', 'orders', 'loading', 'complete'
  const [trucks] = useState(mockTrucks);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [ordersToLoad, setOrdersToLoad] = useState([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [loadedItems, setLoadedItems] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  const selectTruck = (truck) => {
    setSelectedTruck(truck);
    // Get orders ready for this truck
    const readyOrders = mockDispatchOrders.filter(o => o.status === 'ready_to_load');
    setOrdersToLoad(readyOrders);
    setStep('orders');
  };

  const startLoading = () => {
    if (ordersToLoad.length === 0) {
      setMessage({ type: 'error', text: 'No orders selected for loading.' });
      return;
    }
    
    // Flatten all items from all orders
    const allItems = [];
    ordersToLoad.forEach(order => {
      order.items.forEach(item => {
        allItems.push({
          ...item,
          orderId: order.id,
          customerName: order.customerName,
          loadedQty: 0
        });
      });
    });
    
    setLoadedItems(allItems);
    setCurrentItemIndex(0);
    setStep('loading');
    setMessage({ type: '', text: '' });
  };

  const handleItemScan = (scannedId) => {
    const currentItem = loadedItems[currentItemIndex];
    const tyre = getTyreById(currentItem.tyreId);
    
    if (scannedId === currentItem.tyreId || scannedId === tyre?.sku) {
      const updatedItems = [...loadedItems];
      if (updatedItems[currentItemIndex].loadedQty < updatedItems[currentItemIndex].quantity) {
        updatedItems[currentItemIndex].loadedQty += 1;
        setLoadedItems(updatedItems);
        
        if (updatedItems[currentItemIndex].loadedQty >= updatedItems[currentItemIndex].quantity) {
          setMessage({ type: 'success', text: `✓ Item loaded!` });
          setTimeout(() => {
            if (currentItemIndex < loadedItems.length - 1) {
              setCurrentItemIndex(currentItemIndex + 1);
              setMessage({ type: '', text: '' });
            } else {
              setStep('complete');
            }
          }, 800);
        } else {
          setMessage({ type: 'success', text: `✓ Loaded ${updatedItems[currentItemIndex].loadedQty}/${updatedItems[currentItemIndex].quantity}` });
        }
      }
    } else {
      setMessage({ type: 'error', text: 'Wrong item! Please scan the correct tyre.' });
    }
  };

  const handleTruckScan = (scannedId) => {
    const truck = trucks.find(t => t.id === scannedId || t.registration === scannedId);
    if (truck) {
      selectTruck(truck);
      setMessage({ type: '', text: '' });
    } else {
      setMessage({ type: 'error', text: 'Truck not found.' });
    }
  };

  const toggleOrderSelection = (orderId) => {
    const isSelected = ordersToLoad.some(o => o.id === orderId);
    if (isSelected) {
      setOrdersToLoad(ordersToLoad.filter(o => o.id !== orderId));
    } else {
      const order = mockDispatchOrders.find(o => o.id === orderId);
      if (order) {
        setOrdersToLoad([...ordersToLoad, order]);
      }
    }
  };

  const resetLoading = () => {
    setStep('trucks');
    setSelectedTruck(null);
    setOrdersToLoad([]);
    setCurrentItemIndex(0);
    setLoadedItems([]);
    setMessage({ type: '', text: '' });
  };

  const renderTruckSelection = () => (
    <div className="loading-section">
      <h2>Select Truck</h2>
      <p className="section-description">Scan truck barcode or select from available trucks</p>

      <Scanner 
        onScan={handleTruckScan}
        placeholder="Scan truck barcode or enter ID"
        scanType="qr"
      />

      <h3>Available Trucks</h3>
      <div className="trucks-list">
        {trucks.map(truck => (
          <button
            key={truck.id}
            className={`truck-card ${truck.status}`}
            onClick={() => selectTruck(truck)}
          >
            <div className="truck-icon">🚛</div>
            <div className="truck-info">
              <span className="truck-reg">{truck.registration}</span>
              <span className="truck-id">{truck.id}</span>
            </div>
            <div className="truck-meta">
              <span className={`truck-status ${truck.status}`}>{truck.status}</span>
              <span className="truck-capacity">Capacity: {truck.capacity}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderOrderSelection = () => {
    const readyOrders = mockDispatchOrders.filter(o => o.status === 'ready_to_load');
    const totalItems = ordersToLoad.reduce((sum, o) => 
      sum + o.items.reduce((s, i) => s + i.quantity, 0), 0
    );
    
    return (
      <div className="loading-section">
        <div className="truck-header">
          <div className="selected-truck">
            <span className="truck-icon-small">🚛</span>
            <span className="truck-reg">{selectedTruck.registration}</span>
          </div>
          <span className="truck-capacity-badge">
            Cap: {selectedTruck.capacity}
          </span>
        </div>

        <h2>Select Orders to Load</h2>
        
        {readyOrders.length === 0 ? (
          <div className="no-orders">
            <span className="no-orders-icon">📭</span>
            <p>No orders ready for loading</p>
          </div>
        ) : (
          <>
            <div className="orders-list">
              {readyOrders.map(order => {
                const isSelected = ordersToLoad.some(o => o.id === order.id);
                const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
                
                return (
                  <button
                    key={order.id}
                    className={`order-card selectable ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleOrderSelection(order.id)}
                  >
                    <div className="order-checkbox">
                      {isSelected ? '✓' : ''}
                    </div>
                    <div className="order-info">
                      <div className="order-header">
                        <span className="order-id">{order.id}</span>
                        <span className="order-items">{itemCount} items</span>
                      </div>
                      <span className="order-customer">{order.customerName}</span>
                      <span className="order-address">{order.customerAddress}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="load-summary">
              <span className="summary-label">Selected:</span>
              <span className="summary-value">{ordersToLoad.length} orders • {totalItems} items</span>
            </div>

            <button 
              className="primary-button" 
              onClick={startLoading}
              disabled={ordersToLoad.length === 0}
            >
              Start Loading
            </button>
          </>
        )}

        <button className="secondary-button" onClick={resetLoading}>
          Back to Trucks
        </button>
      </div>
    );
  };

  const renderLoading = () => {
    const currentItem = loadedItems[currentItemIndex];
    const tyre = getTyreById(currentItem.tyreId);
    const totalLoaded = loadedItems.reduce((sum, i) => sum + i.loadedQty, 0);
    const totalItems = loadedItems.reduce((sum, i) => sum + i.quantity, 0);
    
    return (
      <div className="loading-section">
        <div className="loading-header">
          <div className="truck-badge">
            <span className="badge-icon">🚛</span>
            <span className="badge-text">{selectedTruck.registration}</span>
          </div>
          <span className="loading-progress">{totalLoaded}/{totalItems}</span>
        </div>

        <div className="progress-bar large">
          <div 
            className="progress-fill"
            style={{ width: `${(totalLoaded / totalItems) * 100}%` }}
          ></div>
        </div>

        <div className="current-order-badge">
          <span className="order-for">For:</span>
          <span className="order-customer">{currentItem.customerName}</span>
          <span className="order-id-small">({currentItem.orderId})</span>
        </div>

        <div className="load-card">
          <div className="load-item-info">
            <div className="load-icon">🛞</div>
            <h3>{tyre?.brand} {tyre?.model}</h3>
            <p className="load-sku">{tyre?.sku}</p>
            <p className="load-size">{tyre?.size}</p>
          </div>

          <div className="load-counter">
            <span className="loaded-count">{currentItem.loadedQty}</span>
            <span className="load-divider">/</span>
            <span className="required-count">{currentItem.quantity}</span>
          </div>
          <p className="load-remaining">
            {currentItem.quantity - currentItem.loadedQty} to load
          </p>
        </div>

        <Scanner 
          onScan={handleItemScan}
          placeholder={`Scan ${tyre?.sku}`}
          scanType="tyre"
        />

        <div className="loading-nav">
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
              if (currentItemIndex < loadedItems.length - 1) {
                setCurrentItemIndex(currentItemIndex + 1);
                setMessage({ type: '', text: '' });
              }
            }}
            disabled={currentItemIndex === loadedItems.length - 1}
          >
            Next →
          </button>
        </div>

        <button className="secondary-button" onClick={() => setStep('orders')}>
          Pause Loading
        </button>
      </div>
    );
  };

  const renderComplete = () => {
    const orderSummary = {};
    loadedItems.forEach(item => {
      if (!orderSummary[item.orderId]) {
        orderSummary[item.orderId] = {
          customerName: item.customerName,
          items: []
        };
      }
      const tyre = getTyreById(item.tyreId);
      orderSummary[item.orderId].items.push({
        name: `${tyre?.brand} ${tyre?.model}`,
        qty: item.loadedQty
      });
    });

    return (
      <div className="loading-section complete-section">
        <div className="success-icon">✅</div>
        <h2>Loading Complete!</h2>
        <p>Truck {selectedTruck.registration} is ready for dispatch</p>

        <div className="complete-summary">
          <div className="truck-summary">
            <span className="truck-icon">🚛</span>
            <span>{selectedTruck.registration}</span>
          </div>

          {Object.entries(orderSummary).map(([orderId, data]) => (
            <div key={orderId} className="order-summary">
              <div className="order-header-summary">
                <span className="order-id">{orderId}</span>
                <span className="customer-name">{data.customerName}</span>
              </div>
              <div className="items-loaded">
                {data.items.map((item, idx) => (
                  <div key={idx} className="loaded-item">
                    <span>{item.name}</span>
                    <span className="loaded-qty">× {item.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button className="primary-button" onClick={resetLoading}>
          Load Another Truck
        </button>
      </div>
    );
  };

  return (
    <div className="truck-loading-page">
      <div className="truck-loading-container">
        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}
        
        {step === 'trucks' && renderTruckSelection()}
        {step === 'orders' && renderOrderSelection()}
        {step === 'loading' && renderLoading()}
        {step === 'complete' && renderComplete()}
      </div>
    </div>
  );
}

export default TruckLoading;
