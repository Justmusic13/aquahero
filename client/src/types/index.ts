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
}

export interface ShowerLog {
  id: number;
  profile_id: string;
  start_time: string;
  end_time: string;
  duration_seconds: number;
  points_earned: number;
}

export interface LeaderboardEntry {
  rank: number;
  child_name: string;
  points: number;
  avatar_id: number;
}

export interface Reminder {
  id: number;
  profile_id: string;
  reminder_time: string; // "HH:MM:SS"
  is_active: boolean;
}
