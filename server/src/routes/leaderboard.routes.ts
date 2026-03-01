import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getLeaderboard } from '../controllers/leaderboard.controller';

const router = Router();

router.use(authenticate);
router.get('/', getLeaderboard);

export default router;
