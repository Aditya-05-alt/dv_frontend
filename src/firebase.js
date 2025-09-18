// Import necessary Firebase services (modular approach)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Modular import for Firebase Authentication
import { getFirestore } from "firebase/firestore"; // Modular import for Firestore

// Firebase configuration from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyA5DobPdmCPmymdoaK2Rh0L-S184u5-DvE",
  authDomain: "dv-360-7289e.firebaseapp.com",
  projectId: "dv-360-7289e",
  storageBucket: "dv-360-7289e.firebasestorage.app",
  messagingSenderId: "331083577803",
  appId: "1:331083577803:web:f6b1492c7ece0039419e4e",
  measurementId: "G-8P119ZFMHN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication and Firestore services
export const auth = getAuth(app);  // Initialize Firebase Authentication
export const db = getFirestore(app);  // Initialize Firestore

// Optionally export app if needed in other parts of the app
export default app;
