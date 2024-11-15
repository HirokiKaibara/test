import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDmv6XtUjk8_bCLLVcLapyir3yhfq-Pwzo",
  authDomain: "fir-training-hiro0024.firebaseapp.com",
  databaseURL: "https://firebase-training-hiro0024-default-rtdb.firebaseio.com",
  projectId: "firebase-training-hiro0024",
  storageBucket: "firebase-training-hiro0024.firebasestorage.app",
  messagingSenderId: "113470322537",
  appId: "1:113470322537:web:fd8eff3aacc646bdb12ff8"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);