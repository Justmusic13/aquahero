import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getProfile, updateUserProfile } from '../controllers/profile.controller';

const router = Router();

router.use(authenticate);
router.get('/', getProfile);
router.put('/', updateUserProfile);

export default router;
