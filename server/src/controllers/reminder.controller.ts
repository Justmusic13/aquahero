import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { findProfileByUserId } from '../models/profile.model';
import { createOrUpdateReminder, getReminderByProfileId } from '../models/reminder.model';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const getReminder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const profile = await findProfileByUserId(req.user!.id);
    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    const reminder = await getReminderByProfileId(profile.id);
    res.json(reminder);
  } catch (error) {
    next(error);
  }
};

export const setReminder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { time, isActive } = req.body;

    if (!time || typeof isActive !== 'boolean') {
      throw new AppError('Time and isActive are required', 400);
    }

    const profile = await findProfileByUserId(req.user!.id);
    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    const reminder = await createOrUpdateReminder(profile.id, time, isActive);
    res.json(reminder);
  } catch (error) {
    next(error);
  }
};
