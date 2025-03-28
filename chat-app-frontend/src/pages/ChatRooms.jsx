import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ChatRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/api/v1/chat_rooms')
      .then(res => setRooms(res.data))
      .catch(err => console.error(err));
  }, []);

  const createRoom = () => {
    if (!name.trim()) {
      alert("Please enter a valid room name!");
      return;
    }
  
    axios.post('http://localhost:3000/api/v1/chat_rooms', { chat_room: { name } })
      .then(res => {
        setRooms([...rooms, res.data]);
        setName('');
      })
      .catch(err => console.error(err));
  };
  

  return (
    <div className="p-4 text-white">
      <h1 className="text-3xl mb-4">Chat Rooms</h1>
      <input
        className="p-2 rounded bg-white text-gray-900 placeholder-gray-500"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Room name"
      />
      <button className="oklch(0.809 0.105 251.813)" onClick={createRoom}>
        Create
      </button>

      <ul className="mt-4">
        {rooms.map((room) => (
          <li key={room.id}>
            <Link
              className="text-blue-300 hover:underline"
              to={`/chat/${room.id}`}
            >
              {room.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRooms;
