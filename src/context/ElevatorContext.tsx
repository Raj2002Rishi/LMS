import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { Direction, ElevatorState, ElevatorStatus, FloorNumber } from '../types/elevator';

interface ElevatorContextType {
  state: ElevatorState;
  requestElevator: (floor: FloorNumber) => void;
  resetSystem: () => void;
  setEmergency: (isEmergency: boolean) => void;
}

const initialState: ElevatorState = {
  currentFloor: 1,
  targetFloor: null,
  status: 'idle',
  direction: 'idle',
  doorOpen: false,
  queue: [],
  lastTripTime: null,
  floorRequests: Object.fromEntries(Array.from({ length: 100 }, (_, i) => [i + 1, false])),
  isEmergency: false,
  isMoving: false
};

type ElevatorAction = 
  | { type: 'REQUEST_ELEVATOR'; floor: FloorNumber }
  | { type: 'SET_STATUS'; status: ElevatorStatus }
  | { type: 'SET_CURRENT_FLOOR'; floor: FloorNumber }
  | { type: 'SET_TARGET_FLOOR'; floor: FloorNumber | null }
  | { type: 'SET_DIRECTION'; direction: Direction }
  | { type: 'TOGGLE_DOOR'; open: boolean }
  | { type: 'SET_TRIP_TIME'; time: number }
  | { type: 'CLEAR_FLOOR_REQUEST'; floor: FloorNumber }
  | { type: 'RESET_SYSTEM' }
  | { type: 'SET_EMERGENCY'; isEmergency: boolean };

const elevatorReducer = (state: ElevatorState, action: ElevatorAction): ElevatorState => {
  switch (action.type) {
    case 'REQUEST_ELEVATOR':
      if (state.currentFloor === action.floor && 
         (state.status === 'idle' || state.status === 'doors-open')) {
        return state;
      }
      
      if (state.queue.includes(action.floor) || state.targetFloor === action.floor) {
        return state;
      }
      
      return {
        ...state,
        queue: [...state.queue, action.floor],
        floorRequests: {
          ...state.floorRequests,
          [action.floor]: true
        },
        targetFloor: state.targetFloor === null ? action.floor : state.targetFloor
      };
      
    case 'SET_STATUS':
      return {
        ...state,
        status: action.status
      };
      
    case 'SET_CURRENT_FLOOR':
      return {
        ...state,
        currentFloor: action.floor
      };
      
    case 'SET_TARGET_FLOOR':
      return {
        ...state,
        targetFloor: action.floor
      };
      
    case 'SET_DIRECTION':
      return {
        ...state,
        direction: action.direction
      };
      
    case 'TOGGLE_DOOR':
      return {
        ...state,
        doorOpen: action.open
      };
      
    case 'SET_TRIP_TIME':
      return {
        ...state,
        lastTripTime: action.time
      };
      
    case 'CLEAR_FLOOR_REQUEST':
      return {
        ...state,
        queue: state.queue.filter(floor => floor !== action.floor),
        floorRequests: {
          ...state.floorRequests,
          [action.floor]: false
        }
      };
      
    case 'RESET_SYSTEM':
      return initialState;
      
    case 'SET_EMERGENCY':
      return {
        ...state,
        isEmergency: action.isEmergency,
        isMoving: false,
        status: action.isEmergency ? 'Emergency Stop' : 'idle',
        targetFloor: null
      };
      
    default:
      return state;
  }
};

const ElevatorContext = createContext<ElevatorContextType | undefined>(undefined);

export const ElevatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(elevatorReducer, initialState);
  const tripStartTime = useRef<number | null>(null);
  
  const requestElevator = (floor: FloorNumber) => {
    if (!state.isEmergency) {
      dispatch({ type: 'REQUEST_ELEVATOR', floor });
    }
  };
  
  const resetSystem = () => {
    dispatch({ type: 'RESET_SYSTEM' });
  };

  const setEmergency = (isEmergency: boolean) => {
    dispatch({ type: 'SET_EMERGENCY', isEmergency });
  };
  
  useEffect(() => {
    let timerId: number | undefined;
    
    const processNextFloor = () => {
      if (state.queue.length > 0 && state.status === 'idle' && !state.isEmergency) {
        const nextFloor = state.queue[0];
        dispatch({ type: 'SET_TARGET_FLOOR', floor: nextFloor });
        
        if (nextFloor > state.currentFloor) {
          dispatch({ type: 'SET_DIRECTION', direction: 'up' });
          dispatch({ type: 'SET_STATUS', status: 'moving-up' });
        } else if (nextFloor < state.currentFloor) {
          dispatch({ type: 'SET_DIRECTION', direction: 'down' });
          dispatch({ type: 'SET_STATUS', status: 'moving-down' });
        } else {
          dispatch({ type: 'SET_STATUS', status: 'doors-opening' });
        }
        
        tripStartTime.current = Date.now();
      }
    };
    
    if ((state.status === 'moving-up' || state.status === 'moving-down') && !state.isEmergency) {
      timerId = window.setTimeout(() => {
        const newFloor = state.status === 'moving-up' 
          ? state.currentFloor + 1 
          : state.currentFloor - 1;
        
        dispatch({ type: 'SET_CURRENT_FLOOR', floor: newFloor });
        
        if (newFloor === state.targetFloor) {
          dispatch({ type: 'SET_STATUS', status: 'doors-opening' });
          
          if (tripStartTime.current !== null) {
            const tripTime = Date.now() - tripStartTime.current;
            dispatch({ type: 'SET_TRIP_TIME', time: tripTime });
            tripStartTime.current = null;
          }
        }
      }, 500);
    }
    
    if (state.status === 'doors-opening') {
      timerId = window.setTimeout(() => {
        dispatch({ type: 'TOGGLE_DOOR', open: true });
        dispatch({ type: 'SET_STATUS', status: 'doors-open' });
        dispatch({ type: 'CLEAR_FLOOR_REQUEST', floor: state.currentFloor });
        
        if (state.targetFloor === state.currentFloor) {
          dispatch({ type: 'SET_TARGET_FLOOR', floor: null });
        }
      }, 1000);
    }
    
    if (state.status === 'doors-open') {
      timerId = window.setTimeout(() => {
        dispatch({ type: 'SET_STATUS', status: 'doors-closing' });
      }, 2000);
    }
    
    if (state.status === 'doors-closing') {
      timerId = window.setTimeout(() => {
        dispatch({ type: 'TOGGLE_DOOR', open: false });
        dispatch({ type: 'SET_STATUS', status: 'idle' });
        dispatch({ type: 'SET_DIRECTION', direction: 'idle' });
      }, 1000);
    }
    
    if (state.status === 'idle' && state.queue.length > 0 && !state.isEmergency) {
      processNextFloor();
    }
    
    return () => {
      if (timerId !== undefined) {
        clearTimeout(timerId);
      }
    };
  }, [state]);
  
  return (
    <ElevatorContext.Provider value={{ state, requestElevator, resetSystem, setEmergency }}>
      {children}
    </ElevatorContext.Provider>
  );
};

export const useElevatorContext = () => {
  const context = useContext(ElevatorContext);
  if (context === undefined) {
    throw new Error('useElevatorContext must be used within an ElevatorProvider');
  }
  return context;
};