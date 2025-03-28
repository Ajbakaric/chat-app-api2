import React, { useState } from 'react';
import axios from 'axios';

const Profile = ({ user, setUser }) => {
    if (!user) {
      return <div className="text-white p-4">Loading user profile...</div>;
    }
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(null);

  const handleAvatarUpload = async () => {
    if (!avatar) return alert('Select an image first.');

    const formData = new FormData();
    formData.append('user[avatar]', avatar);
    formData.append('user[username]', username);
    formData.append('user[email]', email);

    try {
      const res = await axios.put('http://localhost:3000/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      alert('Profile updated!');
      setUser({
        ...user,
        username: res.data.user.username,
        email: res.data.user.email,
        avatar_url: res.data.user.avatar_url
      });
    } catch (err) {
      console.error(err);
      alert('Update failed.');
    }
  };

  return (
    <div className="p-4 text-white max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>

      {user.avatar_url && (
        <img
          src={user.avatar_url}
          alt="Your avatar"
          className="w-20 h-20 rounded-full mb-4 object-cover"
        />
      )}

<input
  className="p-2 bg-gray-800 text-white placeholder-gray-400 rounded w-full mb-3"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

<input
  className="p-2 bg-gray-800 text-white placeholder-gray-400 rounded w-full mb-3"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="mb-4"
        type="file"
        onChange={(e) => setAvatar(e.target.files[0])}
      />

      <button
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded w-full"
        onClick={handleAvatarUpload}
      >
        Update Profile
      </button>
    </div>
  );
};

export default Profile;
