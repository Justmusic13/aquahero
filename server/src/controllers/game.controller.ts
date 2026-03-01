import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { findProfileByUserId, addPoints } from '../models/profile.model';
import { createGameScore } from '../models/game.model';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const submitScore = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { score } = req.body;

    if (typeof score !== 'number' || score < 0) {
      throw new AppError('Valid score is required', 400);
    }

    const profile = await findProfileByUserId(req.user!.id);
    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    // Calculate points based on score (1 point per 100 score, max 50 points)
    const pointsEarned = Math.min(Math.floor(score / 100), 50);

    await createGameScore(profile.id, score, pointsEarned);
    await addPoints(req.user!.id, pointsEarned);

    res.json({
      score,
      pointsEarned
    });
  } catch (error) {
    next(error);
  }
};
