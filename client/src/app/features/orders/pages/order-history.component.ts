import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule
  ],
  template: `
    <div class="orders-container">
      <div class="orders-header">
        <h1>My Orders</h1>
        <p>Track and manage all your orders</p>
      </div>

      <div class="orders-list">
        @if (orders().length > 0) {
          @for (order of orders(); track order.id) {
            <mat-card class="order-card">
              <div class="order-header">
                <div class="order-info">
                  <h3>Order #{{ order.id.substring(0, 8) }}</h3>
                  <p class="order-date">{{ formatDate(order.createdAt) }}</p>
                </div>
                <mat-chip [class]="'status-' + order.status">
                  {{ formatStatus(order.status) }}
                </mat-chip>
              </div>

              <mat-divider></mat-divider>

              <div class="order-items">
                <h4>Items Ordered</h4>
                @for (item of order.items; track item.productId) {
                  <div class="order-item">
                    <img [src]="item.imageUrl" [alt]="item.name" class="item-image">
                    <div class="item-info">
                      <h5>{{ item.name }}</h5>
                      <p>Qty: {{ item.quantity }} × \${{ item.price }}</p>
                    </div>
                    <div class="item-total">
                      \${{ (item.price * item.quantity).toFixed(2) }}
                    </div>
                  </div>
                }
              </div>

              <mat-divider></mat-divider>

              <div class="order-summary">
                <div class="summary-row">
                  <span>Subtotal</span>
                  <span>\${{ (order.total * 0.909).toFixed(2) }}</span>
                </div>
                <div class="summary-row">
                  <span>Tax</span>
                  <span>\${{ (order.total * 0.091).toFixed(2) }}</span>
                </div>
                <div class="summary-row total">
                  <span>Order Total</span>
                  <span>\${{ order.total.toFixed(2) }}</span>
                </div>
              </div>

              <mat-divider></mat-divider>

              <div class="order-shipping">
                <h4>Shipping Address</h4>
                <p>{{ order.shippingAddress.fullName }}</p>
                <p>{{ order.shippingAddress.address }}</p>
                <p>{{ order.shippingAddress.city }}, {{ order.shippingAddress.postalCode }}</p>
                <p>{{ order.shippingAddress.country }}</p>
              </div>

              <div class="order-actions">
                <button mat-raised-button color="primary">Track Order</button>
                <button mat-stroked-button>View Details</button>
              </div>
            </mat-card>
          }
        } @else {
          <div class="no-orders">
            <mat-icon>shopping_cart</mat-icon>
            <h3>No Orders Yet</h3>
            <p>You haven't placed any orders yet. Start shopping to create your first order!</p>
            <button mat-raised-button color="primary" routerLink="/products">
              Continue Shopping
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .orders-container {
      min-height: calc(100vh - 300px);
      max-width: 1000px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .orders-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .orders-header h1 {
      color: #556B2F;
      font-size: 32px;
      margin: 0 0 10px 0;
      font-weight: 700;
    }

    .orders-header p {
      color: #999;
      margin: 0;
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .order-card {
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .order-info h3 {
      margin: 0 0 4px 0;
      color: #333;
      font-size: 18px;
    }

    .order-date {
      margin: 0;
      color: #999;
      font-size: 13px;
    }

    mat-chip {
      padding: 4px 12px !important;
      font-size: 12px !important;
      font-weight: 600 !important;
    }

    .status-pending {
      background: #fff3cd !important;
      color: #856404 !important;
    }

    .status-paid {
      background: #d4edda !important;
      color: #155724 !important;
    }

    .status-shipped {
      background: #d1ecf1 !important;
      color: #0c5460 !important;
    }

    .status-delivered {
      background: #d4edda !important;
      color: #155724 !important;
    }

    .status-cancelled {
      background: #f8d7da !important;
      color: #721c24 !important;
    }

    .order-items {
      margin: 16px 0;
    }

    .order-items h4 {
      margin: 0 0 12px 0;
      color: #333;
      font-size: 14px;
      font-weight: 600;
    }

    .order-item {
      display: flex;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #eee;
    }

    .item-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 6px;
    }

    .item-info {
      flex: 1;
    }

    .item-info h5 {
      margin: 0 0 4px 0;
      font-size: 14px;
      font-weight: 600;
    }

    .item-info p {
      margin: 0;
      font-size: 13px;
      color: #666;
    }

    .item-total {
      font-weight: 600;
      color: #556B2F;
      min-width: 80px;
      text-align: right;
    }

    .order-summary {
      margin: 16px 0;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
      color: #666;
    }

    .summary-row.total {
      font-size: 16px;
      font-weight: 700;
      color: #556B2F;
      margin-top: 8px;
    }

    .order-shipping {
      margin: 16px 0;
    }

    .order-shipping h4 {
      margin: 0 0 12px 0;
      color: #333;
      font-size: 14px;
      font-weight: 600;
    }

    .order-shipping p {
      margin: 4px 0;
      font-size: 14px;
      color: #666;
    }

    .order-actions {
      display: flex;
      gap: 12px;
      margin-top: 16px;
    }

    .order-actions button {
      flex: 1;
    }

    .no-orders {
      text-align: center;
      padding: 60px 20px;
      color: #999;
    }

    .no-orders mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ddd;
      margin: 0 auto 20px;
    }

    .no-orders h3 {
      font-size: 24px;
      margin: 0 0 10px 0;
      color: #333;
    }

    .no-orders p {
      margin: 0 0 20px 0;
    }

    @media (max-width: 600px) {
      .order-header {
        flex-direction: column;
        gap: 12px;
      }

      .order-item {
        flex-direction: column;
      }

      .item-total {
        text-align: left;
      }

      .order-actions {
        flex-direction: column;
      }
    }
  `],
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule, MatChipsModule]
})
export class OrderHistoryComponent implements OnInit {
  orders = signal<Order[]>([]);

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.orderService.getOrders(user.uid).subscribe({
        next: (response) => {
          this.orders.set(response.orders);
        },
        error: (error) => {
          console.error('Failed to load orders:', error);
        }
      });
    }
  }

  formatDate(date: any): string {
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  }

  formatStatus(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
}
