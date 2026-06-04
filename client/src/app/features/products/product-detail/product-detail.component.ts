import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/types';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatDividerModule, MatProgressSpinnerModule],
  template: `
    <div class="detail-container">
      <div class="back-link-row">
        <button mat-button routerLink="/products" class="back-btn">
          <mat-icon>keyboard_backspace</mat-icon> Back to shop
        </button>
      </div>

      @if (isLoading()) {
        <div class="spinner-container">
          <mat-progress-spinner mode="indeterminate" diameter="60" color="primary"></mat-progress-spinner>
        </div>
      } @else {
        @if (product(); as prod) {
          <div class="detail-grid">
            <!-- Product Image -->
            <div class="image-gallery">
              <div class="main-image-wrapper">
                <img [src]="prod.imageUrl" [alt]="prod.name" class="detail-img">
              </div>
            </div>

            <!-- Product Info -->
            <div class="product-info-panel">
              <span class="category-badge">{{ getCategoryName(prod.categoryId) }}</span>
              <h1 class="product-name">{{ prod.name }}</h1>
              
              <div class="rating-row">
                <span class="stars">
                  <mat-icon>star</mat-icon>
                  <mat-icon>star</mat-icon>
                  <mat-icon>star</mat-icon>
                  <mat-icon>star</mat-icon>
                  <mat-icon>star_half</mat-icon>
                </span>
                <span class="rating-val">{{ prod.rating }} rating</span>
              </div>

              <div class="price-row">
                <span class="price">\${{ prod.price | number:'1.2-2' }}</span>
              </div>

              <mat-divider></mat-divider>

              <div class="description-section">
                <h3>Description</h3>
                <p>{{ prod.description }}</p>
              </div>

              <mat-divider></mat-divider>

              <div class="stock-status-section">
                @if (prod.stock > 0) {
                  <span class="stock-indicator in-stock">
                    <mat-icon>check_circle</mat-icon> In Stock ({{ prod.stock }} units available)
                  </span>
                } @else {
                  <span class="stock-indicator out-of-stock">
                    <mat-icon>error_outline</mat-icon> Out of Stock
                  </span>
                }
              </div>

              <!-- Cart Add Action -->
              @if (prod.stock > 0) {
                <div class="add-action-box">
                  <div class="quantity-picker">
                    <button mat-icon-button (click)="decreaseQty()" [disabled]="quantity() <= 1" class="qty-btn">
                      <mat-icon>remove</mat-icon>
                    </button>
                    <span class="qty-value">{{ quantity() }}</span>
                    <button mat-icon-button (click)="increaseQty(prod.stock)" [disabled]="quantity() >= prod.stock" class="qty-btn">
                      <mat-icon>add</mat-icon>
                    </button>
                  </div>
                  <button mat-raised-button color="primary" class="add-to-cart-btn" (click)="addToCart(prod)">
                    <mat-icon>shopping_cart</mat-icon> Add To Cart
                  </button>
                </div>
              }
            </div>
          </div>
        } @else {
          <div class="error-panel">
            <mat-icon>warning</mat-icon>
            <h2>Product Not Found</h2>
            <p>The product you are looking for does not exist or has been removed.</p>
            <button mat-raised-button color="primary" routerLink="/products">Back to Shop</button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .detail-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .back-link-row {
      margin-bottom: 8px;
    }

    .back-btn {
      color: #556B2F !important;
      font-weight: 500;
      
      mat-icon {
        margin-right: 4px;
      }
    }

    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    // Grid Layout
    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      align-items: start;
    }

    // Gallery
    .main-image-wrapper {
      width: 100%;
      height: 450px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      background-color: #f7f9f3;
      border: 1px solid rgba(85, 107, 47, 0.08);
    }

    .detail-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    // Info panel
    .product-info-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .category-badge {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 1px;
      color: #708623;
      background-color: #f0f3e6;
      padding: 4px 10px;
      border-radius: 4px;
      width: fit-content;
    }

    .product-name {
      font-size: 36px;
      color: #1e2610;
      line-height: 1.2;
    }

    .rating-row {
      display: flex;
      align-items: center;
      gap: 12px;

      .stars {
        display: inline-flex;
        color: #ffb300;
        
        mat-icon {
          font-size: 20px;
          height: 20px;
          width: 20px;
        }
      }

      .rating-val {
        font-size: 14px;
        color: #63791d;
        font-weight: 500;
      }
    }

    .price-row {
      .price {
        font-family: 'Outfit', sans-serif;
        font-size: 28px;
        font-weight: 700;
        color: #556B2F;
      }
    }

    .description-section {
      h3 {
        font-size: 16px;
        font-weight: 600;
        color: #1e2610;
        margin-bottom: 8px;
      }

      p {
        font-size: 15px;
        line-height: 1.6;
        color: #4a5435;
      }
    }

    .stock-status-section {
      display: flex;
      align-items: center;
    }

    .stock-indicator {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      font-weight: 600;

      &.in-stock {
        color: #2e7d32;
        mat-icon { color: #2e7d32; }
      }

      &.out-of-stock {
        color: #c62828;
        mat-icon { color: #c62828; }
      }
    }

    // Picker box
    .add-action-box {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 12px;
    }

    .quantity-picker {
      display: flex;
      align-items: center;
      border: 1px solid rgba(85, 107, 47, 0.2);
      border-radius: 25px;
      height: 48px;
      padding: 0 4px;
      background-color: #ffffff;

      .qty-btn {
        color: #556B2F;
      }

      .qty-value {
        width: 32px;
        text-align: center;
        font-weight: 600;
        color: #1e2610;
      }
    }

    .add-to-cart-btn {
      flex: 1;
      height: 48px !important;
      border-radius: 25px !important;
      
      mat-icon {
        margin-right: 8px;
      }
    }

    .error-panel {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 64px 24px;
      gap: 16px;

      mat-icon {
        font-size: 64px;
        height: 64px;
        width: 64px;
        color: #ffb300;
      }

      button {
        border-radius: 20px;
      }
    }

    @media (max-width: 800px) {
      .detail-grid {
        grid-template-columns: 1fr;
        gap: 32px;
      }

      .main-image-wrapper {
        height: 300px;
      }

      .product-name {
        font-size: 28px;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);

  readonly product = signal<Product | null>(null);
  readonly quantity = signal<number>(1);
  readonly isLoading = signal(true);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productService.getProductById(id).subscribe({
          next: (prod) => {
            this.product.set(prod);
            this.isLoading.set(false);
          },
          error: (err) => {
            console.error('Failed to load product', err);
            this.isLoading.set(false);
          }
        });
      } else {
        this.isLoading.set(false);
      }
    });
  }

  decreaseQty() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  increaseQty(stock: number) {
    if (this.quantity() < stock) {
      this.quantity.update(q => q + 1);
    }
  }

  addToCart(prod: Product) {
    this.cartService.addToCart(prod, this.quantity());
    alert(`${this.quantity()} x ${prod.name} added to cart!`);
    this.quantity.set(1);
  }

  getCategoryName(id: string): string {
    const maps: { [key: string]: string } = {
      'gourmet-food': 'Gourmet Food',
      'body-care': 'Body Care',
      'home-kitchen': 'Home & Kitchen',
      'wellness': 'Wellness & Teas'
    };
    return maps[id] || 'Product';
  }
}
