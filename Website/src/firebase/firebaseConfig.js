import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB0BH1xGuzp4V6OK9qTVucK-76xMEGgXbQ",
  authDomain: "symposiumrecap.firebaseapp.com",
  projectId: "symposiumrecap",
  storageBucket: "symposiumrecap.firebasestorage.app",
  messagingSenderId: "911741567786",
  appId: "1:911741567786:web:03906d7c82dcd6f56ad453"
}

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);