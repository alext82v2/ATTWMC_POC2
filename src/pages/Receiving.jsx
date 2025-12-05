import { useState } from 'react';
import Scanner from '../components/Scanner';
import { mockIncomingShipments, getTyreById } from '../data/mockData';
import './Receiving.css';

function Receiving() {
  const [step, setStep] = useState('scan'); // 'scan', 'shipment', 'item', 'complete'
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [scannedItems, setScannedItems] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleShipmentScan = (scannedId) => {
    const shipment = mockIncomingShipments.find(s => s.id === scannedId);
    if (shipment) {
      setSelectedShipment(shipment);
      setScannedItems(shipment.items.map(item => ({ ...item, scannedQty: 0 })));
      setStep('shipment');
      setMessage({ type: '', text: '' });
    } else {
      setMessage({ type: 'error', text: 'Shipment not found. Please scan a valid shipment.' });
    }
  };

  const handleItemScan = (scannedId) => {
    const currentItem = scannedItems[currentItemIndex];
    const tyre = getTyreById(currentItem.tyreId);
    
    if (scannedId === currentItem.tyreId || scannedId === tyre?.sku) {
      const updatedItems = [...scannedItems];
      updatedItems[currentItemIndex].scannedQty += 1;
      setScannedItems(updatedItems);
      
      if (updatedItems[currentItemIndex].scannedQty >= updatedItems[currentItemIndex].quantity) {
        setMessage({ type: 'success', text: `✓ Item ${currentItemIndex + 1} complete!` });
        setTimeout(() => {
          if (currentItemIndex < scannedItems.length - 1) {
            setCurrentItemIndex(currentItemIndex + 1);
            setMessage({ type: '', text: '' });
          } else {
            setStep('complete');
          }
        }, 1000);
      } else {
        setMessage({ type: 'success', text: `✓ Scanned ${updatedItems[currentItemIndex].scannedQty}/${updatedItems[currentItemIndex].quantity}` });
      }
    } else {
      setMessage({ type: 'error', text: 'Wrong item scanned. Please scan the correct tyre.' });
    }
  };

  const startScanning = () => {
    setStep('item');
    setCurrentItemIndex(0);
    setMessage({ type: '', text: '' });
  };

  const resetReceiving = () => {
    setStep('scan');
    setSelectedShipment(null);
    setCurrentItemIndex(0);
    setScannedItems([]);
    setMessage({ type: '', text: '' });
  };

  const renderScanShipment = () => (
    <div className="receiving-section">
      <h2>Scan Shipment Document</h2>
      <p className="section-description">Scan the barcode on the delivery note or packing slip</p>
      <Scanner 
        onScan={handleShipmentScan}
        placeholder="Enter Shipment ID (e.g., SHIP001)"
        scanType="shipment"
      />
      
      <div className="pending-shipments">
        <h3>Pending Shipments</h3>
        {mockIncomingShipments.filter(s => s.status !== 'completed').map(shipment => (
          <button 
            key={shipment.id} 
            className="shipment-card"
            onClick={() => handleShipmentScan(shipment.id)}
          >
            <div className="shipment-info">
              <span className="shipment-id">{shipment.id}</span>
              <span className="shipment-supplier">{shipment.supplier}</span>
            </div>
            <div className="shipment-meta">
              <span className={`status ${shipment.status}`}>{shipment.status.replace('_', ' ')}</span>
              <span className="date">Expected: {shipment.expectedDate}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderShipmentDetails = () => (
    <div className="receiving-section">
      <div className="shipment-header">
        <h2>Shipment Details</h2>
        <span className="shipment-badge">{selectedShipment.id}</span>
      </div>
      
      <div className="shipment-details-card">
        <div className="detail-row">
          <span className="label">Supplier:</span>
          <span className="value">{selectedShipment.supplier}</span>
        </div>
        <div className="detail-row">
          <span className="label">Expected:</span>
          <span className="value">{selectedShipment.expectedDate}</span>
        </div>
        <div className="detail-row">
          <span className="label">Items:</span>
          <span className="value">{selectedShipment.items.length} line(s)</span>
        </div>
      </div>

      <h3>Items to Receive</h3>
      <div className="items-list">
        {scannedItems.map((item, index) => {
          const tyre = getTyreById(item.tyreId);
          return (
            <div key={index} className="item-card">
              <div className="item-icon">🛞</div>
              <div className="item-details">
                <span className="item-name">{tyre?.brand} {tyre?.model}</span>
                <span className="item-sku">{tyre?.sku} - {tyre?.size}</span>
              </div>
              <div className="item-qty">
                <span className="qty-value">{item.quantity}</span>
                <span className="qty-label">units</span>
              </div>
            </div>
          );
        })}
      </div>

      <button className="primary-button" onClick={startScanning}>
        Start Receiving
      </button>
      <button className="secondary-button" onClick={resetReceiving}>
        Cancel
      </button>
    </div>
  );

  const renderItemScanning = () => {
    const currentItem = scannedItems[currentItemIndex];
    const tyre = getTyreById(currentItem.tyreId);
    
    return (
      <div className="receiving-section">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentItemIndex) / scannedItems.length) * 100}%` }}
          ></div>
        </div>
        <p className="progress-text">Item {currentItemIndex + 1} of {scannedItems.length}</p>
        
        <div className="scan-item-card">
          <div className="item-to-scan">
            <div className="scan-icon">🛞</div>
            <h3>{tyre?.brand} {tyre?.model}</h3>
            <p className="scan-sku">{tyre?.sku}</p>
            <p className="scan-size">{tyre?.size}</p>
          </div>
          
          <div className="scan-progress">
            <div className="count-display">
              <span className="current-count">{currentItem.scannedQty}</span>
              <span className="divider">/</span>
              <span className="total-count">{currentItem.quantity}</span>
            </div>
            <p className="count-label">Scanned</p>
          </div>
        </div>

        <Scanner 
          onScan={handleItemScan}
          placeholder={`Scan ${tyre?.sku}`}
          scanType="tyre"
        />

        <button className="secondary-button" onClick={() => setStep('shipment')}>
          Back to Shipment
        </button>
      </div>
    );
  };

  const renderComplete = () => (
    <div className="receiving-section complete-section">
      <div className="success-icon">✅</div>
      <h2>Receiving Complete!</h2>
      <p>All items have been received successfully</p>
      
      <div className="summary-card">
        <h3>Summary</h3>
        {scannedItems.map((item, index) => {
          const tyre = getTyreById(item.tyreId);
          return (
            <div key={index} className="summary-row">
              <span>{tyre?.brand} {tyre?.model}</span>
              <span className="summary-qty">{item.scannedQty} received</span>
            </div>
          );
        })}
      </div>

      <button className="primary-button" onClick={resetReceiving}>
        Receive Another Shipment
      </button>
    </div>
  );

  return (
    <div className="receiving-page">
      <div className="receiving-container">
        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}
        
        {step === 'scan' && renderScanShipment()}
        {step === 'shipment' && renderShipmentDetails()}
        {step === 'item' && renderItemScanning()}
        {step === 'complete' && renderComplete()}
      </div>
    </div>
  );
}

export default Receiving;
