import { Product, Category } from '../../core/models/product.model';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Electronics',
    slug: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'
  },
  {
    id: 'cat-2',
    name: 'Fashion',
    slug: 'fashion',
    imageUrl: 'https://images.unsplash.com/photo-1505250967868-ba7dbc5438a1?w=500&h=500&fit=crop'
  },
  {
    id: 'cat-3',
    name: 'Home & Living',
    slug: 'home-living',
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop'
  },
  {
    id: 'cat-4',
    name: 'Sports',
    slug: 'sports',
    imageUrl: 'https://images.unsplash.com/photo-1550258987-920a2eae7d59?w=500&h=500&fit=crop'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 99.99,
    categoryId: 'cat-1',
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    rating: 4.5,
    reviews: 128,
    createdAt: new Date()
  },
  {
    id: 'prod-2',
    name: 'Smartphone',
    description: 'Latest smartphone with cutting-edge technology',
    price: 799.99,
    categoryId: 'cat-1',
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 256,
    createdAt: new Date()
  },
  {
    id: 'prod-3',
    name: 'Laptop',
    description: 'Powerful laptop for professionals and creators',
    price: 1299.99,
    categoryId: 'cat-1',
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 189,
    createdAt: new Date()
  },
  {
    id: 'prod-4',
    name: 'Classic T-Shirt',
    description: 'Comfortable and durable classic t-shirt',
    price: 29.99,
    categoryId: 'cat-2',
    stock: 200,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    rating: 4.3,
    reviews: 92,
    createdAt: new Date()
  },
  {
    id: 'prod-5',
    name: 'Denim Jeans',
    description: 'Premium quality denim jeans with perfect fit',
    price: 79.99,
    categoryId: 'cat-2',
    stock: 150,
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 164,
    createdAt: new Date()
  },
  {
    id: 'prod-6',
    name: 'Leather Jacket',
    description: 'Stylish leather jacket for all seasons',
    price: 249.99,
    categoryId: 'cat-2',
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 134,
    createdAt: new Date()
  },
  {
    id: 'prod-7',
    name: 'Coffee Maker',
    description: 'Automatic coffee maker with multiple brewing options',
    price: 89.99,
    categoryId: 'cat-3',
    stock: 80,
    imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=500&h=500&fit=crop',
    rating: 4.4,
    reviews: 110,
    createdAt: new Date()
  },
  {
    id: 'prod-8',
    name: 'Desk Lamp',
    description: 'LED desk lamp with adjustable brightness',
    price: 49.99,
    categoryId: 'cat-3',
    stock: 120,
    imageUrl: 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=500&h=500&fit=crop',
    rating: 4.2,
    reviews: 78,
    createdAt: new Date()
  },
  {
    id: 'prod-9',
    name: 'Bed Sheets Set',
    description: 'Premium cotton bed sheets with excellent durability',
    price: 59.99,
    categoryId: 'cat-3',
    stock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1586208898215-b7953e7dd1b0?w=500&h=500&fit=crop',
    rating: 4.5,
    reviews: 142,
    createdAt: new Date()
  },
  {
    id: 'prod-10',
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat for all fitness levels',
    price: 39.99,
    categoryId: 'cat-4',
    stock: 200,
    imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 156,
    createdAt: new Date()
  },
  {
    id: 'prod-11',
    name: 'Running Shoes',
    description: 'Lightweight running shoes with superior comfort',
    price: 129.99,
    categoryId: 'cat-4',
    stock: 85,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 203,
    createdAt: new Date()
  },
  {
    id: 'prod-12',
    name: 'Dumbbells Set',
    description: 'Adjustable dumbbells set for home gym',
    price: 199.99,
    categoryId: 'cat-4',
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1531694711892-88b6e0b2b63f?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 189,
    createdAt: new Date()
  },
  {
    id: 'prod-13',
    name: 'Smartwatch',
    description: 'Feature-rich smartwatch with health monitoring',
    price: 299.99,
    categoryId: 'cat-1',
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    rating: 4.5,
    reviews: 234,
    createdAt: new Date()
  },
  {
    id: 'prod-14',
    name: 'Tablet',
    description: 'High-performance tablet for work and entertainment',
    price: 599.99,
    categoryId: 'cat-1',
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1526245749395-fb8cab371db2?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 167,
    createdAt: new Date()
  },
  {
    id: 'prod-15',
    name: 'Sneakers',
    description: 'Trendy sneakers perfect for casual wear',
    price: 89.99,
    categoryId: 'cat-2',
    stock: 120,
    imageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&h=500&fit=crop',
    rating: 4.4,
    reviews: 121,
    createdAt: new Date()
  },
  {
    id: 'prod-16',
    name: 'Backpack',
    description: 'Durable and spacious backpack for travel',
    price: 69.99,
    categoryId: 'cat-2',
    stock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 143,
    createdAt: new Date()
  },
  {
    id: 'prod-17',
    name: 'Plant Pot',
    description: 'Elegant ceramic plant pot for decoration',
    price: 24.99,
    categoryId: 'cat-3',
    stock: 150,
    imageUrl: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop',
    rating: 4.3,
    reviews: 87,
    createdAt: new Date()
  },
  {
    id: 'prod-18',
    name: 'Desk Organizer',
    description: 'Multi-compartment desk organizer for productivity',
    price: 34.99,
    categoryId: 'cat-3',
    stock: 90,
    imageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&h=500&fit=crop',
    rating: 4.5,
    reviews: 95,
    createdAt: new Date()
  },
  {
    id: 'prod-19',
    name: 'Basketball',
    description: 'Professional basketball with excellent grip',
    price: 44.99,
    categoryId: 'cat-4',
    stock: 75,
    imageUrl: 'https://images.unsplash.com/photo-1461505029265-42276f2c1895?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 112,
    createdAt: new Date()
  },
  {
    id: 'prod-20',
    name: 'Bicycle',
    description: 'Lightweight mountain bicycle for adventure',
    price: 449.99,
    categoryId: 'cat-4',
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 198,
    createdAt: new Date()
  }
];
