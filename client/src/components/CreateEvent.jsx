import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Topbar from "./topbar/Topbar";
import Sidebar from "./sidebar/Sidebar";
import Rightbar from "./rightbar/Rightbar";
import "./CreateEvent.css";

const CreateEvent = () => {
  const { user } = useContext(AuthContext); // Get user from context
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]); // State to store users
  const [selectedParticipant, setSelectedParticipant] = useState(""); // State to store selected participant

  // Fetch events and users
  useEffect(() => {
    const fetchEventsAndUsers = async () => {
      if (!user?._id) {
        console.error("User or user._id is not defined");
        return;
      }

      try {
        // Fetch events
        const eventRes = await axios.get(`/events/organizer/${user._id}`);
        setEvents(eventRes.data);

        // Fetch users
        const userRes = await axios.get('/users/all');
        setParticipants(userRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchEventsAndUsers();
  }, [user?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/events/create", {
        title,
        description,
        date,
        time,
        location,
        organizerId: user._id,
      });
      setEvents([...events, res.data]); // Add new event to events list
      // Clear input fields
      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setLocation("");
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  const handleAddParticipant = async (eventId) => {
    try {
      const res = await axios.post("/events/addParticipant", {
        eventId,
        participantId: selectedParticipant,
      });
      const eventRes = await axios.get(`/events/organizer/${user._id}`);
      setEvents(eventRes.data);
      //setEvents(events.map(event => event._id === eventId ? res.data : event));
      setSelectedParticipant(""); // Clear selection
      //window.location.reload(); // Reload the page
    } catch (err) {
      console.error("Error adding participant:", err);
    }
  };

  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <div className="createEvent">
          <form className="createEventForm" onSubmit={handleSubmit}>
            <label>Título</label>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <label>Descripción</label>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <label>Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <label>Hora</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
            <label>Lugar</label>
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <button type="submit">Crear Evento</button>
          </form>
          <br />
          <div className="eventsList">
            <h2>Eventos</h2>
            {events.map((event, index) => (
              <div key={index} className="eventItem">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p>{event.date}</p>
                <p>{event.time}</p>
                <p>{event.location}</p>
                <p>
                  Invitados: {event.participants.map(participant => participant.username).join(", ")}
                </p>
                <select
                  value={selectedParticipant}
                  onChange={(e) => setSelectedParticipant(e.target.value)}
                >
                  <option value="">Seleccionar Invitados</option>
                  {participants.map((participant) => (
                    <option key={participant._id} value={participant._id}>
                      {participant.username}
                    </option>
                  ))}
                </select>
                <button onClick={() => handleAddParticipant(event._id)}>
                  Agregar Invitado
                </button>
              </div>
            ))}
          </div>
        </div>
        <Rightbar />
      </div>
    </>
  );
};

export default CreateEvent;