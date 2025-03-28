import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ChatRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/v1/chat_rooms')
      .then((res) => setRooms(res.data))
      .catch((err) => console.error(err));
  }, []);

  const createRoom = () => {
    if (!name.trim()) {
      alert('Please enter a valid room name!');
      return;
    }

    axios
      .post('http://localhost:3000/api/v1/chat_rooms', {
        chat_room: { name },
      })
      .then((res) => {
        setRooms([...rooms, res.data]);
        setName('');
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteRoom = (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;

    axios
      .delete(`http://localhost:3000/api/v1/chat_rooms/${roomId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(() => {
        setRooms((prev) => prev.filter((room) => room.id !== roomId));
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-4 text-white max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Chat Rooms</h1>

      <div className="flex items-center space-x-2 mb-6">
        <input
          className="p-2 rounded bg-white text-gray-900 flex-grow"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New room name"
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          onClick={createRoom}
        >
          Create
        </button>
      </div>

      {rooms.length === 0 ? (
        <p className="text-gray-400">No rooms yet. Be the first to create one!</p>
      ) : (
        <div className="space-y-2">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="flex justify-between items-center bg-gray-800 p-3 rounded"
            >
              <Link
                to={`/chat/${room.id}`}
                className="text-blue-400 hover:underline"
              >
                {room.name}
              </Link>
              <button
                onClick={() => handleDeleteRoom(room.id)}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatRooms;
