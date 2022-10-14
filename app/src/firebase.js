import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB6TpJJYXU6MDvnN4l9NBPYPTYDP_51CyI",
  authDomain: "cleanflat-aa40f.firebaseapp.com",
  databaseURL: "https://cleanflat-aa40f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cleanflat-aa40f",
  storageBucket: "cleanflat-aa40f.appspot.com",
  messagingSenderId: "731216094774",
  appId: "1:731216094774:web:734738e43ba8f8c01c9a97",
  measurementId: "G-3HL6LQC9YY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
