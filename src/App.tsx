import React from 'react';
import Building from './components/Building';
import StatusPanel from './components/StatusPanel';
import { ElevatorProvider } from './context/ElevatorContext';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Elevator Management System</h1>
          <p className="text-gray-600 mt-2">Interactive real-time elevator simulation</p>
        </header>
        
        <ElevatorProvider>
          <div className="grid grid-cols-1 gap-6">
            <Building />
            <StatusPanel />
          </div>
        </ElevatorProvider>
        
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2025 Elevator Management Systems. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;