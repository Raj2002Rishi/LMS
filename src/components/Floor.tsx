import React from 'react';
import { UserRound } from 'lucide-react';
import { FloorNumber } from '../types/elevator';
import { useElevatorContext } from '../context/ElevatorContext';

interface FloorProps {
  number: FloorNumber;
  isCurrentFloor: boolean;
}

const Floor: React.FC<FloorProps> = ({ number, isCurrentFloor }) => {
  const { state, requestElevator } = useElevatorContext();
  const isRequested = state.floorRequests[number];
  const hasDoorsOpen = isCurrentFloor && state.doorOpen;

  return (
    <div className="relative flex items-center w-full h-24 border-b border-gray-300">
      <div className="absolute left-2 flex flex-col items-center">
        <span className="text-lg font-semibold text-blue-700">{number}</span>
      </div>

      {/* Floor platform */}
      <div className="flex items-center justify-between w-full pl-8 pr-2">
        {/* Waiting passenger indicator */}
        <div className={`transition-opacity duration-300 ${isRequested ? 'opacity-100' : 'opacity-0'}`}>
          <UserRound size={24} className="text-gray-600" />
        </div>

        {/* Call button */}
        <button
          onClick={() => requestElevator(number)}
          disabled={isRequested || (isCurrentFloor && (state.status === 'idle' || hasDoorsOpen))}
          className={`
            flex items-center justify-center w-12 h-12 rounded-full 
            ${isRequested 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}
            transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400
          `}
        >
          <span className="text-sm font-medium">Call</span>
        </button>
      </div>
    </div>
  );
};

export default Floor;