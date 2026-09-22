import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

function passwordMatchValidator(g: FormGroup) {
  return g.get('password')?.value === g.get('confirmPassword')?.value
    ? null : { mismatch: true };
}

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [
    CommonModule,
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
      <!-- Left Branding Panel -->
      <div class="brand-panel">
        <div class="brand-panel-content">
          <div class="brand-logo">
            <span class="logo-text">QUICK KART ADMIN</span>
          </div>
          <h1 class="brand-headline">Set up your administrator account to manage the store.</h1>
          <p class="brand-sub">Admin accounts have full access to products, orders, users, and analytics. Please use a secure password.</p>
          <div class="trust-signals">
            <div class="trust-item">
              <div class="trust-icon"><span>🔒</span></div>
              <span>Role-Based Access Control</span>
            </div>
            <div class="trust-item">
              <div class="trust-icon"><span>🛡️</span></div>
              <span>Separate Auth Environment</span>
            </div>
            <div class="trust-item">
              <div class="trust-icon"><span>⚡</span></div>
              <span>Instant Dashboard Access</span>
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
            <span class="admin-badge">ADMIN REGISTRATION</span>
            <h2 class="form-title">Create Admin Account</h2>
            <p class="form-subtitle">Fill in your details to get started</p>
          </div>

          <!-- Existing Admin Block Check -->
          @if (adminExists()) {
            <div class="error-banner warning-banner">
              <mat-icon>warning</mat-icon>
              <span>Admin account already exists. Please log in.</span>
            </div>
            <div class="blocked-action-block">
              <button mat-raised-button color="primary" class="login-redirect-btn" routerLink="/admin/login">
                Go to Admin Login
              </button>
            </div>
          } @else {
            @if (errorMessage()) {
              <div class="error-banner">
                <mat-icon>error_outline</mat-icon>
                <span>{{ errorMessage() }}</span>
              </div>
            }

            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
              <mat-form-field appearance="outline" class="field">
                <mat-label>Full Name</mat-label>
                <mat-icon matPrefix class="field-prefix-icon">badge</mat-icon>
                <input matInput type="text" formControlName="displayName" placeholder="John Doe">
                @if (registerForm.get('displayName')?.hasError('required') && registerForm.get('displayName')?.touched) {
                  <mat-error>Name is required</mat-error>
                }
              </mat-form-field>

              <div class="form-row-2">
                <mat-form-field appearance="outline" class="field">
                  <mat-label>Username</mat-label>
                  <mat-icon matPrefix class="field-prefix-icon">person</mat-icon>
                  <input matInput type="text" formControlName="username" placeholder="adminowner">
                  @if (registerForm.get('username')?.hasError('required') && registerForm.get('username')?.touched) {
                    <mat-error>Username is required</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="field">
                  <mat-label>Admin Email</mat-label>
                  <mat-icon matPrefix class="field-prefix-icon">email</mat-icon>
                  <input matInput type="email" formControlName="email" placeholder="admin@example.com">
                  @if (registerForm.get('email')?.hasError('required') && registerForm.get('email')?.touched) {
                    <mat-error>Email is required</mat-error>
                  }
                  @if (registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched) {
                    <mat-error>Enter a valid email address</mat-error>
                  }
                </mat-form-field>
              </div>

              <div class="form-row-2">
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
                    <mat-error>Minimum 8 characters required</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="field">
                  <mat-label>Confirm Password</mat-label>
                  <mat-icon matPrefix class="field-prefix-icon">lock</mat-icon>
                  <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="confirmPassword">
                  @if (registerForm.get('confirmPassword')?.hasError('required') && registerForm.get('confirmPassword')?.touched) {
                    <mat-error>Confirmation is required</mat-error>
                  }
                  @if (registerForm.hasError('mismatch') && registerForm.get('confirmPassword')?.touched) {
                    <mat-error>Passwords must match</mat-error>
                  }
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="field">
                <mat-label>Secret Key</mat-label>
                <mat-icon matPrefix class="field-prefix-icon">vpn_key</mat-icon>
                <input matInput type="text" formControlName="secretKey" placeholder="Enter OWNER2026ADMIN secret key">
                @if (registerForm.get('secretKey')?.hasError('required') && registerForm.get('secretKey')?.touched) {
                  <mat-error>Secret Key is required to create admin account</mat-error>
                }
              </mat-form-field>

              <button mat-raised-button color="primary" type="submit" class="submit-btn" [disabled]="registerForm.invalid || isLoading()">
                @if (isLoading()) {
                  <mat-spinner diameter="22"></mat-spinner>
                } @else {
                  <mat-icon>person_add</mat-icon> Create Admin Account
                }
              </button>
            </form>

            <div class="alt-link">
              <p>Already an admin? <a routerLink="/admin/login" class="link-olive">Sign In</a></p>
            </div>
          }
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

    .brand-logo { margin-bottom: 40px; }
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

    .trust-signals { display: flex; flex-direction: column; gap: 16px; }
    .trust-item {
      display: flex; align-items: center; gap: 14px;
      font-size: 15px; font-weight: 500; color: rgba(255, 255, 255, 0.85);
      .trust-icon {
        width: 42px; height: 42px; border-radius: 12px;
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.15);
        display: flex; align-items: center; justify-content: center;
        font-size: 20px; flex-shrink: 0;
      }
    }

    .brand-decor-circle { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); }
    .c1 { width: 350px; height: 350px; bottom: -120px; right: -100px; }
    .c2 { width: 220px; height: 220px; top: -60px; right: 80px; }

    .form-panel {
      display: flex; align-items: center; justify-content: center;
      background-color: #FAFBF7;
      padding: 48px 32px;
    }

    .form-content { width: 100%; max-width: 480px; }

    .form-header { margin-bottom: 32px; }

    .admin-badge {
      display: inline-block; padding: 4px 10px;
      background-color: #EBF0D8; color: #556B2F;
      font-size: 11px; font-weight: 800;
      border-radius: 4px; margin-bottom: 12px; letter-spacing: 1px;
    }

    .form-title {
      font-family: 'Outfit', sans-serif;
      font-size: 32px; font-weight: 800;
      color: #1E2712; margin-bottom: 8px;
    }

    .form-subtitle { font-size: 15px; color: #5A664A; }

    .auth-form {
      display: flex; flex-direction: column;
      gap: 4px; margin-bottom: 20px;
    }

    .form-row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .field {
      width: 100%;
      .field-prefix-icon {
        color: #5A664A; margin-right: 8px; font-size: 20px;
      }
    }

    .submit-btn {
      height: 52px !important; margin-top: 12px;
      font-size: 15px !important; letter-spacing: 0.5px;
      background-color: #556B2F !important; color: white !important;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      mat-spinner { margin: 0 auto; }
      mat-icon { margin-right: 4px; }
      &:hover { background-color: #3d4d1f !important; }
    }

    .alt-link {
      text-align: center; font-size: 14px; color: #5A664A; margin-top: 16px;
      .link-olive { color: #2D3A1B; font-weight: 700; text-decoration: none; &:hover { text-decoration: underline; } }
    }

    .error-banner {
      background-color: #fff0f0; color: #c62828;
      border: 1px solid rgba(198, 40, 40, 0.15);
      padding: 12px 16px; border-radius: 12px;
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 20px; font-size: 14px; font-weight: 500;
      mat-icon { font-size: 20px; height: 20px; width: 20px; }
    }

    .warning-banner {
      background-color: #fffde7;
      color: #f57f17;
      border: 1px solid rgba(245, 127, 23, 0.15);
      mat-icon { color: #f57f17; }
    }

    .blocked-action-block {
      display: flex;
      justify-content: center;
      margin-top: 24px;
      
      .login-redirect-btn {
        background-color: #556B2F !important;
        color: white !important;
        height: 50px !important;
        border-radius: 25px !important;
        padding: 0 32px !important;
        font-family: 'Outfit', sans-serif;
        font-weight: 700;
      }
    }

    @media (max-width: 900px) {
      .auth-page { grid-template-columns: 1fr; min-height: auto; }
      .brand-panel { display: none; }
      .form-panel { padding: 40px 24px; }
      .form-row-2 { grid-template-columns: 1fr; gap: 0; }
    }
  `]
})
export class AdminRegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly hidePassword = signal(true);
  readonly isLoading = signal(false);
  readonly adminExists = signal(false);
  readonly errorMessage = signal<string | null>(null);

  registerForm!: FormGroup;

  ngOnInit() {
    this.registerForm = this.fb.group({
      displayName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      secretKey: ['', [Validators.required]]
    }, { validators: passwordMatchValidator });

    // Check if an admin is already registered
    this.authService.checkAdminExists().subscribe({
      next: (res) => {
        if (res.exists) {
          this.adminExists.set(true);
          this.registerForm.disable();
        }
      },
      error: (err) => {
        console.error('Failed to check admin status', err);
      }
    });
  }

  onSubmit() {
    if (this.registerForm.invalid || this.adminExists()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const { displayName, username, email, password, secretKey } = this.registerForm.value;

    this.authService.adminSignupPromise({ displayName, username, email, password, secretKey })
      .then(() => {
        this.router.navigate(['/admin']);
      })
      .catch((err) => {
        this.errorMessage.set(err.error || err.message || 'Registration failed. Try again.');
      })
      .finally(() => {
        this.isLoading.set(false);
      });
  }
}
