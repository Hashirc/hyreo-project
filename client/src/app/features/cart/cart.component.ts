import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/types';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatDividerModule, MatCardModule],
  template: `
    <div class="cart-page">
      <h1 class="page-title">Shopping Cart</h1>

      @if (cartService.cartItems().length > 0) {
        <div class="cart-layout">
          <!-- Items List -->
          <div class="cart-items-panel">
            @for (item of cartService.cartItems(); track item.productId) {
              <div class="cart-item-row mat-elevation-z1">
                <img [src]="item.imageUrl" [alt]="item.name" class="item-img" [routerLink]="['/products', item.productId]">
                
                <div class="item-info" [routerLink]="['/products', item.productId]">
                  <h3 class="item-name">{{ item.name }}</h3>
                  <p class="item-price">\${{ item.price | number:'1.2-2' }} each</p>
                </div>
                
                <div class="item-quantity-controls">
                  <button mat-icon-button (click)="decreaseQty(item)" class="qty-btn" aria-label="Decrease quantity">
                    <mat-icon>remove</mat-icon>
                  </button>
                  <span class="qty-value">{{ item.quantity }}</span>
                  <button mat-icon-button (click)="increaseQty(item)" class="qty-btn" aria-label="Increase quantity">
                    <mat-icon>add</mat-icon>
                  </button>
                </div>
                
                <div class="item-total-price">
                  <span>\${{ (item.price * item.quantity) | number:'1.2-2' }}</span>
                </div>
                
                <button mat-icon-button color="warn" (click)="removeItem(item.productId)" class="remove-btn" aria-label="Remove item">
                  <mat-icon>delete_outline</mat-icon>
                </button>
              </div>
            }
          </div>

          <!-- Order Summary Card -->
          <mat-card class="cart-summary-card">
            <mat-card-header>
              <h2 class="summary-title">Order Summary</h2>
            </mat-card-header>
            
            <mat-card-content class="summary-content">
              <div class="summary-row">
                <span>Items Subtotal</span>
                <span>\${{ cartService.cartTotal() | number:'1.2-2' }}</span>
              </div>
              <div class="summary-row">
                <span>Shipping</span>
                <span class="free-shipping">FREE</span>
              </div>
              
              <mat-divider class="summary-divider"></mat-divider>
              
              <div class="summary-row total-row">
                <span>Estimated Total</span>
                <span>\${{ cartService.cartTotal() | number:'1.2-2' }}</span>
              </div>
              
              <button mat-raised-button color="primary" class="checkout-btn" routerLink="/checkout">
                Proceed To Checkout
              </button>
              
              <button mat-button class="continue-btn" routerLink="/products">
                <mat-icon>keyboard_backspace</mat-icon> Continue Shopping
              </button>
            </mat-card-content>
          </mat-card>
        </div>
      } @else {
        <!-- Empty Cart View -->
        <div class="empty-cart-panel mat-elevation-z1">
          <mat-icon class="text-olive">shopping_cart</mat-icon>
          <h2>Your Cart is Empty</h2>
          <p>Fill it with our premium, organic olive soaps, fine oils, or hand-carved tableware.</p>
          <button mat-raised-button color="primary" routerLink="/products">Start Shopping</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .cart-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .page-title {
      font-size: 32px;
      font-weight: 700;
      color: #1e2610;
    }

    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 32px;
      align-items: start;
    }

    // List Panel
    .cart-items-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .cart-item-row {
      display: flex;
      align-items: center;
      padding: 16px;
      background-color: #ffffff;
      border-radius: 12px;
      border: 1px solid rgba(85, 107, 47, 0.08);
      gap: 16px;
    }

    .item-img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 8px;
      cursor: pointer;
      background-color: #f7f9f3;
    }

    .item-info {
      flex: 1;
      cursor: pointer;

      .item-name {
        font-size: 16px;
        font-weight: 600;
        color: #1e2610;
        margin-bottom: 4px;
      }

      .item-price {
        font-size: 13px;
        color: #708623;
        font-weight: 500;
      }
    }

    .item-quantity-controls {
      display: flex;
      align-items: center;
      border: 1px solid rgba(85, 107, 47, 0.15);
      border-radius: 20px;
      background-color: #ffffff;
      padding: 2px;

      .qty-btn {
        width: 32px;
        height: 32px;
        line-height: 32px;
        color: #556B2F;
      }

      .qty-value {
        width: 24px;
        text-align: center;
        font-size: 14px;
        font-weight: 600;
      }
    }

    .item-total-price {
      width: 100px;
      text-align: right;
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: #556B2F;
    }

    .remove-btn {
      color: #c62828 !important;
    }

    // Summary Card
    .cart-summary-card {
      border-radius: 16px;
      border: 1px solid rgba(85, 107, 47, 0.08);
      padding: 16px;
    }

    .summary-title {
      font-size: 20px;
      font-weight: 700;
      color: #1e2610;
      margin-bottom: 8px;
    }

    .summary-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-top: 12px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      font-weight: 500;
      color: #4a5435;

      .free-shipping {
        color: #2e7d32;
        font-weight: 700;
      }
    }

    .summary-divider {
      margin: 4px 0;
    }

    .total-row {
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: #556B2F;
    }

    .checkout-btn {
      height: 48px !important;
      border-radius: 25px !important;
      margin-top: 8px;
    }

    .continue-btn {
      height: 40px !important;
      color: #556B2F !important;
      border-radius: 25px !important;

      mat-icon {
        margin-right: 4px;
      }
    }

    // Empty state
    .empty-cart-panel {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 64px 24px;
      background-color: #ffffff;
      border-radius: 12px;
      border: 1px solid rgba(85, 107, 47, 0.08);
      gap: 16px;

      mat-icon {
        font-size: 64px;
        height: 64px;
        width: 64px;
      }

      h2 {
        font-size: 24px;
        color: #1e2610;
        margin-bottom: 0;
      }

      p {
        font-size: 14px;
        color: #666;
        max-width: 400px;
      }

      button {
        border-radius: 20px;
        padding: 4px 24px;
      }
    }

    @media (max-width: 850px) {
      .cart-layout {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .cart-item-row {
        flex-wrap: wrap;
        
        .item-info {
          min-width: 200px;
        }

        .item-total-price {
          flex-grow: 1;
        }
      }
    }
  `]
})
export class CartComponent {
  cartService = inject(CartService);

  decreaseQty(item: CartItem) {
    this.cartService.updateQuantity(item.productId, item.quantity - 1);
  }

  increaseQty(item: CartItem) {
    this.cartService.updateQuantity(item.productId, item.quantity + 1);
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId);
  }
}
