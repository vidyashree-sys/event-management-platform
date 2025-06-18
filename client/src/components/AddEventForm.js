import { storage, firestore } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export const AddEventForm = ({ onAdd, editingEvent, onCancelEdit }) => {
  const { user, claims } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    club: "",
    imageUrl: "",
    registrationLink: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (editingEvent) {
      setForm({
        title: editingEvent.title || "",
        description: editingEvent.description || "",
        date: editingEvent.date || "",
        time: editingEvent.time || "",
        venue: editingEvent.venue || "",
        club: editingEvent.club || "",
        imageUrl: editingEvent.imageUrl || "",
        registrationLink: editingEvent.registrationLink || "",
      });
    } else {
      resetForm();
    }

    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 100);
  }, [editingEvent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "description" ? value : value.trimStart() });
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      date: "",
      time: "",
      venue: "",
      club: "",
      imageUrl: "",
      registrationLink: "",
    });
    setImageFile(null);
    setMessage("");
    setUploading(false);
    setLoading(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, imageUrl: previewUrl }));
  };

  const uploadImageAndGetURL = async (file) => {
  const fileRef = ref(storage, `events/${user.uid}/${Date.now()}_${file.name}`);
  setUploading(true);
  try {
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    console.error("❌ Image upload failed:", error);
    throw new Error("Failed to upload image.");
  } finally {
    setUploading(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !(claims?.role === "admin" || claims?.role === "clubMember")) {
      alert("Unauthorized: Only admins or club members can add/edit events.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      let imageUrl = form.imageUrl;

      if (imageFile) {
        imageUrl = await uploadImageAndGetURL(imageFile);
      }

      const eventData = {
        title: form.title,
        description: form.description,
        date: form.date,
        time: form.time,
        venue: form.venue,
        imageUrl,
        club: form.club,
        registrationLink: form.registrationLink,
        createdBy: user.uid,
      };

      if (editingEvent) {
        const docRef = doc(firestore, "events", editingEvent.id);
        await updateDoc(docRef, eventData);
        onAdd({ ...eventData, id: editingEvent.id });
      } else {
        const docRef = await addDoc(collection(firestore, "events"), eventData);
        onAdd({ ...eventData, id: docRef.id });
      }

      resetForm();
    } catch (error) {
      console.error("❌ Event submission failed:", error);
      setMessage("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow p-6 rounded-lg space-y-4 border max-w-2xl mx-auto mt-6"
    >
      <h2 className="text-2xl font-semibold text-indigo-700 mb-2">
        {editingEvent ? "Edit Event" : "Add New Event"}
      </h2>

      <input
        ref={titleInputRef}
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Event Title"
        required
        className="w-full p-2 border rounded"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        rows={3}
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        name="venue"
        value={form.venue}
        onChange={handleChange}
        placeholder="Venue"
        required
        className="w-full p-2 border rounded"
      />

      <select
        name="club"
        value={form.club}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      >
        <option value="">All Clubs</option>
        <option value="Drama Club">Drama Club</option>
        <option value="Tech Club">Tech Club</option>
        <option value="Sports Club">Sports Club</option>
      </select>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Upload Event Image (optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full p-2 border rounded"
        />
        {uploading && <p className="text-sm text-gray-500">Uploading image...</p>}
        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="Preview"
            className="w-full h-40 object-cover rounded-md"
          />
        )}
      </div>

      <input
        type="text"
        name="registrationLink"
        value={form.registrationLink}
        onChange={handleChange}
        placeholder="Registration Link (optional)"
        className="w-full p-2 border rounded"
      />

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <input
        type="time"
        name="time"
        value={form.time}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <button
        type="submit"
        disabled={loading || uploading}
        className={`w-full p-2 rounded text-white ${
          loading || uploading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {loading || uploading
          ? editingEvent
            ? "Updating..."
            : "Adding..."
          : editingEvent
          ? "Update Event"
          : "Add Event"}
      </button>

      {editingEvent && (
        <button
          type="button"
          className="w-full p-2 rounded border"
          onClick={onCancelEdit}
        >
          Cancel Edit
        </button>
      )}

      {message && (
        <div className="text-center text-sm font-medium text-green-600">
          {message}
        </div>
      )}
    </form>
  );
};
