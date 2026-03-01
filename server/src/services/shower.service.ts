import { query } from '../config/database';
import { addPoints } from './profile.service';
import { AppError } from '../middleware/errorHandler';

const SHOWER_COMPLETION_POINTS = 50;

export const getShowerLogs = async (profileId: string, limit: number, offset: number) => {
  const res = await query(
    `SELECT id, completed_at, points_awarded, confirmed_by 
     FROM shower_logs 
     WHERE profile_id = $1 
     ORDER BY completed_at DESC 
     LIMIT $2 OFFSET $3`,
    [profileId, limit, offset]
  );
  return res.rows.map(row => ({
    id: row.id,
    completedAt: row.completed_at,
    pointsAwarded: row.points_awarded,
    confirmedBy: row.confirmed_by,
  }));
};

export const hasShoweredToday = async (profileId: string) => {
  const res = await query(
    `SELECT completed_at FROM shower_logs 
     WHERE profile_id = $1 AND completed_at >= current_date 
     ORDER BY completed_at DESC LIMIT 1`,
    [profileId]
  );
  return {
    hasShoweredToday: res.rows.length > 0,
    lastShower: res.rows.length > 0 ? res.rows[0].completed_at : null,
  };
};

export const completeShower = async (profileId: string, confirmedBy: 'parent' | 'child') => {
  const todayCheck = await hasShoweredToday(profileId);
  if (todayCheck.hasShoweredToday) {
    throw new AppError('Shower has already been completed today.', 409);
  }

  const res = await query(
    'INSERT INTO shower_logs (profile_id, points_awarded, confirmed_by) VALUES ($1, $2, $3) RETURNING *',
    [profileId, SHOWER_COMPLETION_POINTS, confirmedBy || 'parent']
  );

  const newPoints = await addPoints(profileId, SHOWER_COMPLETION_POINTS, 'Completed daily shower');

  return {
    log: res.rows[0],
    newTotalPoints: newPoints.totalPoints,
    pointsAwarded: SHOWER_COMPLETION_POINTS,
  };
};
