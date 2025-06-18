// EventCard.js
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  rsvpEvent,
  cancelRSVP,
  isRSVPed,
  getRsvpCount,
} from "../services/rsvpService";
import RsvpListModal from "./RsvpListModal";
import { sendRSVPConfirmation } from "../services/sendEmail";
const EventCard = ({ event, onEdit, onDelete }) => {
  const { user, claims } = useAuth();
  const [isRsvped, setIsRsvped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rsvpCount, setRsvpCount] = useState(0);
  const [showRsvpList, setShowRsvpList] = useState(false);

  useEffect(() => {
    const checkRsvp = async () => {
      if (!user) return setLoading(false);
      try {
        const status = await isRSVPed(event.id, user.uid);
        setIsRsvped(status);
      } catch (error) {
        console.error("RSVP check failed:", error);
      }
      setLoading(false);
    };
    checkRsvp();
  }, [event.id, user]);

  useEffect(() => {
    const fetchRsvpCount = async () => {
      try {
        const count = await getRsvpCount(event.id);
        setRsvpCount(count);
      } catch (error) {
        console.error("RSVP count error:", error);
      }
    };
    fetchRsvpCount();
  }, [event.id, isRsvped]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      onDelete(event.id);
    }
  };

  const handleRsvp = async () => {
    if (!user) return alert("Please log in to RSVP.");
    try {
      if (isRsvped) {
        await cancelRSVP(event.id, user.uid);
        setIsRsvped(false);
      } else {
        await rsvpEvent(event.id, user.uid, user.email, user.displayName || "User");

        setIsRsvped(true);
      }
    } catch (error) {
      alert("RSVP failed. Check console.");
      console.error("RSVP error:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white shadow-lg rounded-xl overflow-hidden p-4 flex flex-col justify-between border hover:shadow-xl transition duration-300"
    >
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      )}

      <div className="flex-1 space-y-2">
        <h2 className="text-lg font-bold text-indigo-700">{event.title}</h2>
        <p className="text-xs text-gray-500 italic">{event.club}</p>
        <p className="text-gray-700 text-sm">{event.description}</p>

        <div className="text-sm text-gray-600 space-y-1 pt-2">
          <div><strong>📍 Venue:</strong> {event.venue}</div>
          <div><strong>📅 Date:</strong> {event.date}</div>
          <div><strong>🕒 Time:</strong> {event.time}</div>
          <div><strong>👥 RSVPs:</strong> {rsvpCount}</div>
        </div>

        {event.registrationLink && (
          <a
            href={event.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-indigo-600 hover:text-indigo-800 text-sm underline"
          >
            Register / Learn More →
          </a>
        )}
      </div>

      <div className="mt-4 flex justify-end gap-2 flex-wrap">
        {user && claims?.role === "admin" && onEdit && (
          <button
            onClick={() => onEdit(event)}
            className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md hover:bg-yellow-200 text-sm"
          >
            ✏️ Edit
          </button>
        )}

        {user && claims?.role === "admin" && onDelete && (
          <button
            onClick={handleDelete}
            className="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 text-sm"
          >
            🗑️ Delete
          </button>
        )}

      {user && !loading && (
  <button
    onClick={() =>
      rsvpEvent(event.id, user.uid, user.email, user.displayName || "User")
        .then(() => setIsRsvped(true))
        .catch(console.error)
    }
    className={`${
      isRsvped
        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
        : "bg-green-500 text-white hover:bg-green-600"
    } px-3 py-1 rounded-md text-sm`}
  >
    {isRsvped ? "✅ RSVP'd (Cancel)" : "📩 RSVP"}
  </button>
)}
        {(claims?.role === "admin" || claims?.role === "clubMember") && (
          <button
            onClick={() => setShowRsvpList(true)}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-200 text-sm"
          >
            👥 View Attendees
          </button>
        )}
      </div>

     {showRsvpList && (
  <RsvpListModal eventId={event.id} onClose={() => setShowRsvpList(false)} />
)}
    </motion.div>
  );
};

export default EventCard;
