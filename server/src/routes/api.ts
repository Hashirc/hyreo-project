import { Router } from 'express';
import { registerUser, loginUser, getCurrentUserProfile } from '../controllers/authController';
import { getProducts, getProductById, getCategories, createProduct } from '../controllers/productController';
import { getCart, updateCart } from '../controllers/cartController';
import { createOrder, getOrders, updateOrderStatus, getDashboardMetrics } from '../controllers/orderController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Authentication Routes
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.get('/auth/me', authenticateToken as any, getCurrentUserProfile as any);

// Products & Categories Routes
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.get('/categories', getCategories);

// Cart Routes
router.get('/cart', authenticateToken as any, getCart as any);
router.post('/cart/items', authenticateToken as any, updateCart as any);

// Orders Routes
router.post('/orders', authenticateToken as any, createOrder as any);
router.get('/orders', authenticateToken as any, getOrders as any);

// Admin Routes
router.post('/products', authenticateToken as any, requireAdmin as any, createProduct);
router.patch('/orders/:id/status', authenticateToken as any, requireAdmin as any, updateOrderStatus as any);
router.get('/admin/dashboard', authenticateToken as any, requireAdmin as any, getDashboardMetrics as any);

export default router;
