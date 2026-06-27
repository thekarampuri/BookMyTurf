export interface Turf {
  id: string;
  name: string;
  size: string;
  surface: string;
  amenities: string[];
  morningPrice: number; // per hour
  eveningPrice: number; // per hour
  imageUrl?: string;
}

export interface TimeSlot {
  id: string;
  time: string; // "09:00 AM"
  endTime: string; // "10:00 AM"
  price: number;
  isBooked: boolean;
  isPrime: boolean; // evening prime slot
}

export interface BookingState {
  selectedTurf: Turf | null;
  selectedDate: Date | null;
  selectedDuration: number; // in hours: 0.5, 1, 2
  selectedSlot: TimeSlot | null;
}

export interface UserDetails {
  name: string;
  phone: string;
  email: string;
  agreedToTerms: boolean;
}
