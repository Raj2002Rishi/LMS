import React, { useState, useEffect } from 'react';
import Floor from './Floor';
import Elevator from './Elevator';
import { FloorNumber } from '../types/elevator';
import { useElevatorContext } from '../context/ElevatorContext';
import { ChevronUp, ChevronDown } from 'lucide-react';

const Building: React.FC = () => {
  const { state } = useElevatorContext();
  const [startFloor, setStartFloor] = useState(1);
  const visibleFloors = 10;
  const totalFloors = 100;
  
  // Auto-scroll to keep elevator in view
  useEffect(() => {
    if (state.currentFloor < startFloor) {
      setStartFloor(Math.max(1, state.currentFloor));
    } else if (state.currentFloor >= startFloor + visibleFloors) {
      setStartFloor(Math.min(totalFloors - visibleFloors + 1, state.currentFloor - visibleFloors + 1));
    }
  }, [state.currentFloor, startFloor, visibleFloors, totalFloors]);
  
  const handleScrollUp = () => {
    setStartFloor(Math.max(1, startFloor - 5));
  };
  
  const handleScrollDown = () => {
    setStartFloor(Math.min(totalFloors - visibleFloors + 1, startFloor + 5));
  };
  
  const floors: FloorNumber[] = Array.from(
    { length: visibleFloors },
    (_, i) => totalFloors - (startFloor + i - 1) as FloorNumber
  ).reverse();
  
  const elevatorPosition = `${((totalFloors - state.currentFloor) * 6)}rem`;
  const isElevatorVisible = state.currentFloor >= startFloor && 
                           state.currentFloor < startFloor + visibleFloors;
  
  return (
    <div className="flex flex-col w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-blue-700 text-white p-3 flex justify-between items-center">
        <h2 className="text-lg font-bold">Floor {state.currentFloor}/100</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleScrollUp}
            disabled={startFloor <= 1}
            className="p-1 hover:bg-blue-600 rounded disabled:opacity-50"
          >
            <ChevronUp size={20} />
          </button>
          <button
            onClick={handleScrollDown}
            disabled={startFloor >= totalFloors - visibleFloors + 1}
            className="p-1 hover:bg-blue-600 rounded disabled:opacity-50"
          >
            <ChevronDown size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex">
        <div className="flex-grow">
          <div className="flex flex-col-reverse h-[30rem]">
            {floors.map(floor => (
              <Floor 
                key={floor} 
                number={floor} 
                isCurrentFloor={state.currentFloor === floor} 
              />
            ))}
          </div>
        </div>
        
        <div className="w-24 h-[30rem] relative overflow-hidden">
          {isElevatorVisible && <Elevator position={elevatorPosition} elevatorId={1} />}
        </div>
      </div>
      
      <div className="bg-gray-100 p-3 text-center text-sm text-gray-600">
        Showing floors {startFloor} to {Math.min(startFloor + visibleFloors - 1, totalFloors)}
      </div>
    </div>
  );
};

export default Building;