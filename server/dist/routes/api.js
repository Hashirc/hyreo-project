"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const productController_1 = require("../controllers/productController");
const cartController_1 = require("../controllers/cartController");
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Authentication Routes
router.post('/auth/register', authController_1.registerUser);
router.post('/auth/login', authController_1.loginUser);
router.get('/auth/me', auth_1.authenticateToken, authController_1.getCurrentUserProfile);
// Products & Categories Routes
router.get('/products', productController_1.getProducts);
router.get('/products/:id', productController_1.getProductById);
router.get('/categories', productController_1.getCategories);
// Cart Routes
router.get('/cart', auth_1.authenticateToken, cartController_1.getCart);
router.post('/cart/items', auth_1.authenticateToken, cartController_1.updateCart);
// Orders Routes
router.post('/orders', auth_1.authenticateToken, orderController_1.createOrder);
router.get('/orders', auth_1.authenticateToken, orderController_1.getOrders);
// Admin Routes
router.post('/products', auth_1.authenticateToken, auth_1.requireAdmin, productController_1.createProduct);
router.patch('/orders/:id/status', auth_1.authenticateToken, auth_1.requireAdmin, orderController_1.updateOrderStatus);
router.get('/admin/dashboard', auth_1.authenticateToken, auth_1.requireAdmin, orderController_1.getDashboardMetrics);
exports.default = router;
