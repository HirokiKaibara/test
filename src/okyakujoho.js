// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmv6XtUjk8_bCLLVcLapyir3yhfq-Pwzo",
  authDomain: "fir-training-hiro0024.firebaseapp.com",
  databaseURL: "https://firebase-training-hiro0024-default-rtdb.firebaseio.com",
  projectId: "firebase-training-hiro0024",
  storageBucket: "firebase-training-hiro0024.firebasestorage.app",
  messagingSenderId: "113470322537",
  appId: "1:113470322537:web:fd8eff3aacc646bdb12ff8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);