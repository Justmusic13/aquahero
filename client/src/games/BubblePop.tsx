import React, { useState, useEffect, useRef, useCallback } from 'react';

interface BubblePopProps {
  onGameEnd: (score: number, durationSeconds: number) => void;
  remainingSeconds: number;
}

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  emoji: string;
  popped: boolean;
}

const EMOJIS = ['💧', '🫧', '💦', '🌊', '🐟', '🐠', '🐙', '🦀', '🐚', '🐳'];

const BubblePop: React.FC<BubblePopProps> = ({ onGameEnd, remainingSeconds }) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const nextId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startTime = useRef<number>(0);

  const maxTime = Math.min(60, remainingSeconds);

  const spawnBubble = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const w = container.offsetWidth;
    const size = 40 + Math.random() * 30;
    const newBubble: Bubble = {
      id: nextId.current++,
      x: Math.random() * (w - size),
      y: container.offsetHeight,
      size,
      speed: 1 + Math.random() * 2,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      popped: false,
    };
    setBubbles(prev => [...prev, newBubble]);
  }, []);

  const popBubble = (id: number) => {
    setBubbles(prev =>
      prev.map(b => (b.id === id && !b.popped ? { ...b, popped: true } : b))
    );
    setScore(prev => prev + 10);
  };

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(maxTime);
    setBubbles([]);
    startTime.current = Date.now();
  };

  // Timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsPlaying(false);
          setGameOver(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Spawn bubbles
  useEffect(() => {
    if (!isPlaying) return;
    const spawner = setInterval(spawnBubble, 800);
    return () => clearInterval(spawner);
  }, [isPlaying, spawnBubble]);

  // Move bubbles
  useEffect(() => {
    if (!isPlaying) return;
    const mover = setInterval(() => {
      setBubbles(prev =>
        prev
          .map(b => ({ ...b, y: b.y - b.speed }))
          .filter(b => b.y > -b.size && !b.popped)
      );
    }, 30);
    return () => clearInterval(mover);
  }, [isPlaying]);

  // Handle game over
  useEffect(() => {
    if (gameOver) {
      const duration = Math.floor((Date.now() - startTime.current) / 1000);
      onGameEnd(score, duration);
    }
  }, [gameOver]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-between w-full max-w-md">
        <span className="text-xl font-bold">⭐ {score}</span>
        <span className="text-xl font-bold">⏱ {timeLeft}s</span>
      </div>

      <div
        ref={containerRef}
        className="relative w-full max-w-md overflow-hidden rounded-2xl"
        style={{
          height: '400px',
          background: 'linear-gradient(to bottom, #bae6fd, #0284c7)',
          cursor: isPlaying ? 'pointer' : 'default',
        }}
      >
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <span className="text-6xl mb-4">🫧</span>
            <h3 className="text-2xl font-bold mb-2">Bubble Pop!</h3>
            <p className="mb-4 text-center px-4">Tap the bubbles before they float away!</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-white text-blue-600 rounded-full font-bold text-lg hover:scale-105 transition-transform"
            >
              Play!
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-40 rounded-2xl">
            <span className="text-6xl mb-4">🎉</span>
            <h3 className="text-3xl font-bold mb-2">Great Job!</h3>
            <p className="text-2xl mb-4">Score: {score}</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-white text-blue-600 rounded-full font-bold text-lg hover:scale-105 transition-transform"
            >
              Play Again!
            </button>
          </div>
        )}

        {isPlaying &&
          bubbles.map(bubble => (
            <div
              key={bubble.id}
              onClick={() => popBubble(bubble.id)}
              className="absolute cursor-pointer transition-opacity hover:opacity-80"
              style={{
                left: bubble.x,
                top: bubble.y,
                width: bubble.size,
                height: bubble.size,
                fontSize: bubble.size * 0.6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                userSelect: 'none',
              }}
            >
              {bubble.emoji}
            </div>
          ))}
      </div>
    </div>
  );
};

export default BubblePop;
