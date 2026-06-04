import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
    RouterLinkActive, 
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
        <a routerLink="/">
          <img src="assets/logo.png" alt="Quick Kart" class="logo-img"/>
        </a>
        <button mat-button routerLink="/auth/profile" class="account-centre">Account Centre</button>
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
        <a *ngFor="let cat of categories" routerLink="/category/{{cat}}" class="category-link">{{ cat }}</a>
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
    }

    .logo-img {
      height: 52px;
      display: block;
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

  // Language selection
  selectedLang = 'en';
  languages = [
    { value: 'en', viewValue: 'EN' },
    { value: 'es', viewValue: 'ES' },
    { value: 'fr', viewValue: 'FR' }
  ];

  // Category navigation
  categories = [
    'Mobile & Computers',
    'Household Appliances',
    "Men's Fashion",
    "Women's Fashion",
    'Sports & Fitness',
    'Books'
  ];

  // Search term handling
  searchTerm = '';
  onSearch() {
    console.log('Search:', this.searchTerm);
    // TODO: Implement actual search navigation
  }
}
