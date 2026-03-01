import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import * as profileService from '@/services/profile.service';

const ProfilePage: React.FC = () => {
  const { profile, reloadProfile } = useAuth();
  const [childName, setChildName] = useState('');
  const [avatarId, setAvatarId] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      setChildName(profile.childName);
      setAvatarId(profile.avatarId);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await profileService.updateProfile({ childName, avatarId });
      await reloadProfile();
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
      console.error(err);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="card" style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>Edit Profile</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="childName">Child's Name</label>
          <input
            id="childName"
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="avatarId">Avatar ID</label>
          <input
            id="avatarId"
            type="number"
            value={avatarId}
            onChange={(e) => setAvatarId(parseInt(e.target.value, 10))}
            min="1"
            required
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default ProfilePage;
