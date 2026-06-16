import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { Product } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart.model';
import { handleImageFallback } from '../../core/utils/image-fallback';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatRippleModule],
  template: `
    <mat-card class="product-card" matRipple>
      <div class="product-image-container">
        <img [src]="product().imageUrl" [alt]="product().name" class="product-image"
             (error)="handleImageError($event)">
        <div class="rating-badge">
          <mat-icon>star</mat-icon>
          <span>{{ product().rating }}</span>
        </div>
      </div>

      <mat-card-content class="product-content">
        <h3 class="product-name">{{ product().name }}</h3>
        
        <p class="product-description">{{ product().description }}</p>

        <div class="product-meta">
          <span class="reviews">({{ product().reviews }} reviews)</span>
          @if (product().stock > 0) {
            <span class="in-stock">In Stock</span>
          } @else {
            <span class="out-of-stock">Out of Stock</span>
          }
        </div>

        <div class="product-footer">
          <div class="price-section">
            <span class="price">\${{ product().price }}</span>
          </div>

          <div class="button-group">
            <button 
              mat-raised-button 
              color="primary"
              routerLink="/products/{{ product().id }}"
              class="view-btn">
              View Details
            </button>
            <button 
              mat-icon-button 
              (click)="addToCart()"
              [disabled]="product().stock === 0"
              class="add-cart-btn"
              matTooltip="Add to Cart">
              <mat-icon>add_shopping_cart</mat-icon>
            </button>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .product-card {
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      height: 100%;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .product-card:hover {
      box-shadow: 0 8px 24px rgba(85, 107, 47, 0.2);
      transform: translateY(-8px);
    }

    .product-image-container {
      position: relative;
      width: 100%;
      height: 250px;
      overflow: hidden;
      background: #f5f5f5;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .product-card:hover .product-image {
      transform: scale(1.05);
    }

    .rating-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(85, 107, 47, 0.9);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: 600;
      font-size: 14px;
    }

    .product-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 16px;
    }

    .product-name {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0 0 10px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-description {
      font-size: 13px;
      color: #666;
      margin: 0 0 12px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex: 1;
    }

    .product-meta {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      margin-bottom: 12px;
    }

    .reviews {
      color: #999;
    }

    .in-stock {
      color: #4caf50;
      font-weight: 600;
    }

    .out-of-stock {
      color: #f44336;
      font-weight: 600;
    }

    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-top: auto;
    }

    .price-section {
      flex-shrink: 0;
    }

    .price {
      font-size: 22px;
      font-weight: 700;
      color: #556B2F;
    }

    .button-group {
      display: flex;
      gap: 8px;
      flex: 1;
    }

    .view-btn {
      flex: 1;
      background: #556B2F !important;
      color: white !important;
      border-radius: 6px;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .view-btn:hover {
      background: #3d4d1f !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(85, 107, 47, 0.3) !important;
    }

    .add-cart-btn {
      background: #556B2F !important;
      color: white !important;
      border-radius: 6px;
    }

    .add-cart-btn:hover:not(:disabled) {
      background: #3d4d1f !important;
    }

    .add-cart-btn:disabled {
      background: #ccc !important;
      color: #999 !important;
    }

    @media (max-width: 600px) {
      .product-image-container {
        height: 200px;
      }

      .product-name {
        font-size: 16px;
      }

      .price {
        font-size: 18px;
      }
    }
  `]
})
export class ProductCardComponent {
  product = input.required<Product>();

  constructor(private cartService: CartService) {}

  handleImageError(event: any): void {
    // Cast type to Product if models differ slightly
    handleImageFallback(event, this.product() as any);
  }

  addToCart(): void {
    const product = this.product();
    this.cartService.addToCart(product, 1);
  }
}
