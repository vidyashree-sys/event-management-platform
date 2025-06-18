// RsvpListModal.js
import React, { useEffect, useState } from "react";
import { getRsvpedUsers } from "../services/rsvpService";

const RsvpListModal = ({ eventId, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getRsvpedUsers(eventId);
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch RSVP list:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [eventId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">👥 RSVP Attendees</h2>

        {loading ? (
          <p>Loading...</p>
        ) : users.length === 0 ? (
          <p>No RSVPs yet.</p>
        ) : (
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {users.map((u) => (
              <li key={u.uid} className="border p-2 rounded">
                <strong>{u.name || "Unknown"}</strong><br />
                <small>{u.email}</small>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RsvpListModal;
