

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs,getDoc, addDoc, deleteDoc,updateDoc, doc, query, orderBy } from "firebase/firestore";


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDAENcCQEZecJW6r_kjQ3KbrpC6XMGwCVU",
  authDomain: "campuseventscheduler.firebaseapp.com",
  projectId: "campuseventscheduler",
  storageBucket: "campuseventscheduler.firebasestorage.app",
  messagingSenderId: "468780777613",
  appId: "1:468780777613:web:85561c2f69929505fc62c4",
  measurementId: "G-DLPF8D71LB"
};


const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Endpoint to get events
app.get('/api/events', async (req, res) => {
  try {
    const eventsQuery = query(collection(db, "events"), orderBy("date"));
    const snapshot = await getDocs(eventsQuery);

    const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Endpoint to add a new event
//import { addDoc, collection } from "firebase/firestore";

app.post("/api/events", async (req, res) => {
  try {
    const { title, description, date, time, venue, club, imageUrl, registrationLink } = req.body;
    const docRef = await addDoc(collection(db, "events"), {
      title,
      description,
      date,
      time,
      venue,
      club,
      imageUrl,
      registrationLink,
      createdAt: new Date().toISOString()
    });
    res.status(201).json({ id: docRef.id, ...req.body });
  } catch (err) {
    console.error("❌ Error adding event:", err);
    res.status(500).send("Failed to add event");
  }
});
//import { doc, deleteDoc } from "firebase/firestore";

app.delete("/api/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const eventRef = doc(db, "events", id);
    await deleteDoc(eventRef);
    res.status(200).json({ id });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Failed to delete" });
  }
});

app.put("/api/events/:id", async (req, res) => {
  const { id } = req.params;
  const updatedEvent = req.body;

  try {
    const eventRef = doc(db, "events", id);

    // Check if document exists before updating
    const docSnap = await getDoc(eventRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Event not found" });
    }

    await updateDoc(eventRef, updatedEvent);
    res.status(200).send(updatedEvent);
  } catch (error) {
    console.error("❌ Failed to update event:", error);
    res.status(500).send("Failed to update event");
  }
});



const PORT = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

/*
Usage Explanation:
- Sets up Express server with CORS and JSON parsing.
- Connects to Firebase using `firebase/app` and `firebase/firestore`.
- `GET /api/events`: Fetches all documents in the "events" collection from Firestore.
- Returns events as JSON to frontend.
*/
// Serve React frontend
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from React app
app.use(express.static(path.join(__dirname, "../client/build")));

// Serve index.html for any unknown routes (for React Router)
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
