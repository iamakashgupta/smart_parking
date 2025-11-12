// This file is now deprecated as we are fetching live data from Firestore.
// It is kept for reference but is not used in the application.

import type { User, ParkingLot, Booking } from './types';
import { Timestamp } from 'firebase/firestore';


export const demoUsers: User[] = [
  {
    id: 'user1',
    name: 'Rohan Sharma',
    email: 'rohan.sharma@example.com',
    phone: '9876543210',
    avatarUrl: 'https://picsum.photos/seed/avatarIndian1/200/200',
    vehicles: [
      { id: 'v1', registrationNumber: 'MH01AB1234', type: 'Regular', make: 'Maruti', model: 'Swift' },
      { id: 'v2', registrationNumber: 'KA03CD5678', type: 'EV', make: 'Tata', model: 'Nexon EV' },
    ],
  },
];

export const demoLots: ParkingLot[] = [
  {
    id: 'lot1',
    name: 'Connaught Place Lot',
    address: 'Connaught Place, New Delhi',
    distance: '1.2 km',
    location: { lat: 28.6324, lng: 77.2187 },
    totalSlots: 350,
    availableSlots: 120,
    rates: { perHour: 150, perDay: 1000 },
    slotTypes: ['Compact', 'Regular', 'EV', 'Disabled'],
    operatingHours: '24/7',
    images: ['https://picsum.photos/seed/delhi_lot/800/600', 'https://picsum.photos/seed/delhi_interior/800/600'],
    slots: Array.from({ length: 350 }, (_, i) => ({
      id: `s${i + 1}`,
      lotId: 'lot1',
      level: Math.floor(i / 50) + 1,
      type: i % 10 === 0 ? 'EV' : (i % 5 === 0 ? 'Compact' : 'Regular'),
      isOccupied: i > 230,
    })),
  },
];


export const demoBookings: Booking[] = [
    // This is sample data, actual bookings will be read from Firestore.
    // The structure has changed to use Firestore Timestamps.
];
