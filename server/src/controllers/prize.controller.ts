import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { findProfileByUserId, addPoints } from '../models/profile.model';
import * as PrizeModel from '../models/prize.model';

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export const getPrizes = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const profile = await findProfileByUserId(req.user!.id);
    if (!profile) throw new AppError('Profile not found', 404);
    const prizes = await PrizeModel.getPrizesByProfileId(profile.id);
    res.json(prizes);
  } catch (error) {
    next(error);
  }
};

export const createPrize = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, pointCost, imageUrl } = req.body;
    if (!title || !pointCost) throw new AppError('Title and point cost are required', 400);

    const profile = await findProfileByUserId(req.user!.id);
    if (!profile) throw new AppError('Profile not found', 404);

    // Check max 10 prizes
    const existing = await PrizeModel.getPrizesByProfileId(profile.id);
    if (existing.length >= 10) throw new AppError('Maximum of 10 prizes allowed', 400);

    const prize = await PrizeModel.createPrize(profile.id, title, description || '', pointCost, imageUrl || null);
    res.status(201).json(prize);
  } catch (error) {
    next(error);
  }
};

export const updatePrize = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const profile = await findProfileByUserId(req.user!.id);
    if (!profile) throw new AppError('Profile not found', 404);

    const prize = await PrizeModel.updatePrize(parseInt(id), profile.id, req.body);
    if (!prize) throw new AppError('Prize not found', 404);
    res.json(prize);
  } catch (error) {
    next(error);
  }
};

export const deletePrize = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const profile = await findProfileByUserId(req.user!.id);
    if (!profile) throw new AppError('Profile not found', 404);

    await PrizeModel.deletePrize(parseInt(id), profile.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const redeemPrize = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const profile = await findProfileByUserId(req.user!.id);
    if (!profile) throw new AppError('Profile not found', 404);

    const prizes = await PrizeModel.getPrizesByProfileId(profile.id);
    const prize = prizes.find(p => p.id === parseInt(id));
    if (!prize) throw new AppError('Prize not found', 404);

    if (profile.points < prize.point_cost) {
      throw new AppError('Not enough points to redeem this prize', 400);
    }

    // Deduct points
    await addPoints(req.user!.id, -prize.point_cost);
    await PrizeModel.redeemPrize(profile.id, prize.id, prize.point_cost);

    res.json({ success: true, pointsSpent: prize.point_cost });
  } catch (error) {
    next(error);
  }
};
