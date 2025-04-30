import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/auth/signup', { name, email, role: 'user' });
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending OTP');
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Error verifying OTP');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={otpSent}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={otpSent}
          />
        </div>
        {otpSent && (
          <div className="mb-4">
            <label className="block mb-1 font-semibold">OTP</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
        )}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {!otpSent ? (
          <button
            onClick={sendOtp}
            disabled={!name || !email || loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        ) : (
          <button
            onClick={verifyOtp}
            disabled={!otp || loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        )}
      </div>
    </div>
  );
}

export default Signup;
