import React, { useState, useEffect } from 'react';
import { GameStatus } from '@/types';
import * as gameService from '@/services/game.service';
import { useAuth } from '@/hooks/useAuth';
import { useAudio } from '@/hooks/useAudio';
import BubblePop from '@/games/BubblePop';
import MemoryMatch from '@/games/MemoryMatch';
import WaterQuiz from '@/games/WaterQuiz';
import PrizeShop from '@/components/PrizeShop';

type GameType = 'bubble-pop' | 'memory-match' | 'water-quiz';

const GAMES = [
  {
    type: 'bubble-pop' as GameType,
    title: 'Bubble Pop',
    emoji: '🫧',
    description: 'Pop the rising water bubbles before they float away!',
    color: '#0ea5e9',
  },
  {
    type: 'memory-match' as GameType,
    title: 'Memory Match',
    emoji: '🧠',
    description: 'Find all the matching ocean creature pairs!',
    color: '#8b5cf6',
  },
  {
    type: 'water-quiz' as GameType,
    title: 'Water Quiz',
    emoji: '💧',
    description: 'Test your water knowledge with fun trivia!',
    color: '#14b8a6',
  },
];

const GamePage: React.FC = () => {
  const [status, setStatus] = useState<GameStatus | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [lastResult, setLastResult] = useState<{ score: number; points: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const { reloadProfile } = useAuth();
  const { playPointsSound } = useAudio();

  const fetchStatus = async () => {
    try {
      const data = await gameService.getGameStatus();
      setStatus(data);
    } catch (error) {
      console.error('Failed to fetch game status', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleGameEnd = async (score: number, durationSeconds: number) => {
    if (!selectedGame) return;
    try {
      const result = await gameService.submitScore(score, selectedGame, durationSeconds);
      playPointsSound();
      setLastResult({ score: result.score, points: result.pointsEarned });
      await reloadProfile();
      await fetchStatus();
    } catch (error: any) {
      console.error('Failed to submit score', error);
      if (error.response?.status === 403) {
        await fetchStatus();
      }
    }
  };

  const handleBack = () => {
    setSelectedGame(null);
    setLastResult(null);
    fetchStatus();
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;

  // Not showered gate
  if (status && !status.hasShoweredToday) {
    return (
      <div className="card animate-slide-up" style={{ textAlign: 'center', maxWidth: '500px', margin: '2rem auto' }}>
        <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🚿</span>
        <h2>Shower First!</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Complete your daily shower to unlock games for today!
        </p>
        <a href="/shower">
          <button style={{ marginTop: '1rem', padding: '0.8rem 2rem', fontSize: '1.1rem', borderRadius: '12px' }}>
            Go to Shower →
          </button>
        </a>
      </div>
    );
  }

  // Time limit reached
  if (status && status.remainingSeconds <= 0) {
    return (
      <div className="card animate-slide-up" style={{ textAlign: 'center', maxWidth: '500px', margin: '2rem auto' }}>
        <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>⏰</span>
        <h2>Game Time's Up!</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          You've used your 15 minutes of game time for today. Great job!
        </p>
        <p style={{ color: 'var(--text-muted)' }}>Come back tomorrow after your shower for more games! 🎮</p>
      </div>
    );
  }

  // Playing a game
  if (selectedGame) {
    const remaining = status?.remainingSeconds || 0;
    return (
      <div className="animate-slide-up" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <button
            onClick={handleBack}
            style={{ background: 'var(--surface-color)', color: 'var(--text-color)', border: '2px solid var(--border-color)', borderRadius: '12px' }}
          >
            ← Back
          </button>
          <span style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>
            ⏱ {Math.floor(remaining / 60)}m left today
          </span>
        </div>

        {lastResult && (
          <div className="card animate-celebrate" style={{ textAlign: 'center', marginBottom: '1rem', background: 'linear-gradient(135deg, #fef3c7, #fffbeb)' }}>
            <h3 style={{ margin: '0.5rem 0' }}>🎉 Score: {lastResult.score}</h3>
            <p style={{ fontWeight: 'bold', color: 'var(--primary-color)', margin: 0 }}>
              +{lastResult.points} AquaHero points earned!
            </p>
          </div>
        )}

        {lastResult && (
          <div style={{ marginBottom: '1rem' }}>
            <PrizeShop compact />
          </div>
        )}

        <div className="card">
          {selectedGame === 'bubble-pop' && (
            <BubblePop onGameEnd={handleGameEnd} remainingSeconds={remaining} />
          )}
          {selectedGame === 'memory-match' && (
            <MemoryMatch onGameEnd={handleGameEnd} remainingSeconds={remaining} />
          )}
          {selectedGame === 'water-quiz' && (
            <WaterQuiz onGameEnd={handleGameEnd} remainingSeconds={remaining} />
          )}
        </div>
      </div>
    );
  }

  // Game selection
  const remaining = status?.remainingSeconds || 0;
  const minutesLeft = Math.floor(remaining / 60);
  const secondsLeft = remaining % 60;

  return (
    <div className="animate-slide-up" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: '0 0 0.5rem' }}>🎮 Game Arcade</h2>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>
          ⏱ {minutesLeft}m {secondsLeft}s of game time remaining today
        </p>
        <div
          style={{
            background: 'var(--border-color)',
            borderRadius: '9999px',
            height: '8px',
            marginTop: '0.5rem',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              background: 'var(--primary-color)',
              height: '100%',
              borderRadius: '9999px',
              width: `${(remaining / (status?.maxDailySeconds || 900)) * 100}%`,
              transition: 'width 0.3s',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {GAMES.map(game => (
          <button
            key={game.type}
            onClick={() => setSelectedGame(game.type)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1.5rem',
              background: 'var(--surface-color)',
              border: '2px solid var(--border-color)',
              borderRadius: '16px',
              cursor: 'pointer',
              textAlign: 'left',
              color: 'var(--text-color)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = game.color;
              e.currentTarget.style.transform = 'translateX(5px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.transform = '';
            }}
          >
            <span style={{ fontSize: '3rem' }}>{game.emoji}</span>
            <div>
              <h3 style={{ margin: '0 0 0.25rem', color: game.color }}>{game.title}</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {game.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GamePage;
