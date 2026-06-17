import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatBadgeModule, 
    MatMenuModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ],
  template: `
    <header class="header-container">
      <div class="header-content">
        <!-- Left brand logo -->
        <div class="brand-side">
          <button mat-icon-button class="mobile-menu-btn" (click)="toggleSidenav.emit()">
            <mat-icon>menu</mat-icon>
          </button>
          <a routerLink="/" class="logo-link">
            <span class="logo-text">QUICK KART</span>
          </a>
        </div>

        <!-- Center: Nav links -->
        <nav class="desktop-nav">
          <a routerLink="/products" class="nav-link">Shop</a>
          <a routerLink="/categories" class="nav-link">Categories</a>
          <a routerLink="/" class="nav-link">Deals</a>
          <a routerLink="/orders" class="nav-link">Orders</a>
        </nav>

        <!-- Search Bar -->
        <div class="search-bar">
          <mat-icon class="search-icon">search</mat-icon>
          <input type="text" placeholder="Search products..." [(ngModel)]="searchTerm" (keyup.enter)="onSearch()" />
        </div>

        <!-- Right side actions -->
        <div class="header-actions">
          <button mat-icon-button routerLink="/cart" aria-label="Shopping Cart" class="icon-btn">
            <mat-icon [matBadge]="cartService.cartCount()" matBadgeColor="warn" *ngIf="cartService.cartCount() > 0">shopping_cart</mat-icon>
            <mat-icon *ngIf="cartService.cartCount() === 0">shopping_cart</mat-icon>
          </button>

          <button mat-icon-button [matMenuTriggerFor]="accountMenu" aria-label="User Account" class="icon-btn">
            <mat-icon>person_outline</mat-icon>
          </button>

          <mat-menu #accountMenu="matMenu" class="account-menu-panel">
            @if (authService.currentUser()) {
              <div class="menu-header">
                <div class="user-name">{{ authService.currentUser()?.displayName }}</div>
                <div class="user-email">{{ authService.currentUser()?.email }}</div>
                <span class="badge" [class.badge-admin]="authService.currentUser()?.role === 'admin'" [class.badge-customer]="authService.currentUser()?.role === 'customer'">
                  {{ authService.currentUser()?.role }}
                </span>
              </div>
              <mat-divider></mat-divider>
              <a mat-menu-item routerLink="/auth/profile">
                <mat-icon>person</mat-icon>
                <span>My Profile</span>
              </a>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Logout</span>
              </button>
            } @else {
              <div class="menu-header">
                <div class="user-name">Welcome, Guest</div>
                <p class="menu-sub">Please sign in to manage orders.</p>
              </div>
              <mat-divider></mat-divider>
              <a mat-menu-item routerLink="/auth/login">
                <mat-icon>login</mat-icon>
                <span>Sign In</span>
              </a>
              <a mat-menu-item routerLink="/auth/register">
                <mat-icon>person_add</mat-icon>
                <span>Register</span>
              </a>
            }
          </mat-menu>

          <!-- Action Capsule Button -->
          @if (authService.currentUser()?.role === 'admin') {
            <button mat-flat-button routerLink="/admin" class="auth-pill-btn admin-color">Admin</button>
          } @else if (authService.currentUser()) {
            <button mat-flat-button (click)="logout()" class="auth-pill-btn">Sign Out</button>
          } @else {
            <button mat-flat-button routerLink="/auth/login" class="auth-pill-btn">Sign In</button>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header-container {
      background-color: #FAFBF7;
      color: #2D3A1B;
      border-bottom: 1px solid rgba(45, 58, 27, 0.06);
      padding: 0 24px;
      display: flex;
      justify-content: center;
      height: 72px;
      align-items: center;
      width: 100%;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(45, 58, 27, 0.02);
    }

    .header-content {
      display: flex;
      align-items: center;
      width: 100%;
      max-width: 1200px;
      justify-content: space-between;
      gap: 16px;
    }

    .brand-side {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .logo-link {
      display: flex;
      align-items: center;
      text-decoration: none;
    }

    .logo-text {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 20px;
      color: #2D3A1B;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .desktop-nav {
      display: flex;
      gap: 24px;
      align-items: center;
    }

    .nav-link {
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #5A664A;
      transition: color 0.2s ease;
      cursor: pointer;
      text-decoration: none;

      &:hover {
        color: #2D3A1B;
      }
    }

    .nav-link-btn {
      background: none;
      border: none;
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #5A664A;
      display: inline-flex;
      align-items: center;
      gap: 2px;
      transition: color 0.2s ease;
      cursor: pointer;
      padding: 0;

      &:hover {
        color: #2D3A1B;
      }

      mat-icon {
        font-size: 16px;
        height: 16px;
        width: 16px;
        margin-top: 2px;
      }
    }

    .search-bar {
      display: flex;
      align-items: center;
      background-color: #EBF0D8;
      border-radius: 20px;
      padding: 4px 14px;
      height: 38px;
      width: 260px;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

      &:focus-within {
        box-shadow: 0 0 0 2px rgba(45, 58, 27, 0.15);
        background-color: #ffffff;
        border: 1px solid #2D3A1B;
        width: 300px;
      }

      input {
        border: none;
        background: none;
        font-size: 13px;
        outline: none;
        padding-left: 6px;
        color: #2D3A1B;
        width: 100%;
        font-family: 'Inter', sans-serif;
      }

      .search-icon {
        color: #5A664A;
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .icon-btn {
      color: #2D3A1B;
      transition: transform 0.2s ease;

      &:hover {
        transform: scale(1.05);
        background-color: rgba(45, 58, 27, 0.04);
      }
    }

    .auth-pill-btn {
      background-color: #2D3A1B !important;
      color: #ffffff !important;
      border-radius: 20px !important;
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 12px !important;
      height: 38px !important;
      line-height: 38px !important;
      padding: 0 22px !important;
      letter-spacing: 0.5px;
      transition: all 0.2s ease;

      &:hover {
        background-color: #43542B !important;
        transform: scale(1.02);
      }

      &.admin-color {
        background-color: #708623 !important;
        &:hover {
          background-color: #5B6F1C !important;
        }
      }
    }

    .mobile-menu-btn {
      display: none;
      color: #2D3A1B;
    }

    // Account Dropdown Menu Panel styling
    ::ng-deep .account-menu-panel, ::ng-deep .categories-menu-panel {
      border-radius: 12px !important;
      margin-top: 8px !important;
      box-shadow: 0 10px 30px rgba(45, 58, 27, 0.08) !important;
      border: 1px solid rgba(45, 58, 27, 0.06) !important;
      overflow: hidden !important;
    }

    .menu-header {
      padding: 16px 20px;
      background-color: #FAFBF7;
      min-width: 220px;
      display: flex;
      flex-direction: column;
      gap: 4px;

      .user-name {
        font-family: 'Outfit', sans-serif;
        font-size: 15px;
        font-weight: 700;
        color: #2D3A1B;
      }

      .user-email {
        font-size: 12px;
        color: #5A664A;
        margin-bottom: 4px;
        word-break: break-all;
      }

      .menu-sub {
        font-size: 12px;
        color: #5A664A;
        margin: 0;
      }

      .badge {
        display: inline-block;
        width: fit-content;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        
        &.badge-admin {
          background-color: #EBF0D8;
          color: #2D3A1B;
        }
        
        &.badge-customer {
          background-color: #E3F2FD;
          color: #1565C0;
        }
      }
    }

    @media (max-width: 850px) {
      .desktop-nav {
        display: none;
      }

      .search-bar {
        display: none;
      }

      .mobile-menu-btn {
        display: inline-flex;
      }

      .logo-text {
        font-size: 18px;
      }
    }
  `]
})
export class HeaderComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
  private router = inject(Router);

  toggleSidenav = output<void>();

  // Language selection
  selectedLang = 'en';
  languages = [
    { value: 'en', viewValue: 'EN' },
    { value: 'es', viewValue: 'ES' },
    { value: 'fr', viewValue: 'FR' }
  ];

  // Category navigation
  categories = [
    { name: 'Mobile & Computers', slug: 'mobile-computers' },
    { name: 'Household Appliances', slug: 'household-appliances' },
    { name: 'Men\'s Fashion', slug: 'mens-fashion' },
    { name: 'Women\'s Fashion', slug: 'womens-fashion' },
    { name: 'Sports & Fitness', slug: 'sports-fitness' },
    { name: 'Books', slug: 'books' }
  ];

  // Search term handling
  searchTerm = '';
  onSearch() {
    console.log('Search:', this.searchTerm);
    if (this.searchTerm.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: this.searchTerm.trim() } });
    }
  }

  useAnotherAccount() {
    this.authService.logout();
  }

  logout() {
    this.authService.logout();
  }
}
