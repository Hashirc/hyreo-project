import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule],
  template: `
    <div class="account-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h1>Account</h1>
          <p>Manage your luxury experience</p>
        </div>
        
        <nav class="sidebar-nav">
          <a class="nav-item active">
            <mat-icon>dashboard</mat-icon> Overview
          </a>
          <a class="nav-item" routerLink="/orders">
            <mat-icon>receipt_long</mat-icon> Orders
          </a>
          <a class="nav-item">
            <mat-icon>favorite_border</mat-icon> Wishlist
          </a>
          <a class="nav-item">
            <mat-icon>settings</mat-icon> Settings
          </a>
          <a class="nav-item">
            <mat-icon>help_outline</mat-icon> Support
          </a>
          <a class="nav-item text-danger" style="margin-top: 16px;" (click)="authService.logout()">
            <mat-icon>exit_to_app</mat-icon> Sign Out
          </a>
        </nav>

        <div class="membership-card">
          <span class="membership-label">Membership</span>
          <div class="membership-status">
            <span class="dot"></span>
            <span class="status-text">Gold Member</span>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <div class="profile-header-card">
          <div class="profile-info">
            <div class="avatar-container">
              <div class="avatar-placeholder">
                <mat-icon>person</mat-icon>
              </div>
              <button class="edit-avatar-btn">
                <mat-icon>edit</mat-icon>
              </button>
            </div>
            <div class="user-details">
              <h2>{{ authService.currentUser()?.displayName || 'Julian Thorne' }}</h2>
              <p>{{ authService.currentUser()?.email || 'julian.thorne@luxe-style.com' }}</p>
              @if (authService.currentUser()?.uid) {
                <p style="font-size: 11px; opacity: 0.7; font-family: monospace; margin-top: 4px;">UID: {{ authService.currentUser()?.uid }}</p>
              }
            </div>
          </div>
          <button class="edit-profile-btn">Edit Profile</button>
        </div>

        <div class="cards-grid">
          <div class="info-card">
            <div class="card-header">
              <div class="icon-wrapper">
                <mat-icon>person_outline</mat-icon>
              </div>
              <mat-icon class="arrow-icon">chevron_right</mat-icon>
            </div>
            <div class="card-body">
              <h3>Personal Information</h3>
              <p>Update your name, contact details and professional preferences.</p>
            </div>
          </div>

          <div class="info-card">
            <div class="card-header">
              <div class="icon-wrapper">
                <mat-icon>security</mat-icon>
              </div>
              <mat-icon class="arrow-icon">chevron_right</mat-icon>
            </div>
            <div class="card-body">
              <h3>Security & Login</h3>
              <p>Manage your password, two-factor authentication, and active sessions.</p>
            </div>
          </div>
        </div>

        <div class="divider-bar"></div>

        <div class="cards-grid">
          <div class="info-card">
            <div class="card-header">
              <div class="icon-wrapper">
                <mat-icon>location_on</mat-icon>
              </div>
              <a class="card-link">Edit</a>
            </div>
            <div class="card-body">
              <h3>Shipping Addresses</h3>
              <div class="address-details">
                <p class="address-title">Default: Home <span class="badge-primary">PRIMARY</span></p>
                <p>128 Organic Precision Way,<br>Floor 4, Suite 800<br>San Francisco, CA 94103</p>
              </div>
            </div>
          </div>

          <div class="info-card">
            <div class="card-header">
              <div class="icon-wrapper">
                <mat-icon>notifications_none</mat-icon>
              </div>
              <a class="card-link">Manage</a>
            </div>
            <div class="card-body">
              <h3>Notification Preferences</h3>
              <div class="toggle-list">
                <div class="toggle-item">
                  <span>Order Tracking</span>
                  <div class="toggle-btn active">
                    <div class="toggle-knob"></div>
                  </div>
                </div>
                <div class="toggle-item">
                  <span>Exclusive Offers</span>
                  <div class="toggle-btn active">
                    <div class="toggle-knob"></div>
                  </div>
                </div>
                <div class="toggle-item">
                  <span>Newsletter</span>
                  <div class="toggle-btn inactive">
                    <div class="toggle-knob"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .account-layout {
      display: flex;
      gap: 40px;
      padding: 48px 60px;
      background-color: #F7F9ED;
      min-height: calc(100vh - 80px);
    }

    /* Sidebar */
    .sidebar {
      width: 280px;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }

    .sidebar-header {
      margin-bottom: 32px;
      padding-left: 16px;

      h1 {
        font-family: 'Outfit', sans-serif;
        font-size: 28px;
        font-weight: 700;
        color: #4a5435;
        margin: 0 0 4px 0;
      }

      p {
        font-size: 13px;
        color: #666;
        margin: 0;
      }
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex-grow: 1;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px 20px;
      border-radius: 24px;
      color: #1e2610;
      font-weight: 500;
      font-size: 15px;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;

      mat-icon {
        color: #4a5435;
      }

      &:hover:not(.active) {
        background-color: rgba(226, 236, 184, 0.4);
      }

      &.active {
        background-color: #D8E5BE;
        color: #2D3A1B;
        font-weight: 600;

        mat-icon {
          color: #2D3A1B;
        }
      }
    }
    
    .text-danger {
      color: #d32f2f !important;
      mat-icon { color: #d32f2f !important; }
    }

    .membership-card {
      background-color: #EFEFE2;
      border-radius: 16px;
      padding: 24px;
      margin-top: 48px;
    }

    .membership-label {
      font-size: 12px;
      color: #666;
      display: block;
      margin-bottom: 12px;
    }

    .membership-status {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .dot {
      width: 4px;
      height: 4px;
      background-color: #1e2610;
      border-radius: 50%;
    }

    .status-text {
      font-weight: 700;
      color: #1e2610;
      font-family: 'Outfit', sans-serif;
    }

    /* Main Content */
    .main-content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 900px;
    }

    .profile-header-card {
      background-color: #ffffff;
      border-radius: 24px;
      padding: 32px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
    }

    .profile-info {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .avatar-container {
      position: relative;
    }

    .avatar-placeholder {
      width: 80px;
      height: 80px;
      background-color: #1e2610;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      
      mat-icon {
        color: #ffffff;
        font-size: 40px;
        width: 40px;
        height: 40px;
      }
    }

    .edit-avatar-btn {
      position: absolute;
      bottom: -4px;
      right: -4px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background-color: #556B2F;
      border: 2px solid #ffffff;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      padding: 0;

      mat-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }
    }

    .user-details {
      h2 {
        font-family: 'Outfit', sans-serif;
        font-size: 28px;
        font-weight: 700;
        color: #1e2610;
        margin: 0 0 4px 0;
      }

      p {
        font-size: 15px;
        color: #666;
        margin: 0;
      }
    }

    .edit-profile-btn {
      background-color: #4a5435;
      color: #ffffff;
      border: none;
      padding: 12px 24px;
      border-radius: 24px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: #384028;
      }
    }

    .cards-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .info-card {
      background-color: #ffffff;
      border-radius: 24px;
      padding: 32px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
      display: flex;
      flex-direction: column;
      gap: 20px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .icon-wrapper {
      width: 48px;
      height: 48px;
      background-color: #D8E5BE;
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;

      mat-icon {
        color: #2D3A1B;
      }
    }

    .arrow-icon {
      color: #999;
    }

    .card-link {
      font-size: 13px;
      font-weight: 600;
      color: #556B2F;
      cursor: pointer;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    .card-body {
      h3 {
        font-family: 'Outfit', sans-serif;
        font-size: 20px;
        font-weight: 600;
        color: #1e2610;
        margin: 0 0 12px 0;
      }

      p {
        font-size: 14px;
        color: #666;
        line-height: 1.5;
        margin: 0;
      }
    }

    .divider-bar {
      height: 48px;
      background-color: #ffffff;
      border-radius: 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
    }

    .address-details {
      .address-title {
        font-size: 14px;
        font-weight: 600;
        color: #1e2610;
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }

      .badge-primary {
        background-color: #4a5435;
        color: #ffffff;
        font-size: 10px;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 12px;
        letter-spacing: 0.5px;
      }

      p:last-child {
        color: #666;
        line-height: 1.6;
      }
    }

    .toggle-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .toggle-item {
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        font-size: 14px;
        color: #1e2610;
      }
    }

    .toggle-btn {
      width: 44px;
      height: 24px;
      border-radius: 12px;
      position: relative;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &.active {
        background-color: #4a5435;
        .toggle-knob {
          transform: translateX(20px);
          background-color: #ffffff;
        }
      }

      &.inactive {
        background-color: #e0e0e0;
        .toggle-knob {
          transform: translateX(0);
          background-color: #ffffff;
        }
      }
    }

    .toggle-knob {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      position: absolute;
      top: 2px;
      left: 2px;
      transition: transform 0.2s ease, background-color 0.2s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    @media (max-width: 900px) {
      .account-layout {
        flex-direction: column;
        padding: 24px;
      }

      .sidebar {
        width: 100%;
      }

      .cards-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  private orderService = inject(OrderService);

  readonly orderCount = signal<number>(0);
  readonly isLoadingOrders = signal(true);

  ngOnInit() {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orderCount.set(orders.length);
        this.isLoadingOrders.set(false);
      },
      error: () => {
        this.isLoadingOrders.set(false);
      }
    });
  }
}
