import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule],
  template: `
    <div class="profile-container">
      <mat-card class="profile-card mat-elevation-z3">
        <mat-card-header class="profile-header">
          <div class="avatar-circle bg-light-olive">
            <mat-icon class="text-olive">person</mat-icon>
          </div>
          <h2 class="profile-name">{{ authService.currentUser()?.displayName }}</h2>
          <p class="profile-role">
            <span class="badge" [class.badge-admin]="authService.isAdmin()" [class.badge-customer]="!authService.isAdmin()">
              {{ authService.currentUser()?.role }} account
            </span>
          </p>
        </mat-card-header>
        
        <mat-card-content class="profile-content">
          <div class="info-row">
            <span class="label">Display Name</span>
            <span class="value">{{ authService.currentUser()?.displayName }}</span>
          </div>
          
          <mat-divider></mat-divider>
          
          <div class="info-row">
            <span class="label">Email Address</span>
            <span class="value">{{ authService.currentUser()?.email }}</span>
          </div>

          <mat-divider></mat-divider>

          <div class="info-row">
            <span class="label">User UID</span>
            <span class="value uid">{{ authService.currentUser()?.uid }}</span>
          </div>
          
          <div class="actions-row">
            <button mat-raised-button color="primary" routerLink="/orders" class="orders-btn">
              <mat-icon>history</mat-icon> View My Orders
            </button>
            <button mat-outlined-button color="warn" (click)="authService.logout()" class="logout-btn">
              <mat-icon>exit_to_app</mat-icon> Logout
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      padding: 24px 0;
    }

    .profile-card {
      width: 100%;
      max-width: 480px;
      padding: 24px 16px 16px;
      border-radius: 16px;
      border: 1px solid rgba(85, 107, 47, 0.08);
    }

    .profile-header {
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 24px;
    }

    .avatar-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 16px;
      box-shadow: 0 4px 10px rgba(85, 107, 47, 0.1);

      mat-icon {
        font-size: 40px;
        height: 40px;
        width: 40px;
      }
    }

    .profile-name {
      font-size: 24px;
      font-weight: 700;
      color: #1e2610;
      margin-bottom: 4px;
    }

    .profile-role {
      margin-bottom: 0;
    }

    .profile-content {
      padding: 8px 16px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      font-size: 15px;

      .label {
        font-weight: 600;
        color: #63791d;
      }

      .value {
        color: #1e2610;
        font-weight: 500;
      }

      .uid {
        font-family: monospace;
        font-size: 12px;
        color: #666;
      }
    }

    .actions-row {
      display: flex;
      gap: 16px;
      margin-top: 32px;
      width: 100%;

      button {
        flex: 1;
        height: 44px !important;
        border-radius: 8px !important;

        mat-icon {
          font-size: 18px;
          height: 18px;
          width: 18px;
          margin-right: 4px;
        }
      }
    }
  `]
})
export class ProfileComponent {
  authService = inject(AuthService);
}
