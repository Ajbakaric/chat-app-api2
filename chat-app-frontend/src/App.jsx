import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ChatRooms from './pages/ChatRooms';
import ChatRoom from './pages/ChatRoom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
      axios.get('http://localhost:3000/profile')
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((err) => {
          console.error('Auth token invalid or expired.');
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
        });
    }
  }, []);
  
  

  return (
    <div className="bg-[#041b1b] text-white min-h-screen">
      <nav className="bg-[#093923] p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div className="text-xl font-bold text-[#6cb54b]">💬 BanterBox</div>
        <div className="space-x-4 text-sm">
          {!user ? (
            <>
              <a href="/login" className="text-[#4fa55d] hover:underline">Login</a>
              <a href="/signup" className="text-[#4fa55d] hover:underline">Sign Up</a>
            </>
          ) : (
            <>
              <a href="/chatrooms" className="text-[#4fa55d] hover:underline">Rooms</a>
              <a href="/profile" className="text-[#4fa55d] hover:underline">Profile</a>
              <span className="text-[#6cb54b]">({user.email})</span>
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

      <main className="flex justify-center items-center min-h-[calc(100vh-64px)] p-4">
        <div className="w-full max-w-4xl">
          <Routes>
            <Route path="/" element={user ? <ChatRooms user={user} /> : <Login setUser={setUser} />} />
            <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
            <Route path="/chat/:id" element={<ChatRoom user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup setUser={setUser} />} />
            <Route path="/chatrooms" element={<ChatRooms user={user} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
