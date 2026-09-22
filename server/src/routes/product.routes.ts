import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getReviews,
  deleteReview
} from '../controllers/product.controller';
import { authMiddleware, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Categories
router.get('/categories', getCategories);
router.post('/categories', authMiddleware, requireAdmin as any, createCategory);
router.put('/categories/:id', authMiddleware, requireAdmin as any, updateCategory);
router.delete('/categories/:id', authMiddleware, requireAdmin as any, deleteCategory);

// Reviews
router.get('/reviews', getReviews);
router.delete('/reviews/:id', authMiddleware, requireAdmin as any, deleteReview);

// Products
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authMiddleware, requireAdmin as any, createProduct);
router.put('/:id', authMiddleware, requireAdmin as any, updateProduct);
router.delete('/:id', authMiddleware, requireAdmin as any, deleteProduct);

export default router;
