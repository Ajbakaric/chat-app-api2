import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await axios.post('http://localhost:3000/signup', {
        user: {
          email,
          password,
          username
        }
      });

      alert('Signup successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Signup failed!');
    }
  };

  return (
    <div className="p-4 text-white max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

      <input
        className="p-2 text-black rounded w-full mb-3"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="p-2 text-black rounded w-full mb-3"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="p-2 text-black rounded w-full mb-4"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
        onClick={handleSignup}
      >
        Sign Up
      </button>
    </div>
  );
};

export default Signup;
