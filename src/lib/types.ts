import { Timestamp } from 'firebase/firestore';

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  vehicles?: Vehicle[];
};

export type Vehicle = {
  id: string;
  registrationNumber: string;
  type: 'Compact' | 'Regular' | 'Large' | 'EV';
  make: string;
  model: string;
};

export type SlotType = 'Compact' | 'Regular' | 'Large' | 'EV' | 'Disabled';

export type ParkingLot = {
  id: string;
  name: string;
  address: string;
  distance: string;
  location: {
    lat: number;
    lng: number;
  };
  totalSlots: number;
  rates: {
    perHour: number;
    perDay: number;
  };
  slotTypes: SlotType[];
  operatingHours: string;
  images: string[];
  // Live data, not stored in Firestore directly for the lot
  availableSlots?: number; 
  slots?: ParkingSlot[];
  createdAt?: Timestamp;
};

export type ParkingSlot = {
  id: string;
  lotId: string;
  level: number;
  type: SlotType;
  isOccupied: boolean;
};

export type Booking = {
  id: string;
  userId: string;
  lotId: string;
  lotName: string;
  slotId: string;
  vehicleReg: string;
  startTime: Timestamp;
  endTime: Timestamp;
  status: 'Confirmed' | 'Active' | 'Completed' | 'Cancelled';
  totalCost: number;
};
