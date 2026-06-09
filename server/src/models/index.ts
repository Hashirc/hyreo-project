export interface User {
  uid: string;
  displayName: string;
  email: string;
  role: 'customer' | 'admin';
  createdAt: Date;
  photoURL?: string;
}

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
  stock: number;
  imageUrl: string;
  images?: string[];
  rating: number;
  reviews?: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  imageUrl: string;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: Date;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Coupon {
  id?: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expiryDate: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface Review {
  id?: string;
  userId: string;
  userDisplayName: string;
  productId: string;
  rating: number;
  comment: string;
  isHidden: boolean;
  createdAt: Date;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentRef?: string;
  createdAt: Date;
  updatedAt?: Date;
}
