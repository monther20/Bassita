import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
function createFirebaseApp() {
  try {
    return getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  } catch (error) {
    console.error('Firebase initialization error', error);
    throw error;
  }
}

const firebaseApp = createFirebaseApp();

// Auth exports
export const auth = getAuth(firebaseApp);

// Firestore exports
export const db = getFirestore(firebaseApp);

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  let isAuthEmulatorConnected = false;
  let isFirestoreEmulatorConnected = false;

  // Connect to Firebase Auth emulator
  if (typeof window !== 'undefined' && !isAuthEmulatorConnected) {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      isAuthEmulatorConnected = true;
    } catch (error) {
      console.log('Auth emulator connection failed (this is normal if already connected):', error);
    }
  }

  // Connect to Firestore emulator
  if (typeof window !== 'undefined' && !isFirestoreEmulatorConnected) {
    try {
      connectFirestoreEmulator(db, 'localhost', 8080);
      isFirestoreEmulatorConnected = true;
    } catch (error) {
      console.log('Firestore emulator connection failed (this is normal if already connected):', error);
    }
  }
}

export default firebaseApp;