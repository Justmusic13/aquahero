import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { findProfileByUserId, addPoints } from '../models/profile.model';
import { createShowerLog, getShowerLogsByProfileId } from '../models/shower.model';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const getShowerLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const profile = await findProfileByUserId(req.user!.id);
    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    const logs = await getShowerLogsByProfileId(profile.id);
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

export const completeShower = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { startTime, durationSeconds } = req.body;

    if (!startTime || !durationSeconds) {
      throw new AppError('Start time and duration are required', 400);
    }

    const profile = await findProfileByUserId(req.user!.id);
    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    const start = new Date(startTime);
    const end = new Date(start.getTime() + durationSeconds * 1000);
    
    // Calculate points based on duration (1 point per 10 seconds, max 100 points)
    const pointsEarned = Math.min(Math.floor(durationSeconds / 10), 100);

    const showerLog = await createShowerLog(
      profile.id,
      start,
      end,
      durationSeconds,
      pointsEarned
    );

    await addPoints(req.user!.id, pointsEarned);

    res.json(showerLog);
  } catch (error) {
    next(error);
  }
};
