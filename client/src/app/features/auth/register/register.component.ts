import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="auth-page">
      <!-- Left Form Panel -->
      <div class="form-panel">
        <div class="form-content">
          <div class="form-header">
            <h2 class="form-title">Create Account</h2>
            <p class="form-subtitle">Join thousands of happy shoppers today</p>
          </div>

          @if (errorMessage()) {
            <div class="error-banner">
              <mat-icon>error_outline</mat-icon>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
            <mat-form-field appearance="outline" class="field">
              <mat-label>Full Name</mat-label>
              <mat-icon matPrefix class="field-prefix-icon">person_outline</mat-icon>
              <input matInput type="text" formControlName="displayName" placeholder="John Doe">
              @if (registerForm.get('displayName')?.hasError('required') && registerForm.get('displayName')?.touched) {
                <mat-error>Full name is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="field">
              <mat-label>Email Address</mat-label>
              <mat-icon matPrefix class="field-prefix-icon">alternate_email</mat-icon>
              <input matInput type="email" formControlName="email" placeholder="john@example.com">
              @if (registerForm.get('email')?.hasError('required') && registerForm.get('email')?.touched) {
                <mat-error>Email is required</mat-error>
              }
              @if (registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched) {
                <mat-error>Enter a valid email address</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="field">
              <mat-label>Password</mat-label>
              <mat-icon matPrefix class="field-prefix-icon">lock_outline</mat-icon>
              <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="password">
              <button mat-icon-button matSuffix type="button" (click)="hidePassword.set(!hidePassword())" [attr.aria-label]="'Hide password'">
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (registerForm.get('password')?.hasError('required') && registerForm.get('password')?.touched) {
                <mat-error>Password is required</mat-error>
              }
              @if (registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched) {
                <mat-error>Password must be at least 6 characters</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="field">
              <mat-label>Account Type</mat-label>
              <mat-icon matPrefix class="field-prefix-icon">manage_accounts</mat-icon>
              <mat-select formControlName="role">
                <mat-option value="customer">Customer</mat-option>
                <mat-option value="admin">Administrator</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" class="submit-btn" id="register-submit-btn" [disabled]="registerForm.invalid || isLoading()">
              @if (isLoading()) {
                <mat-spinner diameter="22"></mat-spinner>
              } @else {
                <mat-icon>person_add</mat-icon> Create Account
              }
            </button>
          </form>

          <div class="alt-link">
            <p>Already have an account? <a routerLink="/auth/login" class="link-olive">Sign In</a></p>
          </div>
        </div>
      </div>

      <!-- Right Branding Panel -->
      <div class="brand-panel">
        <div class="brand-panel-content">
          <div class="brand-logo">
            <span class="logo-text">QUICK KART</span>
          </div>
          <h1 class="brand-headline">Your premium shopping experience starts here.</h1>
          <p class="brand-sub">Create your free account and unlock exclusive deals, order tracking, and a seamless checkout experience.</p>
          <div class="feature-list">
            <div class="feature-item">
              <div class="feature-icon">✨</div>
              <div>
                <div class="feature-name">Exclusive Members Deals</div>
                <div class="feature-desc">Access special discounts only for registered users</div>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📦</div>
              <div>
                <div class="feature-name">Real-time Order Tracking</div>
                <div class="feature-desc">Follow your orders from warehouse to doorstep</div>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">💳</div>
              <div>
                <div class="feature-name">Fast & Secure Checkout</div>
                <div class="feature-desc">Saved addresses and one-click reorder</div>
              </div>
            </div>
          </div>
          <div class="brand-decor-circle c1"></div>
          <div class="brand-decor-circle c2"></div>
          <div class="brand-decor-circle c3"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .auth-page {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: calc(100vh - 72px);
    }

    /* ---- Left form panel ---- */
    .form-panel {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--bg-light);
      padding: 48px 32px;
    }

    .form-content {
      width: 100%;
      max-width: 420px;
    }

    .form-header {
      margin-bottom: 32px;
    }

    .form-title {
      font-family: 'Outfit', sans-serif;
      font-size: 32px;
      font-weight: 800;
      color: #1E2712;
      margin-bottom: 8px;
    }

    .form-subtitle {
      font-size: 15px;
      color: #5A664A;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 20px;
    }

    .field {
      width: 100%;
      .field-prefix-icon {
        color: #5A664A;
        margin-right: 8px;
        font-size: 20px;
      }
    }

    .submit-btn {
      height: 52px !important;
      margin-top: 12px;
      font-size: 16px !important;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      mat-spinner { margin: 0 auto; }
      mat-icon { margin-right: 4px; }
    }

    .alt-link {
      text-align: center;
      font-size: 14px;
      color: #5A664A;
      margin-top: 16px;

      .link-olive {
        color: #2D3A1B;
        font-weight: 700;
        text-decoration: none;
        &:hover { text-decoration: underline; }
      }
    }

    .error-banner {
      background-color: #fff0f0;
      color: #c62828;
      border: 1px solid rgba(198, 40, 40, 0.15);
      padding: 12px 16px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
      font-size: 14px;
      font-weight: 500;
      mat-icon { font-size: 20px; height: 20px; width: 20px; }
    }

    /* ---- Right brand panel ---- */
    .brand-panel {
      background: linear-gradient(145deg, #1E2712 0%, #2D3A1B 45%, #3F5425 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px;
      position: relative;
      overflow: hidden;
    }

    .brand-panel-content {
      position: relative;
      z-index: 2;
      color: #ffffff;
      max-width: 440px;
    }

    .brand-logo {
      margin-bottom: 40px;
    }

    .logo-text {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 22px;
      letter-spacing: 3px;
      color: #D8E5BE;
      text-transform: uppercase;
    }

    .brand-headline {
      font-family: 'Outfit', sans-serif;
      font-size: 36px;
      font-weight: 800;
      line-height: 1.2;
      color: #ffffff;
      margin-bottom: 20px;
    }

    .brand-sub {
      font-size: 15px;
      line-height: 1.7;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 48px;
    }

    .feature-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;

      .feature-icon {
        font-size: 26px;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .feature-name {
        font-size: 15px;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 4px;
      }

      .feature-desc {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.6);
        line-height: 1.5;
      }
    }

    /* decorative circles */
    .brand-decor-circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.05);
    }
    .c1 { width: 350px; height: 350px; bottom: -120px; left: -100px; }
    .c2 { width: 220px; height: 220px; top: -60px; left: 80px; }
    .c3 { width: 140px; height: 140px; top: 30%; right: -50px; }

    @media (max-width: 900px) {
      .auth-page {
        grid-template-columns: 1fr;
        min-height: auto;
      }
      .brand-panel {
        display: none;
      }
      .form-panel {
        padding: 40px 24px;
      }
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly hidePassword = signal(true);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  registerForm: FormGroup = this.fb.group({
    displayName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['customer', [Validators.required]]
  });

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const { email, password, displayName, role } = this.registerForm.value;

    this.authService.register(email, password, displayName, role)
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch((err) => {
        this.errorMessage.set(err.message || 'Registration failed. Try again.');
      })
      .finally(() => {
        this.isLoading.set(false);
      });
  }
}
