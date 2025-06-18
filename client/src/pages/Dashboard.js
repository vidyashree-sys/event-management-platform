import React, { useEffect, useState } from "react";
import { getEvents } from "../services/api";
import EventCard from "../components/EventCard";
import Header from "../components/Header";

export default function Dashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents().then(data => setEvents(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.length ? (
          events.map(event => <EventCard key={event.id} event={event} />)
        ) : (
          <p className="text-center">No public events.</p>
        )}
      </main>
    </div>
  );
}
