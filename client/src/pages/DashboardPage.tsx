import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Avatar from '@/components/Avatar';
import PrizeShop from '@/components/PrizeShop';

const DashboardPage: React.FC = () => {
  const { profile } = useAuth();

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="animate-slide-up">
      {/* Hero section */}
      <div className="card mb-6" style={{ textAlign: 'center' }}>
        <Avatar avatarId={profile.avatarId} size="large" />
        <h1 style={{ fontSize: '1.8rem', marginTop: '1rem', marginBottom: '0.5rem' }}>
          Welcome back, {profile.childName}! 👋
        </h1>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, #fbbf24, #f97316)',
            color: 'white',
            padding: '0.5rem 1.5rem',
            borderRadius: '9999px',
            fontSize: '1.3rem',
            fontWeight: 'bold',
          }}
        >
          ⭐ {profile.points.toLocaleString()} points
        </div>
      </div>

      {/* Prize teaser */}
      <div style={{ marginBottom: '1.5rem' }}>
        <PrizeShop compact />
      </div>

      {/* Action cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <Link to="/shower" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card" style={{ textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer' }}
               onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-5px)')}
               onMouseLeave={e => (e.currentTarget.style.transform = '')}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.5rem' }}>🚿</span>
            <h3 style={{ color: 'var(--primary-color)', margin: '0 0 0.5rem' }}>Start Shower</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Earn points and keep your streak going!</p>
          </div>
        </Link>

        <Link to="/game" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card" style={{ textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer' }}
               onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-5px)')}
               onMouseLeave={e => (e.currentTarget.style.transform = '')}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.5rem' }}>🎮</span>
            <h3 style={{ color: 'var(--secondary-color)', margin: '0 0 0.5rem' }}>Play Games</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Shower first, then play to earn more points!</p>
          </div>
        </Link>

        <Link to="/leaderboard" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card" style={{ textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer' }}
               onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-5px)')}
               onMouseLeave={e => (e.currentTarget.style.transform = '')}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.5rem' }}>🏆</span>
            <h3 style={{ color: '#f59e0b', margin: '0 0 0.5rem' }}>Leaderboard</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>See how you rank against the others!</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
