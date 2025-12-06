import { useState } from 'react';
import Scanner from '../components/Scanner';
import { mockCycleCountTasks, mockTyres, getTyreById, getBinById } from '../data/mockData';
import './StockTaking.css';

function StockTaking() {
  const [step, setStep] = useState('list'); // 'list', 'scan-bin', 'counting', 'variance', 'complete'
  const [tasks, setTasks] = useState(mockCycleCountTasks);
  const [currentTask, setCurrentTask] = useState(null);
  const [countedItems, setCountedItems] = useState([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });

  const startTask = (task) => {
    setCurrentTask(task);
    setCountedItems(task.expectedItems.map(item => ({ ...item, countedQty: 0 })));
    setCurrentItemIndex(0);
    setStep('counting');
  };

  const handleBinScan = (scannedId) => {
    const bin = getBinById(scannedId);
    if (bin) {
      // Check if there's a task for this bin
      const task = tasks.find(t => t.binId === scannedId && t.status !== 'completed');
      if (task) {
        startTask(task);
      } else {
        // Create ad-hoc count task
        const newTask = {
          id: `CC${String(tasks.length + 1).padStart(3, '0')}`,
          binId: scannedId,
          scheduledDate: new Date().toISOString().split('T')[0],
          status: 'in_progress',
          expectedItems: [
            { tyreId: 'TYR001', expectedQty: Math.floor(Math.random() * 20) + 5 }
          ]
        };
        startTask(newTask);
      }
      setMessage({ type: '', text: '' });
    } else {
      setMessage({ type: 'error', text: 'Bin not found. Please scan a valid bin.' });
    }
  };

  const handleItemScan = (scannedId) => {
    const currentItem = countedItems[currentItemIndex];
    const tyre = getTyreById(currentItem.tyreId);
    
    if (scannedId === currentItem.tyreId || scannedId === tyre?.sku) {
      const updatedItems = [...countedItems];
      updatedItems[currentItemIndex].countedQty += 1;
      setCountedItems(updatedItems);
      setMessage({ type: 'success', text: `✓ Count: ${updatedItems[currentItemIndex].countedQty}` });
    } else {
      // Allow counting other items
      const foundTyre = mockTyres.find(t => t.id === scannedId || t.sku === scannedId);
      if (foundTyre) {
        const existingIdx = countedItems.findIndex(i => i.tyreId === foundTyre.id);
        if (existingIdx >= 0) {
          const updatedItems = [...countedItems];
          updatedItems[existingIdx].countedQty += 1;
          setCountedItems(updatedItems);
          setMessage({ type: 'info', text: `✓ Added to ${foundTyre.brand} ${foundTyre.model}` });
        } else {
          setCountedItems([...countedItems, { tyreId: foundTyre.id, expectedQty: 0, countedQty: 1 }]);
          setMessage({ type: 'info', text: `✓ New item: ${foundTyre.brand} ${foundTyre.model}` });
        }
      } else {
        setMessage({ type: 'error', text: 'Tyre not recognized.' });
      }
    }
  };

  const nextItem = () => {
    if (currentItemIndex < countedItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      setMessage({ type: '', text: '' });
    }
  };

  const prevItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
      setMessage({ type: '', text: '' });
    }
  };

  const finishCounting = () => {
    const hasVariance = countedItems.some(item => item.countedQty !== item.expectedQty);
    if (hasVariance) {
      setStep('variance');
    } else {
      completeCount();
    }
  };

  const completeCount = () => {
    const updatedTasks = tasks.map(t => 
      t.id === currentTask.id ? { ...t, status: 'completed' } : t
    );
    setTasks(updatedTasks);
    setStep('complete');
  };

  const resetCount = () => {
    setStep('list');
    setCurrentTask(null);
    setCountedItems([]);
    setCurrentItemIndex(0);
    setMessage({ type: '', text: '' });
  };

  const renderTaskList = () => (
    <div className="stocktaking-section">
      <div className="section-header">
        <h2>Stock Taking Tasks</h2>
        <button className="scan-bin-button" onClick={() => setStep('scan-bin')}>
          📦 Scan Bin
        </button>
      </div>

      <div className="task-filters">
        <button className="filter-btn active">All</button>
        <button className="filter-btn">Pending</button>
        <button className="filter-btn">In Progress</button>
        <button className="filter-btn">Completed</button>
      </div>

      <div className="tasks-list">
        {tasks.map(task => {
          return (
            <div key={task.id} className={`task-card ${task.status}`}>
              <div className="task-header">
                <span className="task-id">{task.id}</span>
                <span className={`task-status ${task.status}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
              <div className="task-details">
                <div className="task-bin">
                  <span className="detail-label">Bin:</span>
                  <span className="detail-value">{task.binId}</span>
                </div>
                <div className="task-date">
                  <span className="detail-label">Scheduled:</span>
                  <span className="detail-value">{task.scheduledDate}</span>
                </div>
              </div>
              <div className="task-items-preview">
                {task.expectedItems.length} item type(s) to count
              </div>
              {task.status !== 'completed' && (
                <button 
                  className="start-count-btn"
                  onClick={() => startTask(task)}
                >
                  Start Count
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderScanBin = () => (
    <div className="stocktaking-section">
      <h2>Scan Bin to Count</h2>
      <p className="section-description">Scan a bin barcode to start an ad-hoc count</p>
      
      <Scanner 
        onScan={handleBinScan}
        placeholder="Enter Bin ID (e.g., BIN-A1-01)"
        scanType="bin"
      />

      <button className="secondary-button" onClick={() => setStep('list')}>
        Back to Tasks
      </button>
    </div>
  );

  const renderCounting = () => {
    const currentItem = countedItems[currentItemIndex];
    const tyre = getTyreById(currentItem.tyreId);
    
    return (
      <div className="stocktaking-section">
        <div className="count-header">
          <div className="bin-info-badge">
            <span className="badge-icon">📦</span>
            <span className="badge-text">{currentTask.binId}</span>
          </div>
          <span className="item-progress">{currentItemIndex + 1} / {countedItems.length}</span>
        </div>

        <div className="count-card">
          <div className="tyre-info">
            <div className="tyre-icon">🛞</div>
            <h3>{tyre?.brand} {tyre?.model}</h3>
            <p className="tyre-sku">{tyre?.sku}</p>
            <p className="tyre-size">{tyre?.size}</p>
          </div>

          <div className="count-comparison">
            <div className="expected-count">
              <span className="count-label">Expected</span>
              <span className="count-value">{currentItem.expectedQty}</span>
            </div>
            <div className="vs-divider">vs</div>
            <div className="actual-count">
              <span className="count-label">Counted</span>
              <span className={`count-value ${currentItem.countedQty !== currentItem.expectedQty ? 'variance' : 'match'}`}>
                {currentItem.countedQty}
              </span>
            </div>
          </div>

          <div className="manual-adjust">
            <button className="adjust-btn minus" onClick={() => {
              if (currentItem.countedQty > 0) {
                const updated = [...countedItems];
                updated[currentItemIndex].countedQty -= 1;
                setCountedItems(updated);
              }
            }}>−</button>
            <span className="adjust-value">{currentItem.countedQty}</span>
            <button className="adjust-btn plus" onClick={() => {
              const updated = [...countedItems];
              updated[currentItemIndex].countedQty += 1;
              setCountedItems(updated);
            }}>+</button>
          </div>
        </div>

        <Scanner 
          onScan={handleItemScan}
          placeholder={`Scan ${tyre?.sku}`}
          scanType="tyre"
        />

        <div className="count-navigation">
          <button 
            className="nav-btn prev" 
            onClick={prevItem}
            disabled={currentItemIndex === 0}
          >
            ← Previous
          </button>
          {currentItemIndex < countedItems.length - 1 ? (
            <button className="nav-btn next" onClick={nextItem}>
              Next →
            </button>
          ) : (
            <button className="nav-btn finish" onClick={finishCounting}>
              Finish Count
            </button>
          )}
        </div>

        <button className="secondary-button" onClick={resetCount}>
          Cancel
        </button>
      </div>
    );
  };

  const renderVariance = () => (
    <div className="stocktaking-section">
      <div className="variance-header">
        <span className="variance-icon">⚠️</span>
        <h2>Variance Detected</h2>
      </div>
      <p className="section-description">
        The counted quantities differ from expected. Please review and confirm.
      </p>

      <div className="variance-list">
        {countedItems.filter(item => item.countedQty !== item.expectedQty).map((item, idx) => {
          const tyre = getTyreById(item.tyreId);
          const diff = item.countedQty - item.expectedQty;
          return (
            <div key={idx} className="variance-item">
              <div className="variance-tyre">
                <span className="tyre-name">{tyre?.brand} {tyre?.model}</span>
                <span className="tyre-sku">{tyre?.sku}</span>
              </div>
              <div className="variance-counts">
                <span className="expected">Expected: {item.expectedQty}</span>
                <span className="counted">Counted: {item.countedQty}</span>
                <span className={`difference ${diff > 0 ? 'positive' : 'negative'}`}>
                  {diff > 0 ? '+' : ''}{diff}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <button className="primary-button" onClick={completeCount}>
        Confirm & Submit
      </button>
      <button className="secondary-button" onClick={() => setStep('counting')}>
        Re-count
      </button>
    </div>
  );

  const renderComplete = () => (
    <div className="stocktaking-section complete-section">
      <div className="success-icon">✅</div>
      <h2>Count Complete!</h2>
      <p>Stock count for {currentTask?.binId} has been submitted</p>

      <div className="count-summary">
        <h3>Summary</h3>
        {countedItems.map((item, idx) => {
          const tyre = getTyreById(item.tyreId);
          const match = item.countedQty === item.expectedQty;
          return (
            <div key={idx} className={`summary-row ${match ? '' : 'variance'}`}>
              <span className="summary-item">{tyre?.brand} {tyre?.model}</span>
              <span className="summary-counts">
                {item.countedQty} / {item.expectedQty}
                {!match && <span className="variance-badge">!</span>}
              </span>
            </div>
          );
        })}
      </div>

      <button className="primary-button" onClick={resetCount}>
        Back to Tasks
      </button>
    </div>
  );

  return (
    <div className="stocktaking-page">
      <div className="stocktaking-container">
        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}
        
        {step === 'list' && renderTaskList()}
        {step === 'scan-bin' && renderScanBin()}
        {step === 'counting' && renderCounting()}
        {step === 'variance' && renderVariance()}
        {step === 'complete' && renderComplete()}
      </div>
    </div>
  );
}

export default StockTaking;
