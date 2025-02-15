import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🔥 Your Firebase Configuration (Replace with actual credentials from Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyD6VzYpMLdieFGLstg8kIe_i4lFfEFC-l4",
    authDomain: "bomwipstore.firebaseapp.com",
    projectId: "bomwipstore",
    storageBucket: "bomwipstore.firebasestorage.app",
    messagingSenderId: "885647055115",
    appId: "1:885647055115:web:14844c9cf06b85683caa0e",
    measurementId: "G-VW3DSZ6SPM"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
const db = getFirestore(app);

export { db };
