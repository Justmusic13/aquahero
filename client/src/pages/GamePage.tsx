import React, { useState } from 'react';
import * as gameService from '@/services/game.service';
import { useAuth } from '@/hooks/useAuth';

const GamePage: React.FC = () => {
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { reloadProfile } = useAuth();

  const handlePlayGame = () => {
    // Simulate playing a game and getting a score
    const randomScore = Math.floor(Math.random() * 1000) + 100;
    setScore(randomScore);
  };

  const handleSubmitScore = async () => {
    if (score === 0) {
      setMessage('Play the game first to get a score!');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const response = await gameService.submitScore(score);
      setMessage(`Score of ${score} submitted! You earned ${response.pointsEarned} points.`);
      await reloadProfile();
      setScore(0);
    } catch (error) {
      console.error('Failed to submit score', error);
      setMessage('Error submitting score. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ textAlign: 'center', maxWidth: '500px', margin: 'auto' }}>
      <h2>AquaHero Game</h2>
      <p>This is a placeholder for a fun, water-saving themed game!</p>
      
      <div style={{ margin: '2rem 0' }}>
        <button onClick={handlePlayGame} disabled={loading}>
          Click to "Play"
        </button>
      </div>

      {score > 0 && (
        <div>
          <h3>Your Score: {score}</h3>
          <button onClick={handleSubmitScore} disabled={loading} className="secondary">
            {loading ? 'Submitting...' : 'Submit Score & Get Points'}
          </button>
        </div>
      )}
      
      {message && <p style={{ marginTop: '1rem', color: 'green' }}>{message}</p>}
    </div>
  );
};

export default GamePage;
