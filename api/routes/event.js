const router = require("express").Router();
const Event = require("../models/Event");
const User = require("../models/User");

// Create an event
router.post("/create", async (req, res) => {
  const { title, description, date, time, location, organizerId } = req.body;
  try {
    const organizer = await User.findById(organizerId);
    if (!organizer) {
      return res.status(404).json("Organizer not found");
    }

    const newEvent = new Event({
      title,
      description,
      date,
      time,
      location,
      organizer: organizer._id,
    });

    const savedEvent = await newEvent.save();
    res.status(200).json(savedEvent);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Invite a user to an event
router.post("/invite", async (req, res) => {
  const { eventId, userId } = req.body;
  try {
    const event = await Event.findById(eventId);
    const user = await User.findById(userId);

    if (!event || !user) {
      return res.status(404).json("Event or user not found");
    }

    if (!event.participants.includes(userId)) {
      event.participants.push(userId);
      await event.save();

      // Notify user (you can implement a notification system here)
      // For now, we'll just send a simple response
      res.status(200).json("User invited and notified");
    } else {
      res.status(400).json("User already invited");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get events by organizer
router.get("/organizer/:organizerId", async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.params.organizerId }).populate('participants', 'username') // Populate participants with username
    .exec();
    console.log(events);
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

// Add participant to event
router.post("/addParticipant", async (req, res) => {
  const { eventId, participantId } = req.body;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    event.participants.push(participantId);
    await event.save();
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
