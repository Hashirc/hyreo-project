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
  selector: 'app-order-tracking',
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
    <div class="tracking-page">
      @if (isLoading()) {
        <div class="spinner-container">
          <mat-progress-spinner mode="indeterminate" diameter="60" color="primary"></mat-progress-spinner>
        </div>
      } @else if (order()) {
        <!-- Tracking Header -->
        <div class="tracking-header-section">
          <div class="tracking-icon-circle">
            <mat-icon class="text-olive">local_shipping</mat-icon>
          </div>
          <h1 class="tracking-title">Order Tracking</h1>
          <p class="tracking-subtitle">Real-time status updates for your purchase.</p>
          <div class="order-id-badge">
            <mat-icon>confirmation_number</mat-icon>
            <span>Order #{{ order()!.id }}</span>
          </div>
        </div>

        <!-- Status Timeline Card -->
        <mat-card class="status-card mat-elevation-z1">
          <mat-card-header class="status-card-header">
            <h2 class="status-card-title"><mat-icon>timeline</mat-icon> Shipment Status</h2>
            <span class="status-badge" [class]="order()!.status">{{ order()!.status | titlecase }}</span>
          </mat-card-header>
          <mat-card-content class="status-card-content">
            <div class="status-timeline">
              @if (order()!.status === 'cancelled') {
                <div class="timeline-step cancelled">
                  <div class="step-icon"><mat-icon>cancel</mat-icon></div>
                  <span class="step-label">Order Cancelled</span>
                  <span class="step-desc">Your order has been cancelled. Please contact support for assistance.</span>
                </div>
              } @else {
                <!-- Pending -->
                <div class="timeline-step" [class.active]="true" [class.completed]="isStepCompleted('pending')">
                  <div class="step-icon">
                    @if (isStepCompleted('pending')) {
                      <mat-icon>check</mat-icon>
                    } @else {
                      <mat-icon>receipt_long</mat-icon>
                    }
                  </div>
                  <span class="step-label">Order Placed</span>
                  <span class="step-desc">We have received your order request.</span>
                </div>

                <div class="timeline-line" [class.completed]="isStepCompleted('pending')"></div>

                <!-- Processing -->
                <div class="timeline-step" [class.active]="isStepActive('processing')" [class.completed]="isStepCompleted('processing')">
                  <div class="step-icon">
                    @if (isStepCompleted('processing')) {
                      <mat-icon>check</mat-icon>
                    } @else {
                      <mat-icon>autorenew</mat-icon>
                    }
                  </div>
                  <span class="step-label">Processing</span>
                  <span class="step-desc">Your order is being picked and packed.</span>
                </div>

                <div class="timeline-line" [class.completed]="isStepCompleted('processing')"></div>

                <!-- Shipped -->
                <div class="timeline-step" [class.active]="isStepActive('shipped')" [class.completed]="isStepCompleted('shipped')">
                  <div class="step-icon">
                    @if (isStepCompleted('shipped')) {
                      <mat-icon>check</mat-icon>
                    } @else {
                      <mat-icon>local_shipping</mat-icon>
                    }
                  </div>
                  <span class="step-label">Shipped</span>
                  <span class="step-desc">Your package is on its way.</span>
                </div>

                <div class="timeline-line" [class.completed]="isStepCompleted('shipped')"></div>

                <!-- Delivered -->
                <div class="timeline-step" [class.active]="isStepActive('delivered')" [class.completed]="isStepCompleted('delivered')">
                  <div class="step-icon">
                    @if (isStepCompleted('delivered')) {
                      <mat-icon>done_all</mat-icon>
                    } @else {
                      <mat-icon>home</mat-icon>
                    }
                  </div>
                  <span class="step-label">Delivered</span>
                  <span class="step-desc">Successfully delivered to shipping address.</span>
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Order Summary Card -->
        <mat-card class="order-detail-card mat-elevation-z1">
          <mat-card-header class="detail-header">
            <h2 class="detail-title"><mat-icon>receipt_long</mat-icon> Order Details</h2>
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
                <span>Total</span>
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
                <h3><mat-icon>payment</mat-icon> Payment Status</h3>
                <p class="payment-status"><mat-icon>check_circle</mat-icon> Paid</p>
                <p class="payment-ref">Reference: {{ order()!.paymentRef }}</p>
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
    .tracking-page {
      display: flex;
      flex-direction: column;
      gap: 32px;
      max-width: 800px;
      margin: 0 auto;
      padding: 24px 16px 48px;
    }

    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    /* ─── Tracking Header ─── */
    .tracking-header-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 24px 24px 0;
      animation: fadeInUp 0.6s ease-out;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .tracking-icon-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-color: #f0f4e8;
      border: 2px solid #556B2F;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      
      mat-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
        color: #556B2F;
      }
    }

    .tracking-title {
      font-family: 'Outfit', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: #1e2610;
      margin: 0 0 8px;
    }

    .tracking-subtitle {
      font-size: 15px;
      color: #666;
      max-width: 420px;
      margin: 0 0 16px;
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

    /* ─── Status Timeline Card ─── */
    .status-card {
      border-radius: 16px;
      border: 1px solid rgba(85, 107, 47, 0.08);
      overflow: hidden;
      animation: fadeInUp 0.6s ease-out 0.1s both;
    }

    .status-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background-color: #fcfcf9;
      border-bottom: 1px solid rgba(85, 107, 47, 0.08);
    }

    .status-card-title {
      font-size: 18px;
      font-weight: 700;
      color: #1e2610;
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      &.pending {
        background-color: #fff3cd;
        color: #856404;
      }
      &.processing {
        background-color: #cce5ff;
        color: #004085;
      }
      &.shipped {
        background-color: #d1ecf1;
        color: #0c5460;
      }
      &.delivered {
        background-color: #d4edda;
        color: #155724;
      }
      &.cancelled {
        background-color: #f8d7da;
        color: #721c24;
      }
    }

    .status-card-content {
      padding: 32px 24px;
    }

    .status-timeline {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      position: relative;
      gap: 16px;
    }

    .timeline-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      flex: 1;
      position: relative;
      z-index: 2;
      opacity: 0.35;
      transition: all 0.4s ease;

      &.active {
        opacity: 1;
        .step-icon {
          background-color: #556B2F;
          color: white;
          border-color: #556B2F;
          box-shadow: 0 0 0 4px rgba(85, 107, 47, 0.2);
          transform: scale(1.1);
        }
        .step-label {
          color: #1e2610;
          font-weight: 700;
        }
      }

      &.completed {
        opacity: 1;
        .step-icon {
          background-color: #708623;
          color: white;
          border-color: #708623;
        }
        .step-label {
          color: #1e2610;
        }
      }

      &.cancelled {
        opacity: 1;
        margin: 0 auto;
        max-width: 400px;
        .step-icon {
          background-color: #d32f2f;
          color: white;
          border-color: #d32f2f;
        }
        .step-label {
          color: #d32f2f;
          font-weight: 700;
        }
        .step-desc {
          margin-top: 8px;
          color: #d32f2f;
        }
      }
    }

    .step-icon {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background-color: white;
      border: 2px solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #888;
      transition: all 0.3s ease;
      margin-bottom: 12px;
      
      mat-icon {
        font-size: 20px;
        height: 20px;
        width: 20px;
      }
    }

    .step-label {
      font-size: 14px;
      color: #4a5435;
      font-weight: 600;
      font-family: 'Outfit', sans-serif;
      margin-bottom: 4px;
    }

    .step-desc {
      font-size: 11px;
      color: #777;
      line-height: 1.4;
      padding: 0 8px;
    }

    .timeline-line {
      position: absolute;
      top: 21px; // Center horizontally with the 42px icons
      height: 2px;
      background-color: #e0e0e0;
      z-index: 1;
      width: calc(25% - 42px);
      transition: background-color 0.4s ease;

      &.completed {
        background-color: #708623;
      }

      &:nth-of-type(1) { left: calc(12.5% + 21px); width: calc(25% - 42px); }
      &:nth-of-type(2) { left: calc(37.5% + 21px); width: calc(25% - 42px); }
      &:nth-of-type(3) { left: calc(62.5% + 21px); width: calc(25% - 42px); }
    }

    /* ─── Order Details Card ─── */
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
      .status-timeline {
        flex-direction: column;
        align-items: flex-start;
        gap: 24px;
        padding-left: 20px;
      }

      .timeline-line {
        display: none; /* Hide line in vertical layout */
      }

      .timeline-step {
        flex-direction: row;
        text-align: left;
        align-items: center;
        gap: 16px;
      }

      .step-icon {
        margin-bottom: 0;
      }

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
export class OrderTrackingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  readonly order = signal<Order | null>(null);
  readonly isLoading = signal(true);

  private readonly statusSequence: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered'];

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get('orderId');

    if (!orderId) {
      this.isLoading.set(false);
      return;
    }

    // Try to get order from navigation state first (passed from success page if clicked immediately)
    const navState = history.state as any;
    if (navState?.order) {
      this.order.set(navState.order);
      this.isLoading.set(false);
      return;
    }

    // Fallback: fetch from API
    this.orderService.getOrderById(orderId).subscribe({
      next: (order) => {
        this.order.set(order);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load tracking details:', err);
        this.isLoading.set(false);
      }
    });
  }

  isStepActive(step: Order['status']): boolean {
    const currentStatus = this.order()?.status;
    if (!currentStatus) return false;
    return currentStatus === step;
  }

  isStepCompleted(step: Order['status']): boolean {
    const currentStatus = this.order()?.status;
    if (!currentStatus || currentStatus === 'cancelled') return false;

    const currentIndex = this.statusSequence.indexOf(currentStatus);
    const stepIndex = this.statusSequence.indexOf(step);

    return stepIndex < currentIndex;
  }
}
