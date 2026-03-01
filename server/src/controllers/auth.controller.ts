import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { createUser, findUserByEmail } from '../models/user.model';
import { createProfile } from '../models/profile.model';
import { generateToken, hashPassword, comparePassword } from '../services/auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, childName } = req.body;

    if (!email || !password || !childName) {
      throw new AppError('Email, password, and child name are required', 400);
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser(email, passwordHash);
    await createProfile(user.id, childName);

    res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const user = await findUserByEmail(email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken({ id: user.id, email: user.email });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};
