import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AVATAR_MAP } from '@/types';
import * as profileService from '@/services/profile.service';
import Avatar from '@/components/Avatar';

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
      setMessage('Profile updated! 🎉');
    } catch (err) {
      setError('Failed to update profile.');
      console.error(err);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="animate-slide-up" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="card" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <Avatar avatarId={avatarId} size="xlarge" />
        <h2 style={{ marginBottom: 0 }}>{profile.childName}</h2>
        <p style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '1.2rem' }}>
          ⭐ {profile.points.toLocaleString()} points
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Edit Profile</h3>
        {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="childName" style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
              Your Name
            </label>
            <input
              id="childName"
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.75rem' }}>
              Choose Your Character
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
            }}>
              {Object.entries(AVATAR_MAP).map(([id, avatar]) => {
                const numId = parseInt(id);
                const isSelected = avatarId === numId;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setAvatarId(numId)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '1rem 0.5rem',
                      borderRadius: '16px',
                      border: isSelected ? '3px solid var(--primary-color)' : '2px solid var(--border-color)',
                      background: isSelected ? 'var(--background-color)' : 'var(--surface-color)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                      color: 'var(--text-color)',
                    }}
                  >
                    <span style={{ fontSize: '2.5rem' }}>{avatar.emoji}</span>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      marginTop: '0.25rem',
                      color: isSelected ? 'var(--primary-color)' : 'var(--text-muted)',
                    }}>
                      {avatar.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button type="submit" style={{ width: '100%', padding: '0.8rem', fontSize: '1.1rem', borderRadius: '12px' }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
