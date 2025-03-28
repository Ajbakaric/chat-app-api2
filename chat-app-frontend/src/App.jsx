import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatRooms from './pages/ChatRooms';
import ChatRoom from './pages/ChatRoom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      axios.get('http://localhost:3000/profile')
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          console.error('Auth token invalid or expired.');
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">💬 ChatApp</Link>

        <div className="space-x-4 text-sm flex items-center">
          {!user ? (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/signup" className="hover:underline">Sign Up</Link>
            </>
          ) : (
            <>
              <Link to="/chatrooms" className="hover:underline">Rooms</Link>
              <Link to="/profile" className="hover:underline">Profile</Link>
              <span className="text-gray-400 hidden sm:inline">({user.email})</span>
              <button
                onClick={handleLogout}
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
        <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
        <Route path="/chat/:id" element={<ChatRoom user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chatrooms" element={<ChatRooms user={user} />} />
      </Routes>
    </div>
  );
}

export default App;
