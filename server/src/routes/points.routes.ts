import { Router } from 'express';
import { getPoints, awardPoints } from '../controllers/points.controller';
import { mvpAuth } from '../middleware/auth';

const router = Router();

// All points routes are protected
router.use(mvpAuth);

router.get('/', getPoints);
router.post('/award', awardPoints);

export default router;
