import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/types';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    DecimalPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="orders-page">
      <h1 class="page-title">Order History</h1>

      @if (isLoading()) {
        <div class="spinner-container">
          <mat-progress-spinner mode="indeterminate" diameter="60" color="primary"></mat-progress-spinner>
        </div>
      } @else {
        @if (orders().length > 0) {
          <div class="orders-list">
            @for (order of orders(); track order.id) {
              <mat-card class="order-card mat-elevation-z1">
                <mat-card-header class="order-card-header">
                  <div class="header-left">
                    <span class="order-id">Order #{{ order.id }}</span>
                    <span class="order-date">Placed on {{ order.createdAt | date:'mediumDate' }}</span>
                  </div>
                  <div class="header-right">
                    <span class="badge badge-status" [class]="order.status">
                      {{ order.status }}
                    </span>
                  </div>
                </mat-card-header>

                <mat-card-content class="order-card-content">
                  <!-- Product items list in order -->
                  <div class="order-items">
                    @for (item of order.items; track item.productId) {
                      <div class="order-item-row">
                        <img [src]="item.imageUrl" [alt]="item.name" class="item-thumb">
                        <div class="item-details">
                          <span class="item-name">{{ item.name }}</span>
                          <span class="item-qty-price">Qty: {{ item.quantity }} &#64; \${{ item.price | number:'1.2-2' }}</span>
                        </div>
                        <span class="item-subtotal">\${{ (item.price * item.quantity) | number:'1.2-2' }}</span>
                      </div>
                    }
                  </div>

                  <mat-divider class="divider"></mat-divider>

                  <div class="order-footer">
                    <div class="address-box">
                      <span class="section-title">Shipping Address:</span>
                      <p>{{ order.shippingAddress.fullName }}</p>
                      <p>{{ order.shippingAddress.addressLine1 }}, {{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} {{ order.shippingAddress.postalCode }}</p>
                    </div>
                    
                    <div class="price-box">
                      <span class="section-title">Order Total:</span>
                      <span class="total-price">\${{ order.total | number:'1.2-2' }}</span>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            }
          </div>
        } @else {
          <!-- Empty State -->
          <div class="empty-orders-panel mat-elevation-z1">
            <mat-icon class="text-olive">history</mat-icon>
            <h2>No Orders Yet</h2>
            <p>You haven't placed any orders with us yet. Start exploring our collections today!</p>
            <button mat-raised-button color="primary" routerLink="/products">Start Shopping</button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .orders-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .page-title {
      font-size: 32px;
      font-weight: 700;
      color: #1e2610;
    }

    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .order-card {
      border-radius: 16px;
      border: 1px solid rgba(85, 107, 47, 0.08);
      overflow: hidden;
    }

    .order-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background-color: #fcfcf9;
      border-bottom: 1px solid rgba(85, 107, 47, 0.08);

      .header-left {
        display: flex;
        flex-direction: column;
      }

      .order-id {
        font-family: 'Outfit', sans-serif;
        font-size: 16px;
        font-weight: 700;
        color: #556B2F;
      }

      .order-date {
        font-size: 12px;
        color: #777;
      }
    }

    .order-card-content {
      padding: 20px 24px;
    }

    .order-items {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 20px;
    }

    .order-item-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .item-thumb {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 6px;
      background-color: #f7f9f3;
      border: 1px solid rgba(85, 107, 47, 0.05);
    }

    .item-details {
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      .item-name {
        font-size: 15px;
        font-weight: 600;
        color: #1e2610;
      }

      .item-qty-price {
        font-size: 12px;
        color: #666;
      }
    }

    .item-subtotal {
      font-size: 15px;
      font-weight: 600;
      color: #1e2610;
    }

    .divider {
      margin: 16px 0;
    }

    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 32px;
      flex-wrap: wrap;
    }

    .section-title {
      font-family: 'Outfit', sans-serif;
      font-weight: 600;
      font-size: 13px;
      color: #708623;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
      display: block;
    }

    .address-box {
      flex: 1;
      min-width: 200px;
      p {
        font-size: 13px;
        color: #4a5435;
        line-height: 1.4;
      }
    }

    .price-box {
      text-align: right;
      
      .total-price {
        font-family: 'Outfit', sans-serif;
        font-size: 22px;
        font-weight: 700;
        color: #556B2F;
      }
    }

    // Empty state
    .empty-orders-panel {
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
      }
    }
  `]
})
export class OrderHistoryComponent implements OnInit {
  private orderService = inject(OrderService);
  
  readonly orders = signal<Order[]>([]);
  readonly isLoading = signal(true);

  ngOnInit() {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.isLoading.set(false);
      }
    });
  }
}
