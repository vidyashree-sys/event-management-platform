// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { setDoc, getDoc,doc } from "firebase/firestore";
import { firestore } from "../firebase";
import app from "../firebase/firebaseConfig";

const auth = getAuth(app);
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [claims, setClaims] = useState({});
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (user) => {
    setUser(user);
    if (user) {
      try {
        await saveUser(user); // 👈 ✅ Save to Firestore
        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);
        setClaims(docSnap.exists() ? docSnap.data() : {});
      } catch (err) {
        console.error("Failed to fetch user claims", err);
        setClaims({});
      }
    } else {
      setClaims(null);
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, []);


  const login = (email, pw) => signInWithEmailAndPassword(auth, email, pw);
  const register = (email, pw) =>
    createUserWithEmailAndPassword(auth, email, pw);
  const logout = () => signOut(auth);
const saveUser = async (user) => {
  const userRef = doc(firestore, "users", user.uid);
  await setDoc(userRef, {
    name: user.displayName || "Anonymous",
    email: user.email,
  }, { merge: true });
};
  return (
    <AuthContext.Provider value={{ user, claims, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
