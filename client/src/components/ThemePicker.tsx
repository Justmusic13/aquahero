import React from 'react';
import { ThemeColor, THEME_COLORS } from '@/types';

interface ThemePickerProps {
  currentTheme: ThemeColor;
  onSelect: (theme: ThemeColor) => void;
}

const ThemePicker: React.FC<ThemePickerProps> = ({ currentTheme, onSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {(Object.keys(THEME_COLORS) as ThemeColor[]).map((key) => {
        const theme = THEME_COLORS[key];
        const isActive = key === currentTheme;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`
              p-3 rounded-xl border-3 transition-all duration-200
              flex flex-col items-center gap-1
              ${isActive
                ? 'border-4 border-gray-800 shadow-lg scale-105'
                : 'border-2 border-gray-200 hover:border-gray-400 hover:scale-102'
              }
            `}
            style={{ backgroundColor: theme.bg }}
          >
            <span className="text-2xl">{theme.emoji}</span>
            <span className="text-sm font-bold" style={{ color: theme.primary }}>
              {theme.name}
            </span>
            <div className="flex gap-1 mt-1">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.primary }} />
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.secondary }} />
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.accent }} />
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ThemePicker;
