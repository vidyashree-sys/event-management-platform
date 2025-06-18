// rsvpService.js
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { firestore } from "../firebase";

// Add RSVP
export const rsvpEvent = async (eventId, userId) => {
  const ref = doc(firestore, "rsvps", `${eventId}_${userId}`);
  await setDoc(ref, { eventId, userId, timestamp: Date.now() });
};

// Cancel RSVP
export const cancelRSVP = async (eventId, userId) => {
  const ref = doc(firestore, "rsvps", `${eventId}_${userId}`);
  await deleteDoc(ref);
};

// Check if user RSVPed
export const isRSVPed = async (eventId, userId) => {
  const ref = doc(firestore, "rsvps", `${eventId}_${userId}`);
  const snap = await getDoc(ref);
  return snap.exists();
};

// Get RSVP count
export const getRsvpCount = async (eventId) => {
  const snapshot = await getDocs(collection(firestore, "rsvps"));
  return snapshot.docs.filter((doc) => doc.data().eventId === eventId).length;
};

// Get list of RSVPed users
export const getRsvpedUsers = async (eventId) => {
  const rsvpCollection = collection(firestore, "rsvps");
  const snapshot = await getDocs(rsvpCollection);

  const filtered = snapshot.docs.filter((doc) => doc.data().eventId === eventId);
  const users = [];

  for (const docSnap of filtered) {
    const userId = docSnap.data().userId;
    const userRef = doc(firestore, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      users.push({ uid: userId, ...userSnap.data() });
    }
  }

  return users;
};
