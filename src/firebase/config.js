// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJtN4HuIaQ0Rx2gzHq_tKKtrm-o1vy2fA",
  authDomain: "sygok-santana.firebaseapp.com",
  projectId: "sygok-santana",
  storageBucket: "sygok-santana.firebasestorage.app",
  messagingSenderId: "83925011424",
  appId: "1:83925011424:web:dd4b96ff2948bd1d89b985"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { app, db };