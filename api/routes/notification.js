// routes/notifications.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get notifications for a user
router.get('/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark notification as read
router.post('/markAsRead/:notificationId', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.notificationId, { isRead: true }, { new: true });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new notification (to be called when certain events happen)
router.post('/create', async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/notifications', async (req, res) => {
    try {
      const { userId, type, message, link } = req.body;
      const newNotification = new Notification({ userId, type, message, link });
      await newNotification.save();
      res.status(201).json(newNotification);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
module.exports = router;
