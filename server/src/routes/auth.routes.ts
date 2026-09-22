import express from 'express';
import * as authController from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/current', authController.getCurrentUser);

router.put('/profile', authMiddleware, authController.updateProfile);
router.put('/change-password', authMiddleware, authController.changePassword);
router.put('/addresses', authMiddleware, authController.updateAddresses);

router.get('/admin/exists', authController.checkAdminExists);
router.post('/admin/register', authController.registerAdmin);
router.post('/admin/login', authController.loginAdmin);

export default router;
