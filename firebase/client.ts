// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);