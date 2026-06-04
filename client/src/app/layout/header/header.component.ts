import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink, 
    RouterLinkActive, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatBadgeModule, 
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar color="primary" class="header bg-olive mat-elevation-z4">
      <button mat-icon-button class="mobile-menu-btn" (click)="toggleSidenav.emit()">
        <mat-icon>menu</mat-icon>
      </button>

      <span class="logo-text" routerLink="/">Olive & Co.</span>
      
      <div class="spacer"></div>
      
      <nav class="desktop-nav">
        <a routerLink="/" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Home</a>
        <a routerLink="/products" routerLinkActive="active-link" class="nav-link">Shop</a>
        @if (authService.isAdmin()) {
          <a routerLink="/admin" routerLinkActive="active-link" class="nav-link admin-link">Admin Dashboard</a>
        }
      </nav>

      <div class="actions">
        <!-- Shopping Cart Icon -->
        <button mat-icon-button routerLink="/cart" aria-label="Shopping Cart" class="cart-btn">
          @if (cartService.cartCount() > 0) {
            <mat-icon [matBadge]="cartService.cartCount()" matBadgeColor="accent">shopping_cart</mat-icon>
          } @else {
            <mat-icon>shopping_cart</mat-icon>
          }
        </button>

        <!-- User Menu -->
        @if (authService.isAuthenticated()) {
          <button mat-icon-button [matMenuTriggerFor]="userMenu" aria-label="User Account" class="user-btn">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu" xPosition="before" class="custom-menu">
            <div class="menu-header">
              <p class="user-name">{{ authService.currentUser()?.displayName }}</p>
              <p class="user-email">{{ authService.currentUser()?.email }}</p>
              <span class="badge" [class.badge-admin]="authService.isAdmin()" [class.badge-customer]="!authService.isAdmin()">
                {{ authService.currentUser()?.role }}
              </span>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item routerLink="/auth/profile">
              <mat-icon>person</mat-icon>
              <span>My Profile</span>
            </button>
            <button mat-menu-item routerLink="/orders">
              <mat-icon>history</mat-icon>
              <span>Order History</span>
            </button>
            @if (authService.isAdmin()) {
              <button mat-menu-item routerLink="/admin">
                <mat-icon>dashboard</mat-icon>
                <span>Admin Panel</span>
              </button>
            }
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="authService.logout()">
              <mat-icon>exit_to_app</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
        } @else {
          <button mat-flat-button routerLink="/auth/login" class="login-btn">Login</button>
        }
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .header {
      display: flex;
      align-items: center;
      padding: 0 24px;
      height: 70px;
      color: #ffffff;
    }

    .logo-text {
      font-family: 'Outfit', sans-serif;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 0.5px;
      cursor: pointer;
      margin-right: 32px;
      
      &:hover {
        opacity: 0.9;
      }
    }

    .spacer {
      flex: 1 1 auto;
    }

    .desktop-nav {
      display: flex;
      gap: 24px;
      align-items: center;
      margin-right: 24px;
    }

    .nav-link {
      color: rgba(255, 255, 255, 0.85);
      font-family: 'Outfit', sans-serif;
      font-weight: 500;
      font-size: 15px;
      padding: 8px 12px;
      border-radius: 4px;
      
      &:hover {
        color: #ffffff;
        background-color: rgba(255, 255, 255, 0.08);
      }

      &.active-link {
        color: #ffffff;
        background-color: rgba(255, 255, 255, 0.15);
      }
    }

    .admin-link {
      border: 1px solid rgba(255, 255, 255, 0.4);
      
      &:hover, &.active-link {
        border-color: #ffffff;
        background-color: rgba(255, 255, 255, 0.2) !important;
      }
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .cart-btn, .user-btn {
      color: #ffffff;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.08);
      }
    }

    .login-btn {
      background-color: #ffffff !important;
      color: #556B2F !important;
      font-family: 'Outfit', sans-serif;
      font-weight: 600;
      border-radius: 20px;
      padding: 0 16px;
      height: 36px;
      line-height: 36px;

      &:hover {
        background-color: #f2f5eb !important;
      }
    }

    .mobile-menu-btn {
      display: none;
      color: #ffffff;
      margin-right: 12px;
    }

    .menu-header {
      padding: 16px;
      min-width: 200px;

      .user-name {
        font-family: 'Outfit', sans-serif;
        font-weight: 600;
        font-size: 16px;
        margin-bottom: 2px;
        color: #1e2610;
      }

      .user-email {
        font-size: 12px;
        color: #666;
        margin-bottom: 8px;
      }
    }

    @media (max-width: 800px) {
      .desktop-nav {
        display: none;
      }

      .mobile-menu-btn {
        display: inline-flex;
      }

      .logo-text {
        font-size: 20px;
        margin-right: 0;
      }
    }
  `]
})
export class HeaderComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);

  toggleSidenav = output<void>();
}
