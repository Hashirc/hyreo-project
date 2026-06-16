import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { ShippingAddress } from '../../core/models/types';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    DecimalPipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="checkout-page">
      <h1 class="page-title">Checkout</h1>

      @if (cartService.cartItems().length === 0 && !orderSuccess()) {
        <div class="empty-checkout">
          <mat-icon class="text-olive">shopping_cart</mat-icon>
          <h2>No Items to Checkout</h2>
          <p>Your cart is empty. Please add some products to your cart before checking out.</p>
          <button mat-raised-button color="primary" routerLink="/products">View Products</button>
        </div>
      } @else {
        <div class="checkout-layout">
          <!-- Forms Area -->
          <div class="forms-column">
            <form [formGroup]="checkoutForm" (ngSubmit)="onPlaceOrder()" class="checkout-form">
              <!-- Shipping Address -->
              <mat-card class="checkout-card">
                <mat-card-header>
                  <h2 class="card-title"><mat-icon class="text-olive">local_shipping</mat-icon> Shipping Address</h2>
                </mat-card-header>
                <mat-card-content class="shipping-form-content">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Full Name</mat-label>
                    <input matInput type="text" formControlName="fullName" placeholder="Enter your full name">
                    @if (checkoutForm.get('fullName')?.hasError('required') && checkoutForm.get('fullName')?.touched) {
                      <mat-error>Full name is required</mat-error>
                    }
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Email Address</mat-label>
                    <input matInput type="email" formControlName="email" placeholder="Enter your email">
                    @if (checkoutForm.get('email')?.hasError('required') && checkoutForm.get('email')?.touched) {
                      <mat-error>Email is required</mat-error>
                    }
                    @if (checkoutForm.get('email')?.hasError('email') && checkoutForm.get('email')?.touched) {
                      <mat-error>Please enter a valid email address</mat-error>
                    }
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Phone Number</mat-label>
                    <input matInput type="text" formControlName="phone" placeholder="Enter your phone number">
                    @if (checkoutForm.get('phone')?.hasError('required') && checkoutForm.get('phone')?.touched) {
                      <mat-error>Phone number is required</mat-error>
                    }
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Address</mat-label>
                    <input matInput type="text" formControlName="address" placeholder="Enter your address">
                    @if (checkoutForm.get('address')?.hasError('required') && checkoutForm.get('address')?.touched) {
                      <mat-error>Address is required</mat-error>
                    }
                  </mat-form-field>

                  <div class="form-row-grid">
                    <mat-form-field appearance="outline">
                      <mat-label>City</mat-label>
                      <input matInput type="text" formControlName="city" placeholder="Enter city">
                      @if (checkoutForm.get('city')?.hasError('required') && checkoutForm.get('city')?.touched) {
                        <mat-error>City is required</mat-error>
                      }
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Postal Code</mat-label>
                      <input matInput type="text" formControlName="postalCode" placeholder="Enter postal code">
                      @if (checkoutForm.get('postalCode')?.hasError('required') && checkoutForm.get('postalCode')?.touched) {
                        <mat-error>Postal code is required</mat-error>
                      }
                    </mat-form-field>
                  </div>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Country</mat-label>
                    <input matInput type="text" formControlName="country" placeholder="Enter country">
                    @if (checkoutForm.get('country')?.hasError('required') && checkoutForm.get('country')?.touched) {
                      <mat-error>Country is required</mat-error>
                    }
                  </mat-form-field>
                </mat-card-content>
              </mat-card>
            </form>
          </div>

          <!-- Order Summary column -->
          <div class="summary-column">
            <mat-card class="checkout-summary-card">
              <mat-card-header>
                <h2 class="card-title">Order Recap</h2>
              </mat-card-header>
              <mat-card-content class="summary-content">
                <!-- Items list -->
                <div class="summary-items">
                  @for (item of cartService.cartItems(); track item.productId) {
                    <div class="summary-item-row">
                      <span class="item-qty-name">{{ item.quantity }} x {{ item.name }}</span>
                      <span class="item-price">\${{ (item.price * item.quantity) | number:'1.2-2' }}</span>
                    </div>
                  }
                </div>

                <mat-divider></mat-divider>

                <!-- Coupon Section -->
                <div class="coupon-section" style="margin-top: 16px;">
                  <form [formGroup]="checkoutForm" style="display: block; width: 100%;">
                    <mat-form-field appearance="outline" style="width: 100%; margin-bottom: -16px;">
                      <mat-label>Discount Coupon</mat-label>
                      <input matInput type="text" formControlName="couponCode" placeholder="Enter code">
                      <button mat-icon-button matSuffix type="button" (click)="applyCoupon()" [disabled]="!checkoutForm.get('couponCode')?.value || isApplyingCoupon()">
                        @if (isApplyingCoupon()) {
                          <mat-spinner diameter="20"></mat-spinner>
                        } @else {
                          <mat-icon>local_offer</mat-icon>
                        }
                      </button>
                    </mat-form-field>
                  </form>
                  @if (appliedCoupon()) {
                    <p class="coupon-success" style="color: #2e7d32; font-size: 12px; font-weight: 500; margin-top: 4px;">
                      <mat-icon style="font-size: 14px; width: 14px; height: 14px; vertical-align: middle;">check_circle</mat-icon>
                      Code '{{ appliedCoupon()?.code }}' applied (-\${{ appliedCoupon()?.discountValue | number:'1.2-2' }})
                    </p>
                  }
                </div>

                <mat-divider style="margin-top: 8px;"></mat-divider>

                <!-- Subtotals -->
                <div class="summary-totals">
                  <div class="summary-row">
                    <span>Items Subtotal</span>
                    <span>\${{ cartService.cartTotal() | number:'1.2-2' }}</span>
                  </div>
                  @if (appliedCoupon()) {
                    <div class="summary-row" style="color: #2e7d32;">
                      <span>Discount</span>
                      <span>-\${{ appliedCoupon()?.discountValue | number:'1.2-2' }}</span>
                    </div>
                  }
                  <div class="summary-row">
                    <span>Shipping</span>
                    <span class="shipping-free">FREE</span>
                  </div>
                  <mat-divider class="inner-divider"></mat-divider>
                  <div class="summary-row total-row">
                    <span>Total Amount</span>
                    <span>\${{ finalTotal() | number:'1.2-2' }}</span>
                  </div>
                </div>

                <!-- Submit Button -->
                <button mat-raised-button color="primary" class="place-order-btn" 
                        [disabled]="checkoutForm.invalid || isLoading()" 
                        (click)="onPlaceOrder()">
                  @if (isLoading()) {
                    <mat-spinner diameter="24"></mat-spinner>
                  } @else {
                    <ng-container><mat-icon>done_all</mat-icon> Place Order (\${{ finalTotal() | number:'1.2-2' }})</ng-container>
                  }
                </button>
                
                <p class="demo-disclaimer">* This is a demonstration shop. No real charges are made.</p>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .checkout-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .page-title {
      font-size: 32px;
      font-weight: 700;
      color: #1e2610;
    }

    .checkout-layout {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 32px;
      align-items: start;
    }

    .forms-column {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .checkout-card {
      border-radius: 16px;
      border: 1px solid rgba(85, 107, 47, 0.08);
      background-color: var(--bg-card);
      padding: 16px;
    }

    .card-title {
      font-size: 20px;
      font-weight: 700;
      color: #1e2610;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .shipping-form-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-top: 12px;
    }

    .full-width {
      width: 100%;
    }

    .form-row-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    // Summary panel
    .checkout-summary-card {
      border-radius: 16px;
      border: 1px solid rgba(85, 107, 47, 0.08);
      background-color: var(--bg-card);
      padding: 16px;
      position: sticky;
      top: 24px;
    }

    .summary-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-top: 12px;
    }

    .summary-items {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 180px;
      overflow-y: auto;
    }

    .summary-item-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #4a5435;

      .item-qty-name {
        font-weight: 500;
        max-width: 250px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .item-price {
        font-weight: 600;
      }
    }

    .summary-totals {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      font-weight: 500;
      color: #4a5435;

      .shipping-free {
        color: #2e7d32;
        font-weight: 700;
      }
    }

    .inner-divider {
      margin: 4px 0;
    }

    .total-row {
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: #556B2F;
    }

    .place-order-btn {
      height: 48px !important;
      border-radius: 25px !important;
      margin-top: 8px;

      mat-spinner {
        margin: 0 auto;
      }

      mat-icon {
        margin-right: 4px;
      }
    }

    .demo-disclaimer {
      font-size: 11px;
      color: #777;
      text-align: center;
      margin-top: 4px;
    }

    // Empty state
    .empty-checkout {
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
      .checkout-layout {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  cartService = inject(CartService);
  private orderService = inject(OrderService);

  readonly isLoading = signal(false);
  readonly orderSuccess = signal(false);
  readonly isApplyingCoupon = signal(false);
  readonly appliedCoupon = signal<any | null>(null);

  finalTotal() {
    const sub = this.cartService.cartTotal();
    const discount = this.appliedCoupon()?.discountValue || 0;
    return Math.max(0, sub - discount);
  }

  checkoutForm: FormGroup = this.fb.group({
    // Address
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', Validators.required],
    country: ['', Validators.required],
    couponCode: ['']
  });

  applyCoupon() {
    const code = this.checkoutForm.get('couponCode')?.value;
    if (!code) return;
    
    this.isApplyingCoupon.set(true);
    // Mock Validation for now
    setTimeout(() => {
      if (code.toUpperCase() === 'WELCOME10') {
        this.appliedCoupon.set({ code: 'WELCOME10', discountValue: 10 });
      } else {
        alert('Invalid or expired coupon code');
        this.appliedCoupon.set(null);
      }
      this.isApplyingCoupon.set(false);
    }, 800);
  }

  onPlaceOrder() {
    if (this.checkoutForm.invalid) {
      // Mark all as touched to trigger validation messages
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const shippingAddress: ShippingAddress = {
      fullName: this.checkoutForm.value.fullName,
      email: this.checkoutForm.value.email,
      phone: this.checkoutForm.value.phone,
      address: this.checkoutForm.value.address,
      city: this.checkoutForm.value.city,
      postalCode: this.checkoutForm.value.postalCode,
      country: this.checkoutForm.value.country
    };

    const orderData = {
      items: this.cartService.cartItems(),
      total: this.finalTotal(),
      shippingAddress,
      paymentRef: 'pay_mock_' + Math.random().toString(36).substr(2, 9),
      couponCode: this.appliedCoupon()?.code || null
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (res) => {
        this.orderSuccess.set(true);
        this.cartService.clearCart();
        this.isLoading.set(false);
        // Navigate to order success page with the order data
        const createdOrder = res.order;
        this.router.navigate(['/orders/success', createdOrder?.id || 'latest'], {
          state: { order: createdOrder, isNewOrder: true }
        });
      },
      error: (err) => {
        console.error('Checkout failed (detailed):', err);
        if (err && err.error) {
          console.error('Checkout error payload:', err.error);
        }
        alert('There was an error placing your order. Please try again.');
        this.isLoading.set(false);
      }
    });
  }
}
