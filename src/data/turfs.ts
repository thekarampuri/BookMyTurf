import type { Turf } from '../types';

export const TURFS: Turf[] = [
  {
    id: 'turf-1',
    name: 'Grand Arena',
    size: '60 × 40 ft',
    surface: 'Premium Synthetic Grass',
    amenities: ['Floodlights', 'Changing Rooms', 'Parking', 'Drinking Water', 'First Aid'],
    morningPrice: 900,
    eveningPrice: 1200,
  },
  {
    id: 'turf-2',
    name: 'The Pitch',
    size: '80 × 50 ft',
    surface: 'FIFA-Grade Turf',
    amenities: ['Floodlights', 'Cafeteria', 'Changing Rooms', 'Parking', 'Scoreboard'],
    morningPrice: 1000,
    eveningPrice: 1400,
  },
  {
    id: 'turf-3',
    name: 'Mini Field',
    size: '40 × 30 ft',
    surface: 'Synthetic Grass',
    amenities: ['Floodlights', 'Drinking Water', 'Parking'],
    morningPrice: 700,
    eveningPrice: 900,
  },
];

export function generateSlots(turf: Turf, date: Date): import('../types').TimeSlot[] {
  const slots: import('../types').TimeSlot[] = [];
  // Pre-booked slots for demo
  const bookedTimes = ['11:00 AM', '06:00 PM', '07:00 PM'];

  const hours = [
    { h: 6, label: '06:00 AM' },
    { h: 7, label: '07:00 AM' },
    { h: 8, label: '08:00 AM' },
    { h: 9, label: '09:00 AM' },
    { h: 10, label: '10:00 AM' },
    { h: 11, label: '11:00 AM' },
    { h: 12, label: '12:00 PM' },
    { h: 13, label: '01:00 PM' },
    { h: 14, label: '02:00 PM' },
    { h: 15, label: '03:00 PM' },
    { h: 16, label: '04:00 PM' },
    { h: 17, label: '05:00 PM' },
    { h: 18, label: '06:00 PM' },
    { h: 19, label: '07:00 PM' },
    { h: 20, label: '08:00 PM' },
    { h: 21, label: '09:00 PM' },
    { h: 22, label: '10:00 PM' },
  ];

  for (const slot of hours) {
    const isPrime = slot.h >= 17;
    const price = isPrime ? turf.eveningPrice : turf.morningPrice;
    const endH = slot.h + 1;
    const endLabel =
      endH >= 24
        ? `${String(endH - 24).padStart(2, '0')}:00 AM`
        : endH >= 12
        ? `${String(endH === 12 ? 12 : endH - 12).padStart(2, '0')}:00 PM`
        : `${String(endH).padStart(2, '0')}:00 AM`;

    slots.push({
      id: `${date.toISOString()}-${slot.label}`,
      time: slot.label,
      endTime: endLabel,
      price: Math.round(price),
      isBooked: bookedTimes.includes(slot.label),
      isPrime,
    });
  }

  return slots;
}
