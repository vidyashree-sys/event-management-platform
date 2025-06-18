// client/src/services/api.js
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "../firebase";

// 🔽 Get all events
export async function getEvents() {
  try {
    const snapshot = await getDocs(collection(firestore, "events"));
    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

// 🔽 Delete an event by ID
export async function deleteEvent(id) {
  try {
    await deleteDoc(doc(firestore, "events", id));
    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
    return false;
  }
}

// 🔽 Update an event by ID
export async function updateEvent(id, updatedData) {
  try {
    await updateDoc(doc(firestore, "events", id), updatedData);
    return true;
  } catch (error) {
    console.error("Error updating event:", error);
    return false;
  }
}
