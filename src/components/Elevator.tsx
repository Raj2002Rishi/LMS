import React from 'react';
import { useElevatorContext } from '../context/ElevatorContext';
import EmergencyButton from './EmergencyButton';

interface ElevatorProps {
  position: string;
  elevatorId: number;
}

const Elevator: React.FC<ElevatorProps> = ({ position, elevatorId }) => {
  const { state } = useElevatorContext();
  const { doorOpen, status, currentFloor, isEmergency } = state;
  
  let elevatorAnimation = '';
  if (status === 'moving-up' || status === 'moving-down') {
    elevatorAnimation = 'transition-transform duration-500 ease-in-out';
  }
  
  return (
    <div className="absolute inset-0 bg-gray-200 border-l border-r border-gray-300">
      <div className="absolute inset-0 flex flex-col justify-between py-2">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="flex justify-between items-center px-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
        ))}
      </div>
      
      <div 
        className={`absolute bottom-0 left-0 right-0 h-24 bg-blue-600 shadow-lg ${elevatorAnimation}`}
        style={{ transform: `translateY(-${position})` }}
      >
        <div className="absolute inset-0 flex">
          <div 
            className="w-1/2 h-full bg-gray-800 transition-transform duration-1000 ease-in-out"
            style={{ transform: doorOpen ? 'translateX(-100%)' : 'translateX(0)' }}
          ></div>
          <div 
            className="w-1/2 h-full bg-gray-800 transition-transform duration-1000 ease-in-out"
            style={{ transform: doorOpen ? 'translateX(100%)' : 'translateX(0)' }}
          ></div>
        </div>
        
        <div className="absolute top-2 left-0 right-0 flex justify-center">
          <div className="bg-black bg-opacity-70 px-2 py-1 rounded-md">
            <span className="text-white text-sm font-medium">{currentFloor}</span>
          </div>
        </div>

        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <EmergencyButton elevatorId={elevatorId} />
        </div>
      </div>
    </div>
  );
};

export default Elevator;