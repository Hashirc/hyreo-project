export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  subCategory?: string;
  stock: number;
  imageUrl: string;
  images?: string[];
  rating: number;
  reviews?: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ProductResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}
