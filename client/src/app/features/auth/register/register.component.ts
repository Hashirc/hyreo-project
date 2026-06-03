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
    <div class="auth-container">
      <mat-card class="auth-card mat-elevation-z3">
        <mat-card-header class="auth-header">
          <h2 class="auth-title">Create Account</h2>
          <p class="auth-subtitle">Join Olive & Co. today</p>
        </mat-card-header>
        
        <mat-card-content>
          @if (errorMessage()) {
            <div class="error-banner">
              <mat-icon>error</mat-icon>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
            <mat-form-field appearance="outlined">
              <mat-label>Full Name</mat-label>
              <input matInput type="text" formControlName="displayName" placeholder="John Doe">
              @if (registerForm.get('displayName')?.hasError('required') && registerForm.get('displayName')?.touched) {
                <mat-error>Name is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outlined">
              <mat-label>Email Address</mat-label>
              <input matInput type="email" formControlName="email" placeholder="john@example.com">
              @if (registerForm.get('email')?.hasError('required') && registerForm.get('email')?.touched) {
                <mat-error>Email is required</mat-error>
              }
              @if (registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched) {
                <mat-error>Please enter a valid email address</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outlined">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="password">
              <button mat-icon-button matSuffix type="button" (click)="hidePassword.set(!hidePassword())" [attr.aria-label]="'Hide password'" [attr.aria-pressed]="hidePassword()">
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (registerForm.get('password')?.hasError('required') && registerForm.get('password')?.touched) {
                <mat-error>Password is required</mat-error>
              }
              @if (registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched) {
                <mat-error>Password must be at least 6 characters long</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outlined">
              <mat-label>Assign Role (For Testing)</mat-label>
              <mat-select formControlName="role">
                <mat-option value="customer">Customer</mat-option>
                <mat-option value="admin">Administrator</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" class="submit-btn" [disabled]="registerForm.invalid || isLoading()">
              @if (isLoading()) {
                <mat-spinner diameter="24"></mat-spinner>
              } @else {
                Register
              }
            </button>
          </form>

          <div class="auth-alternative">
            <p>Already have an account? <a routerLink="/auth/login" class="text-olive font-weight-600">Sign In</a></p>
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
