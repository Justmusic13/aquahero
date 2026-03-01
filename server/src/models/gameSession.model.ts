import { query } from '../config/database';

export interface GameSession {
  id: number;
  profile_id: string;
  game_type: string;
  duration_seconds: number;
  score: number;
  points_earned: number;
  played_at: Date;
}

export const createGameSession = async (
  profileId: string,
  gameType: string,
  durationSeconds: number,
  score: number,
  pointsEarned: number
): Promise<GameSession> => {
  const result = await query(
    'INSERT INTO game_sessions (profile_id, game_type, duration_seconds, score, points_earned) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [profileId, gameType, durationSeconds, score, pointsEarned]
  );
  return result.rows[0];
};

export const getTodayPlayTime = async (profileId: string): Promise<number> => {
  const result = await query(
    `SELECT COALESCE(SUM(duration_seconds), 0) as total_seconds 
     FROM game_sessions 
     WHERE profile_id = $1 AND played_at >= CURRENT_DATE`,
    [profileId]
  );
  return parseInt(result.rows[0].total_seconds);
};

export const getTodaySessions = async (profileId: string): Promise<GameSession[]> => {
  const result = await query(
    'SELECT * FROM game_sessions WHERE profile_id = $1 AND played_at >= CURRENT_DATE ORDER BY played_at DESC',
    [profileId]
  );
  return result.rows;
};
