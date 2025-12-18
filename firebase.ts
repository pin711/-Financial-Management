
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfigRaw = process.env.FIREBASE_CONFIG;
let isOfflineMode = false;
let auth: any = null;
let db: any = null;

if (firebaseConfigRaw) {
  try {
    const config = JSON.parse(firebaseConfigRaw);
    const app = getApps().length > 0 ? getApp() : initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    isOfflineMode = true;
  }
} else {
  console.warn("No FIREBASE_CONFIG found. Running in Offline/Demo mode.");
  isOfflineMode = true;
}

export { auth, db, isOfflineMode };
