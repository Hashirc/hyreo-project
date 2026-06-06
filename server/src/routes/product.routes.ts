import express from 'express';
import * as productController from '../controllers/productController';

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/categories', productController.getCategories);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);

export default router;
