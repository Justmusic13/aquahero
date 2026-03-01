import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { submitScore, getGameStatus } from '../controllers/game.controller';

const router = Router();

router.use(authenticate);
router.get('/status', getGameStatus);
router.post('/score', submitScore);

export default router;
