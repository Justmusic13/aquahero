import { query } from '../config/database';

export interface Profile {
  id: string;
  userId: string;
  childName: string;
  avatarId: number;
  points: number;
  created_at: Date;
  updated_at: Date;
}

export const createProfile = async (userId: string, childName: string): Promise<Profile> => {
  const result = await query(
    'INSERT INTO profiles (user_id, child_name, avatar_id, points) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, childName, 1, 0]
  );
  return result.rows[0];
};

export const findProfileByUserId = async (userId: string): Promise<Profile | null> => {
  const result = await query('SELECT * FROM profiles WHERE user_id = $1', [userId]);
  return result.rows[0] || null;
};

export const updateProfile = async (userId: string, updates: Partial<Profile>): Promise<Profile> => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  if (updates.childName !== undefined) {
    fields.push(`child_name = $${paramCount++}`);
    values.push(updates.childName);
  }
  if (updates.avatarId !== undefined) {
    fields.push(`avatar_id = $${paramCount++}`);
    values.push(updates.avatarId);
  }
  if (updates.points !== undefined) {
    fields.push(`points = $${paramCount++}`);
    values.push(updates.points);
  }

  fields.push(`updated_at = NOW()`);
  values.push(userId);

  const result = await query(
    `UPDATE profiles SET ${fields.join(', ')} WHERE user_id = $${paramCount} RETURNING *`,
    values
  );
  return result.rows[0];
};

export const addPoints = async (userId: string, points: number): Promise<Profile> => {
  const result = await query(
    'UPDATE profiles SET points = points + $1, updated_at = NOW() WHERE user_id = $2 RETURNING *',
    [points, userId]
  );
  return result.rows[0];
};
