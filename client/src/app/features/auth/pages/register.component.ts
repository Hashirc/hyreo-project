import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h2 class="register-title">Create Account</h2>
        <p class="register-subtitle">Join HYREO and start shopping</p>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Full Name</mat-label>
            <input matInput formControlName="displayName" placeholder="Enter your full name">
            @if (registerForm.get('displayName')?.hasError('required')) {
              <mat-error>Name is required</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" placeholder="Enter your email">
            @if (registerForm.get('email')?.hasError('required')) {
              <mat-error>Email is required</mat-error>
            }
            @if (registerForm.get('email')?.hasError('email')) {
              <mat-error>Please enter a valid email</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" [type]="showPassword() ? 'text' : 'password'" placeholder="Create a strong password">
            <button mat-icon-button matSuffix (click)="togglePasswordVisibility()" type="button">
              <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (registerForm.get('password')?.hasError('required')) {
              <mat-error>Password is required</mat-error>
            }
            @if (registerForm.get('password')?.hasError('minlength')) {
              <mat-error>Password must be at least 6 characters</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Confirm Password</mat-label>
            <input matInput formControlName="confirmPassword" [type]="showPassword() ? 'text' : 'password'" placeholder="Confirm your password">
            @if (registerForm.get('confirmPassword')?.hasError('required')) {
              <mat-error>Please confirm your password</mat-error>
            }
          </mat-form-field>

          @if (getPasswordMismatchError()) {
            <div class="error-message">Passwords do not match</div>
          }

          @if (errorMessage()) {
            <div class="error-message">{{ errorMessage() }}</div>
          }

          <button 
            mat-raised-button 
            color="primary" 
            type="submit"
            [disabled]="loading() || !registerForm.valid"
            class="register-button">
            @if (loading()) {
              <mat-spinner diameter="20"></mat-spinner>
              <span>Creating account...</span>
            } @else {
              <span>Create Account</span>
            }
          </button>
        </form>

        <div class="form-footer">
          <p>Already have an account? <a routerLink="/auth/login">Sign in here</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 200px);
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 40px 20px;
    }

    .register-card {
      background: white;
      border-radius: 12px;
      padding: 40px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }

    .register-title {
      text-align: center;
      color: #556B2F;
      font-size: 28px;
      margin: 0 0 10px 0;
      font-weight: 700;
    }

    .register-subtitle {
      text-align: center;
      color: #999;
      margin: 0 0 30px 0;
      font-size: 14px;
    }

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .full-width {
      width: 100%;
    }

    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 12px;
      border-radius: 6px;
      font-size: 14px;
      border-left: 4px solid #c62828;
    }

    .register-button {
      background: #556B2F !important;
      color: white !important;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: all 0.3s ease;
      margin-top: 10px;
    }

    .register-button:hover:not(:disabled) {
      background: #3d4d1f !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(85, 107, 47, 0.3) !important;
    }

    .form-footer {
      margin-top: 30px;
      text-align: center;
    }

    .form-footer p {
      margin: 0;
      color: #666;
    }

    .form-footer a {
      color: #556B2F;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .form-footer a:hover {
      color: #3d4d1f;
    }

    @media (max-width: 600px) {
      .register-card {
        padding: 30px 20px;
      }

      .register-title {
        font-size: 24px;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      displayName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  getPasswordMismatchError(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword;
  }

  onSubmit(): void {
    if (this.registerForm.invalid || this.getPasswordMismatchError()) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    const { email, password, displayName } = this.registerForm.value;

    this.authService.register(email, password, displayName).subscribe({
      next: (user) => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.message || 'Registration failed. Please try again.');
      }
    });
  }
}
