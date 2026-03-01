import { query } from '../config/database';

export interface ShowerLog {
  id: number;
  profile_id: string;
  start_time: Date;
  end_time: Date;
  duration_seconds: number;
  points_earned: number;
  created_at: Date;
}

export const createShowerLog = async (
  profileId: string,
  startTime: Date,
  endTime: Date,
  durationSeconds: number,
  pointsEarned: number
): Promise<ShowerLog> => {
  const result = await query(
    'INSERT INTO shower_logs (profile_id, start_time, end_time, duration_seconds, points_earned) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [profileId, startTime, endTime, durationSeconds, pointsEarned]
  );
  return result.rows[0];
};

export const getShowerLogsByProfileId = async (profileId: string): Promise<ShowerLog[]> => {
  const result = await query(
    'SELECT * FROM shower_logs WHERE profile_id = $1 ORDER BY created_at DESC LIMIT 20',
    [profileId]
  );
  return result.rows;
};
