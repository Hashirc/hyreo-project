import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { WishlistService, WishlistItem } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { handleImageFallback } from '../../core/utils/image-fallback';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatRippleModule],
  template: `
    <div class="wishlist-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-left">
            <button mat-icon-button class="back-btn" (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
            </button>
            <div>
              <h1 class="page-title">My Wishlist</h1>
              <p class="page-subtitle">
                {{ wishlistService.wishlistCount() }} {{ wishlistService.wishlistCount() === 1 ? 'item' : 'items' }} saved
              </p>
            </div>
          </div>
          @if (wishlistService.wishlistCount() > 0) {
            <button mat-stroked-button class="add-all-btn" (click)="addAllToCart()">
              <mat-icon>add_shopping_cart</mat-icon>
              Add All to Cart
            </button>
          }
        </div>
      </div>

      <!-- Toast Notification -->
      @if (wishlistService.toastMessage()) {
        <div class="toast" [class.success]="wishlistService.toastMessage()?.type === 'success'">
          <mat-icon>{{ wishlistService.toastMessage()?.type === 'success' ? 'check_circle' : 'error' }}</mat-icon>
          {{ wishlistService.toastMessage()?.text }}
        </div>
      }

      <!-- Empty State -->
      @if (wishlistService.wishlistCount() === 0) {
        <div class="empty-state">
          <div class="empty-icon-wrapper">
            <mat-icon class="empty-icon">favorite_border</mat-icon>
          </div>
          <h2 class="empty-title">Your wishlist is empty</h2>
          <p class="empty-desc">Save items you love for later. Browse products and click the heart icon to add them here.</p>
          <div class="empty-actions">
            <button mat-flat-button class="shop-btn" routerLink="/products">
              <mat-icon>shopping_bag</mat-icon>
              Continue Shopping
            </button>
            <button mat-stroked-button class="home-btn" routerLink="/">
              <mat-icon>home</mat-icon>
              Go Home
            </button>
          </div>
        </div>
      } @else {
        <!-- Wishlist Grid -->
        <div class="wishlist-container">
          <div class="wishlist-grid">
            @for (item of wishlistService.wishlistItems(); track item.productId) {
              <div class="wishlist-card" matRipple>
                <!-- Product Image -->
                <div class="card-image-wrap" [routerLink]="['/products', item.productId]">
                  <img
                    [src]="item.imageUrl"
                    [alt]="item.name"
                    class="card-image"
                    (error)="handleImgError($event, item)">
                  <!-- Remove from wishlist -->
                  <button
                    class="remove-wishlist-btn"
                    (click)="removeItem(item.productId, $event)"
                    aria-label="Remove from wishlist"
                    title="Remove from wishlist">
                    <mat-icon>close</mat-icon>
                  </button>
                  <!-- Stock Badge -->
                  @if (item.stock === 0) {
                    <div class="out-of-stock-overlay">Out of Stock</div>
                  }
                </div>

                <!-- Card Body -->
                <div class="card-body">
                  <h3 class="item-name" [routerLink]="['/products', item.productId]">{{ item.name }}</h3>

                  <div class="item-rating">
                    <mat-icon class="star-icon">star</mat-icon>
                    <span>{{ item.rating }}</span>
                  </div>

                  <div class="item-price">
                    <span class="price">₹{{ item.price | number:'1.0-0' }}</span>
                  </div>

                  <div class="stock-info">
                    @if (item.stock > 0) {
                      <span class="in-stock"><mat-icon>check_circle</mat-icon> In Stock</span>
                    } @else {
                      <span class="no-stock"><mat-icon>cancel</mat-icon> Out of Stock</span>
                    }
                  </div>

                  <!-- Action Buttons -->
                  <div class="card-actions">
                    <button
                      mat-flat-button
                      class="add-cart-btn"
                      [disabled]="item.stock === 0"
                      (click)="moveToCart(item)">
                      <mat-icon>add_shopping_cart</mat-icon>
                      Move to Cart
                    </button>
                    <button
                      mat-stroked-button
                      class="view-btn"
                      [routerLink]="['/products', item.productId]">
                      View
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Bottom CTA -->
          <div class="bottom-cta">
            <button mat-stroked-button class="continue-btn" routerLink="/products">
              <mat-icon>arrow_back</mat-icon>
              Continue Shopping
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

    * { box-sizing: border-box; }

    .wishlist-page {
      min-height: 100vh;
      background: #F7F8F3;
      font-family: 'Inter', sans-serif;
    }

    /* ── Page Header ── */
    .page-header {
      background: white;
      border-bottom: 1px solid #e8ecd8;
      padding: 20px 0;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 12px rgba(45,58,27,0.06);
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .back-btn {
      color: #556B2F;
      background: #EBF0D8;
      border-radius: 50%;
      transition: all 0.2s ease;

      &:hover {
        background: #d4e09a;
        transform: translateX(-2px);
      }
    }

    .page-title {
      font-family: 'Outfit', sans-serif;
      font-size: 26px;
      font-weight: 800;
      color: #2D3A1B;
      margin: 0;
    }

    .page-subtitle {
      font-size: 13px;
      color: #7a8a5c;
      margin: 2px 0 0 0;
    }

    .add-all-btn {
      border: 2px solid #556B2F;
      color: #556B2F;
      font-family: 'Outfit', sans-serif;
      font-weight: 600;
      border-radius: 24px;
      padding: 0 20px;
      height: 42px;
      gap: 6px;
      transition: all 0.2s ease;

      &:hover {
        background: #556B2F;
        color: white;
      }
    }

    /* ── Toast ── */
    .toast {
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%);
      background: #2D3A1B;
      color: white;
      padding: 12px 24px;
      border-radius: 32px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      font-size: 14px;
      box-shadow: 0 8px 24px rgba(45,58,27,0.3);
      z-index: 9999;
      animation: slideUp 0.3s ease;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: #a8d08d;
      }

      &.success mat-icon { color: #a8d08d; }
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    /* ── Empty State ── */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 100px 24px;
      text-align: center;
    }

    .empty-icon-wrapper {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, #EBF0D8, #d4e09a);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 28px;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .empty-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      color: #556B2F;
    }

    .empty-title {
      font-family: 'Outfit', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: #2D3A1B;
      margin: 0 0 12px 0;
    }

    .empty-desc {
      font-size: 15px;
      color: #6b7a4e;
      max-width: 380px;
      line-height: 1.6;
      margin: 0 0 36px 0;
    }

    .empty-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .shop-btn {
      background: #556B2F !important;
      color: white !important;
      border-radius: 24px !important;
      height: 48px !important;
      padding: 0 28px !important;
      font-family: 'Outfit', sans-serif !important;
      font-weight: 700 !important;
      font-size: 15px !important;
      gap: 8px;

      &:hover {
        background: #3d4d1f !important;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(85,107,47,0.3) !important;
      }
    }

    .home-btn {
      border: 2px solid #556B2F !important;
      color: #556B2F !important;
      border-radius: 24px !important;
      height: 48px !important;
      padding: 0 28px !important;
      font-family: 'Outfit', sans-serif !important;
      font-weight: 700 !important;
      font-size: 15px !important;
      gap: 8px;

      &:hover {
        background: #EBF0D8 !important;
      }
    }

    /* ── Wishlist Grid ── */
    .wishlist-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    .wishlist-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 24px;
    }

    /* ── Wishlist Card ── */
    .wishlist-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;

      &:hover {
        box-shadow: 0 12px 32px rgba(85,107,47,0.18);
        transform: translateY(-6px);
      }
    }

    .card-image-wrap {
      position: relative;
      width: 100%;
      height: 220px;
      overflow: hidden;
      cursor: pointer;
      background: #f8f8f8;
    }

    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .wishlist-card:hover .card-image {
      transform: scale(1.05);
    }

    .remove-wishlist-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: rgba(255,255,255,0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      transition: all 0.2s ease;
      z-index: 2;
      padding: 0;

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        color: #e53935;
      }

      &:hover {
        background: #ffebee;
        transform: scale(1.1);
      }
    }

    .out-of-stock-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 15px;
      font-family: 'Outfit', sans-serif;
      letter-spacing: 0.5px;
    }

    .card-body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
    }

    .item-name {
      font-family: 'Outfit', sans-serif;
      font-size: 16px;
      font-weight: 700;
      color: #2D3A1B;
      margin: 0;
      cursor: pointer;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.4;
      transition: color 0.2s;

      &:hover { color: #556B2F; }
    }

    .item-rating {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #556B2F;

      .star-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        color: #f59e0b;
      }

      span {
        font-size: 13px;
        font-weight: 600;
        color: #5A664A;
      }
    }

    .item-price {
      margin-top: 2px;
    }

    .price {
      font-family: 'Outfit', sans-serif;
      font-size: 22px;
      font-weight: 800;
      color: #556B2F;
    }

    .stock-info {
      display: flex;
      align-items: center;

      .in-stock, .no-stock {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        font-weight: 600;

        mat-icon {
          font-size: 14px;
          width: 14px;
          height: 14px;
        }
      }

      .in-stock {
        color: #4caf50;
        mat-icon { color: #4caf50; }
      }

      .no-stock {
        color: #e53935;
        mat-icon { color: #e53935; }
      }
    }

    .card-actions {
      display: flex;
      gap: 8px;
      margin-top: auto;
      padding-top: 8px;
    }

    .add-cart-btn {
      flex: 1;
      background: #556B2F !important;
      color: white !important;
      border-radius: 8px !important;
      font-family: 'Outfit', sans-serif !important;
      font-weight: 600 !important;
      font-size: 13px !important;
      height: 40px !important;
      gap: 4px;
      transition: all 0.2s ease;

      mat-icon { font-size: 16px; width: 16px; height: 16px; }

      &:hover:not(:disabled) {
        background: #3d4d1f !important;
        transform: translateY(-1px);
      }

      &:disabled {
        background: #ccc !important;
        color: #999 !important;
      }
    }

    .view-btn {
      border: 2px solid #556B2F !important;
      color: #556B2F !important;
      border-radius: 8px !important;
      font-family: 'Outfit', sans-serif !important;
      font-weight: 600 !important;
      height: 40px !important;
      padding: 0 16px !important;
      transition: all 0.2s ease;

      &:hover {
        background: #EBF0D8 !important;
      }
    }

    /* ── Bottom CTA ── */
    .bottom-cta {
      display: flex;
      justify-content: center;
      padding-top: 40px;
    }

    .continue-btn {
      border: 2px solid #556B2F !important;
      color: #556B2F !important;
      border-radius: 24px !important;
      height: 48px !important;
      padding: 0 32px !important;
      font-family: 'Outfit', sans-serif !important;
      font-weight: 700 !important;
      font-size: 15px !important;
      gap: 8px;

      &:hover {
        background: #EBF0D8 !important;
      }
    }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .header-content { flex-direction: column; align-items: flex-start; gap: 12px; }
      .wishlist-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
      .card-image-wrap { height: 180px; }
      .page-title { font-size: 22px; }
    }

    @media (max-width: 480px) {
      .wishlist-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
      .wishlist-container { padding: 20px 16px; }
      .card-body { padding: 12px; }
      .price { font-size: 18px; }
    }
  `]
})
export class WishlistComponent {
  wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  goBack() {
    this.router.navigate(['/products']);
  }

  handleImgError(event: any, item: WishlistItem) {
    handleImageFallback(event, {
      id: item.productId,
      name: item.name,
      imageUrl: item.imageUrl,
      categoryId: item.categoryId
    } as any);
  }

  removeItem(productId: string, event: Event) {
    event.stopPropagation();
    this.wishlistService.removeFromWishlist(productId);
  }

  moveToCart(item: WishlistItem) {
    if (item.stock === 0) return;
    this.cartService.addToCart({
      id: item.productId,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      stock: item.stock,
      categoryId: item.categoryId,
      rating: item.rating,
      description: ''
    } as any, 1);
  }

  addAllToCart() {
    const items = this.wishlistService.wishlistItems().filter(i => i.stock > 0);
    for (const item of items) {
      this.moveToCart(item);
    }
  }
}
