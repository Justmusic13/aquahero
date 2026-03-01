import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const { profile } = useAuth();

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <h1>Welcome, {profile.childName}!</h1>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h2>Points</h2>
          <p>{profile.points}</p>
        </div>
        <div className="stat-card">
          <h2>Avatar</h2>
          <p>#{profile.avatarId}</p>
        </div>
      </div>
      <div className="dashboard-actions">
        <Link to="/shower" className="action-card">
          <h3>Start Shower</h3>
          <p>Begin a new shower session and earn points.</p>
        </Link>
        <Link to="/game" className="action-card">
          <h3>Play Game</h3>
          <p>Play a fun game to earn more points.</p>
        </Link>
        <Link to="/leaderboard" className="action-card">
          <h3>View Leaderboard</h3>
          <p>See how you rank against others.</p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
