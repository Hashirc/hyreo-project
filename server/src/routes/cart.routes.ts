import { Router } from 'express';
import { getCart, updateCart } from '../controllers/cartController';

const router = Router();

router.get('/', getCart as any);
router.post('/items', updateCart as any);

export default router;
