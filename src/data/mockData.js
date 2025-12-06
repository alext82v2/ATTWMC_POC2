// Mock data for warehouse scanning application

export const mockUsers = [
  { id: 'USR001', name: 'John Smith', role: 'Warehouse Operator', pin: '1234' },
  { id: 'USR002', name: 'Jane Doe', role: 'Supervisor', pin: '5678' },
  { id: 'USR003', name: 'Bob Wilson', role: 'Driver', pin: '9999' }
];

export const mockLocations = [
  { id: 'LOC001', name: 'Warehouse A - Zone 1', type: 'receiving' },
  { id: 'LOC002', name: 'Warehouse A - Zone 2', type: 'storage' },
  { id: 'LOC003', name: 'Warehouse B - Zone 1', type: 'dispatch' },
  { id: 'LOC004', name: 'Loading Bay 1', type: 'loading' },
  { id: 'LOC005', name: 'Loading Bay 2', type: 'loading' }
];

export const mockBins = [
  { id: 'BIN-A1-01', location: 'LOC001', capacity: 50, currentStock: 12 },
  { id: 'BIN-A1-02', location: 'LOC001', capacity: 50, currentStock: 45 },
  { id: 'BIN-A2-01', location: 'LOC002', capacity: 100, currentStock: 78 },
  { id: 'BIN-A2-02', location: 'LOC002', capacity: 100, currentStock: 23 },
  { id: 'BIN-B1-01', location: 'LOC003', capacity: 75, currentStock: 60 },
  { id: 'BIN-B1-02', location: 'LOC003', capacity: 75, currentStock: 15 }
];

export const mockTyres = [
  { 
    id: 'TYR001', 
    sku: 'MT-225-45-R17', 
    brand: 'Michelin', 
    model: 'Pilot Sport 4', 
    size: '225/45 R17',
    type: 'Passenger Car',
    price: 189.99,
    quantity: 24
  },
  { 
    id: 'TYR002', 
    sku: 'BR-265-70-R16', 
    brand: 'Bridgestone', 
    model: 'Dueler H/T', 
    size: '265/70 R16',
    type: 'SUV/4x4',
    price: 245.99,
    quantity: 18
  },
  { 
    id: 'TYR003', 
    sku: 'CT-315-80-R22.5', 
    brand: 'Continental', 
    model: 'Conti Hybrid HD3', 
    size: '315/80 R22.5',
    type: 'Truck',
    price: 450.00,
    quantity: 32
  },
  { 
    id: 'TYR004', 
    sku: 'GY-205-55-R16', 
    brand: 'Goodyear', 
    model: 'Eagle F1', 
    size: '205/55 R16',
    type: 'Passenger Car',
    price: 165.00,
    quantity: 42
  },
  { 
    id: 'TYR005', 
    sku: 'DL-295-80-R22.5', 
    brand: 'Dunlop', 
    model: 'SP 446', 
    size: '295/80 R22.5',
    type: 'Truck',
    price: 420.00,
    quantity: 15
  },
  { 
    id: 'TYR006', 
    sku: 'PR-235-65-R17', 
    brand: 'Pirelli', 
    model: 'Scorpion Verde', 
    size: '235/65 R17',
    type: 'SUV/4x4',
    price: 210.00,
    quantity: 28
  }
];

export const mockIncomingShipments = [
  {
    id: 'SHIP001',
    supplier: 'Michelin Distribution',
    expectedDate: '2024-12-05',
    status: 'pending',
    items: [
      { tyreId: 'TYR001', quantity: 50 },
      { tyreId: 'TYR004', quantity: 30 }
    ]
  },
  {
    id: 'SHIP002',
    supplier: 'Continental Wholesale',
    expectedDate: '2024-12-06',
    status: 'in_transit',
    items: [
      { tyreId: 'TYR003', quantity: 20 }
    ]
  }
];

