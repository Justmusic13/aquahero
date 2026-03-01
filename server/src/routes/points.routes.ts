import { Router } from 'express';
import { getPoints, awardPoints } from '../controllers/points.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All points routes are protected
router.use(authenticate);

router.get('/', getPoints);
router.post('/award', awardPoints);

export default router;
