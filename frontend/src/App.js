import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Chat from './pages/Chat';
import Payment from './pages/Payment';

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        {role === 'admin' ? (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </>
        ) : (
          <>
            <Route path="/user" element={<UserDashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="*" element={<Navigate to="/user" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
