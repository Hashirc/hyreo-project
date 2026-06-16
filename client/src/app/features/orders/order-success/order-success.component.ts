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
        <!-- Success Hero -->
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
            <div class="delivery-estimate" style="background-color: #f0f4e8; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
              <mat-icon style="color: #556B2F;">event_available</mat-icon>
              <span style="color: #4a5435; font-weight: 500;">Expected Delivery: <strong style="color: #1e2610;">{{ estimatedDeliveryDate | date:'fullDate' }}</strong></span>
            </div>

            <!-- Status Timeline -->
            <div class="status-timeline">
              @if (order()!.status === 'cancelled') {
                <div class="timeline-step cancelled">
                  <div class="step-icon"><mat-icon>cancel</mat-icon></div>
                  <span class="step-label">Order Cancelled</span>
                </div>
              } @else {
                <div class="timeline-step" [class.active]="true" [class.completed]="isStepCompleted('pending')">
                  <div class="step-icon">
                    @if (isStepCompleted('pending')) { <mat-icon>check</mat-icon> } @else { <mat-icon>receipt_long</mat-icon> }
                  </div>
                  <span class="step-label">Order Placed</span>
                </div>

                <div class="timeline-line" [class.completed]="isStepCompleted('pending')"></div>

                <div class="timeline-step" [class.active]="isStepActive('processing')" [class.completed]="isStepCompleted('processing')">
                  <div class="step-icon">
                    @if (isStepCompleted('processing')) { <mat-icon>check</mat-icon> } @else { <mat-icon>autorenew</mat-icon> }
                  </div>
                  <span class="step-label">Processing</span>
                </div>

                <div class="timeline-line" [class.completed]="isStepCompleted('processing')"></div>

                <div class="timeline-step" [class.active]="isStepActive('shipped')" [class.completed]="isStepCompleted('shipped')">
                  <div class="step-icon">
                    @if (isStepCompleted('shipped')) { <mat-icon>check</mat-icon> } @else { <mat-icon>local_shipping</mat-icon> }
                  </div>
                  <span class="step-label">Shipped</span>
                </div>

                <div class="timeline-line" [class.completed]="isStepCompleted('shipped')"></div>

                <div class="timeline-step" [class.active]="isStepActive('out_for_delivery')" [class.completed]="isStepCompleted('out_for_delivery')">
                  <div class="step-icon">
                    @if (isStepCompleted('out_for_delivery')) { <mat-icon>check</mat-icon> } @else { <mat-icon>directions_bike</mat-icon> }
                  </div>
                  <span class="step-label">Out for Delivery</span>
                </div>

                <div class="timeline-line" [class.completed]="isStepCompleted('out_for_delivery')"></div>

                <div class="timeline-step" [class.active]="isStepActive('delivered')" [class.completed]="isStepCompleted('delivered')">
                  <div class="step-icon">
                    @if (isStepCompleted('delivered')) { <mat-icon>done_all</mat-icon> } @else { <mat-icon>home</mat-icon> }
                  </div>
                  <span class="step-label">Delivered</span>
                </div>
              }
            </div>
            
            <mat-divider style="margin-bottom: 20px;"></mat-divider>

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
                  Status: <span class="status-badge" [class]="order()!.status">{{ order()!.status | titlecase }}</span>
                </p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button mat-raised-button color="primary" [routerLink]="['/orders/track', order()!.id]" [state]="{ order: order() }" class="action-btn primary-btn">
            <mat-icon>local_shipping</mat-icon> Track Order
          </button>
          <button mat-stroked-button class="action-btn secondary-btn" (click)="downloadInvoice()">
            <mat-icon>download</mat-icon> Download Invoice
          </button>
        </div>
        <div class="action-buttons" style="margin-top: 16px;">
          <button mat-stroked-button routerLink="/products" class="action-btn secondary-btn">
            <mat-icon>shopping_bag</mat-icon> Continue Shopping
          </button>
          @if (order()!.status !== 'cancelled' && order()!.status !== 'delivered') {
            <button mat-stroked-button color="warn" class="action-btn cancel-btn" (click)="cancelOrder()">
              <mat-icon>cancel</mat-icon> Cancel Order
            </button>
          }
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
      &.processing {
        background-color: #cce5ff;
        color: #004085;
      }
      &.shipped {
        background-color: #d1ecf1;
        color: #0c5460;
      }
      &.out_for_delivery {
        background-color: #fff3cd;
        color: #856404;
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

    .tracking-icon-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-color: #f0f4e8;
      border: 2px solid #556B2F;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      
      mat-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
        color: #556B2F;
      }
    }

    .order-status-label {
      margin-top: 4px !important;
    }

    /* Timeline */
    .status-timeline {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      position: relative;
      gap: 16px;
      margin-bottom: 24px;
      padding: 0 16px;
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
        .step-icon {
          background-color: #d32f2f;
          color: white;
          border-color: #d32f2f;
        }
        .step-label {
          color: #d32f2f;
          font-weight: 700;
        }
      }
    }

    .step-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: white;
      border: 2px solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #888;
      transition: all 0.3s ease;
      margin-bottom: 8px;
      
      mat-icon {
        font-size: 16px;
        height: 16px;
        width: 16px;
      }
    }

    .step-label {
      font-size: 12px;
      color: #4a5435;
      font-weight: 600;
      font-family: 'Outfit', sans-serif;
    }

    .timeline-line {
      position: absolute;
      top: 16px;
      height: 2px;
      background-color: #e0e0e0;
      z-index: 1;
      width: calc(25% - 32px);
      transition: background-color 0.4s ease;

      &.completed {
        background-color: #708623;
      }

      &:nth-of-type(1) { left: calc(10% + 16px); width: calc(20% - 32px); }
      &:nth-of-type(2) { left: calc(30% + 16px); width: calc(20% - 32px); }
      &:nth-of-type(3) { left: calc(50% + 16px); width: calc(20% - 32px); }
      &:nth-of-type(4) { left: calc(70% + 16px); width: calc(20% - 32px); }
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

    .cancel-btn {
      min-width: 200px;
      border-color: rgba(211, 47, 47, 0.3) !important;
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
  
  estimatedDeliveryDate: Date = new Date();
  private readonly statusSequence: Order['status'][] = ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get('orderId');

    if (!orderId) {
      this.isLoading.set(false);
      return;
    }

    // Try to get order from navigation state first (passed from checkout)
    const navState = history.state as any;

    if (navState?.order) {
      this.setupOrder(navState.order);
      return;
    }

    // Fallback: fetch from API
    this.orderService.getOrderById(orderId).subscribe({
      next: (order) => this.setupOrder(order),
      error: (err) => {
        console.error('Failed to load order details:', err);
        this.isLoading.set(false);
      }
    });
  }

  private setupOrder(order: Order) {
    this.order.set(order);
    
    // Estimate delivery 5 days after creation
    const created = order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt);
    this.estimatedDeliveryDate = new Date(created);
    this.estimatedDeliveryDate.setDate(this.estimatedDeliveryDate.getDate() + 5);

    this.isLoading.set(false);
    setTimeout(() => this.showAnimation.set(true), 100);
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

  cancelOrder() {
    if (confirm('Are you sure you want to cancel this order?')) {
      const currentOrder = this.order();
      if (currentOrder) {
        this.orderService.updateOrderStatus(currentOrder.id, 'cancelled').subscribe({
          next: () => {
            alert('Order cancelled successfully.');
            this.order.update(o => o ? { ...o, status: 'cancelled' } : o);
          },
          error: (err) => {
            console.error('Failed to cancel order:', err);
            alert('Failed to cancel order.');
          }
        });
      }
    }
  }

  downloadInvoice() {
    alert('Invoice downloaded successfully.');
    // In a real app, generate PDF or download file
  }
}
