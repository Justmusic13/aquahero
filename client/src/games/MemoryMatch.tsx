import React, { useState, useEffect, useRef } from 'react';

interface MemoryMatchProps {
  onGameEnd: (score: number, durationSeconds: number) => void;
  remainingSeconds: number;
}

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARD_EMOJIS = ['🐳', '🦈', '🐙', '🦀', '🐠', '🌊', '🐚', '🧜‍♀️'];

const shuffleArray = <T,>(arr: T[]): T[] => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const createCards = (): Card[] => {
  const pairs = CARD_EMOJIS.flatMap((emoji, i) => [
    { id: i * 2, emoji, isFlipped: false, isMatched: false },
    { id: i * 2 + 1, emoji, isFlipped: false, isMatched: false },
  ]);
  return shuffleArray(pairs);
};

const MemoryMatch: React.FC<MemoryMatchProps> = ({ onGameEnd, remainingSeconds }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const startTime = useRef(0);
  const maxTime = Math.min(120, remainingSeconds);

  const startGame = () => {
    setCards(createCards());
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setIsPlaying(true);
    setGameOver(false);
    setTimeLeft(maxTime);
    startTime.current = Date.now();
  };

  // Timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
  };

  // Check for win
  useEffect(() => {
    if (isPlaying && matches === CARD_EMOJIS.length) {
      endGame();
    }
  }, [matches, isPlaying]);

  // Submit score on game over
  useEffect(() => {
    if (gameOver) {
      const duration = Math.floor((Date.now() - startTime.current) / 1000);
      // Score: matches * 100, bonus for fewer moves, bonus for time remaining
      const baseScore = matches * 100;
      const moveBonus = Math.max(0, 50 - moves) * 5;
      const timeBonus = timeLeft * 2;
      const finalScore = baseScore + moveBonus + timeBonus;
      onGameEnd(finalScore, duration);
    }
  }, [gameOver]);

  const handleCardClick = (cardId: number) => {
    if (!isPlaying) return;
    if (flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, isFlipped: true } : c));

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = newFlipped.map(id => cards.find(c => c.id === id)!);
      
      if (first.emoji === cards.find(c => c.id === cardId)!.emoji && first.id !== cardId) {
        // Match!
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === newFlipped[0] || c.id === newFlipped[1]
                ? { ...c, isMatched: true }
                : c
            )
          );
          setMatches(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === newFlipped[0] || c.id === newFlipped[1]
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
        }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-between w-full max-w-md">
        <span className="text-lg font-bold">Matches: {matches}/{CARD_EMOJIS.length}</span>
        <span className="text-lg font-bold">Moves: {moves}</span>
        <span className="text-lg font-bold">⏱ {timeLeft}s</span>
      </div>

      {!isPlaying && !gameOver && (
        <div className="text-center p-8">
          <span className="text-6xl block mb-4">🧠</span>
          <h3 className="text-2xl font-bold mb-2">Memory Match!</h3>
          <p className="mb-4">Find all the matching pairs!</p>
          <button
            onClick={startGame}
            className="px-8 py-3 bg-purple-500 text-white rounded-full font-bold text-lg hover:scale-105 transition-transform"
          >
            Play!
          </button>
        </div>
      )}

      {gameOver && (
        <div className="text-center p-8">
          <span className="text-6xl block mb-4">{matches === CARD_EMOJIS.length ? '🏆' : '⏰'}</span>
          <h3 className="text-2xl font-bold mb-2">
            {matches === CARD_EMOJIS.length ? 'You Won!' : 'Time\'s Up!'}
          </h3>
          <p className="mb-1">Matches: {matches}/{CARD_EMOJIS.length}</p>
          <p className="mb-4">Moves: {moves}</p>
          <button
            onClick={startGame}
            className="px-8 py-3 bg-purple-500 text-white rounded-full font-bold text-lg hover:scale-105 transition-transform"
          >
            Play Again!
          </button>
        </div>
      )}

      {isPlaying && (
        <div className="grid grid-cols-4 gap-2 max-w-md w-full">
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`
                aspect-square rounded-xl text-3xl flex items-center justify-center
                transition-all duration-300 transform
                ${card.isMatched
                  ? 'bg-green-200 border-2 border-green-400 scale-95'
                  : card.isFlipped
                    ? 'bg-white border-2 border-blue-400 shadow-md'
                    : 'bg-blue-500 border-2 border-blue-600 hover:bg-blue-400 hover:scale-105 cursor-pointer'
                }
              `}
              disabled={card.isMatched || card.isFlipped}
            >
              {card.isFlipped || card.isMatched ? card.emoji : '❓'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryMatch;
