import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { Product, Category } from '../models/index';
import { broadcast } from '../services/realtime';

export async function getAllProducts(req: Request, res: Response) {
  try {
    const category = req.query.category as string;
    const search = req.query.search as string;
    const subCategory = req.query.subCategory as string;

    const snapshot = await db.collection('products').get();
    let products: Product[] = [];
    
    snapshot.forEach((doc: any) => {
      products.push({
        id: doc.id,
        ...doc.data()
      } as Product);
    });

    if (category) {
      products = products.filter(p => p.categoryId === category);
    }

    if (subCategory) {
      products = products.filter(p => p.subCategory?.toLowerCase() === subCategory.toLowerCase());
    }

    if (search) {
      const queryStr = search.toLowerCase();
      products = products.filter(p => 
        (p.name && p.name.toLowerCase().includes(queryStr)) ||
        (p.description && p.description.toLowerCase().includes(queryStr))
      );
    }

    res.json(products);
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
    const { name, description, price, categoryId, subCategory, stock, imageUrl } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newProduct: Product = {
      id: '',
      name,
      description: description || '',
      price: parseFloat(price),
      categoryId,
      subCategory: subCategory || '',
      stock: parseInt(stock) || 0,
      imageUrl,
      rating: 0,
      reviews: 0,
      createdAt: new Date()
    };

    const docRef = await db.collection('products').add(newProduct);
    const createdProduct = { ...newProduct, id: docRef.id };
    broadcast('product_change', { type: 'create', productId: docRef.id, product: createdProduct });

    res.status(201).json(createdProduct);
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
    const updatedProduct = { id: updatedDoc.id, ...updatedDoc.data() };
    broadcast('product_change', { type: 'update', productId: id, product: updatedProduct });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await db.collection('products').doc(id).delete();
    broadcast('product_change', { type: 'delete', productId: id });

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

export async function createCategory(req: Request, res: Response) {
  try {
    const categoryData: Category = req.body;
    const docRef = await db.collection('categories').add(categoryData);
    const createdCategory = { ...categoryData, id: docRef.id };
    broadcast('category_change', { type: 'create', categoryId: docRef.id, category: createdCategory });
    res.status(201).json(createdCategory);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create category' });
  }
}

export async function updateCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const bodyWithoutId = { ...req.body };
    delete bodyWithoutId.id;
    await db.collection('categories').doc(id).update(bodyWithoutId);
    const updatedCategory = { id, ...bodyWithoutId };
    broadcast('category_change', { type: 'update', categoryId: id, category: updatedCategory });
    res.json(updatedCategory);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update category' });
  }
}

export async function deleteCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await db.collection('categories').doc(id).delete();
    broadcast('category_change', { type: 'delete', categoryId: id });
    res.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
}

export async function getReviews(req: Request, res: Response) {
  try {
    const snapshot = await db.collection('reviews').get();
    const reviews = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
}

export async function deleteReview(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await db.collection('reviews').doc(id).delete();
    res.json({ message: 'Review deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
}
