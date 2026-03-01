import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">AquaHero</Link>
        <ul className="nav-menu">
          <li className="nav-item"><Link to="/" className="nav-link">Dashboard</Link></li>
          <li className="nav-item"><Link to="/shower" className="nav-link">Shower</Link></li>
          <li className="nav-item"><Link to="/game" className="nav-link">Game</Link></li>
          <li className="nav-item"><Link to="/leaderboard" className="nav-link">Leaderboard</Link></li>
          <li className="nav-item"><Link to="/profile" className="nav-link">Profile</Link></li>
          <li className="nav-item"><Link to="/settings" className="nav-link">Settings</Link></li>
        </ul>
        <div className="nav-user-info">
          <span>{profile?.childName} - {profile?.points} pts</span>
          <button onClick={handleLogout} className="nav-logout-btn">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
