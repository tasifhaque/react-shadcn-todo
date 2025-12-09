import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";



const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
  databaseURL: import.meta.env.VITE_DATABASEURL,
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseDB = getDatabase(firebaseApp, import.meta.env.VITE_DATABASEURL);
export const firebaseAuth = getAuth(firebaseApp);

