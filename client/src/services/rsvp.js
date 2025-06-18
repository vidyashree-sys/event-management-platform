import { doc, setDoc, getDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";
import emailjs from "emailjs-com";

// Save RSVP
export const rsvpEvent = async (eventId, userId, userEmail, userName) => {
  const rsvpRef = doc(firestore, "rsvps", `${eventId}_${userId}`);
  await setDoc(rsvpRef, { eventId, userId, timestamp: Date.now() });

  // Send confirmation email to user
  const templateParams = {
    to_name: userName,
    to_email: userEmail,
    message: `You've successfully RSVP’d to the event.`,
  };

  try {
    await emailjs.send(
      "YOUR_SERVICE_ID",     // Replace with your actual EmailJS Service ID
      "YOUR_TEMPLATE_ID",    // Replace with your actual EmailJS Template ID
      templateParams,
      "YOUR_PUBLIC_KEY"      // Replace with your actual EmailJS Public Key
    );
  } catch (e) {
    console.error("Email send error:", e);
  }
};

// Cancel RSVP
export const cancelRsvp = async (eventId, userId) => {
  const rsvpRef = doc(firestore, "rsvps", `${eventId}_${userId}`);
  await deleteDoc(rsvpRef);
};

// Check if user has RSVPed
export const hasRsvped = async (eventId, userId) => {
  const rsvpRef = doc(firestore, "rsvps", `${eventId}_${userId}`);
  const rsvpSnap = await getDoc(rsvpRef);
  return rsvpSnap.exists();
};

// Get RSVP count
export const getRsvpCount = async (eventId) => {
  const snapshot = await getDocs(collection(firestore, "rsvps"));
  return snapshot.docs.filter((doc) => doc.data().eventId === eventId).length;
};

// Get RSVP users (for modal)
export const getRsvpedUsers = async (eventId) => {
  const snapshot = await getDocs(collection(firestore, "rsvps"));
  const users = [];

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    if (data.eventId === eventId) {
      const userDoc = await getDoc(doc(firestore, "users", data.userId));
      if (userDoc.exists()) {
        users.push({ uid: data.userId, ...userDoc.data() });
      }
    }
  }

  return users;
};
