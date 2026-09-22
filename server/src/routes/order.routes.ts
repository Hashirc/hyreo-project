import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Auth middleware is already applied at the app level in server.ts
router.post('/', orderController.createOrder as any);
router.get('/', orderController.getOrders as any);
router.get('/all', requireAdmin as any, orderController.getAllOrders as any);
router.get('/:id', orderController.getOrderById as any);
router.patch('/:id/status', requireAdmin as any, orderController.updateOrderStatus as any);

export default router;
