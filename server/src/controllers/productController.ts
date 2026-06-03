import { Request, Response } from 'express';
import { dbGetProducts, dbGetProductById, dbCreateProduct, dbGetCategories } from '../services/dbService';

export async function getProducts(req: Request, res: Response) {
  try {
    const { category, search } = req.query;
    const products = await dbGetProducts(
      category as string || undefined,
      search as string || undefined
    );
    return res.status(200).json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: error.message || 'Error fetching products' });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = await dbGetProductById(id);
    if (!product) {
      return res.status(404).json({ message: `Product with ID ${id} not found` });
    }
    return res.status(200).json(product);
  } catch (error: any) {
    console.error(`Error fetching product ${req.params.id}:`, error);
    return res.status(500).json({ message: error.message || 'Error fetching product' });
  }
}

export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await dbGetCategories();
    return res.status(200).json(categories);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ message: error.message || 'Error fetching categories' });
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const { name, description, price, categoryId, stock, imageUrl } = req.body;

    if (!name || !price || !categoryId || stock === undefined) {
      return res.status(400).json({ message: 'Name, price, categoryId, and stock are required' });
    }

    const newProduct = await dbCreateProduct({
      name,
      description,
      price: Number(price),
      categoryId,
      stock: Number(stock),
      imageUrl
    });

    return res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return res.status(500).json({ message: error.message || 'Error creating product' });
  }
}
