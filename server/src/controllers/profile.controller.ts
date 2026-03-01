import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { findProfileByUserId, updateProfile } from '../models/profile.model';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const profile = await findProfileByUserId(req.user!.id);
    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    res.json({
      id: profile.id,
      userId: profile.userId,
      childName: profile.childName,
      avatarId: profile.avatarId,
      points: profile.points
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { childName, avatarId } = req.body;
    const updates: any = {};

    if (childName !== undefined) updates.childName = childName;
    if (avatarId !== undefined) updates.avatarId = avatarId;

    const profile = await updateProfile(req.user!.id, updates);

    res.json({
      id: profile.id,
      userId: profile.userId,
      childName: profile.childName,
      avatarId: profile.avatarId,
      points: profile.points
    });
  } catch (error) {
    next(error);
  }
};
