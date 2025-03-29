import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import ChatRooms from './pages/ChatRooms';
import ChatRoom from './pages/ChatRoom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import NavBar from './pages/NavBar';

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios
        .get('http://localhost:3000/profile')
        .then((res) => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
        });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eafce3] to-[#74e291] flex items-center justify-center px-4 py-8">
      <div className="bg-white w-full max-w-2xl shadow-2xl rounded-2xl p-6 space-y-6">
        <NavBar user={user} setUser={setUser} />

        <Routes>
          <Route
            path="/"
            element={user ? <ChatRooms user={user} /> : <Login setUser={setUser} />}
          />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/chatrooms" element={<ChatRooms user={user} />} />
          <Route path="/chat/:id" element={<ChatRoom user={user} />} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
