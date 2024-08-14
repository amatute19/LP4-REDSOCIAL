// components/Notifications.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Notifications.css';
const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`/notifications/${user._id}`);
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, [user._id]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(`/notifications/markAsRead/${notificationId}`);
      setNotifications(notifications.map(notification =>
        notification._id === notificationId ? { ...notification, isRead: true } : notification
      ));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="notifications">
      <h2>Notificaciones</h2>
      {notifications.map(notification => (
        <div
          key={notification._id}
          className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
          onClick={() => markAsRead(notification._id)}
        >
          <a>{notification.message}</a>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
