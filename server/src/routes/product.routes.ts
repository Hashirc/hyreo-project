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
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Categories
router.get('/categories', getCategories);
router.post('/categories', authMiddleware, createCategory);
router.put('/categories/:id', authMiddleware, updateCategory);
router.delete('/categories/:id', authMiddleware, deleteCategory);

// Reviews
router.get('/reviews', getReviews);
router.delete('/reviews/:id', authMiddleware, deleteReview);

// Products
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;
