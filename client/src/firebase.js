// client/src/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDAENcCQEZecJW6r_kjQ3KbrpC6XMGwCVU",
  authDomain: "campuseventscheduler.firebaseapp.com",
  projectId: "campuseventscheduler",
  storageBucket: "campuseventscheduler.appspot.com",
  messagingSenderId: "468780777613",
  appId: "1:468780777613:web:85561c2f69929505fc62c4",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
