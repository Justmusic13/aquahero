export interface User {
  id: string;
  email: string;
}

export interface Profile {
  id: string;
  userId: string;
  childName: string;
  avatarId: number;
  points: number;
  themeColor: string;
}

export interface ShowerLog {
  id: number;
  profile_id: string;
  start_time: string;
  end_time: string;
  duration_seconds: number;
  points_earned: number;
  bonusAwarded?: boolean;
  bonusPoints?: number;
  totalPointsEarned?: number;
}

export interface LeaderboardEntry {
  rank: number;
  child_name: string;
  points: number;
  avatar_id: number;
  is_npc: boolean;
  has_showered_today: boolean | null;
}

export interface Reminder {
  id: number;
  profile_id: string;
  reminder_time: string;
  is_active: boolean;
}

export interface Prize {
  id: number;
  profile_id: string;
  title: string;
  description: string;
  point_cost: number;
  image_url: string | null;
  is_active: boolean;
}

export interface GameStatus {
  canPlay: boolean;
  hasShoweredToday: boolean;
  todayPlayTimeSeconds: number;
  remainingSeconds: number;
  maxDailySeconds: number;
}

export interface GameScoreResponse {
  score: number;
  pointsEarned: number;
  gameType: string;
}

export type AvatarType = 'robot' | 'dinosaur' | 'alien' | 'cowboy' | 'astronaut' | 'ninja';

export const AVATAR_MAP: Record<number, { type: AvatarType; emoji: string; name: string; showerEmoji: string }> = {
  1: { type: 'robot', emoji: '🤖', name: 'Robot', showerEmoji: '🤖🚿' },
  2: { type: 'dinosaur', emoji: '🦖', name: 'Dinosaur', showerEmoji: '🦖🚿' },
  3: { type: 'alien', emoji: '👽', name: 'Alien', showerEmoji: '👽🚿' },
  4: { type: 'cowboy', emoji: '🤠', name: 'Cowboy', showerEmoji: '🤠🚿' },
  5: { type: 'astronaut', emoji: '🧑‍🚀', name: 'Astronaut', showerEmoji: '🧑‍🚀🚿' },
  6: { type: 'ninja', emoji: '🥷', name: 'Ninja', showerEmoji: '🥷🚿' },
};

export type ThemeColor = 'ocean' | 'jungle' | 'sunset' | 'candy' | 'space' | 'lava';

export const THEME_COLORS: Record<ThemeColor, { name: string; primary: string; secondary: string; bg: string; accent: string; emoji: string }> = {
  ocean:  { name: 'Ocean',  primary: '#0ea5e9', secondary: '#06b6d4', bg: '#f0f9ff', accent: '#0284c7', emoji: '🌊' },
  jungle: { name: 'Jungle', primary: '#16a34a', secondary: '#65a30d', bg: '#f0fdf4', accent: '#15803d', emoji: '🌴' },
  sunset: { name: 'Sunset', primary: '#f97316', secondary: '#eab308', bg: '#fffbeb', accent: '#ea580c', emoji: '🌅' },
  candy:  { name: 'Candy',  primary: '#ec4899', secondary: '#a855f7', bg: '#fdf2f8', accent: '#db2777', emoji: '🍬' },
  space:  { name: 'Space',  primary: '#8b5cf6', secondary: '#6366f1', bg: '#f5f3ff', accent: '#7c3aed', emoji: '🚀' },
  lava:   { name: 'Lava',   primary: '#ef4444', secondary: '#f97316', bg: '#fef2f2', accent: '#dc2626', emoji: '🌋' },
};
