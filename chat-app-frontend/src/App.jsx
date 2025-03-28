import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ChatRooms from './pages/ChatRooms';
import ChatRoom from './pages/ChatRoom';

function App() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Routes>
        <Route path="/" element={<ChatRooms />} />
        <Route path="/chat/:id" element={<ChatRoom />} />
      </Routes>
    </div>
  );
}

export default App;
