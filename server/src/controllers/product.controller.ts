import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { Product, Category } from '../models/index';

export async function getAllProducts(req: Request, res: Response) {
  try {
    const category = req.query.category as string;
    const search = req.query.search as string;

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

export async function createCategory(req: Request, res: Response) {
  try {
    const categoryData: Category = req.body;
    const docRef = await db.collection('categories').add(categoryData);
    res.status(201).json({ ...categoryData, id: docRef.id });
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
    res.json({ id, ...bodyWithoutId });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update category' });
  }
}

export async function deleteCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await db.collection('categories').doc(id).delete();
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
