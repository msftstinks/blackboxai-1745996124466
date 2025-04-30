const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { verifyToken } = require('../middleware/authMiddleware');

// Middleware to verify user token
router.use(verifyToken);

// Get messages for a room
router.get('/:room', async (req, res) => {
  const { room } = req.params;
  try {
    const messages = await Message.find({ room }).populate('sender', 'name');
    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Post a message to a room
router.post('/:room', async (req, res) => {
  const { room } = req.params;
  const { message } = req.body;
  try {
    const newMessage = new Message({
      room,
      sender: req.user.userId,
      message,
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
