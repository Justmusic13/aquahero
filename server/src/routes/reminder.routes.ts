import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getReminder, setReminder } from '../controllers/reminder.controller';

const router = Router();

router.use(authenticate);
router.get('/', getReminder);
router.post('/', setReminder);

export default router;
