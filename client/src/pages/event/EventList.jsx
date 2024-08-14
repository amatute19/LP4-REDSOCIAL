import React from 'react';
import OrganizerEvents from '../../components/OrganizerEvents';
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
const EventList = () => {
  // Assuming userId is provided through context or passed as a prop
  const { user } = useContext(AuthContext); // Obtiene el usuario del contexto de autenticación

  return (
    <div>
      <h2>Your Events</h2>
      <OrganizerEvents userId={user._id} />
    </div>
  );
};

export default EventList;
