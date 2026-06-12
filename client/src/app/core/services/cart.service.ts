import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Cart, CartItem, Product } from '../models/types';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/cart`;

  // Signals for Cart state
  readonly cartItems = signal<CartItem[]>([]);
  
  // Computed properties
  readonly cartTotal = computed(() => 
    this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );
  readonly cartCount = computed(() => 
    this.cartItems().reduce((count, item) => count + item.quantity, 0)
  );

  constructor() {
    // Sync cart when auth state changes
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.loadCartFromServer();
      } else {
        this.loadCartFromLocalStorage();
      }
    });
  }

  private loadCartFromServer() {
    this.http.get<Cart>(this.apiUrl).subscribe({
      next: (cart) => {
        const filtered = (cart.items || []).filter(item => item.productId !== 'deal_1' && item.productId !== 'flat50_6');
        this.cartItems.set(filtered);
      },
      error: (err) => {
        console.error('Failed to load cart from server:', err);
        this.loadCartFromLocalStorage();
      }
    });
  }

  private loadCartFromLocalStorage() {
    const saved = localStorage.getItem('local_cart');
    if (saved) {
      try {
        const items = JSON.parse(saved);
        const filtered = (items || []).filter((item: any) => item.productId !== 'deal_1' && item.productId !== 'flat50_6');
        this.cartItems.set(filtered);
      } catch {
        this.cartItems.set([]);
      }
    } else {
      this.cartItems.set([]);
    }
  }

  private saveCart(items: CartItem[]) {
    this.cartItems.set(items);
    
    if (this.authService.isAuthenticated()) {
      // Sync to Express backend
      this.http.post<any>(`${this.apiUrl}/items`, { items }).subscribe({
        error: (err) => console.error('Failed to sync cart with server:', err)
      });
    } else {
      // Save locally
      localStorage.setItem('local_cart', JSON.stringify(items));
    }
  }

  addToCart(product: Product, quantity = 1) {
    const currentItems = [...this.cartItems()];
    const existingIdx = currentItems.findIndex(i => i.productId === product.id);

    if (existingIdx > -1) {
      const currentQty = currentItems[existingIdx].quantity;
      const targetQty = currentQty + quantity;
      
      if (targetQty > product.stock) {
        alert(`Sorry, you cannot add more than ${product.stock} items of this product.`);
        return;
      }
      currentItems[existingIdx].quantity = targetQty;
    } else {
      if (quantity > product.stock) {
        alert(`Sorry, you cannot add more than ${product.stock} items.`);
        return;
      }
      currentItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        imageUrl: product.imageUrl
      });
    }

    this.saveCart(currentItems);
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItems().map(item => {
      if (item.productId === productId) {
        return { ...item, quantity };
      }
      return item;
    });

    this.saveCart(currentItems);
  }

  removeFromCart(productId: string) {
    const currentItems = this.cartItems().filter(item => item.productId !== productId);
    this.saveCart(currentItems);
  }

  clearCart() {
    this.saveCart([]);
    localStorage.removeItem('local_cart');
  }
}
