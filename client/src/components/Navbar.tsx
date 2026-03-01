import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AVATAR_MAP } from '@/types';

const Navbar: React.FC = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const avatar = AVATAR_MAP[profile?.avatarId || 1] || AVATAR_MAP[1];

  const navItems = [
    { path: '/', label: '🏠', title: 'Home' },
    { path: '/shower', label: '🚿', title: 'Shower' },
    { path: '/game', label: '🎮', title: 'Games' },
    { path: '/leaderboard', label: '🏆', title: 'Ranks' },
    { path: '/profile', label: avatar.emoji, title: 'Profile' },
    { path: '/settings', label: '⚙️', title: 'Settings' },
  ];

  return (
    <nav style={{
      background: 'var(--surface-color)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      padding: '0 1rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1000px',
        margin: '0 auto',
        height: '56px',
      }}>
        {/* Logo */}
        <Link to="/" style={{
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '1.3rem',
          color: 'var(--primary-color)',
        }}>
<img src="/ah.svg" alt="AquaHero" style={{ height: '40px' }} /> AquaHero
        </Link>

        {/* Nav items */}
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={item.title}
                style={{
                  textDecoration: 'none',
                  padding: '0.4rem 0.6rem',
                  borderRadius: '10px',
                  fontSize: '1.2rem',
                  background: isActive ? 'var(--background-color)' : 'transparent',
                  border: isActive ? '2px solid var(--primary-color)' : '2px solid transparent',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Points + logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            background: 'linear-gradient(135deg, #fbbf24, #f97316)',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 'bold',
          }}>
            ⭐ {profile?.points || 0}
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.3rem 0.6rem',
              fontSize: '0.8rem',
              background: 'var(--danger-color)',
              borderRadius: '8px',
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
