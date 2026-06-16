import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../../core/models/types';
import { CartService } from '../../../core/services/cart.service';
import { handleImageFallback } from '../../../core/utils/image-fallback';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <div class="product-card">
      <!-- Image Upper Half -->
      <div class="image-wrapper" [routerLink]="['/products', product().id]">
        <img [src]="product().imageUrl" [alt]="product().name" class="product-img"
             (error)="handleImageError($event)">
        
        @if (product().stock <= 0) {
          <div class="out-of-stock-badge">OUT OF STOCK</div>
        }

        <!-- Floating Cart Action -->
        <button class="cart-floating-btn" 
                [disabled]="product().stock <= 0" 
                (click)="addToCart($event)" 
                aria-label="Add to cart">
          <mat-icon>shopping_bag</mat-icon>
        </button>
      </div>
      
      <!-- Info Lower Half -->
      <div class="info-area" [routerLink]="['/products', product().id]">
        <span class="category-lbl">{{ getCategoryName(product().categoryId) }}</span>
        <h3 class="product-title">{{ product().name }}</h3>
        <p class="product-sub">{{ getTruncatedDescription(product().description) }}</p>
        
        <div class="price-row">
          <span class="current-price">\${{ product().price | number:'1.2-2' }}</span>
          <span class="original-price">\${{ getOriginalPrice(product().price) | number:'1.2-2' }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      display: flex;
      flex-direction: column;
      background-color: var(--bg-card);
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(45, 58, 27, 0.05);
      transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease;
      box-shadow: 0 4px 12px rgba(45, 58, 27, 0.02);
      cursor: pointer;
      height: 100%;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 24px rgba(45, 58, 27, 0.06);
      }
    }

    .image-wrapper {
      position: relative;
      height: 240px;
      background-color: #F2F5EA;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      overflow: hidden;
    }

    .product-img {
      max-width: 90%;
      max-height: 90%;
      width: auto;
      height: auto;
      object-fit: contain;
      transition: transform 0.4s ease;
    }

    .product-card:hover .product-img {
      transform: scale(1.03);
    }

    .cart-floating-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: #F2F5EA;
      border: none;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #2D3A1B;
      cursor: pointer;
      transition: all 0.2s ease;
      z-index: 10;

      &:hover {
        background-color: #2D3A1B;
        color: #ffffff;
        transform: scale(1.05);
      }

      &[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
        
        &:hover {
          background-color: #ffffff;
          color: #2D3A1B;
          transform: none;
        }
      }

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    .out-of-stock-badge {
      position: absolute;
      top: 16px;
      left: 16px;
      background-color: #c62828;
      color: #ffffff;
      font-size: 9px;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 4px;
      letter-spacing: 0.5px;
      z-index: 10;
    }

    .info-area {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex-grow: 1;
      justify-content: flex-start;
    }

    .category-lbl {
      font-size: 11px;
      font-weight: 700;
      color: #5A664A;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .product-title {
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 16px;
      color: #2D3A1B;
      margin: 0;
      line-height: 1.35;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      height: 42px;
    }

    .product-sub {
      font-size: 13px;
      color: #5A664A;
      line-height: 1.4;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      height: 36px;
    }

    .price-row {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-top: auto;
      padding-top: 8px;
    }

    .current-price {
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
      font-weight: 800;
      color: #2D3A1B;
    }

    .original-price {
      font-size: 13px;
      font-weight: 500;
      color: #a0a0a0;
      text-decoration: line-through;
    }
  `]
})
export class ProductCardComponent {
  product = input.required<Product>();
  cartService = inject(CartService);

  addToCart(event: Event) {
    event.stopPropagation();
    this.cartService.addToCart(this.product());
    alert(`${this.product().name} added to cart!`);
  }

  handleImageError(event: any) {
    handleImageFallback(event, this.product());
  }

  getOriginalPrice(price: number): number {
    return parseFloat((price * 1.33).toFixed(2));
  }

  getTruncatedDescription(desc?: string): string {
    if (!desc) return '';
    return desc.length > 55 ? desc.substring(0, 52) + '...' : desc;
  }

  getCategoryName(id: string): string {
    const maps: { [key: string]: string } = {
      'gourmet-food': 'Gourmet Food',
      'body-care': 'Body Care',
      'home-kitchen': 'Home & Kitchen',
      'wellness': 'Wellness & Teas',
      'mobile-computers': 'Mobile & Computers',
      'household-appliances': 'Household Appliances',
      'mens-fashion': "Men's Fashion",
      'womens-fashion': "Women's Fashion",
      'sports-fitness': 'Sports & Fitness',
      'books': 'Books'
    };
    return maps[id] || 'Product';
  }
}
