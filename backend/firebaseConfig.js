import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBwXbBUnVMtnf_vuIVp23PSKOAdtlXGFyI",
  authDomain: "tiktour-79fa8.firebaseapp.com",
  projectId: "tiktour-79fa8",
  storageBucket: "tiktour-79fa8.appspot.com",
  messagingSenderId: "767843589126",
  appId: "1:767843589126:web:97be7133dfb8175005f787",
  measurementId: "G-TFPQQHQQG8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);