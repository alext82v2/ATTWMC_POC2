import { useState } from 'react';
import Scanner from '../components/Scanner';
import { mockDeliveries, mockDeliveryStops, mockDispatchOrders, mockTrucks, getTyreById } from '../data/mockData';
import './Delivery.css';

function Delivery() {
  const [step, setStep] = useState('deliveries'); // 'deliveries', 'route', 'stop', 'signature', 'complete'
  const [deliveries] = useState(mockDeliveries);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [stops, setStops] = useState([]);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [deliveredItems, setDeliveredItems] = useState([]);
  const [signature, setSignature] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const selectDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    const deliveryStops = mockDeliveryStops.filter(s => s.deliveryId === delivery.id);
    setStops(deliveryStops.map(s => ({ ...s, completed: false })));
    setStep('route');
  };

  const startStop = (stopIndex) => {
    setCurrentStopIndex(stopIndex);
    const stop = stops[stopIndex];
    const order = mockDispatchOrders.find(o => o.id === stop.orderId);
    if (order) {
      setDeliveredItems(order.items.map(item => ({ ...item, delivered: false })));
    }
    setStep('stop');
  };

  const handleItemScan = (scannedId) => {
    const itemIndex = deliveredItems.findIndex(item => {
      const tyre = getTyreById(item.tyreId);
      return item.tyreId === scannedId || tyre?.sku === scannedId;
    });

    if (itemIndex >= 0 && !deliveredItems[itemIndex].delivered) {
      const updatedItems = [...deliveredItems];
      updatedItems[itemIndex].delivered = true;
      setDeliveredItems(updatedItems);
      setMessage({ type: 'success', text: '✓ Item confirmed!' });

      const allDelivered = updatedItems.every(i => i.delivered);
      if (allDelivered) {
        setTimeout(() => {
          setStep('signature');
          setMessage({ type: '', text: '' });
        }, 800);
      }
    } else if (itemIndex >= 0) {
      setMessage({ type: 'info', text: 'Item already scanned.' });
    } else {
      setMessage({ type: 'error', text: 'Item not found in this order.' });
    }
  };

  const confirmSignature = () => {
    if (!signature.trim()) {
      setMessage({ type: 'error', text: 'Please enter customer name.' });
      return;
    }

    const updatedStops = [...stops];
    updatedStops[currentStopIndex].completed = true;
    setStops(updatedStops);

    const allComplete = updatedStops.every(s => s.completed);
    if (allComplete) {
      setStep('complete');
    } else {
      setStep('route');
    }
    setSignature('');
    setMessage({ type: '', text: '' });
  };

  const resetDelivery = () => {
    setStep('deliveries');
    setSelectedDelivery(null);
    setStops([]);
    setCurrentStopIndex(0);
    setDeliveredItems([]);
    setSignature('');
    setMessage({ type: '', text: '' });
  };

  const getTruck = (truckId) => mockTrucks.find(t => t.id === truckId);

  const renderDeliveryList = () => (
    <div className="delivery-section">
      <h2>Active Deliveries</h2>
      <p className="section-description">Select a delivery route to begin</p>

      <div className="deliveries-list">
        {deliveries.map(delivery => {
          const truck = getTruck(delivery.truckId);
          const stopCount = mockDeliveryStops.filter(s => s.deliveryId === delivery.id).length;
          
          return (
            <button
              key={delivery.id}
              className={`delivery-card ${delivery.status}`}
              onClick={() => selectDelivery(delivery)}
            >
              <div className="delivery-icon">🚚</div>
              <div className="delivery-info">
                <div className="delivery-header">
                  <span className="delivery-id">{delivery.id}</span>
                  <span className={`delivery-status ${delivery.status}`}>
                    {delivery.status}
                  </span>
                </div>
                <span className="delivery-truck">
                  Truck: {truck?.registration}
                </span>
                <span className="delivery-stops">
                  {stopCount} stop{stopCount !== 1 ? 's' : ''}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderRoute = () => {
    const truck = getTruck(selectedDelivery.truckId);
    const completedStops = stops.filter(s => s.completed).length;
    
    return (
      <div className="delivery-section">
        <div className="route-header">
          <div className="delivery-badge">
            <span className="badge-icon">🚚</span>
            <span className="badge-text">{truck?.registration}</span>
          </div>
          <span className="route-progress">{completedStops}/{stops.length} stops</span>
        </div>

        <div className="progress-bar large">
          <div 
            className="progress-fill"
            style={{ width: `${(completedStops / stops.length) * 100}%` }}
          ></div>
        </div>

        <h2>Delivery Route</h2>

        <div className="stops-list">
          {stops.map((stop, index) => {
            const isNext = !stop.completed && stops.slice(0, index).every(s => s.completed);
            
            return (
              <div 
                key={index}
                className={`stop-card ${stop.completed ? 'completed' : ''} ${isNext ? 'next' : ''}`}
              >
                <div className="stop-number">
                  {stop.completed ? '✓' : stop.stopNumber}
                </div>
                <div className="stop-info">
                  <span className="stop-customer">{stop.customerName}</span>
                  <span className="stop-address">{stop.address}</span>
                  <span className="stop-order">Order: {stop.orderId}</span>
                </div>
                {isNext && (
                  <button 
                    className="start-stop-btn"
                    onClick={() => startStop(index)}
                  >
                    Start
                  </button>
                )}
                {stop.completed && (
                  <span className="completed-badge">Delivered</span>
                )}
              </div>
            );
          })}
        </div>

        <button className="secondary-button" onClick={resetDelivery}>
          Back to Deliveries
        </button>
      </div>
    );
  };

  const renderStop = () => {
    const stop = stops[currentStopIndex];
    const deliveredCount = deliveredItems.filter(i => i.delivered).length;
    
    return (
      <div className="delivery-section">
        <div className="stop-header">
          <span className="stop-label">Stop {stop.stopNumber}</span>
          <span className="delivery-count">{deliveredCount}/{deliveredItems.length}</span>
        </div>

        <div className="customer-card">
          <div className="customer-icon">🏢</div>
          <div className="customer-details">
            <span className="customer-name">{stop.customerName}</span>
            <span className="customer-address">{stop.address}</span>
          </div>
        </div>

        <h3>Verify Delivery Items</h3>
        <p className="section-description">Scan each item as you hand it over</p>

        <div className="delivery-items">
          {deliveredItems.map((item, index) => {
            const tyre = getTyreById(item.tyreId);
            return (
              <div 
                key={index} 
                className={`delivery-item ${item.delivered ? 'delivered' : ''}`}
              >
                <div className="item-status">
                  {item.delivered ? '✓' : '○'}
                </div>
                <div className="item-info">
                  <span className="item-name">{tyre?.brand} {tyre?.model}</span>
                  <span className="item-sku">{tyre?.sku}</span>
                </div>
                <span className="item-qty">× {item.quantity}</span>
              </div>
            );
          })}
        </div>

        <Scanner 
          onScan={handleItemScan}
          placeholder="Scan item barcode"
          scanType="tyre"
        />

        <button 
          className="skip-button"
          onClick={() => {
            const allDelivered = deliveredItems.map(i => ({ ...i, delivered: true }));
            setDeliveredItems(allDelivered);
            setStep('signature');
          }}
        >
          Mark All Delivered
        </button>

        <button className="secondary-button" onClick={() => setStep('route')}>
          Back to Route
        </button>
      </div>
    );
  };

  const renderSignature = () => {
    const stop = stops[currentStopIndex];
    
    return (
      <div className="delivery-section">
        <div className="signature-header">
          <span className="check-icon">✓</span>
          <h2>Confirm Delivery</h2>
        </div>

        <div className="delivery-summary-card">
          <div className="summary-customer">
            <span className="customer-name">{stop.customerName}</span>
            <span className="customer-order">{stop.orderId}</span>
          </div>
          <div className="summary-items">
            {deliveredItems.map((item, idx) => {
              const tyre = getTyreById(item.tyreId);
              return (
                <div key={idx} className="summary-item">
                  <span>{tyre?.brand} {tyre?.model}</span>
                  <span>× {item.quantity}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="signature-section">
          <h3>Customer Confirmation</h3>
          <p className="signature-instructions">
            Please have the customer enter their name to confirm receipt
          </p>
          
          <div className="signature-box">
            <input
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Customer name"
              className="signature-input"
            />
          </div>

          <div className="timestamp">
            <span className="timestamp-label">Delivered at:</span>
            <span className="timestamp-value">
              {new Date().toLocaleString()}
            </span>
          </div>
        </div>

        <button className="primary-button" onClick={confirmSignature}>
          Confirm Delivery
        </button>
        <button className="secondary-button" onClick={() => setStep('stop')}>
          Back
        </button>
      </div>
    );
  };

  const renderComplete = () => (
    <div className="delivery-section complete-section">
      <div className="success-icon">🎉</div>
      <h2>Route Complete!</h2>
      <p>All deliveries have been completed successfully</p>

      <div className="complete-summary">
        <h3>Delivery Summary</h3>
        {stops.map((stop, index) => (
          <div key={index} className="stop-summary">
            <div className="stop-summary-header">
              <span className="stop-num">Stop {stop.stopNumber}</span>
              <span className="check-badge">✓</span>
            </div>
            <span className="stop-customer">{stop.customerName}</span>
            <span className="stop-order">{stop.orderId}</span>
          </div>
        ))}
      </div>

      <button className="primary-button" onClick={resetDelivery}>
        Back to Deliveries
      </button>
    </div>
  );

  return (
    <div className="delivery-page">
      <div className="delivery-container">
        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}
        
        {step === 'deliveries' && renderDeliveryList()}
        {step === 'route' && renderRoute()}
        {step === 'stop' && renderStop()}
        {step === 'signature' && renderSignature()}
        {step === 'complete' && renderComplete()}
      </div>
    </div>
  );
}

export default Delivery;
