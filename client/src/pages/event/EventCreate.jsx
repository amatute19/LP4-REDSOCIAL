import React from 'react';
import CreateEvent from '../../components/CreateEvent';
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
const EventCreate = () => {
  // Assuming userId is provided through context or passed as a prop
  const { user } = useContext(AuthContext); // Obtiene el usuario del contexto de autenticación

  return (
    <div>
      <CreateEvent userId={user._id} />
    </div>
  );
};

export default EventCreate;