export const mockTransferOrders = [
  {
    id: 'TRF001',
    fromBin: 'BIN-A1-01',
    toBin: 'BIN-A2-01',
    items: [{ tyreId: 'TYR001', quantity: 5 }],
    status: 'pending',
    createdAt: '2024-12-05T08:00:00Z'
  },
  {
    id: 'TRF002',
    fromBin: 'BIN-A2-02',
    toBin: 'BIN-B1-01',
    items: [{ tyreId: 'TYR002', quantity: 10 }],
    status: 'completed',
    createdAt: '2024-12-04T14:30:00Z'
  }
];

export const mockCycleCountTasks = [
  {
    id: 'CC001',
    binId: 'BIN-A1-01',
    scheduledDate: '2024-12-05',
    status: 'pending',
    expectedItems: [
      { tyreId: 'TYR001', expectedQty: 12 }
    ]
  },
  {
    id: 'CC002',
    binId: 'BIN-A2-01',
    scheduledDate: '2024-12-05',
    status: 'in_progress',
    expectedItems: [
      { tyreId: 'TYR002', expectedQty: 25 },
      { tyreId: 'TYR004', expectedQty: 53 }
    ]
  }
];

export const mockDispatchOrders = [
  {
    id: 'DSP001',
    customerName: 'AutoFit Garage',
    customerAddress: '123 Main Street, Sydney NSW 2000',
    orderDate: '2024-12-04',
    requiredDate: '2024-12-06',
    status: 'picking',
    items: [
      { tyreId: 'TYR001', quantity: 4, pickedQty: 2 },
      { tyreId: 'TYR004', quantity: 4, pickedQty: 0 }
    ]
  },
  {
    id: 'DSP002',
    customerName: 'Highway Truck Services',
    customerAddress: '456 Industrial Ave, Melbourne VIC 3000',
    orderDate: '2024-12-05',
    requiredDate: '2024-12-07',
    status: 'pending',
    items: [
      { tyreId: 'TYR003', quantity: 8, pickedQty: 0 },
      { tyreId: 'TYR005', quantity: 4, pickedQty: 0 }
    ]
  },
  {
    id: 'DSP003',
    customerName: 'City Motors',
    customerAddress: '789 Queen St, Brisbane QLD 4000',
    orderDate: '2024-12-03',
    requiredDate: '2024-12-05',
    status: 'ready_to_load',
    items: [
      { tyreId: 'TYR002', quantity: 6, pickedQty: 6 },
      { tyreId: 'TYR006', quantity: 4, pickedQty: 4 }
    ]
  }
];

export const mockTrucks = [
  { id: 'TRK001', registration: 'ABC-123', driver: 'USR003', capacity: 200, status: 'available' },
  { id: 'TRK002', registration: 'DEF-456', driver: null, capacity: 150, status: 'available' },
  { id: 'TRK003', registration: 'GHI-789', driver: 'USR003', capacity: 250, status: 'loading' }
];

export const mockDeliveries = [
  {
    id: 'DEL001',
    truckId: 'TRK003',
    dispatchOrders: ['DSP003'],
    status: 'loading',
    departureTime: null,
    estimatedArrival: null
  },
  {
    id: 'DEL002',
    truckId: 'TRK001',
    dispatchOrders: ['DSP001', 'DSP002'],
    status: 'scheduled',
    departureTime: '2024-12-06T06:00:00Z',
    estimatedArrival: '2024-12-06T14:00:00Z'
  }
];

export const mockDeliveryStops = [
  {
    deliveryId: 'DEL002',
    stopNumber: 1,
    orderId: 'DSP001',
    customerName: 'AutoFit Garage',
    address: '123 Main Street, Sydney NSW 2000',
    estimatedTime: '2024-12-06T10:00:00Z',
    status: 'pending'
  },
  {
    deliveryId: 'DEL002',
    stopNumber: 2,
    orderId: 'DSP002',
    customerName: 'Highway Truck Services',
    address: '456 Industrial Ave, Melbourne VIC 3000',
    estimatedTime: '2024-12-06T14:00:00Z',
    status: 'pending'
  }
];

// Helper function to get tyre by ID
export const getTyreById = (id) => mockTyres.find(t => t.id === id);

// Helper function to get location by ID
export const getLocationById = (id) => mockLocations.find(l => l.id === id);

// Helper function to get bin by ID
export const getBinById = (id) => mockBins.find(b => b.id === id);
