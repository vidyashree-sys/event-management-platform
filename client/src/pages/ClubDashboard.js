import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getEvents, deleteEvent } from "../services/api";
import EventCard from "../components/EventCard";
import { AddEventForm } from "../components/AddEventForm";
import Header from "../components/Header";

export default function ClubDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    getEvents().then(data =>
      setEvents(data.filter(e => e.createdBy === user.uid))
    );
  }, [user]);

  const handleAddOrUpdate = e =>
    setEvents(prev =>
      prev.some(ev => ev.id === e.id) ? prev.map(ev => (ev.id === e.id ? e : ev)) : [...prev, e]
    );

  const handleDelete = async id => {
    await deleteEvent(id);
    setEvents(prev => prev.filter(ev => ev.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header role="Club Member" />
      <div className="p-4">
        <AddEventForm editingEvent={editingEvent} onAdd={handleAddOrUpdate} />
      </div>
      <main className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map(e => (
          <EventCard
            key={e.id}
            event={e}
            onEdit={() => setEditingEvent(e)}
            onDelete={handleDelete}
          />
        ))}
      </main>
    </div>
  );
}
