// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseProdConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "rhoc-supper-bidding-4dc84.firebaseapp.com",
  projectId: "rhoc-supper-bidding-4dc84",
  storageBucket: "rhoc-supper-bidding-4dc84.appspot.com",
  messagingSenderId: "636054306235",
  appId: "1:636054306235:web:108d4e2a16cc331eb7989e",
  measurementId: "G-0MLNFBZGSV",
};

const firebaseDevConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "rhoc-supper-bidding-dev.firebaseapp.com",
  projectId: "rhoc-supper-bidding-dev",
  storageBucket: "rhoc-supper-bidding-dev.appspot.com",
  messagingSenderId: "975413439196",
  appId: "1:975413439196:web:827a23c483edc5708aa219",
  measurementId: "G-4V81QEBG76",
};

const firebaseConfig = import.meta.env.DEV
  ? firebaseDevConfig
  : firebaseProdConfig;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
