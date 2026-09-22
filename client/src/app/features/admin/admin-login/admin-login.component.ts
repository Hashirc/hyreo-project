import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="auth-page">
      <!-- Left Branding Panel (Admin Specific) -->
      <div class="brand-panel">
        <div class="brand-panel-content">
          <div class="brand-logo">
            <span class="logo-text">QUICK KART ADMIN</span>
          </div>
          <h1 class="brand-headline">Manage products, orders, users and store stats in one place.</h1>
          <p class="brand-sub">Secure administrative environment. Unauthorized access attempts will be monitored and logged.</p>
          <div class="trust-signals">
            <div class="trust-item">
              <div class="trust-icon"><span>📊</span></div>
              <span>Real-time Store Analytics</span>
            </div>
            <div class="trust-item">
              <div class="trust-icon"><span>📦</span></div>
              <span>Inventory & Product Control</span>
            </div>
            <div class="trust-item">
              <div class="trust-icon"><span>👥</span></div>
              <span>User & Account Moderation</span>
            </div>
          </div>
          <div class="brand-decor-circle c1"></div>
          <div class="brand-decor-circle c2"></div>
        </div>
      </div>

      <!-- Right Form Panel -->
      <div class="form-panel">
        <div class="form-content">
          <div class="form-header">
            <span class="admin-badge">ADMIN PORTAL</span>
            <h2 class="form-title">Welcome, Officer</h2>
            <p class="form-subtitle">Sign in to access your dashboard controls</p>
          </div>

          @if (errorMessage()) {
            <div class="error-banner">
              <mat-icon>error_outline</mat-icon>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
            <mat-form-field appearance="outline" class="field">
              <mat-label>Username or Email</mat-label>
              <mat-icon matPrefix class="field-prefix-icon">admin_panel_settings</mat-icon>
              <input matInput type="text" formControlName="usernameOrEmail" placeholder="Enter username or email">
              @if (loginForm.get('usernameOrEmail')?.hasError('required') && loginForm.get('usernameOrEmail')?.touched) {
                <mat-error>Username or Email is required</mat-error>
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

            <button mat-raised-button color="primary" type="submit" class="submit-btn" [disabled]="loginForm.invalid || isLoading()">
              @if (isLoading()) {
                <mat-spinner diameter="22"></mat-spinner>
              } @else {
                <mat-icon>login</mat-icon> Sign In to Admin Panel
              }
            </button>
          </form>

          <div class="alt-link">
            <p>New Administrator? <a routerLink="/admin/signup" class="link-olive">Register Admin Account</a></p>
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
      background: linear-gradient(145deg, #2D3A1B 0%, #3D4D20 50%, #43542B 100%);
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
      letter-spacing: 2px;
      color: #D8E5BE;
      text-transform: uppercase;
    }

    .brand-headline {
      font-family: 'Outfit', sans-serif;
      font-size: 34px;
      font-weight: 800;
      line-height: 1.25;
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

    /* ---- Right form panel ---- */
    .form-panel {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #FAFBF7;
      padding: 48px 32px;
    }

    .form-content {
      width: 100%;
      max-width: 420px;
    }

    .form-header {
      margin-bottom: 32px;
    }

    .admin-badge {
      display: inline-block;
      padding: 4px 10px;
      background-color: #EBF0D8;
      color: #556B2F;
      font-size: 11px;
      font-weight: 800;
      border-radius: 4px;
      margin-bottom: 12px;
      letter-spacing: 1px;
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
      font-size: 15px !important;
      letter-spacing: 0.5px;
      background-color: #556B2F !important;
      color: white !important;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;

      mat-spinner { margin: 0 auto; }
      mat-icon { margin-right: 4px; }
      
      &:hover {
        background-color: #3d4d1f !important;
      }
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
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly hidePassword = signal(true);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  loginForm: FormGroup = this.fb.group({
    usernameOrEmail: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const { usernameOrEmail, password } = this.loginForm.value;

    this.authService.adminLoginPromise({ usernameOrEmail, password })
      .then(() => {
        let returnUrl = this.route.snapshot.queryParams['returnUrl'];
        if (!returnUrl) {
          returnUrl = '/admin';
        }
        this.router.navigateByUrl(returnUrl);
      })
      .catch((err) => {
        this.errorMessage.set(err.error || err.message || 'Login failed. Verify admin credentials.');
      })
      .finally(() => {
        this.isLoading.set(false);
      });
  }
}
