import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

function Chat() {
  const [room, setRoom] = useState('');
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem('token');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('chatMessage', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('chatMessage');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const joinRoom = async () => {
    if (!room) return;
    socket.emit('joinRoom', room);
    setJoinedRoom(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/chat/${room}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to load messages');
    }
  };

  const sendMessage = () => {
    if (!message) return;
    const data = {
      room,
      message,
      sender: localStorage.getItem('name'),
      createdAt: new Date(),
    };
    socket.emit('chatMessage', data);
    setMessages((prev) => [...prev, data]);
    setMessage('');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col h-screen">
      {!joinedRoom ? (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter room name (e.g. faculty-room)"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 mr-2"
          />
          <button
            onClick={joinRoom}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Join Room
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto border border-gray-300 rounded p-4 mb-4">
            {messages.map((msg, idx) => (
              <div key={idx} className="mb-2">
                <strong>{msg.sender || 'Unknown'}:</strong> {msg.message}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex">
            <input
              type="text"
              placeholder="Type your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-grow border border-gray-300 rounded px-3 py-2 mr-2"
            />
            <button
              onClick={sendMessage}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Chat;
