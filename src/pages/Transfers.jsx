import { useState } from 'react';
import Scanner from '../components/Scanner';
import { mockTransferOrders, mockBins, mockTyres, getTyreById, getBinById } from '../data/mockData';
import './Transfers.css';

function Transfers() {
  const [step, setStep] = useState('list'); // 'list', 'create', 'scan-from', 'scan-to', 'scan-items', 'complete'
  const [transfers, setTransfers] = useState(mockTransferOrders);
  const [currentTransfer, setCurrentTransfer] = useState(null);
  const [newTransfer, setNewTransfer] = useState({ fromBin: null, toBin: null, items: [] });
  const [scannedQty, setScannedQty] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleFromBinScan = (scannedId) => {
    const bin = getBinById(scannedId);
    if (bin) {
      setNewTransfer({ ...newTransfer, fromBin: bin });
      setStep('scan-to');
      setMessage({ type: '', text: '' });
    } else {
      setMessage({ type: 'error', text: 'Bin not found. Please scan a valid bin.' });
    }
  };

  const handleToBinScan = (scannedId) => {
    const bin = getBinById(scannedId);
    if (bin) {
      if (bin.id === newTransfer.fromBin.id) {
        setMessage({ type: 'error', text: 'Cannot transfer to the same bin.' });
        return;
      }
      setNewTransfer({ ...newTransfer, toBin: bin });
      setStep('scan-items');
      setMessage({ type: '', text: '' });
    } else {
      setMessage({ type: 'error', text: 'Bin not found. Please scan a valid bin.' });
    }
  };

  const handleItemScan = (scannedId) => {
    const tyre = mockTyres.find(t => t.id === scannedId || t.sku === scannedId);
    if (tyre) {
      setScannedQty(prev => prev + 1);
      const existingItem = newTransfer.items.find(i => i.tyreId === tyre.id);
      if (existingItem) {
        setNewTransfer({
          ...newTransfer,
          items: newTransfer.items.map(i => 
            i.tyreId === tyre.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        });
      } else {
        setNewTransfer({
          ...newTransfer,
          items: [...newTransfer.items, { tyreId: tyre.id, quantity: 1 }]
        });
      }
      setMessage({ type: 'success', text: `✓ Added ${tyre.brand} ${tyre.model}` });
    } else {
      setMessage({ type: 'error', text: 'Tyre not found. Please scan a valid tyre.' });
    }
  };

  const completeTransfer = () => {
    if (newTransfer.items.length === 0) {
      setMessage({ type: 'error', text: 'Please scan at least one item.' });
      return;
    }
    
    const transfer = {
      id: `TRF${String(transfers.length + 1).padStart(3, '0')}`,
      fromBin: newTransfer.fromBin.id,
      toBin: newTransfer.toBin.id,
      items: newTransfer.items,
      status: 'completed',
      createdAt: new Date().toISOString()
    };
    
    setTransfers([transfer, ...transfers]);
    setCurrentTransfer(transfer);
    setStep('complete');
  };

  const startNewTransfer = () => {
    setStep('scan-from');
    setNewTransfer({ fromBin: null, toBin: null, items: [] });
    setScannedQty(0);
    setMessage({ type: '', text: '' });
  };

  const resetTransfer = () => {
    setStep('list');
    setNewTransfer({ fromBin: null, toBin: null, items: [] });
    setCurrentTransfer(null);
    setScannedQty(0);
    setMessage({ type: '', text: '' });
  };

  const renderTransferList = () => (
    <div className="transfers-section">
      <div className="section-header">
        <h2>Warehouse Transfers</h2>
        <button className="create-button" onClick={startNewTransfer}>
          + New Transfer
        </button>
      </div>

      <div className="transfers-list">
        {transfers.map(transfer => (
          <div key={transfer.id} className={`transfer-card ${transfer.status}`}>
            <div className="transfer-header">
              <span className="transfer-id">{transfer.id}</span>
              <span className={`transfer-status ${transfer.status}`}>
                {transfer.status}
              </span>
            </div>
            <div className="transfer-route">
              <div className="route-bin">
                <span className="route-label">From</span>
                <span className="route-value">{transfer.fromBin}</span>
              </div>
              <div className="route-arrow">→</div>
              <div className="route-bin">
                <span className="route-label">To</span>
                <span className="route-value">{transfer.toBin}</span>
              </div>
            </div>
            <div className="transfer-items">
              {transfer.items.map((item, idx) => {
                const tyre = getTyreById(item.tyreId);
                return (
                  <span key={idx} className="transfer-item-badge">
                    {tyre?.brand} × {item.quantity}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderScanFromBin = () => (
    <div className="transfers-section">
      <h2>Scan Source Bin</h2>
      <p className="section-description">Scan the bin you want to transfer FROM</p>
      
      <Scanner 
        onScan={handleFromBinScan}
        placeholder="Enter Bin ID (e.g., BIN-A1-01)"
        scanType="bin"
      />

      <div className="bins-list">
        <h3>Available Bins</h3>
        {mockBins.map(bin => (
          <button
            key={bin.id}
            className="bin-card"
            onClick={() => handleFromBinScan(bin.id)}
          >
            <div className="bin-info">
              <span className="bin-id">{bin.id}</span>
              <span className="bin-stock">{bin.currentStock} items</span>
            </div>
            <div className="bin-capacity">
              <div className="capacity-bar">
                <div 
                  className="capacity-fill"
                  style={{ width: `${(bin.currentStock / bin.capacity) * 100}%` }}
                ></div>
              </div>
              <span className="capacity-text">{bin.currentStock}/{bin.capacity}</span>
            </div>
          </button>
        ))}
      </div>

      <button className="secondary-button" onClick={resetTransfer}>
        Cancel
      </button>
    </div>
  );

  const renderScanToBin = () => (
    <div className="transfers-section">
      <div className="selected-bin-badge">
        <span className="badge-label">From:</span>
        <span className="badge-value">{newTransfer.fromBin.id}</span>
      </div>
      
      <h2>Scan Destination Bin</h2>
      <p className="section-description">Scan the bin you want to transfer TO</p>
      
      <Scanner 
        onScan={handleToBinScan}
        placeholder="Enter Bin ID (e.g., BIN-A2-01)"
        scanType="bin"
      />

      <div className="bins-list">
        <h3>Available Bins</h3>
        {mockBins.filter(b => b.id !== newTransfer.fromBin.id).map(bin => (
          <button
            key={bin.id}
            className="bin-card"
            onClick={() => handleToBinScan(bin.id)}
          >
            <div className="bin-info">
              <span className="bin-id">{bin.id}</span>
              <span className="bin-stock">{bin.currentStock} items</span>
            </div>
            <div className="bin-capacity">
              <div className="capacity-bar">
                <div 
                  className="capacity-fill"
                  style={{ width: `${(bin.currentStock / bin.capacity) * 100}%` }}
                ></div>
              </div>
              <span className="capacity-text">{bin.currentStock}/{bin.capacity}</span>
            </div>
          </button>
        ))}
      </div>

      <button className="secondary-button" onClick={() => setStep('scan-from')}>
        Back
      </button>
    </div>
  );

  const renderScanItems = () => (
    <div className="transfers-section">
      <div className="transfer-route-display">
        <div className="route-bin selected">
          <span className="route-label">From</span>
          <span className="route-value">{newTransfer.fromBin.id}</span>
        </div>
        <div className="route-arrow">→</div>
        <div className="route-bin selected">
          <span className="route-label">To</span>
          <span className="route-value">{newTransfer.toBin.id}</span>
        </div>
      </div>

      <h2>Scan Items to Transfer</h2>
      <p className="section-description">Scan each tyre you want to move</p>

      <div className="scanned-count">
        <span className="count-value">{scannedQty}</span>
        <span className="count-label">items scanned</span>
      </div>

      <Scanner 
        onScan={handleItemScan}
        placeholder="Scan tyre barcode"
        scanType="tyre"
      />

      {newTransfer.items.length > 0 && (
        <div className="scanned-items">
          <h3>Scanned Items</h3>
          {newTransfer.items.map((item, idx) => {
            const tyre = getTyreById(item.tyreId);
            return (
              <div key={idx} className="scanned-item">
                <span className="item-name">{tyre?.brand} {tyre?.model}</span>
                <span className="item-qty">× {item.quantity}</span>
              </div>
            );
          })}
        </div>
      )}

      <button className="primary-button" onClick={completeTransfer}>
        Complete Transfer
      </button>
      <button className="secondary-button" onClick={() => setStep('scan-to')}>
        Back
      </button>
    </div>
  );

  const renderComplete = () => (
    <div className="transfers-section complete-section">
      <div className="success-icon">✅</div>
      <h2>Transfer Complete!</h2>
      <p>Transfer {currentTransfer?.id} has been recorded</p>
      
      <div className="transfer-summary">
        <div className="summary-route">
          <span>{currentTransfer?.fromBin}</span>
          <span className="arrow">→</span>
          <span>{currentTransfer?.toBin}</span>
        </div>
        <div className="summary-items">
          {currentTransfer?.items.map((item, idx) => {
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

      <button className="primary-button" onClick={startNewTransfer}>
        New Transfer
      </button>
      <button className="secondary-button" onClick={resetTransfer}>
        Back to List
      </button>
    </div>
  );

  return (
    <div className="transfers-page">
      <div className="transfers-container">
        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}
        
        {step === 'list' && renderTransferList()}
        {step === 'scan-from' && renderScanFromBin()}
        {step === 'scan-to' && renderScanToBin()}
        {step === 'scan-items' && renderScanItems()}
        {step === 'complete' && renderComplete()}
      </div>
    </div>
  );
}

export default Transfers;
