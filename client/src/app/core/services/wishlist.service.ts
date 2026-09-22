import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Product } from '../models/types';
import { AuthService } from './auth.service';
import { RealtimeService } from './realtime.service';

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
  stock: number;
  categoryId: string;
  discount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private realtimeService = inject(RealtimeService);
  private apiUrl = `${environment.apiUrl}/wishlist`;

  // Signals for wishlist state
  readonly wishlistProductIds = signal<string[]>([]);
  readonly wishlistItems = signal<WishlistItem[]>([]);

  // Computed
  readonly wishlistCount = computed(() => this.wishlistProductIds().length);

  // Toast notification signal
  readonly toastMessage = signal<{ text: string; type: 'success' | 'error' } | null>(null);

  constructor() {
    this.realtimeService.init();

    // Listen to real-time product changes
    this.realtimeService.productChanged$.subscribe((change) => {
      if (change.type === 'update') {
        const updatedProduct = change.product;
        const currentItems = [...this.wishlistItems()];
        let changed = false;
        
        currentItems.forEach((item, idx) => {
          if (item.productId === updatedProduct.id) {
            currentItems[idx] = {
              ...item,
              name: updatedProduct.name,
              price: updatedProduct.price,
              imageUrl: updatedProduct.imageUrl,
              rating: updatedProduct.rating,
              stock: updatedProduct.stock,
              categoryId: updatedProduct.categoryId,
              discount: updatedProduct.discount
            };
            changed = true;
          }
        });
        
        if (changed) {
          this.wishlistItems.set(currentItems);
          const user = this.authService.currentUser();
          this.saveToLocalStorage(user?.uid || null, this.wishlistProductIds(), currentItems);
        }
      } else if (change.type === 'delete') {
        const deletedId = change.productId;
        if (this.wishlistProductIds().includes(deletedId)) {
          this.removeFromWishlist(deletedId);
        }
      }
    });

    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.loadAndMergeWishlist(user.uid);
      } else {
        this.loadWishlistFromLocalStorage();
      }
    });
  }

  private loadAndMergeWishlist(userId: string) {
    const userKey = `local_wishlist_user_${userId}`;
    // 1. Instant load from user-specific local storage to avoid flicker
    const saved = localStorage.getItem(userKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.wishlistProductIds.set(parsed.productIds || []);
        this.wishlistItems.set(parsed.items || []);
      } catch (e) {}
    }

    // 2. Fetch from server
    this.http.get<{ productIds: string[] }>(this.apiUrl).subscribe({
      next: (data) => {
        const serverIds = data.productIds || [];
        this.wishlistProductIds.set(serverIds);
        // Rebuild items from local cache + server IDs
        const currentItems = this.wishlistItems();
        const mergedItems = currentItems.filter(i => serverIds.includes(i.productId));
        this.wishlistItems.set(mergedItems);
        this.saveToLocalStorage(userId, serverIds, mergedItems);
      },
      error: (err) => console.error('Failed to load wishlist from server:', err)
    });
  }

  private loadWishlistFromLocalStorage() {
    const saved = localStorage.getItem('local_wishlist');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.wishlistProductIds.set(parsed.productIds || []);
        this.wishlistItems.set(parsed.items || []);
      } catch {
        this.wishlistProductIds.set([]);
        this.wishlistItems.set([]);
      }
    } else {
      this.wishlistProductIds.set([]);
      this.wishlistItems.set([]);
    }
  }

  private saveToLocalStorage(userId: string | null, productIds: string[], items: WishlistItem[]) {
    const payload = JSON.stringify({ productIds, items });
    if (userId) {
      localStorage.setItem(`local_wishlist_user_${userId}`, payload);
    } else {
      localStorage.setItem('local_wishlist', payload);
    }
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistProductIds().includes(productId);
  }

  toggleWishlist(product: Product) {
    if (this.isInWishlist(product.id)) {
      this.removeFromWishlist(product.id);
    } else {
      this.addToWishlist(product);
    }
  }

  addToWishlist(product: Product) {
    const currentIds = [...this.wishlistProductIds()];
    if (currentIds.includes(product.id)) return;

    const newIds = [...currentIds, product.id];
    const newItem: WishlistItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      rating: product.rating,
      stock: product.stock,
      categoryId: product.categoryId
    };
    const newItems = [...this.wishlistItems(), newItem];

    this.wishlistProductIds.set(newIds);
    this.wishlistItems.set(newItems);

    const user = this.authService.currentUser();
    this.saveToLocalStorage(user?.uid || null, newIds, newItems);

    if (user) {
      this.http.post<any>(`${this.apiUrl}/add`, { productId: product.id }).subscribe({
        error: (err) => console.error('Failed to sync wishlist add:', err)
      });
    }

    this.showToast('Added to wishlist!', 'success');
  }

  removeFromWishlist(productId: string) {
    const newIds = this.wishlistProductIds().filter(id => id !== productId);
    const newItems = this.wishlistItems().filter(i => i.productId !== productId);

    this.wishlistProductIds.set(newIds);
    this.wishlistItems.set(newItems);

    const user = this.authService.currentUser();
    this.saveToLocalStorage(user?.uid || null, newIds, newItems);

    if (user) {
      this.http.delete<any>(`${this.apiUrl}/${productId}`).subscribe({
        error: (err) => console.error('Failed to sync wishlist remove:', err)
      });
    }

    this.showToast('Removed from wishlist', 'success');
  }

  private showToast(text: string, type: 'success' | 'error') {
    this.toastMessage.set({ text, type });
    setTimeout(() => this.toastMessage.set(null), 2500);
  }
}
