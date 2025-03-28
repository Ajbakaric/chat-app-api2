import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { createConsumer } from '@rails/actioncable';

const consumer = createConsumer('ws://localhost:3000/cable');

const ChatRoom = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/v1/chat_rooms/${id}/messages`)
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));

    const subscription = consumer.subscriptions.create(
      { channel: 'ChatRoomChannel', chat_room_id: id },
      {
        received: (message) => {
          console.log('New message received:', message);
          setMessages((prevMessages) => [...prevMessages, message]);
        },
      }
    );

    return () => subscription.unsubscribe();
  }, [id]);

 const sendMessage = () => {
  const formData = new FormData();
  formData.append('message[content]', content);
  if (image) formData.append('message[image]', image);

  axios.post(`http://localhost:3000/api/v1/chat_rooms/${id}/messages`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  .then(() => {
    setContent('');
    setImage(null);
  })
  .catch(err => console.error(err));
};

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl">Messages</h2>
      <div className="my-4">
      {messages.map((msg) => (
  <div key={msg.id} className="bg-gray-800 p-2 my-2 rounded">
    {msg.content && <p>{msg.content}</p>}
    
    {msg.image_url && (
      <img
        src={msg.image_url}
        alt="uploaded"
        className="mt-2 rounded max-h-40 object-cover"
      />
    )}
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
  <input 
    type="file"
    className="ml-2 text-sm"
    onChange={(e) => setImage(e.target.files[0])}
  />
  <button className="bg-blue-500 p-2 rounded ml-2" onClick={sendMessage}>
    Send
  </button>
</div>
    </div>
  );
};

export default ChatRoom;
