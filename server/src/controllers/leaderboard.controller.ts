import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';

export const getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query(`
      SELECT 
        ROW_NUMBER() OVER (ORDER BY points DESC) as rank,
        child_name,
        points,
        avatar_id
      FROM profiles 
      ORDER BY points DESC 
      LIMIT 10
    `);

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};
