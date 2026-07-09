import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc, 
  onSnapshot, 
  query,
  getDocs,
  setDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Turf } from '../types';

const TURFS_COLLECTION = 'turfs';

// Listen to all turfs in real-time
export const subscribeToTurfs = (callback: (turfs: Turf[]) => void) => {
  const q = query(collection(db, TURFS_COLLECTION));
  return onSnapshot(q, (snapshot) => {
    const turfs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Turf));
    callback(turfs);
  });
};

// Create a new turf
export const createTurf = async (turfData: Omit<Turf, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, TURFS_COLLECTION), turfData);
  return docRef.id;
};

// Update existing turf
export const updateTurf = async (id: string, turfData: Partial<Turf>): Promise<void> => {
  const docRef = doc(db, TURFS_COLLECTION, id);
  await updateDoc(docRef, turfData);
};

// Delete a turf
export const deleteTurf = async (id: string): Promise<void> => {
  const docRef = doc(db, TURFS_COLLECTION, id);
  await deleteDoc(docRef);
};

// One-time utility to seed initial data
export const seedTurfs = async (initialTurfs: Turf[]): Promise<void> => {
  for (const turf of initialTurfs) {
    const { id, ...data } = turf;
    // We use the predefined string id from the mock data to keep references clean
    const docRef = doc(db, TURFS_COLLECTION, id);
    await setDoc(docRef, data);
  }
};
