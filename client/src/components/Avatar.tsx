import React from 'react';

interface AvatarProps {
  avatarId: number;
  size?: 'small' | 'medium' | 'large';
  animate?: boolean;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  avatarId, 
  size = 'medium', 
  animate = false,
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  };

  const avatarEmojis = ['🧒', '👧', '🧑'];
  const emoji = avatarEmojis[avatarId - 1] || avatarEmojis[0];

  return (
    <div
      className={`
        ${sizeClasses[size]}
        bg-gradient-to-br from-yellow-300 to-orange-400
        rounded-full
        flex items-center justify-center
        text-4xl
        shadow-lg
        border-4 border-white
        ${animate ? 'celebration' : ''}
        ${className}
      `}
    >
      {emoji}
    </div>
  );
};

export default Avatar;
