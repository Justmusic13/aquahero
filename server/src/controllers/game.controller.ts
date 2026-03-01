import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { findProfileByUserId, addPoints } from '../models/profile.model';
import { createGameSession, getTodayPlayTime } from '../models/gameSession.model';
import { getShowerLogsByProfileId } from '../models/shower.model';

const MAX_DAILY_PLAY_SECONDS = 15 * 60; // 15 minutes

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

const hasShoweredToday = async (profileId: string): Promise<boolean> => {
  const logs = await getShowerLogsByProfileId(profileId);
  if (logs.length === 0) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return logs.some(log => new Date(log.created_at) >= today);
};

export const getGameStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const profile = await findProfileByUserId(req.user!.id);
    if (!profile) throw new AppError('Profile not found', 404);

    const showeredToday = await hasShoweredToday(profile.id);
    const todayPlayTime = await getTodayPlayTime(profile.id);
    const remainingSeconds = Math.max(0, MAX_DAILY_PLAY_SECONDS - todayPlayTime);

    res.json({
      canPlay: showeredToday && remainingSeconds > 0,
      hasShoweredToday: showeredToday,
      todayPlayTimeSeconds: todayPlayTime,
      remainingSeconds,
      maxDailySeconds: MAX_DAILY_PLAY_SECONDS,
    });
  } catch (error) {
    next(error);
  }
};

export const submitScore = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { score, gameType, durationSeconds } = req.body;

    if (typeof score !== 'number' || score < 0) {
      throw new AppError('Valid score is required', 400);
    }
    if (!gameType) {
      throw new AppError('Game type is required', 400);
    }

    const profile = await findProfileByUserId(req.user!.id);
    if (!profile) throw new AppError('Profile not found', 404);

    // Verify shower completed today
    const showeredToday = await hasShoweredToday(profile.id);
    if (!showeredToday) {
      throw new AppError('You must complete your shower before playing games!', 403);
    }

    // Verify time limit
    const todayPlayTime = await getTodayPlayTime(profile.id);
    if (todayPlayTime >= MAX_DAILY_PLAY_SECONDS) {
      throw new AppError('You have reached your daily game time limit!', 403);
    }

    // Calculate points: 1 point per 50 score, max 30 points per session
    const pointsEarned = Math.min(Math.floor(score / 50), 30);

    await createGameSession(profile.id, gameType, durationSeconds || 60, score, pointsEarned);

    if (pointsEarned > 0) {
      await addPoints(req.user!.id, pointsEarned);
    }

    res.json({
      score,
      pointsEarned,
      gameType,
    });
  } catch (error) {
    next(error);
  }
};
