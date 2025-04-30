require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const chatRoutes = require('./routes/chat');
const eventRoutes = require('./routes/events');
const paymentRoutes = require('./routes/payments');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/payments', paymentRoutes);

// Socket.io for chat
io.on('connection', (socket) => {
  console.log('a user connected: ' + socket.id);

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log('User joined room: ' + room);
  });

  socket.on('chatMessage', (data) => {
    io.to(data.room).emit('chatMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected: ' + socket.id);
  });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});
