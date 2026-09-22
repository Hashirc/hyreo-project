export interface User {
  uid: string;
  displayName: string;
  email: string;
  username?: string;
  role: 'customer' | 'admin';
  createdAt?: string | Date;
  phone?: string;
  dob?: string;
  gender?: string;
  photoURL?: string;
  addresses?: any[];
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
  reviews?: number;
  createdAt?: string | Date;
  discount?: number;
  specifications?: any;
  status?: string;
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

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Coupon {
  id?: string;
  code: string;
  discountType?: 'percentage' | 'fixed';
  discountValue: number;
  expiryDate?: string | Date;
  isActive: boolean;
  description?: string;
  createdAt?: string | Date;
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
  totalCategories: number;
  totalWishlistItems: number;
  totalReviews: number;
  averageRating: number;
  conversionRate: number;
  averageOrderValue: number;
  revenueToday: number;
  ordersToday: number;
  activeUsersToday: number;
  pendingOrdersCount: number;
  charts?: any;
  activityLogs?: any[];
}
