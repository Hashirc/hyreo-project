import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="auth-page">
      <!-- Left Branding Panel -->
      <div class="brand-panel">
        <div class="brand-panel-content">
          <div class="brand-logo">
            <span class="logo-text">QUICK KART</span>
          </div>
          <h1 class="brand-headline">Discover a world of premium products, curated for you.</h1>
          <p class="brand-sub">Shop with confidence. Fast shipping, secure checkout, and exceptional quality — every time.</p>
          <div class="trust-signals">
            <div class="trust-item">
              <div class="trust-icon"><span>🚚</span></div>
              <span>Free Global Shipping</span>
            </div>
            <div class="trust-item">
              <div class="trust-icon"><span>🔒</span></div>
              <span>SSL Secure Checkout</span>
            </div>
            <div class="trust-item">
              <div class="trust-icon"><span>💬</span></div>
              <span>24/7 Expert Support</span>
            </div>
          </div>
          <div class="brand-decor-circle c1"></div>
          <div class="brand-decor-circle c2"></div>
          <div class="brand-decor-circle c3"></div>
        </div>
      </div>

      <!-- Right Form Panel -->
      <div class="form-panel">
        <div class="form-content">
          <div class="form-header">
            <h2 class="form-title">Welcome Back</h2>
            <p class="form-subtitle">Sign in to your account to continue shopping</p>
          </div>

          @if (errorMessage()) {
            <div class="error-banner">
              <mat-icon>error_outline</mat-icon>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
            <mat-form-field appearance="outline" class="field">
              <mat-label>Email Address</mat-label>
              <mat-icon matPrefix class="field-prefix-icon">alternate_email</mat-icon>
              <input matInput type="email" formControlName="email" placeholder="you@example.com">
              @if (loginForm.get('email')?.hasError('required') && loginForm.get('email')?.touched) {
                <mat-error>Email is required</mat-error>
              }
              @if (loginForm.get('email')?.hasError('email') && loginForm.get('email')?.touched) {
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
              @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
                <mat-error>Password is required</mat-error>
              }
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" class="submit-btn" id="login-submit-btn" [disabled]="loginForm.invalid || isLoading()">
              @if (isLoading()) {
                <mat-spinner diameter="22"></mat-spinner>
              } @else {
                <mat-icon>login</mat-icon> Sign In
              }
            </button>
          </form>

          <div class="alt-link">
            <p>New to Quick Kart? <a routerLink="/auth/register" class="link-olive">Create an account</a></p>
          </div>

          <mat-divider class="divider"></mat-divider>

          <div class="demo-section">
            <p class="demo-label">Quick Test Accounts</p>
            <div class="demo-btns">
              <button id="demo-customer-btn" class="demo-btn" (click)="quickLogin('customer')">
                <mat-icon>person</mat-icon> Demo Customer
              </button>
              <button id="demo-admin-btn" class="demo-btn admin" (click)="quickLogin('admin')">
                <mat-icon>admin_panel_settings</mat-icon> Demo Admin
              </button>
            </div>
          </div>
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

    /* ---- Left brand panel ---- */
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

    .trust-signals {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .trust-item {
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 15px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.85);

      .trust-icon {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        flex-shrink: 0;
      }
    }

    /* decorative circles */
    .brand-decor-circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.05);
    }
    .c1 { width: 350px; height: 350px; bottom: -120px; right: -100px; }
    .c2 { width: 220px; height: 220px; top: -60px; right: 80px; }
    .c3 { width: 140px; height: 140px; top: 30%; left: -50px; }

    /* ---- Right form panel ---- */
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
      letter-spacing: 0.5px;
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

    .divider {
      margin: 28px 0;
    }

    .demo-section {
      text-align: center;

      .demo-label {
        font-family: 'Outfit', sans-serif;
        font-weight: 700;
        font-size: 11px;
        color: #708623;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-bottom: 14px;
      }
    }

    .demo-btns {
      display: flex;
      gap: 12px;
    }

    .demo-btn {
      flex: 1;
      height: 44px;
      border-radius: 12px;
      border: 1.5px solid rgba(45, 58, 27, 0.18);
      background: #ffffff;
      color: #2D3A1B;
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s ease;

      mat-icon { font-size: 18px; height: 18px; width: 18px; }

      &:hover {
        background: #2D3A1B;
        color: #ffffff;
        border-color: #2D3A1B;
      }

      &.admin {
        background: #EBF0D8;
        border-color: rgba(85, 107, 47, 0.3);
        &:hover {
          background: #556B2F;
          color: #ffffff;
          border-color: #556B2F;
        }
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
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly hidePassword = signal(true);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password)
      .then(() => {
        const user = this.authService.currentUser();
        let returnUrl = this.route.snapshot.queryParams['returnUrl'];
        if (!returnUrl) {
          returnUrl = user?.role === 'admin' ? '/admin' : '/';
        }
        this.router.navigateByUrl(returnUrl);
      })
      .catch((err) => {
        this.errorMessage.set(err.message || 'Login failed. Please check your credentials.');
      })
      .finally(() => {
        this.isLoading.set(false);
      });
  }

  quickLogin(role: 'customer' | 'admin') {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    const email = role === 'admin' ? 'admin@olive.com' : 'customer@olive.com';
    const password = 'password123';

    this.authService.login(email, password)
      .then(() => {
        const user = this.authService.currentUser();
        let returnUrl = this.route.snapshot.queryParams['returnUrl'];
        if (!returnUrl) {
          returnUrl = user?.role === 'admin' ? '/admin' : '/';
        }
        this.router.navigateByUrl(returnUrl);
      })
      .catch((err) => {
        this.errorMessage.set(err.message || 'Quick login failed.');
      })
      .finally(() => {
        this.isLoading.set(false);
      });
  }
}
