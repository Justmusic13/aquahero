import { query } from '../config/database';

export interface GameScore {
  id: number;
  profile_id: string;
  score: number;
  points_earned: number;
  created_at: Date;
}

export const createGameScore = async (
  profileId: string,
  score: number,
  pointsEarned: number
): Promise<GameScore> => {
  const result = await query(
    'INSERT INTO game_scores (profile_id, score, points_earned) VALUES ($1, $2, $3) RETURNING *',
    [profileId, score, pointsEarned]
  );
  return result.rows[0];
};

export const getGameScoresByProfileId = async (profileId: string): Promise<GameScore[]> => {
  const result = await query(
    'SELECT * FROM game_scores WHERE profile_id = $1 ORDER BY created_at DESC LIMIT 10',
    [profileId]
  );
  return result.rows;
};
