export type FloorNumber = number;

export type Direction = 'up' | 'down' | 'idle';

export type ElevatorStatus = 
  | 'idle' 
  | 'moving-up' 
  | 'moving-down' 
  | 'doors-opening' 
  | 'doors-closing'
  | 'doors-open'
  | 'Emergency Stop';

export interface ElevatorState {
  currentFloor: FloorNumber;
  targetFloor: FloorNumber | null;
  status: ElevatorStatus;
  direction: Direction;
  doorOpen: boolean;
  queue: FloorNumber[];
  lastTripTime: number | null;
  floorRequests: Record<number, boolean>;
  isEmergency: boolean;
  isMoving: boolean;
}