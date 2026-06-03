import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../../core/models/types';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card class="product-card hover-lift">
      <div class="image-container" [routerLink]="['/products', product().id]">
        <img mat-card-image [src]="product().imageUrl" [alt]="product().name" class="product-img">
        @if (product().stock <= 0) {
          <div class="out-of-stock-overlay">Out of Stock</div>
        }
      </div>
      
      <mat-card-content class="card-content" [routerLink]="['/products', product().id]">
        <p class="category-name">{{ getCategoryName(product().categoryId) }}</p>
        <h3 class="product-title">{{ product().name }}</h3>
        
        <div class="rating-price-row">
          <span class="rating">
            <mat-icon>star</mat-icon> {{ product().rating | number:'1.1-1' }}
          </span>
          <span class="price">\${{ product().price | number:'1.2-2' }}</span>
        </div>
      </mat-card-content>
      
      <mat-card-actions class="card-actions">
        <button mat-button class="view-details-btn" [routerLink]="['/products', product().id]">
          View Details
        </button>
        <button mat-raised-button color="primary" class="add-to-cart-btn" 
                [disabled]="product().stock <= 0"
                (click)="addToCart($event)">
          <mat-icon>shopping_cart</mat-icon> Add
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .product-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid rgba(85, 107, 47, 0.08);
      overflow: hidden;
    }

    .image-container {
      position: relative;
      width: 100%;
      height: 200px;
      overflow: hidden;
      cursor: pointer;
      background-color: #f7f9f3;
    }

    .product-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;

      &:hover {
        transform: scale(1.05);
      }
    }

    .out-of-stock-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 16px;
    }

    .card-content {
      padding: 16px;
      flex-grow: 1;
      cursor: pointer;
    }

    .category-name {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #708623;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .product-title {
      font-size: 16px;
      font-weight: 600;
      color: #1e2610;
      margin-bottom: 12px;
      line-height: 1.3;
      height: 42px; // limit to 2 lines
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .rating-price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .rating {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        font-size: 12px;
        font-weight: 600;
        color: #708623;

        mat-icon {
          font-size: 16px;
          height: 16px;
          width: 16px;
          color: #ffb300;
        }
      }

      .price {
        font-family: 'Outfit', sans-serif;
        font-size: 18px;
        font-weight: 700;
        color: #556B2F;
      }
    }

    .card-actions {
      padding: 8px 16px 16px;
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }

    .view-details-btn {
      flex: 1;
      font-size: 12px !important;
      color: #556B2F !important;
      border-radius: 8px !important;
      
      &:hover {
        background-color: rgba(85, 107, 47, 0.05);
      }
    }

    .add-to-cart-btn {
      flex: 1;
      font-size: 12px !important;
      border-radius: 8px !important;
      
      mat-icon {
        font-size: 16px;
        height: 16px;
        width: 16px;
        margin-right: 4px;
      }
    }
  `]
})
export class ProductCardComponent {
  product = input.required<Product>();
  cartService = inject(CartService);

  addToCart(event: Event) {
    event.stopPropagation();
    this.cartService.addToCart(this.product());
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
