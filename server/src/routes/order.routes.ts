import express from 'express';
import * as orderController from '../controllers/order.controller';

const router = express.Router();

// Auth middleware is already applied at the app level in server.ts
router.post('/', orderController.createOrder as any);
router.get('/', orderController.getOrders as any);
router.get('/all', orderController.getAllOrders as any);
router.get('/:id', orderController.getOrderById as any);
router.patch('/:id/status', orderController.updateOrderStatus as any);

export default router;
