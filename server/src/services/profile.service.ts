import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getProfileById = async (profileId: string) => {
  const res = await query('SELECT child_name, avatar_id, total_points FROM profiles WHERE id = $1', [profileId]);
  if (res.rows.length === 0) {
    throw new AppError('Profile not found', 404);
  }
  const { child_name, avatar_id, total_points } = res.rows[0];
  return { childName: child_name, avatarId: avatar_id, totalPoints: total_points };
};

export const updateProfile = async (profileId: string, data: { childName?: string, avatarId?: number }) => {
  const { childName, avatarId } = data;
  if (!childName || !avatarId) {
    throw new AppError('childName and avatarId are required', 400);
  }
  const res = await query(
    'UPDATE profiles SET child_name = $1, avatar_id = $2, updated_at = NOW() WHERE id = $3 RETURNING child_name, avatar_id, total_points',
    [childName, avatarId, profileId]
  );
  const { child_name, avatar_id, total_points } = res.rows[0];
  return { childName: child_name, avatarId: avatar_id, totalPoints: total_points };
};

export const getPointsByProfileId = async (profileId: string) => {
  const res = await query('SELECT total_points FROM profiles WHERE id = $1', [profileId]);
  if (res.rows.length === 0) {
    throw new AppError('Profile not found', 404);
  }
  return res.rows[0].total_points;
};

export const addPoints = async (profileId: string, pointsToAdd: number, reason: string) => {
  // In a real app, you might log the reason for the points change.
  console.log(`Adding ${pointsToAdd} points to profile ${profileId} for reason: ${reason}`);
  const res = await query(
    'UPDATE profiles SET total_points = total_points + $1, updated_at = NOW() WHERE id = $2 RETURNING total_points',
    [pointsToAdd, profileId]
  );
  return { totalPoints: res.rows[0].total_points };
};
