import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjeN4-zf8BuXJKgU5fV2A93rKZy25kiBg",
  authDomain: "geburstagfraumuti.firebaseapp.com",
  projectId: "geburstagfraumuti",
  storageBucket: "geburstagfraumuti.firebasestorage.app",
  messagingSenderId: "690459659950",
  appId: "1:690459659950:web:ef64c36e8061c00645273f",
  measurementId: "G-L491CZXKE8",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
