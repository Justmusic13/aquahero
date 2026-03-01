import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { submitScore } from '../controllers/game.controller';

const router = Router();

router.use(authenticate);
router.post('/score', submitScore);

export default router;
