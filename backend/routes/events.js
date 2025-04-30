const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { verifyToken } = require('../middleware/authMiddleware');

// Middleware to verify user token
router.use(verifyToken);

// Get all events for user
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user.userId });
    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add an event or submission
router.post('/', async (req, res) => {
  const { title, description, date, type } = req.body;
  try {
    const event = new Event({
      title,
      description,
      date,
      type,
      createdBy: req.user.userId,
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
