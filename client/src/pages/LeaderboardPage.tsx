import React, { useState, useEffect } from 'react';
import { LeaderboardEntry, AVATAR_MAP } from '@/types';
import * as pointsService from '@/services/points.service';
import { useAuth } from '@/hooks/useAuth';
import Avatar from '@/components/Avatar';

const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { profile } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await pointsService.getLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        setError('Failed to load leaderboard.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
    // Refresh every 5 minutes
    const interval = setInterval(fetchLeaderboard, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading leaderboard...</div>;
  if (error) return <p className="error-message">{error}</p>;

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>🏆 Leaderboard</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {leaderboard.map((entry) => {
          const avatar = AVATAR_MAP[entry.avatar_id] || AVATAR_MAP[1];
          const isCurrentUser = !entry.is_npc && profile?.childName === entry.child_name;

          return (
            <div
              key={`${entry.rank}-${entry.child_name}`}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.5rem',
                border: isCurrentUser ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                background: isCurrentUser ? 'var(--background-color)' : 'var(--surface-color)',
              }}
            >
              {/* Rank */}
              <span style={{ fontSize: entry.rank <= 3 ? '1.5rem' : '1rem', fontWeight: 'bold', minWidth: '2.5rem', textAlign: 'center' }}>
                {getRankEmoji(entry.rank)}
              </span>

              {/* Avatar */}
              <Avatar avatarId={entry.avatar_id} size="small" />

              {/* Name and info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {entry.child_name}
                  </span>
                  {isCurrentUser && (
                    <span style={{
                      background: 'var(--primary-color)',
                      color: 'white',
                      padding: '0.1rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                    }}>
                      YOU
                    </span>
                  )}
                  {entry.is_npc && (
                    <span style={{
                      background: '#e5e7eb',
                      color: '#6b7280',
                      padding: '0.1rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.7rem',
                    }}>
                      {avatar.name}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {entry.has_showered_today === true && '🚿 Showered today'}
                  {entry.has_showered_today === false && '⏳ Hasn\'t showered yet'}
                  {entry.has_showered_today === null && ''}
                </div>
              </div>

              {/* Points */}
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary-color)' }}>
                  {entry.points.toLocaleString()}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>points</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaderboardPage;
