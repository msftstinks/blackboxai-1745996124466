import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function UserDashboard() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventsForDate, setEventsForDate] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const filtered = events.filter(
      (event) =>
        new Date(event.date).toDateString() === selectedDate.toDateString()
    );
    setEventsForDate(filtered);
  }, [selectedDate, events]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        className="mb-6"
      />
      <h2 className="text-xl font-semibold mb-2">Events on {selectedDate.toDateString()}</h2>
      {eventsForDate.length === 0 ? (
        <p>No events for this date.</p>
      ) : (
        <ul className="list-disc list-inside">
          {eventsForDate.map((event) => (
            <li key={event._id}>
              <strong>{event.title}</strong>: {event.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserDashboard;
