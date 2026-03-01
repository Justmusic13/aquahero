import { Router } from 'express';
import profileRouter from './profile.routes';
import pointsRouter from './points.routes';
import showerRouter from './shower.routes';
import reminderRouter from './reminder.routes';
import gameRouter from './game.routes';

const router = Router();

router.use('/profile', profileRouter);
router.use('/points', pointsRouter);
router.use('/showers', showerRouter);
router.use('/reminders', reminderRouter);
router.use('/games', gameRouter);

export default router;
