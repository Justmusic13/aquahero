import React, { useState, useEffect } from 'react';

interface PointsDisplayProps {
  points: number;
  size?: 'small' | 'medium' | 'large';
  showAnimation?: boolean;
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({
  points,
  size = 'medium',
  showAnimation = true,
}) => {
  const [previousPoints, setPreviousPoints] = useState(points);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (points > previousPoints && showAnimation) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
    setPreviousPoints(points);
  }, [points, previousPoints, showAnimation]);

  const sizeClasses = {
    small: 'text-2xl px-4 py-2',
    medium: 'text-4xl px-6 py-3',
    large: 'text-6xl px-8 py-4',
  };

  return (
    <div
      className={`
        bg-gradient-to-r from-yellow-400 to-orange-500
        text-white font-bold rounded-full
        shadow-lg border-4 border-white
        flex items-center justify-center
        ${sizeClasses[size]}
        ${isAnimating ? 'celebration animate-pulse' : ''}
      `}
    >
      <span className="mr-2">⭐</span>
      <span>{points.toLocaleString()}</span>
      <span className="ml-2 text-sm opacity-80">points</span>
    </div>
  );
};

export default PointsDisplay;
