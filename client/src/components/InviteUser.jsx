// src/components/InviteUser.js
import React, { useState } from "react";
import axios from "axios";

const InviteUser = ({ eventId }) => {
  const [userId, setUserId] = useState("");

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/events/invite", { eventId, userId });
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleInvite}>
      <input type="text" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} required />
      <button type="submit">Invite User</button>
    </form>
  );
};

export default InviteUser;
