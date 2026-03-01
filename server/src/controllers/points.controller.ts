import { Request, Response, NextFunction } from 'express';
import * as ProfileService from '../services/profile.service';
import { AppError } from '../middleware/errorHandler';

export const getPoints = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.profile?.id) {
      throw new AppError('Authentication error: Profile not found', 401);
    }
    const totalPoints = await ProfileService.getPointsByProfileId(req.profile.id);
    res.status(200).json({ totalPoints });
  } catch (error) {
    next(error);
  }
};

export const awardPoints = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.profile?.id) {
      throw new AppError('Authentication error: Profile not found', 401);
    }
    const { points, reason } = req.body;
    if (typeof points !== 'number' || !reason) {
      throw new AppError('Invalid request: points (number) and reason (string) are required', 400);
    }
    const result = await ProfileService.addPoints(req.profile.id, points, reason);
    res.status(200).json({
      newTotal: result.totalPoints,
      pointsAwarded: points,
    });
  } catch (error) {
    next(error);
  }
};
