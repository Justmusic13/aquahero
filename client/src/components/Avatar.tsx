import React from 'react';
import { AVATAR_MAP } from '@/types';

interface AvatarProps {
  avatarId: number;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  showering?: boolean;
  className?: string;
}

const AVATAR_COLORS: Record<number, { bg: string; ring: string }> = {
  1: { bg: 'from-gray-400 to-blue-500', ring: 'border-blue-400' },
  2: { bg: 'from-green-400 to-emerald-600', ring: 'border-green-400' },
  3: { bg: 'from-purple-400 to-indigo-600', ring: 'border-purple-400' },
  4: { bg: 'from-amber-400 to-orange-600', ring: 'border-amber-400' },
  5: { bg: 'from-sky-300 to-blue-600', ring: 'border-sky-400' },
  6: { bg: 'from-red-400 to-gray-800', ring: 'border-red-400' },
};

const Avatar: React.FC<AvatarProps> = ({
  avatarId,
  size = 'medium',
  showering = false,
  className = '',
}) => {
  const avatar = AVATAR_MAP[avatarId] || AVATAR_MAP[1];
  const colors = AVATAR_COLORS[avatarId] || AVATAR_COLORS[1];

  const sizeMap = {
    small: { container: 'w-12 h-12', emoji: 'text-2xl', drops: 'text-xs' },
    medium: { container: 'w-20 h-20', emoji: 'text-4xl', drops: 'text-sm' },
    large: { container: 'w-28 h-28', emoji: 'text-5xl', drops: 'text-base' },
    xlarge: { container: 'w-36 h-36', emoji: 'text-7xl', drops: 'text-lg' },
  };

  const s = sizeMap[size];

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {/* Shower head */}
      {showering && (
        <div className="relative w-full flex justify-center mb-1">
          <span className={`${s.drops}`}>🚿</span>
          <div className="absolute top-full flex gap-0.5 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className={`${s.drops} opacity-70`}
                style={{
                  animation: `dropFall 0.8s ease-in infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                💧
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Avatar circle */}
      <div
        className={`
          ${s.container}
          bg-gradient-to-br ${colors.bg}
          rounded-full flex items-center justify-center
          shadow-lg border-4 ${colors.ring}
          transition-transform duration-200
          ${showering ? 'animate-bounce' : 'hover:scale-110'}
        `}
      >
        <span className={s.emoji}>{avatar.emoji}</span>
      </div>

      {/* Bubbles when showering */}
      {showering && (
        <div className="absolute -right-2 top-1/2 flex flex-col gap-1">
          {['🫧', '🫧'].map((b, i) => (
            <span
              key={i}
              className="text-sm opacity-60"
              style={{
                animation: `float 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              {b}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Avatar;
