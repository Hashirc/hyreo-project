import { CartItem } from './cart.model';

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

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

export interface OrderResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}
