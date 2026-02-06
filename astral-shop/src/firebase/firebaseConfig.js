// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAkpzeW6kHWCc7Pi5LLAj1JLVUxVK3HbMQ",
  authDomain: "astral-shop-46542.firebaseapp.com",
  projectId: "astral-shop-46542",
  storageBucket: "astral-shop-46542.firebasestorage.app",
  messagingSenderId: "164343664457",
  appId: "1:164343664457:web:6501c0e54c3d4517875498",
  measurementId: "G-ETYWQ0PXEF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;