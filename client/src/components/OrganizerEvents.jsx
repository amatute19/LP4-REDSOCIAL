import React, { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const OrganizerEvents = () => {
  const { user } = useContext(AuthContext); // Get user from context
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`/events/organizer/${user._id}`);
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, [user._id]);

  return (
    <div>
      <h2>Your Events</h2>
      {events.map((event) => (
        <div key={event._id}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>{new Date(event.date).toLocaleDateString()}</p>
          <p>{event.time}</p>
          <p>{event.location}</p>
        </div>
      ))}
    </div>
  );
};

export default OrganizerEvents;
