import { Router } from 'express';
import { getDashboardMetrics } from '../controllers/order.controller';

const router = Router();

router.get('/dashboard', getDashboardMetrics as any);

export default router;
