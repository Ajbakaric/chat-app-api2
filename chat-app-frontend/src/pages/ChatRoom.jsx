import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ChatRoom = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:3000/api/v1/chat_rooms/${id}/messages`)
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const sendMessage = () => {
    axios.post(`http://localhost:3000/api/v1/chat_rooms/${id}/messages`, { content })
      .then(res => {
        setMessages([...messages, res.data]);
        setContent('');
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl">Messages</h2>
      <div className="my-4">
        {messages.map(msg => (
          <div key={msg.id} className="bg-gray-800 p-2 my-2 rounded">
            {msg.content}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <input
          className="p-2 rounded bg-white text-gray-900 placeholder-gray-500"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Your message"
        />
        <button className="bg-blue-500 p-2 rounded ml-2" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
