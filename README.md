# ATT Warehouse Scanner

A full warehouse scanning solution (POC) for an auto & truck tyres company. This is a front-end only application with mock data.

## Features

### Login Process
- **QR Code Scan**: Scan employee ID badge (simulated)
- **PIN Entry**: Secure PIN-based authentication
- **Location Selection**: Select working location after login

### Scanning Processes
1. **Receiving**: Receive new tyres into the warehouse
2. **WH Transfers**: Transfer stock between bins and move inventory
3. **Stock Taking**: Cycle counting and inventory management
4. **Dispatch**: Manage stock for customer dispatch
5. **Truck Loading**: Load orders onto delivery trucks
6. **Delivery**: Deliver tyres to customers with confirmation

## Tech Stack
- React 19
- React Router DOM (routing)
- Vite (build tool)
- CSS (styling)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Demo Credentials

| User ID | Name | Role | PIN |
|---------|------|------|-----|
| USR001 | John Smith | Warehouse Operator | 1234 |
| USR002 | Jane Doe | Supervisor | 5678 |
| USR003 | Bob Wilson | Driver | 9999 |

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Header.jsx   # App header with navigation
│   └── Scanner.jsx  # QR/barcode scanner simulation
├── pages/           # Page components
│   ├── Login.jsx
│   ├── LocationScan.jsx
│   ├── Dashboard.jsx
│   ├── Receiving.jsx
│   ├── Transfers.jsx
│   ├── StockTaking.jsx
│   ├── Dispatch.jsx
│   ├── TruckLoading.jsx
│   └── Delivery.jsx
├── data/            # Mock data
│   └── mockData.js
├── App.jsx          # Main app with routing
└── main.jsx         # Entry point
```

## Screenshots

### Login Page
![Login](https://github.com/user-attachments/assets/ab013b4a-205a-49eb-8df2-56f45cd65d5d)

### Dashboard
![Dashboard](https://github.com/user-attachments/assets/de15a1b8-c3fa-40d2-937a-10a439f60d47)

### Dispatch Management
![Dispatch](https://github.com/user-attachments/assets/5da8eb50-03a2-4889-af40-1b6156b74e22)
