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
                <mat-card-content class="card-content-grid">
                  <mat-form-field appearance="outline" class="col-span-2">
                    <mat-label>Full Name</mat-label>
                    <input matInput type="text" formControlName="fullName" placeholder="John Doe">
                    @if (checkoutForm.get('fullName')?.hasError('required') && checkoutForm.get('fullName')?.touched) {
                      <mat-error>Full name is required</mat-error>
                    }
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="col-span-2">
                    <mat-label>Address Line 1</mat-label>
                    <input matInput type="text" formControlName="addressLine1" placeholder="123 Olive Grove Way">
                    @if (checkoutForm.get('addressLine1')?.hasError('required') && checkoutForm.get('addressLine1')?.touched) {
                      <mat-error>Address is required</mat-error>
                    }
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>City</mat-label>
                    <input matInput type="text" formControlName="city" placeholder="Ojai">
                    @if (checkoutForm.get('city')?.hasError('required') && checkoutForm.get('city')?.touched) {
                      <mat-error>City is required</mat-error>
                    }
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>State / Region</mat-label>
                    <input matInput type="text" formControlName="state" placeholder="CA">
                    @if (checkoutForm.get('state')?.hasError('required') && checkoutForm.get('state')?.touched) {
                      <mat-error>State is required</mat-error>
                    }
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Postal / ZIP Code</mat-label>
                    <input matInput type="text" formControlName="postalCode" placeholder="93023">
                    @if (checkoutForm.get('postalCode')?.hasError('required') && checkoutForm.get('postalCode')?.touched) {
                      <mat-error>Postal code is required</mat-error>
                    }
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Country</mat-label>
                    <input matInput type="text" formControlName="country" placeholder="United States">
                    @if (checkoutForm.get('country')?.hasError('required') && checkoutForm.get('country')?.touched) {
                      <mat-error>Country is required</mat-error>
                    }
                  </mat-form-field>
                </mat-card-content>
              </mat-card>

              <!-- Payment Method (Mock) -->
              <mat-card class="checkout-card">
                <mat-card-header>
                  <h2 class="card-title"><mat-icon class="text-olive">payment</mat-icon> Payment Information</h2>
                </mat-card-header>
                <mat-card-content class="card-content-grid">
                  <mat-form-field appearance="outline" class="col-span-2">
                    <mat-label>Cardholder Name</mat-label>
                    <input matInput type="text" formControlName="cardName" placeholder="JOHN DOE">
                    @if (checkoutForm.get('cardName')?.hasError('required') && checkoutForm.get('cardName')?.touched) {
                      <mat-error>Cardholder name is required</mat-error>
                    }
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="col-span-2">
                    <mat-label>Card Number</mat-label>
                    <input matInput type="text" formControlName="cardNumber" placeholder="4111 2222 3333 4444">
                    @if (checkoutForm.get('cardNumber')?.hasError('required') && checkoutForm.get('cardNumber')?.touched) {
                      <mat-error>Card number is required</mat-error>
                    }
                    @if (checkoutForm.get('cardNumber')?.hasError('pattern') && checkoutForm.get('cardNumber')?.touched) {
                      <mat-error>Enter valid 16-digit card number</mat-error>
                    }
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Expiration Date</mat-label>
                    <input matInput type="text" formControlName="cardExpiry" placeholder="MM/YY">
                    @if (checkoutForm.get('cardExpiry')?.hasError('required') && checkoutForm.get('cardExpiry')?.touched) {
                      <mat-error>Required</mat-error>
                    }
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Security Code (CVV)</mat-label>
                    <input matInput type="text" formControlName="cardCvv" placeholder="123">
                    @if (checkoutForm.get('cardCvv')?.hasError('required') && checkoutForm.get('cardCvv')?.touched) {
                      <mat-error>Required</mat-error>
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

                <!-- Subtotals -->
                <div class="summary-totals">
                  <div class="summary-row">
                    <span>Items Subtotal</span>
                    <span>\${{ cartService.cartTotal() | number:'1.2-2' }}</span>
                  </div>
                  <div class="summary-row">
                    <span>Shipping</span>
                    <span class="shipping-free">FREE</span>
                  </div>
                  <mat-divider class="inner-divider"></mat-divider>
                  <div class="summary-row total-row">
                    <span>Total Amount</span>
                    <span>\${{ cartService.cartTotal() | number:'1.2-2' }}</span>
                  </div>
                </div>

                <!-- Submit Button -->
                <button mat-raised-button color="primary" class="place-order-btn" 
                        [disabled]="checkoutForm.invalid || isLoading()" 
                        (click)="onPlaceOrder()">
                  @if (isLoading()) {
                    <mat-spinner diameter="24"></mat-spinner>
                  } @else {
                    <mat-icon>done_all</mat-icon> Place Order (\${{ cartService.cartTotal() | number:'1.2-2' }})
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

    .card-content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .col-span-2 {
      grid-column: span 2;
    }

    // Summary panel
    .checkout-summary-card {
      border-radius: 16px;
      border: 1px solid rgba(85, 107, 47, 0.08);
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

  checkoutForm: FormGroup = this.fb.group({
    // Address
    fullName: ['', Validators.required],
    addressLine1: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    postalCode: ['', Validators.required],
    country: ['United States', Validators.required],
    // Payment
    cardName: ['', Validators.required],
    cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
    cardExpiry: ['', [Validators.required]],
    cardCvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]]
  });

  onPlaceOrder() {
    if (this.checkoutForm.invalid) {
      // Mark all as touched to trigger validation messages
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const shippingAddress: ShippingAddress = {
      fullName: this.checkoutForm.value.fullName,
      addressLine1: this.checkoutForm.value.addressLine1,
      city: this.checkoutForm.value.city,
      state: this.checkoutForm.value.state,
      postalCode: this.checkoutForm.value.postalCode,
      country: this.checkoutForm.value.country
    };

    const orderData = {
      items: this.cartService.cartItems(),
      total: this.cartService.cartTotal(),
      shippingAddress,
      paymentRef: 'pay_mock_' + Math.random().toString(36).substr(2, 9)
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (res) => {
        this.orderSuccess.set(true);
        this.cartService.clearCart();
        this.isLoading.set(false);
        alert('Order Placed Successfully! Thank you for shopping with us.');
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        console.error('Checkout failed:', err);
        alert('There was an error placing your order. Please try again.');
        this.isLoading.set(false);
      }
    });
  }
}
