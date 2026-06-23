import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Cart, CartItem, Product } from '../models/types';
import { AuthService } from './auth.service';
import { OrderService } from './order.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
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

  // Keep track of the last ordered items to remove only those upon order success
  private lastOrderedItems: any[] | null = null;

  constructor() {
    // Monkey patch OrderService.createOrder to capture ordered items
    const originalCreateOrder = this.orderService.createOrder.bind(this.orderService);
    this.orderService.createOrder = (orderData: any) => {
      this.lastOrderedItems = orderData.items;
      return originalCreateOrder(orderData);
    };

    // Sync cart when auth state changes
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.loadAndMergeCart(user.uid);
      } else {
        this.loadCartFromLocalStorage();
      }
    });
  }

  private loadAndMergeCart(userId: string) {
    // 1. Instant load from user-specific local storage first to prevent flicker
    const userCartKey = `local_cart_user_${userId}`;
    const savedUserCart = localStorage.getItem(userCartKey);
    if (savedUserCart) {
      try {
        const items = JSON.parse(savedUserCart);
        const filtered = (items || []).filter((item: any) => item.productId !== 'deal_1' && item.productId !== 'flat50_6');
        this.cartItems.set(filtered);
      } catch (e) {}
    }

    // 2. Retrieve guest items to merge
    const guestCartStr = localStorage.getItem('local_cart');
    let guestItems: CartItem[] = [];
    if (guestCartStr) {
      try {
        guestItems = JSON.parse(guestCartStr) || [];
      } catch (e) {}
    }

    // 3. Fetch from server and merge
    this.http.get<Cart>(this.apiUrl).subscribe({
      next: (cart) => {
        let serverItems = (cart.items || []).filter(item => item.productId !== 'deal_1' && item.productId !== 'flat50_6');
        
        if (guestItems.length > 0) {
          // Merge guest items into server items
          const merged = [...serverItems];
          guestItems.forEach(gItem => {
            const idx = merged.findIndex(sItem => sItem.productId === gItem.productId);
            if (idx > -1) {
              merged[idx].quantity += gItem.quantity;
            } else {
              merged.push(gItem);
            }
          });
          
          // Clear guest cart
          localStorage.removeItem('local_cart');
          
          // Save merged cart (updates server & user-specific local storage)
          this.saveCart(merged);
        } else {
          // Just update state and user-specific local storage
          this.cartItems.set(serverItems);
          localStorage.setItem(userCartKey, JSON.stringify(serverItems));
        }
      },
      error: (err) => {
        console.error('Failed to load cart from server:', err);
        // Fallback: merge guest items locally if server load fails
        if (guestItems.length > 0) {
          const current = [...this.cartItems()];
          guestItems.forEach(gItem => {
            const idx = current.findIndex(c => c.productId === gItem.productId);
            if (idx > -1) {
              current[idx].quantity += gItem.quantity;
            } else {
              current.push(gItem);
            }
          });
          localStorage.removeItem('local_cart');
          this.saveCart(current);
        }
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
    const user = this.authService.currentUser();
    
    if (user) {
      // Save to user-specific local storage for persistence on refresh/close
      localStorage.setItem(`local_cart_user_${user.uid}`, JSON.stringify(items));
      
      // Sync to Express backend
      this.http.post<any>(`${this.apiUrl}/items`, { items }).subscribe({
        error: (err) => console.error('Failed to sync cart with server:', err)
      });
    } else {
      // Save locally as guest cart
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
    const user = this.authService.currentUser();
    const ordered = this.lastOrderedItems;

    if (ordered && ordered.length > 0) {
      // 5. When a user places an order, only the ordered products should be removed from the cart.
      const orderedIds = ordered.map((item: any) => item.productId);
      const remainingItems = this.cartItems().filter(item => !orderedIds.includes(item.productId));
      this.saveCart(remainingItems);
      this.lastOrderedItems = null; // Reset
    } else {
      // Clear entire cart
      this.saveCart([]);
    }

    localStorage.removeItem('local_cart');
    if (user) {
      localStorage.removeItem(`local_cart_user_${user.uid}`);
    }
  }
}
