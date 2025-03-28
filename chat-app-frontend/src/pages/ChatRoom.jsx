import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { createConsumer } from '@rails/actioncable';

const consumer = createConsumer('ws://localhost:3000/cable');

const ChatRoom = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const messagesEndRef = useRef();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/chat_rooms/${id}/messages`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err));

    const subscription = consumer.subscriptions.create(
      { channel: 'ChatRoomChannel', chat_room_id: id },
      {
        received: (message) => {
          setMessages((prevMessages) => [...prevMessages, message]);
        },
      }
    );

    return () => subscription.unsubscribe();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    const formData = new FormData();
    formData.append('message[content]', content);
    if (image) formData.append('message[image]', image);

    axios
      .post(`http://localhost:3000/api/v1/chat_rooms/${id}/messages`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(() => {
        setContent('');
        setImage(null);
      })
      .catch((err) => console.error(err));
  };

  const startEdit = (msg) => {
    setEditingId(msg.id);
    setEditingContent(msg.content);
  };

  const handleEdit = (messageId) => {
    axios
      .patch(
        `http://localhost:3000/api/v1/chat_rooms/${id}/messages/${messageId}`,
        { message: { content: editingContent } },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .then((res) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? res.data : m))
        );
        setEditingId(null);
        setEditingContent('');
      });
  };

  const deleteMessage = (messageId) => {
    axios
      .delete(
        `http://localhost:3000/api/v1/chat_rooms/${id}/messages/${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .then(() => {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="p-4 border-b border-gray-700">
        <h2 className="text-2xl font-bold">Messages</h2>
      </header>

      {/* Scrollable message container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[calc(100vh-160px)]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="flex items-start space-x-3 bg-gray-800 p-3 rounded relative"
          >
            {msg.sender_avatar_url && (
              <img
                src={msg.sender_avatar_url}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">{msg.sender_email}</p>
              {editingId === msg.id ? (
                <>
                  <input
                    className="p-2 rounded bg-white text-black w-full mb-2"
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                  />
                  <div className="space-x-2 text-sm">
                    <button
                      className="text-green-400 hover:underline"
                      onClick={() => handleEdit(msg.id)}
                    >
                      Save
                    </button>
                    <button
                      className="text-red-400 hover:underline"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {msg.image_url ? (
                    <img
                      src={msg.image_url}
                      alt="uploaded"
                      className="mt-2 rounded max-w-xs object-cover"
                    />
                  ) : (
                    msg.content && <p className="mb-2">{msg.content}</p>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </div>
                  <div className="absolute top-2 right-2 text-xs space-x-2">
                    <button
                      className="text-blue-300 hover:underline"
                      onClick={() => startEdit(msg)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-300 hover:underline"
                      onClick={() => deleteMessage(msg.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input bar */}
      <div className="p-4 border-t border-gray-700 flex items-center space-x-2">
        <input
          className="p-2 rounded bg-white text-gray-900 flex-grow"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Your message"
        />
        <input
          type="file"
          className="text-sm"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
