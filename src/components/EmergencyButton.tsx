import React from 'react';
import { useElevatorContext } from '../context/ElevatorContext';

interface EmergencyButtonProps {
  elevatorId: number;
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({ elevatorId }) => {
  const { state, setEmergency } = useElevatorContext();

  const handleEmergency = () => {
    setEmergency(true);
  };

  const handleReset = () => {
    setEmergency(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleEmergency}
        disabled={state.isEmergency}
        className={`px-4 py-2 rounded-full font-bold text-white transition-all
          ${state.isEmergency 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-red-600 hover:bg-red-700 active:bg-red-800'}`}
      >
        EMERGENCY STOP
      </button>
      {state.isEmergency && (
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-full font-bold text-white bg-green-600 hover:bg-green-700 active:bg-green-800"
        >
          Reset Emergency
        </button>
      )}
    </div>
  );
};

export default EmergencyButton; 