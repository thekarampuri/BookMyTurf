import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  getDocs,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Booking, BookingStatus } from '../types';

const BOOKINGS_COLLECTION = 'bookings';

// Fetch all bookings for a specific date (used in BookingFlow to check slots)
export const getBookingsByDate = async (date: string): Promise<Booking[]> => {
  const q = query(
    collection(db, BOOKINGS_COLLECTION),
    where('date', '==', date)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
};

// Create a new booking
export const createBooking = async (bookingData: Omit<Booking, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), bookingData);
  return docRef.id;
};

// Update booking status
export const updateBookingStatus = async (id: string, status: BookingStatus): Promise<void> => {
  const docRef = doc(db, BOOKINGS_COLLECTION, id);
  await updateDoc(docRef, { status });
};

// Listen to all bookings in real-time (used in AdminDashboard)
export const subscribeToBookings = (callback: (bookings: Booking[]) => void) => {
  const q = query(collection(db, BOOKINGS_COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const bookings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Booking));
    callback(bookings);
  });
};
