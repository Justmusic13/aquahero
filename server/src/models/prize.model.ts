import { query } from '../config/database';

export interface Prize {
  id: number;
  profile_id: string;
  title: string;
  description: string;
  point_cost: number;
  image_url: string | null;
  is_active: boolean;
  created_at: Date;
}

export const createPrize = async (
  profileId: string,
  title: string,
  description: string,
  pointCost: number,
  imageUrl: string | null
): Promise<Prize> => {
  const result = await query(
    'INSERT INTO prizes (profile_id, title, description, point_cost, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [profileId, title, description, pointCost, imageUrl]
  );
  return result.rows[0];
};

export const getPrizesByProfileId = async (profileId: string): Promise<Prize[]> => {
  const result = await query(
    'SELECT * FROM prizes WHERE profile_id = $1 AND is_active = true ORDER BY point_cost ASC',
    [profileId]
  );
  return result.rows;
};

export const updatePrize = async (
  prizeId: number,
  profileId: string,
  updates: Partial<Prize>
): Promise<Prize> => {
  const result = await query(
    `UPDATE prizes SET title = COALESCE($1, title), description = COALESCE($2, description), 
     point_cost = COALESCE($3, point_cost), image_url = COALESCE($4, image_url), updated_at = NOW() 
     WHERE id = $5 AND profile_id = $6 RETURNING *`,
    [updates.title, updates.description, updates.point_cost, updates.image_url, prizeId, profileId]
  );
  return result.rows[0];
};

export const deletePrize = async (prizeId: number, profileId: string): Promise<void> => {
  await query('UPDATE prizes SET is_active = false WHERE id = $1 AND profile_id = $2', [prizeId, profileId]);
};

export const redeemPrize = async (profileId: string, prizeId: number, pointCost: number) => {
  await query(
    'INSERT INTO prize_redemptions (profile_id, prize_id, points_spent) VALUES ($1, $2, $3)',
    [profileId, prizeId, pointCost]
  );
};

export const getRedemptionsByProfileId = async (profileId: string) => {
  const result = await query(
    `SELECT pr.*, p.title, p.description, p.image_url 
     FROM prize_redemptions pr JOIN prizes p ON pr.prize_id = p.id 
     WHERE pr.profile_id = $1 ORDER BY pr.redeemed_at DESC`,
    [profileId]
  );
  return result.rows;
};
