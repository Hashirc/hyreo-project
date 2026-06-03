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

export interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  loading: boolean;
  error: string | null;
}
