// client/src/pages/MainApp.js
import React, { useEffect, useState } from "react";
import { getEvents } from "../services/api";
import EventCard from "../components/EventCard";
import Header from "../components/Header";
import { AddEventForm } from "../components/AddEventForm";
import { useAuth } from "../context/AuthContext";

export default function MainApp({role}) {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [filterClub, setFilterClub] = useState("");
  const [showUpcoming, setShowUpcoming] = useState(true);

  const { user, claims, logout } = useAuth();

  useEffect(() => {
    async function fetchEvents() {
      const data = await getEvents();
      const sorted = data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(sorted);
    }
    fetchEvents();
  }, []);

  const handleDelete = (id) => setEvents(prev => prev.filter(event => event.id !== id));

const now = new Date();
const filteredEvents = events
  .filter(e =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.description.toLowerCase().includes(searchTerm.toLowerCase()))
  .filter(e => filterClub ? e.club === filterClub : true)
  .filter(e => {
    const eventDate = new Date(e.date);
    return showUpcoming ? eventDate >= now : true;
  })
  .sort((a, b) => sortOrder === "newest"
    ? new Date(b.date) - new Date(a.date)
    : new Date(a.date) - new Date(b.date));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-4 text-right space-x-4">
        {!user ? (
          <>
            <a href="/login" className="text-blue-600 underline">Login</a>
            <a href="/register" className="text-green-600 underline">Register</a>
          </>
        ) : (
          <>
            <span className="text-gray-700">{user.displayName || user.email}</span>
            <button
              onClick={async () => { await logout(); window.location.href = "/login"; }}
              className="text-red-600 underline"
            >
              Logout
            </button>
          </>
        )}
      </div>

      <div className="p-4">
        {user && (role === "admin" ||role === "clubMember") && (
          <AddEventForm
            editingEvent={editingEvent}
            onAdd={(newEvent) => {
              setEvents(prev => editingEvent
                ? prev.map(ev => ev.id === newEvent.id ? newEvent : ev)
                : [...prev, newEvent]
              );
              setEditingEvent(null);
            }}
            onCancelEdit={() => setEditingEvent(null)}
          />
        )}

        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <input
            type="text"
            placeholder="Search..."
            className="border p-2 rounded w-full md:w-1/3"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select
            className="border p-2 rounded w-full md:w-1/4"
            value={filterClub}
            onChange={e => setFilterClub(e.target.value)}
          >
            <option value="">All Clubs</option>
            <option value="Drama Club">Drama Club</option>
            <option value="Tech Club">Tech Club</option>
            <option value="Sports Club">Sports Club</option>
          </select>
          {/* <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showUpcoming}
              onChange={() => setShowUpcoming(prev => !prev)}
            />
            Upcoming Only
          </label> */}
          <select
            className="border p-2 rounded w-full md:w-1/4"
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      <main className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.length
          ? filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onDelete={(role === "admin") ? handleDelete : null}
                onEdit={
                  (role === "admin" || (role === "clubMember" && event.createdBy === user.uid))
                  ? e => setEditingEvent(e)
                  : null
                }
              />
            ))
          : <p className="col-span-full text-center text-gray-500">No matching events</p>}
      </main>
    </div>
  );
}
