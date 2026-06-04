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
    <div class="auth-container">
      <mat-card class="auth-card mat-elevation-z3">
        <mat-card-header class="auth-header">
          <h2 class="auth-title">Welcome Back</h2>
          <p class="auth-subtitle">Sign in to your Olive & Co. account</p>
        </mat-card-header>
        
        <mat-card-content>
          @if (errorMessage()) {
            <div class="error-banner">
              <mat-icon>error</mat-icon>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
            <mat-form-field appearance="outline">
              <mat-label>Email Address</mat-label>
              <input matInput type="email" formControlName="email" placeholder="example@olive.com">
              @if (loginForm.get('email')?.hasError('required') && loginForm.get('email')?.touched) {
                <mat-error>Email is required</mat-error>
              }
              @if (loginForm.get('email')?.hasError('email') && loginForm.get('email')?.touched) {
                <mat-error>Please enter a valid email address</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="password">
              <button mat-icon-button matSuffix type="button" (click)="hidePassword.set(!hidePassword())" [attr.aria-label]="'Hide password'" [attr.aria-pressed]="hidePassword()">
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
                <mat-error>Password is required</mat-error>
              }
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" class="submit-btn" [disabled]="loginForm.invalid || isLoading()">
              @if (isLoading()) {
                <mat-spinner diameter="24"></mat-spinner>
              } @else {
                Sign In
              }
            </button>
          </form>

          <div class="auth-alternative">
            <p>Don't have an account? <a routerLink="/auth/register" class="text-olive font-weight-600">Register</a></p>
          </div>

          <mat-divider class="divider"></mat-divider>

          <div class="demo-login-box">
            <p class="demo-title">Quick Test Accounts</p>
            <div class="demo-buttons">
              <button mat-outlined-button (click)="quickLogin('customer')" class="demo-btn">
                <mat-icon class="text-olive">person</mat-icon> Demo Customer
              </button>
              <button mat-outlined-button (click)="quickLogin('admin')" class="demo-btn">
                <mat-icon class="text-olive">admin_panel_settings</mat-icon> Demo Admin
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 70vh;
      padding: 24px 0;
    }

    .auth-card {
      width: 100%;
      max-width: 420px;
      padding: 16px;
      border-radius: 16px;
      border: 1px solid rgba(85, 107, 47, 0.08);
    }

    .auth-header {
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 24px;
    }

    .auth-title {
      font-size: 28px;
      font-weight: 700;
      color: #1e2610;
      margin-bottom: 4px;
    }

    .auth-subtitle {
      font-size: 14px;
      color: #63791d;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .submit-btn {
      height: 48px !important;
      margin-top: 12px;
      
      mat-spinner {
        margin: 0 auto;
      }
    }

    .auth-alternative {
      text-align: center;
      margin-top: 16px;
      font-size: 14px;
      color: #4a5435;
      
      a:hover {
        text-decoration: underline;
      }
    }

    .divider {
      margin: 24px 0;
    }

    .error-banner {
      background-color: #ffebee;
      color: #c62828;
      padding: 12px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
      font-size: 14px;
      font-weight: 500;

      mat-icon {
        font-size: 20px;
        height: 20px;
        width: 20px;
      }
    }

    .demo-login-box {
      text-align: center;

      .demo-title {
        font-family: 'Outfit', sans-serif;
        font-weight: 600;
        font-size: 13px;
        color: #708623;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 12px;
      }

      .demo-buttons {
        display: flex;
        gap: 12px;
      }

      .demo-btn {
        flex: 1;
        font-size: 12px !important;
        border-radius: 8px !important;
        height: 40px !important;

        mat-icon {
          font-size: 16px;
          height: 16px;
          width: 16px;
          margin-right: 4px;
        }
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
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
