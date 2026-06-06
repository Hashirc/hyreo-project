import { Request, Response } from 'express';
import { db } from '../server';
import { Product, Category } from '../models/index';

export async function getAllProducts(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const snapshot = await db.collection('products').get();
    const products: Product[] = [];
    
    snapshot.forEach((doc: any) => {
      products.push({
        id: doc.id,
        ...doc.data()
      } as Product);
    });

    const totalSnapshot = await db.collection('products').get();

    res.json({
      products,
      total: totalSnapshot.size,
      page,
      limit
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const doc = await db.collection('products').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const { name, description, price, categoryId, stock, imageUrl } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newProduct: Product = {
      id: '',
      name,
      description: description || '',
      price: parseFloat(price),
      categoryId,
      stock: parseInt(stock) || 0,
      imageUrl,
      rating: 0,
      reviews: 0,
      createdAt: new Date()
    };

    const docRef = await db.collection('products').add(newProduct);

    res.status(201).json({
      ...newProduct,
      id: docRef.id
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };

    await db.collection('products').doc(id).update(updateData);

    const updatedDoc = await db.collection('products').doc(id).get();

    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await db.collection('products').doc(id).delete();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
}

export async function getCategories(req: Request, res: Response) {
  try {
    const snapshot = await db.collection('categories').get();
    const categories: Category[] = [];

    snapshot.forEach((doc: any) => {
      categories.push({
        id: doc.id,
        ...doc.data()
      } as Category);
    });

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}
