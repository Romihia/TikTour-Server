import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
//   measurementId: process.env.FIREBASE_MEASUREMENT_ID
// };

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
