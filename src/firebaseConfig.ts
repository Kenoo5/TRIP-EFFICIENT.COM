import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDEHqDbA-1p98PQXJ4wAq1SSvUNdWGtIbA",
  authDomain: "smart-yatra-login.firebaseapp.com",
  projectId: "smart-yatra-login",
  storageBucket: "smart-yatra-login.firebasestorage.app",
  messagingSenderId: "441879673078",
  appId: "1:441879673078:web:d6ac318731c8cc77e354d7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
