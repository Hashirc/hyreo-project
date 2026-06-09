import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
      <mat-toolbar color="primary" class="header bg-olive mat-elevation-z4">
        <!-- Left side: logo and account centre -->
        <a routerLink="/" class="logo-link">
          <img src="assets/logo.png" alt="Quick Kart" class="logo-img"/>
        </a>
        @if (authService.currentUser()?.role === 'admin') {
          <button mat-button routerLink="/admin" class="admin-panel-btn"><mat-icon>admin_panel_settings</mat-icon> Admin Panel</button>
        }
        
        <!-- Account Centre Dropdown Menu -->
        <button mat-button [matMenuTriggerFor]="accountMenu" class="account-centre">
          <mat-icon>account_circle</mat-icon>
          <span>Account Centre</span>
        </button>

        <mat-menu #accountMenu="matMenu" class="account-menu-panel">
          <!-- Logged in state -->
          @if (authService.currentUser()) {
            <div class="menu-header">
              <div class="user-name">{{ authService.currentUser()?.displayName }}</div>
              <div class="user-email">{{ authService.currentUser()?.email }}</div>
              <span class="badge" [class.badge-admin]="authService.currentUser()?.role === 'admin'" [class.badge-customer]="authService.currentUser()?.role === 'customer'">
                {{ authService.currentUser()?.role }}
              </span>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item routerLink="/auth/profile">
              <mat-icon>person</mat-icon>
              <span>My Profile</span>
            </button>
            <button mat-menu-item (click)="useAnotherAccount()">
              <mat-icon>switch_account</mat-icon>
              <span>Use another account</span>
            </button>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Logout</span>
            </button>
          } @else {
            <!-- Not logged in state -->
            <div class="menu-header">
              <div class="user-name">Welcome, Guest</div>
              <div class="user-email">Please sign in to access your account</div>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item routerLink="/auth/login">
              <mat-icon>login</mat-icon>
              <span>Sign In</span>
            </button>
            <button mat-menu-item routerLink="/auth/register">
              <mat-icon>person_add</mat-icon>
              <span>Create Account</span>
            </button>
          }
        </mat-menu>

        <!-- Mobile menu button (visible on small screens) -->
        <button mat-icon-button class="mobile-menu-btn" (click)="toggleSidenav.emit()">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="spacer"></span>
        <!-- Center: Search -->
        <div class="search-bar">
          <input type="text" placeholder="Search..." [(ngModel)]="searchTerm" (keyup.enter)="onSearch()" />
          <button mat-icon-button aria-label="Search" (click)="onSearch()">
            <mat-icon>search</mat-icon>
          </button>
        </div>
        <span class="spacer"></span>
        <!-- Right side: language selector, orders, cart -->
        <mat-select [(value)]="selectedLang" class="lang-select" disableRipple>
          <mat-option *ngFor="let lang of languages" [value]="lang.value">{{ lang.viewValue }}</mat-option>
        </mat-select>
        <button mat-button routerLink="/orders" class="orders-btn">Orders</button>
        <button mat-icon-button routerLink="/cart" aria-label="Shopping Cart">
          <mat-icon [matBadge]="cartService.cartCount()" matBadgeColor="accent" *ngIf="cartService.cartCount() > 0">shopping_cart</mat-icon>
          <mat-icon *ngIf="cartService.cartCount() === 0">shopping_cart</mat-icon>
        </button>
      </mat-toolbar>

      <!-- Category navigation below the main toolbar -->
      <mat-toolbar color="primary" class="categories-toolbar bg-olive">
        <a *ngFor="let cat of categories" routerLink="/category/{{cat.slug}}" class="category-link">{{ cat.name }}</a>
      </mat-toolbar>
  `,
  styles: [`
    .header {
      display: flex;
      align-items: center;
      padding: 0 24px;
      height: 64px;
      background-color: #131921;
      color: #fff;
      position: relative;
    }

    .logo-link {
      display: flex;
      align-items: center;
      margin-right: 24px;
      min-width: 160px; /* Reserves space for the floating logo */
      text-decoration: none;
    }

    .logo-img {
      height: 180px;
      position: absolute;
      top: -5px;
      left: -60px;
      z-index: 100;
    }

    .spacer { flex: 1 1 auto; }

    .search-bar {
      display: flex;
      flex: 1;
      max-width: 600px;
      height: 40px;
      background: #fff;
      border-radius: 4px;
      overflow: hidden;
      margin: 0 auto;
    }
    .search-bar input {
      flex: 1;
      border: none;
      padding: 0 8px;
      font-size: 14px;
    }
    .search-bar button {
      width: 48px;
      background-color: #febd69;
      color: #111;
      border-left: 1px solid #ddd;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0 4px 4px 0;
    }

    .lang-select { display:none; }
    .orders-btn, .cart-btn {
      color: #fff;
      margin-left: 12px;
      font-size: 16px;
    }
    .cart-btn mat-icon {
      font-size: 24px;
    }

    .categories-toolbar {
      background: #232F3E;
      padding: 0 12px;
      display: flex;
      justify-content: center;
    }

    .category-link {
      color: #fff;
      text-transform: uppercase;
      margin: 0 12px;
      font-size: 16px;
      font-weight: 600;
      transition: background-color .2s;
    }
    .category-link:hover { text-decoration: underline; }

    .mobile-menu-btn { display: none; color: #fff; margin-right: 12px; }
    @media (max-width: 800px) {
      .desktop-nav { display: none; }
      .mobile-menu-btn { display: inline-flex; }
      .logo-text { font-size: 22px; margin-right: 0; }
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

    // Account Centre Pill Button
    .account-centre {
      margin-left: 16px;
      display: inline-flex !important;
      align-items: center;
      gap: 6px;
      padding: 6px 16px !important;
      border-radius: 20px !important;
      background-color: rgba(255, 255, 255, 0.12) !important;
      color: #ffffff !important;
      font-weight: 500;
      transition: all 0.2s ease;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      height: 38px;

      &:hover {
        background-color: rgba(255, 255, 255, 0.22) !important;
        border-color: #ffffff !important;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
      }

      mat-icon {
        margin: 0 !important;
        font-size: 20px;
        height: 20px;
        width: 20px;
      }
    }

    // Account Dropdown Menu Panel styling
    ::ng-deep .account-menu-panel {
      border-radius: 12px !important;
      margin-top: 8px !important;
      box-shadow: 0 10px 25px rgba(0,0,0,0.12) !important;
      border: 1px solid rgba(85, 107, 47, 0.08) !important;
      overflow: hidden !important;
    }

    .menu-header {
      padding: 16px 20px;
      background-color: #fcfcfb;
      min-width: 220px;
      display: flex;
      flex-direction: column;
      gap: 4px;

      .user-name {
        font-family: 'Outfit', sans-serif;
        font-size: 15px;
        font-weight: 700;
        color: #1e2610;
      }

      .user-email {
        font-size: 12px;
        color: #555;
        margin-bottom: 4px;
        word-break: break-all;
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
          background-color: #e8f5e9;
          color: #2e7d32;
        }
        
        &.badge-customer {
          background-color: #e3f2fd;
          color: #1565c0;
        }
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
    // TODO: Implement actual search navigation
  }

  useAnotherAccount() {
    this.authService.logout();
  }

  logout() {
    this.authService.logout();
  }
}
