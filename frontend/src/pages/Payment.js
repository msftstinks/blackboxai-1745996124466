import React, { useState } from 'react';
import axios from 'axios';

function Payment() {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    const res = await loadRazorpayScript();
    if (!res) {
      setError('Failed to load Razorpay SDK');
      setLoading(false);
      return;
    }

    try {
      const orderRes = await axios.post(
        'http://localhost:5000/api/payments/create-order',
        { amount: Number(amount), receipt: 'receipt#1' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID',
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: 'LMS Payment',
        description: 'Test Transaction',
        order_id: orderRes.data.id,
        handler: function (response) {
          alert('Payment successful. Payment ID: ' + response.razorpay_payment_id);
        },
        prefill: {
          email: localStorage.getItem('email') || '',
          name: localStorage.getItem('name') || '',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      setError('Payment failed');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Make a Payment</h1>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
      />
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <button
        onClick={handlePayment}
        disabled={!amount || loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? 'Processing...' : 'Pay'}
      </button>
    </div>
  );
}

export default Payment;
