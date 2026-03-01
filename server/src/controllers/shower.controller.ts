import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { findProfileByUserId, addPoints } from '../models/profile.model';
import { createShowerLog, getShowerLogsByProfileId } from '../models/shower.model';
import { getReminderByProfileId } from '../models/reminder.model';

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export const getShowerLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const profile = await findProfileByUserId(req.user!.id);
    if (!profile) throw new AppError('Profile not found', 404);
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
    if (!profile) throw new AppError('Profile not found', 404);

    const start = new Date(startTime);
    const end = new Date(start.getTime() + durationSeconds * 1000);

    // Base points: 1 point per 10 seconds, max 100 points
    let pointsEarned = Math.min(Math.floor(durationSeconds / 10), 100);
    let bonusAwarded = false;
    let bonusPoints = 0;

    // Check for reminder bonus: 50 pts if shower completed within 45 min of reminder time
    try {
      const reminder = await getReminderByProfileId(profile.id);
      if (reminder && reminder.is_active && reminder.reminder_time) {
        const [rHour, rMin] = reminder.reminder_time.split(':').map(Number);
        const now = new Date();
        const reminderToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), rHour, rMin, 0);
        
        // Calculate difference in minutes between shower completion and reminder time
        const diffMs = Math.abs(end.getTime() - reminderToday.getTime());
        const diffMinutes = diffMs / (1000 * 60);
        
        if (diffMinutes <= 45) {
          bonusPoints = 50;
          pointsEarned += bonusPoints;
          bonusAwarded = true;
        }
      }
    } catch (e) {
      // If reminder check fails, just skip the bonus
      console.error('Reminder bonus check failed:', e);
    }

    const showerLog = await createShowerLog(
      profile.id, start, end, durationSeconds, pointsEarned
    );

    await addPoints(req.user!.id, pointsEarned);

    res.json({
      ...showerLog,
      bonusAwarded,
      bonusPoints,
      totalPointsEarned: pointsEarned,
    });
  } catch (error) {
    next(error);
  }
};
