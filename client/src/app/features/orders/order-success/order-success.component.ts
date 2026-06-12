import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/types';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    DecimalPipe,
    TitleCasePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="success-page">
      @if (isLoading()) {
        <div class="spinner-container">
          <mat-progress-spinner mode="indeterminate" diameter="60" color="primary"></mat-progress-spinner>
        </div>
      } @else if (order()) {
        <!-- Success Animation -->
        <div class="success-hero">
          <div class="checkmark-circle" [class.animate]="showAnimation()">
            <svg class="checkmark-svg" viewBox="0 0 52 52">
              <circle class="checkmark-circle-bg" cx="26" cy="26" r="25" fill="none"/>
              <path class="checkmark-path" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
          <h1 class="success-title">Order Placed Successfully!</h1>
          <p class="success-subtitle">Thank you for your purchase. Your order has been confirmed and is being processed.</p>
          <div class="order-id-badge">
            <mat-icon>confirmation_number</mat-icon>
            <span>Order #{{ order()!.id }}</span>
          </div>
        </div>

        <!-- Order Details Card -->
        <mat-card class="order-detail-card mat-elevation-z1">
          <mat-card-header class="detail-header">
            <h2 class="detail-title"><mat-icon>receipt_long</mat-icon> Order Summary</h2>
            <span class="order-date">{{ order()!.createdAt | date:'medium' }}</span>
          </mat-card-header>

          <mat-card-content class="detail-content">
            <!-- Items -->
            <div class="items-section">
              @for (item of order()!.items; track item.productId) {
                <div class="item-row">
                  <img [src]="item.imageUrl" [alt]="item.name" class="item-img">
                  <div class="item-info">
                    <span class="item-name">{{ item.name }}</span>
                    <span class="item-qty">Qty: {{ item.quantity }} × \${{ item.price | number:'1.2-2' }}</span>
                  </div>
                  <span class="item-total">\${{ (item.price * item.quantity) | number:'1.2-2' }}</span>
                </div>
              }
            </div>

            <mat-divider></mat-divider>

            <!-- Totals -->
            <div class="totals-section">
              <div class="total-row">
                <span>Subtotal</span>
                <span>\${{ order()!.total | number:'1.2-2' }}</span>
              </div>
              <div class="total-row">
                <span>Shipping</span>
                <span class="free-shipping">FREE</span>
              </div>
              <mat-divider></mat-divider>
              <div class="total-row grand-total">
                <span>Total Paid</span>
                <span>\${{ order()!.total | number:'1.2-2' }}</span>
              </div>
            </div>

            <mat-divider></mat-divider>

            <!-- Shipping & Payment -->
            <div class="info-grid">
              <div class="info-block">
                <h3><mat-icon>local_shipping</mat-icon> Shipping Address</h3>
                <p>{{ order()!.shippingAddress.fullName }}</p>
                <p>{{ order()!.shippingAddress.address }}</p>
                <p>{{ order()!.shippingAddress.city }}, {{ order()!.shippingAddress.postalCode }}</p>
                <p>{{ order()!.shippingAddress.country }}</p>
              </div>
              <div class="info-block">
                <h3><mat-icon>payment</mat-icon> Payment Details</h3>
                <p class="payment-status"><mat-icon>check_circle</mat-icon> Payment Confirmed</p>
                <p class="payment-ref">Ref: {{ order()!.paymentRef }}</p>
                <p class="order-status-label">
                  Status: <span class="status-badge pending">{{ order()!.status | titlecase }}</span>
                </p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button mat-raised-button color="primary" routerLink="/orders" class="action-btn primary-btn">
            <mat-icon>history</mat-icon> View All Orders
          </button>
          <button mat-stroked-button routerLink="/products" class="action-btn secondary-btn">
            <mat-icon>shopping_bag</mat-icon> Continue Shopping
          </button>
        </div>
      } @else {
        <div class="error-state">
          <mat-icon>error_outline</mat-icon>
          <h2>Order Not Found</h2>
          <p>We couldn't find the order details. It may have been processed already.</p>
          <button mat-raised-button color="primary" routerLink="/orders">View Your Orders</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .success-page {
      display: flex;
      flex-direction: column;
      gap: 32px;
      max-width: 720px;
      margin: 0 auto;
      padding: 24px 16px 48px;
    }

    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    /* ─── Hero Section ─── */
    .success-hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 48px 24px 24px;
      animation: fadeInUp 0.6s ease-out;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Checkmark animation */
    .checkmark-circle {
      width: 80px;
      height: 80px;
      margin-bottom: 24px;
    }

    .checkmark-svg {
      width: 80px;
      height: 80px;
    }

    .checkmark-circle-bg {
      stroke: #556B2F;
      stroke-width: 2;
      stroke-dasharray: 166;
      stroke-dashoffset: 166;
      stroke-miterlimit: 10;
      fill: none;
      animation: none;
    }

    .checkmark-path {
      stroke: #556B2F;
      stroke-width: 3;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 48;
      stroke-dashoffset: 48;
      animation: none;
    }

    .checkmark-circle.animate .checkmark-circle-bg {
      animation: strokeCircle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }

    .checkmark-circle.animate .checkmark-path {
      animation: strokeCheck 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
    }

    @keyframes strokeCircle {
      100% { stroke-dashoffset: 0; }
    }

    @keyframes strokeCheck {
      100% { stroke-dashoffset: 0; }
    }

    .success-title {
      font-family: 'Outfit', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: #1e2610;
      margin: 0 0 8px;
    }

    .success-subtitle {
      font-size: 15px;
      color: #666;
      max-width: 420px;
      margin: 0 0 20px;
      line-height: 1.5;
    }

    .order-id-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 20px;
      background: linear-gradient(135deg, #f0f4e8 0%, #e8f0d8 100%);
      border-radius: 25px;
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #556B2F;
      border: 1px solid rgba(85, 107, 47, 0.15);

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    /* ─── Order Detail Card ─── */
    .order-detail-card {
      border-radius: 16px;
      border: 1px solid rgba(85, 107, 47, 0.08);
      overflow: hidden;
      animation: fadeInUp 0.6s ease-out 0.2s both;
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background-color: #fcfcf9;
      border-bottom: 1px solid rgba(85, 107, 47, 0.08);
    }

    .detail-title {
      font-size: 18px;
      font-weight: 700;
      color: #1e2610;
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
    }

    .order-date {
      font-size: 12px;
      color: #777;
    }

    .detail-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* Items */
    .items-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .item-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .item-img {
      width: 52px;
      height: 52px;
      object-fit: cover;
      border-radius: 8px;
      background-color: #f7f9f3;
      border: 1px solid rgba(85, 107, 47, 0.05);
    }

    .item-info {
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      .item-name {
        font-size: 14px;
        font-weight: 600;
        color: #1e2610;
      }

      .item-qty {
        font-size: 12px;
        color: #777;
      }
    }

    .item-total {
      font-size: 14px;
      font-weight: 600;
      color: #1e2610;
    }

    /* Totals */
    .totals-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: #4a5435;
    }

    .free-shipping {
      color: #2e7d32;
      font-weight: 700;
    }

    .grand-total {
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: #556B2F;
      margin-top: 4px;
    }

    /* Info Grid */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .info-block {
      h3 {
        font-size: 13px;
        font-weight: 600;
        color: #708623;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin: 0 0 12px;
        display: flex;
        align-items: center;
        gap: 6px;

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }

      p {
        font-size: 13px;
        color: #4a5435;
        margin: 2px 0;
        line-height: 1.5;
      }
    }

    .payment-status {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #2e7d32 !important;
      font-weight: 500;

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        color: #2e7d32;
      }
    }

    .payment-ref {
      font-size: 12px !important;
      color: #999 !important;
      font-family: monospace;
    }

    .status-badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      &.pending {
        background-color: #fff3cd;
        color: #856404;
      }
    }

    .order-status-label {
      margin-top: 4px !important;
    }

    /* ─── Action Buttons ─── */
    .action-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
      animation: fadeInUp 0.6s ease-out 0.4s both;
    }

    .action-btn {
      border-radius: 25px !important;
      padding: 6px 28px !important;
      height: 44px !important;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .primary-btn {
      min-width: 200px;
    }

    .secondary-btn {
      min-width: 200px;
      border-color: rgba(85, 107, 47, 0.3) !important;
      color: #556B2F !important;
    }

    /* Error state */
    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 64px 24px;
      gap: 16px;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #ccc;
      }

      h2 {
        font-size: 24px;
        color: #1e2610;
        margin: 0;
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

    @media (max-width: 600px) {
      .info-grid {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        flex-direction: column;
        align-items: stretch;
      }

      .action-btn {
        justify-content: center;
      }
    }
  `]
})
export class OrderSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);

  readonly order = signal<Order | null>(null);
  readonly isLoading = signal(true);
  readonly showAnimation = signal(false);

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get('orderId');

    if (!orderId) {
      this.isLoading.set(false);
      return;
    }

    // Try to get order from navigation state first (passed from checkout)
    const navState = history.state as any;
    if (navState?.order) {
      this.order.set(navState.order);
      this.isLoading.set(false);
      setTimeout(() => this.showAnimation.set(true), 100);
      return;
    }

    // Fallback: fetch from API
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        const found = orders.find(o => o.id === orderId);
        if (found) {
          this.order.set(found);
        }
        this.isLoading.set(false);
        setTimeout(() => this.showAnimation.set(true), 100);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}
