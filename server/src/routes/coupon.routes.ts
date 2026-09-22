import { Router } from 'express';
import { createCoupon, getAllCoupons, validateCoupon, updateCoupon, deleteCoupon } from '../controllers/coupon.controller';

const router = Router();

router.post('/', createCoupon);
router.get('/', getAllCoupons);
router.post('/validate', validateCoupon);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

export default router;
