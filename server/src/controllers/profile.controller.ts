import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { findProfileByUserId, updateProfile } from '../models/profile.model';
import { query } from '../config/database';

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const profile = await findProfileByUserId(req.user!.id);
    if (!profile) throw new AppError('Profile not found', 404);

    res.json({
      id: profile.id,
      userId: profile.userId,
      childName: profile.childName,
      avatarId: profile.avatarId,
      points: profile.points,
      themeColor: (profile as any).theme_color || 'ocean',
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { childName, avatarId, themeColor } = req.body;
    const updates: any = {};

    if (childName !== undefined) updates.childName = childName;
    if (avatarId !== undefined) updates.avatarId = avatarId;

    const profile = await updateProfile(req.user!.id, updates);

    // Handle theme color separately since it's a new column
    if (themeColor !== undefined) {
      await query('UPDATE profiles SET theme_color = $1 WHERE user_id = $2', [themeColor, req.user!.id]);
    }

    res.json({
      id: profile.id,
      userId: profile.userId,
      childName: profile.childName,
      avatarId: profile.avatarId,
      points: profile.points,
      themeColor: themeColor || (profile as any).theme_color || 'ocean',
    });
  } catch (error) {
    next(error);
  }
};
