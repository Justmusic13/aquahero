import React from 'react';
import { useNavigate } from 'react-router-dom';

interface GameCardProps {
  title: string;
  description: string;
  icon: string;
  pointsReward: number;
  gameType: string;
  highScore?: number;
}

const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  icon,
  pointsReward,
  gameType,
  highScore,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/games?type=${gameType}`);
  };

  return (
    <div
      onClick={handleClick}
      className="game-card hover:shadow-2xl cursor-pointer"
    >
      <div className="text-center">
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-lg mb-4 opacity-90">{description}</p>
        
        <div className="flex justify-between items-center">
          <div className="bg-white bg-opacity-20 rounded-full px-3 py-1">
            <span className="text-sm font-semibold">+{pointsReward} points</span>
          </div>
          
          {highScore && (
            <div className="bg-white bg-opacity-20 rounded-full px-3 py-1">
              <span className="text-sm font-semibold">Best: {highScore}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCard;
