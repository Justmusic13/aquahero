import { query } from '../config/database';
import { addPoints } from './profile.service';

const POINTS_PER_SCORE_UNIT = 1; // 1 point for every 1 score point in the game

export const submitScore = async (profileId: string, gameType: string, score: number) => {
  await query(
    'INSERT INTO game_scores (profile_id, game_type, score) VALUES ($1, $2, $3)',
    [profileId, gameType, score]
  );

  const pointsAwarded = Math.floor(score * POINTS_PER_SCORE_UNIT);
  const newPointsData = await addPoints(profileId, pointsAwarded, `Game score for ${gameType}`);

  return {
    pointsAwarded,
    newTotalPoints: newPointsData.totalPoints,
  };
};

export const getHighScores = async (profileId: string, gameType: string) => {
  const res = await query(
    'SELECT score, played_at FROM game_scores WHERE profile_id = $1 AND game_type = $2 ORDER BY score DESC LIMIT 10',
    [profileId, gameType]
  );
  return res.rows;
};
