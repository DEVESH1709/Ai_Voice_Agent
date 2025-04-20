// Import the functions you need from the SDKs you need
import {initializeApp,getApp,getApps,} from "firebase/app";

import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAFMiEPpHRP_XTfZYVDZxo-P9S1ueFFq_w",
  authDomain: "prepview-6ab92.firebaseapp.com",
  projectId: "prepview-6ab92",
  storageBucket: "prepview-6ab92.firebasestorage.app",
  messagingSenderId: "759591512056",
  appId: "1:759591512056:web:e4024ed64259571141d80d",
  measurementId: "G-QDJJ5T3LNH"
};


// Initialize Firebase
const app = !getApps.length? initializeApp(firebaseConfig): getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);