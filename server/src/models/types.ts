export interface User {
  uid: string;
  displayName: string;
  email: string;
  role: 'customer' | 'admin';
  createdAt: Date;
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
  stock: number;
  imageUrl: string;
  rating: number;
  createdAt: Date;
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
  updatedAt: Date;
}

export type OrderStatus = 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface ShippingAddress {
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  addressLine1?: string;
  city: string;
  state?: string;
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
  createdAt: Date;
}
