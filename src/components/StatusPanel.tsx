import React from 'react';
import { ArrowDown, ArrowUp, Pause, DoorOpen } from 'lucide-react';
import { useElevatorContext } from '../context/ElevatorContext';
import EmergencyButton from './EmergencyButton';

const StatusPanel: React.FC = () => {
  const { state, resetSystem } = useElevatorContext();
  
  // Format trip time from milliseconds to seconds with 1 decimal place
  const formattedTripTime = state.lastTripTime 
    ? `${(state.lastTripTime / 1000).toFixed(1)}s` 
    : 'N/A';
  
  // Get human-readable status
  const getStatusDisplay = () => {
    switch (state.status) {
      case 'idle':
        return 'Idle';
      case 'moving-up':
        return 'Moving Up';
      case 'moving-down':
        return 'Moving Down';
      case 'doors-opening':
        return 'Doors Opening';
      case 'doors-closing':
        return 'Doors Closing';
      case 'doors-open':
        return 'Doors Open';
      default:
        return state.status;
    }
  };
  
  // Get status icon
  const getStatusIcon = () => {
    switch (state.status) {
      case 'moving-up':
        return <ArrowUp className="text-blue-500" />;
      case 'moving-down':
        return <ArrowDown className="text-blue-500" />;
      case 'doors-open':
      case 'doors-opening':
      case 'doors-closing':
        return <DoorOpen className="text-green-500" />;
      default:
        return <Pause className="text-gray-500" />;
    }
  };
  
  // Get color class for status badge
  const getStatusColorClass = () => {
    switch (state.status) {
      case 'idle':
        return 'bg-gray-200 text-gray-800';
      case 'moving-up':
      case 'moving-down':
        return 'bg-blue-100 text-blue-800';
      case 'doors-open':
        return 'bg-green-100 text-green-800';
      case 'doors-opening':
      case 'doors-closing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="mt-4 w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-100 p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Elevator Status</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Current Floor */}
          <div className="bg-white p-3 rounded-md shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Current Floor</div>
            <div className="text-2xl font-bold text-blue-700">{state.currentFloor}</div>
          </div>
          
          {/* Status */}
          <div className="bg-white p-3 rounded-md shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Status</div>
            <div className="flex items-center">
              <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${getStatusColorClass()}`}>
                {getStatusIcon()}
                <span>{getStatusDisplay()}</span>
              </span>
            </div>
          </div>
          
          {/* Queue */}
          <div className="bg-white p-3 rounded-md shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Floor Queue</div>
            <div className="text-md">
              {state.queue.length > 0 
                ? state.queue.map((floor, i) => (
                    <span key={i} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-md mr-1 mb-1">
                      {floor}
                    </span>
                  ))
                : <span className="text-gray-400">None</span>
              }
            </div>
          </div>
          
          {/* Last Trip Time */}
          <div className="bg-white p-3 rounded-md shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Last Trip Time</div>
            <div className="text-lg font-medium">{formattedTripTime}</div>
          </div>
        </div>
        
        {/* System Controls */}
        <div className="mt-4 flex justify-end gap-2">
          <EmergencyButton elevatorId={1} />
          <button 
            onClick={resetSystem}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Reset System
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;