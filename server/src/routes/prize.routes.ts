import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getPrizes, createPrize, updatePrize, deletePrize, redeemPrize } from '../controllers/prize.controller';

const router = Router();

router.use(authenticate);
router.get('/', getPrizes);
router.post('/', createPrize);
router.put('/:id', updatePrize);
router.delete('/:id', deletePrize);
router.post('/:id/redeem', redeemPrize);

export default router;
