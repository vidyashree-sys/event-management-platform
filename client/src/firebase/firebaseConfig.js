// client/src/firebase/firebaseConfig.js
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDAENcCQEZecJW6r_kjQ3KbrpC6XMGwCVU",
  authDomain: "campuseventscheduler.firebaseapp.com",
  projectId: "campuseventscheduler",
  storageBucket: "campuseventscheduler.appspot.com"
,
  messagingSenderId: "468780777613",
  appId: "1:468780777613:web:85561c2f69929505fc62c4",
  measurementId: "G-DLPF8D71LB"
};

// 🛡️ Prevent initializing more than once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default app;
