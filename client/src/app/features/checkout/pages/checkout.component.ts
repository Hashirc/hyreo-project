import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { Order, ShippingAddress } from '../../../core/models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule
  ],
  template: `
    <div class="checkout-container">
      <div class="checkout-content">
        <h1>Checkout</h1>

        <div class="checkout-grid">
          <div class="checkout-form-section">
            <mat-card class="checkout-section">
              <h2>Shipping Address</h2>
              <form [formGroup]="shippingForm" class="form-group">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Full Name</mat-label>
                  <input matInput formControlName="fullName" placeholder="Enter your full name">
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Email</mat-label>
                  <input matInput formControlName="email" type="email" placeholder="Enter your email">
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Phone Number</mat-label>
                  <input matInput formControlName="phone" placeholder="Enter your phone number">
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Address</mat-label>
                  <input matInput formControlName="address" placeholder="Enter your address">
                </mat-form-field>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>City</mat-label>
                    <input matInput formControlName="city" placeholder="Enter your city">
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Postal Code</mat-label>
                    <input matInput formControlName="postalCode" placeholder="Enter postal code">
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Country</mat-label>
                  <input matInput formControlName="country" placeholder="Enter your country">
                </mat-form-field>
              </form>
            </mat-card>

            <mat-card class="checkout-section">
              <h2>Payment Method</h2>
              <div class="payment-methods">
                <button 
                  (click)="selectPaymentMethod('card')"
                  [class.active]="selectedPaymentMethod() === 'card'"
                  class="payment-option">
                  💳 Credit Card
                </button>
                <button 
                  (click)="selectPaymentMethod('paypal')"
                  [class.active]="selectedPaymentMethod() === 'paypal'"
                  class="payment-option">
                  🅿️ PayPal
                </button>
                <button 
                  (click)="selectPaymentMethod('cod')"
                  [class.active]="selectedPaymentMethod() === 'cod'"
                  class="payment-option">
                  📦 Cash on Delivery
                </button>
              </div>
            </mat-card>
          </div>

          <div class="order-summary-section">
            <mat-card class="order-summary">
              <h2>Order Summary</h2>

              <div class="summary-items">
                @for (item of cartService.items(); track item.productId) {
                  <div class="summary-item">
                    <div class="item-details">
                      <h4>{{ item.name }}</h4>
                      <p>Qty: {{ item.quantity }}</p>
                    </div>
                    <div class="item-price">
                      \${{ (item.price * item.quantity).toFixed(2) }}
                    </div>
                  </div>
                }
              </div>

              <mat-divider></mat-divider>

              <div class="summary-totals">
                <div class="summary-row">
                  <span>Subtotal</span>
                  <span>\${{ cartService.subtotal().toFixed(2) }}</span>
                </div>
                <div class="summary-row">
                  <span>Tax (10%)</span>
                  <span>\${{ cartService.tax().toFixed(2) }}</span>
                </div>
                <div class="summary-row shipping">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>

              <mat-divider></mat-divider>

              <div class="summary-row total">
                <span>Total</span>
                <span>\${{ cartService.total().toFixed(2) }}</span>
              </div>

              <button 
                mat-raised-button 
                color="primary"
                (click)="placeOrder()"
                [disabled]="loading() || !isFormValid()"
                class="checkout-btn">
                @if (loading()) {
                  <span>Processing...</span>
                } @else {
                  <span>Place Order</span>
                }
              </button>

              <button 
                mat-stroked-button 
                (click)="continueShopping()"
                class="continue-btn">
                Continue Shopping
              </button>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-container {
      min-height: calc(100vh - 300px);
      background: #f5f5f5;
      padding: 40px 20px;
    }

    .checkout-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .checkout-content h1 {
      color: #556B2F;
      font-size: 32px;
      margin: 0 0 40px 0;
      font-weight: 700;
    }

    .checkout-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }

    .checkout-section {
      margin-bottom: 20px;
      padding: 24px;
    }

    .checkout-section h2 {
      color: #556B2F;
      font-size: 20px;
      margin: 0 0 20px 0;
      font-weight: 600;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .half-width {
      width: 100%;
    }

    .payment-methods {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .payment-option {
      background: white;
      border: 2px solid #ddd;
      padding: 16px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .payment-option:hover {
      border-color: #556B2F;
      background: #f9faf7;
    }

    .payment-option.active {
      background: #556B2F;
      color: white;
      border-color: #556B2F;
    }

    .order-summary-section {
      position: sticky;
      top: 100px;
    }

    .order-summary {
      padding: 24px;
    }

    .order-summary h2 {
      color: #556B2F;
      font-size: 20px;
      margin: 0 0 20px 0;
      font-weight: 600;
    }

    .summary-items {
      margin-bottom: 16px;
      max-height: 300px;
      overflow-y: auto;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 12px 0;
      border-bottom: 1px solid #eee;
    }

    .item-details h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }

    .item-details p {
      margin: 4px 0 0 0;
      font-size: 13px;
      color: #999;
    }

    .item-price {
      font-weight: 600;
      color: #556B2F;
    }

    .summary-totals {
      margin: 20px 0;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      font-size: 14px;
      color: #666;
    }

    .summary-row.shipping {
      color: #4caf50;
    }

    .summary-row.total {
      font-size: 18px;
      font-weight: 700;
      color: #556B2F;
      padding: 16px 0;
      margin-top: 10px;
    }

    .checkout-btn {
      width: 100%;
      background: #556B2F !important;
      color: white !important;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 6px;
      margin-bottom: 12px;
    }

    .checkout-btn:hover:not(:disabled) {
      background: #3d4d1f !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(85, 107, 47, 0.3) !important;
    }

    .continue-btn {
      width: 100%;
      border-color: #556B2F !important;
      color: #556B2F !important;
    }

    @media (max-width: 968px) {
      .checkout-grid {
        grid-template-columns: 1fr;
      }

      .order-summary-section {
        position: static;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CheckoutComponent {
  shippingForm: FormGroup;
  selectedPaymentMethod = signal('card');
  loading = signal(false);

  constructor(
    private fb: FormBuilder,
    public cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {
    this.shippingForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod.set(method);
  }

  isFormValid(): boolean {
    return this.shippingForm.valid && this.cartService.items().length > 0;
  }

  placeOrder(): void {
    if (!this.isFormValid() || !this.authService.getCurrentUser()) return;

    this.loading.set(true);

    const shippingAddress: ShippingAddress = this.shippingForm.value;
    const user = this.authService.getCurrentUser();

    const order: Partial<Order> = {
      userId: user?.uid,
      items: this.cartService.items(),
      total: this.cartService.total(),
      status: 'pending',
      shippingAddress,
      paymentRef: `PAY_${Date.now()}`,
      createdAt: new Date()
    };

    this.orderService.createOrder(order).subscribe({
      next: (createdOrder) => {
        this.loading.set(false);
        this.cartService.clearCart();
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        this.loading.set(false);
        console.error('Order creation failed:', error);
      }
    });
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}
