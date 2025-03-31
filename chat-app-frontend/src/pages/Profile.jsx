import React, { useState } from 'react';
import axios from 'axios';

const Profile = ({ user, setUser }) => {
  if (!user) {
    return <div className="text-[#5f8b4c] p-4">Loading user profile...</div>;
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
    <div className="min-h-screen bg-gradient-to-br from-[#ffddab] to-[#5f8b4c] flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-[#945034] mb-4 text-center">Your Profile</h2>

        {user.avatar_url && (
          <img
            src={user.avatar_url}
            alt="Your avatar"
            className="w-24 h-24 rounded-full mb-4 object-cover mx-auto border-4 border-[#ff9a9a]"
          />
        )}

        <input
          className="p-2 bg-[#fef8f5] text-[#945034] placeholder-[#caa08d] border border-[#ff9a9a] rounded w-full mb-3"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="p-2 bg-[#fef8f5] text-[#945034] placeholder-[#caa08d] border border-[#ff9a9a] rounded w-full mb-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="mb-4 text-[#945034]"
          type="file"
          onChange={(e) => setAvatar(e.target.files[0])}
        />

        <button
          className="bg-[#5f8b4c] hover:bg-[#4e753d] text-white px-4 py-2 rounded w-full transition-all font-semibold"
          onClick={handleAvatarUpload}
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
