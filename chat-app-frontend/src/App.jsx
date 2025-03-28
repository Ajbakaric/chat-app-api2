import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ChatRooms from './pages/ChatRooms';
import ChatRoom from './pages/ChatRoom';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);
  

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="text-xl font-bold">💬 ChatApp</div>
        <div className="space-x-4 text-sm">
          {!user ? (
            <>
              <a href="/login" className="hover:underline">Login</a>
              <a href="/signup" className="hover:underline">Sign Up</a>
            </>
          ) : (
            <>
              <span className="text-gray-400">Logged in as {user.email}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  delete axios.defaults.headers.common['Authorization'];
                  setUser(null);
                }}
                className="text-red-400 hover:underline"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <Routes>
      <Route path="/" element={user ? <ChatRooms user={user} /> : <Login setUser={setUser} />} />

        <Route path="/chat/:id" element={<ChatRoom user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
