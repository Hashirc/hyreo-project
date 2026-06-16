export interface User {
  uid: string;
  displayName: string;
  email: string;
  role: 'customer' | 'admin';
  createdAt?: string | Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
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
  rating: number;
  createdAt?: string | Date;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt?: string | Date;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Coupon {
  id?: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expiryDate: string | Date;
  isActive: boolean;
  createdAt: string | Date;
}

export interface Review {
  id?: string;
  userId: string;
  userDisplayName: string;
  productId: string;
  rating: number;
  comment: string;
  isHidden: boolean;
  createdAt: string | Date;
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
  paymentRef: string;
  createdAt: string | Date;
}

export interface DashboardMetrics {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}
