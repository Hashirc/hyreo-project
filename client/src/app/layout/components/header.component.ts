import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <mat-toolbar color="primary" class="header">
      <div class="header-container">
        <div class="logo">
          <a routerLink="/">
            <h1>HYREO</h1>
          </a>
        </div>

        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active">Home</a>
          <a routerLink="/products" routerLinkActive="active">Products</a>
          <a routerLink="/about" routerLinkActive="active">About</a>
          <a routerLink="/contact" routerLinkActive="active">Contact</a>
        </nav>

        <div class="header-actions">
          <a routerLink="/cart" class="cart-icon">
            <mat-icon>shopping_cart</mat-icon>
            <span class="cart-badge">{{ cartService.itemCount() }}</span>
          </a>

          <button mat-icon-button [matMenuTriggerFor]="menu" class="profile-icon">
            <mat-icon>person</mat-icon>
          </button>

          <mat-menu #menu="matMenu">
            @if (authService.isAuthenticated()) {
              <button mat-menu-item routerLink="/profile">Profile</button>
              <button mat-menu-item routerLink="/orders">My Orders</button>
              @if (authService.isAdmin()) {
                <mat-divider></mat-divider>
                <button mat-menu-item routerLink="/admin/dashboard">Admin Dashboard</button>
              }
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">Logout</button>
            } @else {
              <button mat-menu-item routerLink="/auth/login">Login</button>
              <button mat-menu-item routerLink="/auth/register">Register</button>
            }
          </mat-menu>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .header {
      background: linear-gradient(135deg, #556B2F 0%, #3d4d1f 100%) !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .logo h1 {
      margin: 0;
      color: white;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 2px;
    }

    .logo a {
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      gap: 30px;
      flex: 1;
      justify-content: center;
      align-items: center;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      position: relative;
    }

    .nav-links a:hover,
    .nav-links a.active {
      color: #9ACD32;
    }

    .nav-links a::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 0;
      height: 2px;
      background: #9ACD32;
      transition: width 0.3s ease;
    }

    .nav-links a:hover::after,
    .nav-links a.active::after {
      width: 100%;
    }

    .header-actions {
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .cart-icon {
      position: relative;
      color: white;
      font-size: 24px;
      text-decoration: none;
      transition: transform 0.3s ease;
    }

    .cart-icon:hover {
      transform: scale(1.1);
    }

    .cart-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #ff4444;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    }

    .profile-icon {
      color: white !important;
    }

    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }

      .header-container {
        gap: 20px;
      }
    }
  `]
})
export class HeaderComponent {
  constructor(
    public authService: AuthService,
    public cartService: CartService
  ) {}

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
