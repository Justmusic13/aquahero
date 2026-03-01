import React, { useState, useEffect, useRef } from 'react';
import { ShowerLog } from '@/types';
import * as showerService from '@/services/shower.service';
import { useAuth } from '@/hooks/useAuth';
import { useAudio } from '@/hooks/useAudio';
import Avatar from '@/components/Avatar';
import PrizeShop from '@/components/PrizeShop';
import { formatDistanceToNow } from 'date-fns';

const ShowerPage: React.FC = () => {
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [logs, setLogs] = useState<ShowerLog[]>([]);
  const [result, setResult] = useState<{
    points: number;
    bonus: boolean;
    bonusPoints: number;
  } | null>(null);
  const countRef = useRef<number | null>(null);
  const { profile, reloadProfile } = useAuth();
  const { playStartSound, playStopSound } = useAudio();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const showerLogs = await showerService.getShowerLogs();
      setLogs(showerLogs);
    } catch (error) {
      console.error('Failed to fetch shower logs', error);
    }
  };

  const handleStart = () => {
    playStartSound();
    setIsActive(true);
    setStartTime(new Date());
    setResult(null);
    countRef.current = window.setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);
  };

  const handleStop = async () => {
    playStopSound();
    if (countRef.current) clearInterval(countRef.current);
    setIsActive(false);

    if (startTime) {
      try {
        const response = await showerService.completeShower({
          startTime: startTime.toISOString(),
          durationSeconds: timer,
        });
        setResult({
          points: response.totalPointsEarned || response.points_earned,
          bonus: response.bonusAwarded || false,
          bonusPoints: response.bonusPoints || 0,
        });
        await reloadProfile();
        await fetchLogs();
      } catch (error) {
        console.error('Failed to complete shower', error);
        alert('There was an error saving your shower. Please try again.');
      }
    }

    setTimer(0);
    setStartTime(null);
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Timer Card */}
      <div className="card" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <Avatar
          avatarId={profile?.avatarId || 1}
          size="xlarge"
          showering={isActive}
        />

        <div
          style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            color: 'var(--primary-color)',
            margin: '1rem 0',
            fontFamily: 'monospace',
          }}
        >
          {formatTime(timer)}
        </div>

        {!isActive ? (
          <button
            onClick={handleStart}
            className="secondary"
            style={{ width: '100%', padding: '1em', fontSize: '1.3rem', borderRadius: '16px' }}
          >
            🚿 Start Shower!
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="danger"
            style={{ width: '100%', padding: '1em', fontSize: '1.3rem', borderRadius: '16px' }}
          >
            ✅ Done! End Shower
          </button>
        )}

        {isActive && (
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            🎵 Keep going, you're doing awesome!
          </p>
        )}
      </div>

      {/* Result Card */}
      {result && (
        <div className="card animate-celebrate" style={{ textAlign: 'center', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #fef3c7, #fffbeb)' }}>
          <span style={{ fontSize: '3rem', display: 'block' }}>🎉</span>
          <h3 style={{ margin: '0.5rem 0' }}>Shower Complete!</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
            +{result.points} points earned!
          </p>
          {result.bonus && (
            <p style={{
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              display: 'inline-block',
              fontWeight: 'bold',
              marginTop: '0.5rem',
            }}>
              🔥 +{result.bonusPoints} Reminder Bonus!
            </p>
          )}
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Now you can play games! 🎮
          </p>
        </div>
      )}

      {/* Prize teaser after completing shower */}
      {result && (
        <div style={{ marginBottom: '1.5rem' }}>
          <PrizeShop compact />
        </div>
      )}

      {/* History */}
      <div className="card">
        <h3 style={{ marginTop: 0 }}>📋 Shower History</h3>
        {logs.length > 0 ? (
          <div>
            {logs.slice(0, 7).map(log => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                <span>{formatDistanceToNow(new Date(log.end_time || log.created_at), { addSuffix: true })}</span>
                <span style={{ color: 'var(--text-muted)' }}>{log.duration_seconds}s</span>
                <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                  +{log.points_earned} pts
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>No shower history yet. Start your first shower! 🚿</p>
        )}
      </div>
    </div>
  );
};

export default ShowerPage;
