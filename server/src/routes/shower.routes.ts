import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getShowerLogs, completeShower } from '../controllers/shower.controller';

const router = Router();

router.use(authenticate);
router.get('/', getShowerLogs);
router.post('/complete', completeShower);

export default router;
