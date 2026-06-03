import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    HeaderComponent,
    FooterComponent
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="over" class="sidenav bg-light-olive">
        <div class="sidenav-header bg-olive text-white">
          <span class="sidenav-title">Olive & Co.</span>
          <button mat-icon-button (click)="sidenav.close()" class="text-white">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        
        <mat-nav-list class="nav-list">
          <a mat-list-item routerLink="/" routerLinkActive="active-item" [routerLinkActiveOptions]="{exact: true}" (click)="sidenav.close()">
            <mat-icon matListItemIcon>home</mat-icon>
            <span matListItemTitle>Home</span>
          </a>
          <a mat-list-item routerLink="/products" routerLinkActive="active-item" (click)="sidenav.close()">
            <mat-icon matListItemIcon>shopping_bag</mat-icon>
            <span matListItemTitle>Shop</span>
          </a>
          <a mat-list-item routerLink="/cart" routerLinkActive="active-item" (click)="sidenav.close()">
            <mat-icon matListItemIcon>shopping_cart</mat-icon>
            <span matListItemTitle>Shopping Cart</span>
          </a>

          <mat-divider></mat-divider>
          
          @if (authService.isAuthenticated()) {
            <a mat-list-item routerLink="/auth/profile" routerLinkActive="active-item" (click)="sidenav.close()">
              <mat-icon matListItemIcon>person</mat-icon>
              <span matListItemTitle>My Profile</span>
            </a>
            <a mat-list-item routerLink="/orders" routerLinkActive="active-item" (click)="sidenav.close()">
              <mat-icon matListItemIcon>history</mat-icon>
              <span matListItemTitle>Order History</span>
            </a>
            
            @if (authService.isAdmin()) {
              <mat-divider></mat-divider>
              <h3 mat-subheader class="text-olive">Administration</h3>
              <a mat-list-item routerLink="/admin" routerLinkActive="active-item" (click)="sidenav.close()">
                <mat-icon matListItemIcon class="text-olive">dashboard</mat-icon>
                <span matListItemTitle class="text-olive">Admin Dashboard</span>
              </a>
            }
            
            <mat-divider></mat-divider>
            <button mat-list-item (click)="authService.logout(); sidenav.close()">
              <mat-icon matListItemIcon>exit_to_app</mat-icon>
              <span matListItemTitle>Logout</span>
            </button>
          } @else {
            <a mat-list-item routerLink="/auth/login" routerLinkActive="active-item" (click)="sidenav.close()">
              <mat-icon matListItemIcon>lock_open</mat-icon>
              <span matListItemTitle>Login / Register</span>
            </a>
          }
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="sidenav-content">
        <app-header (toggleSidenav)="sidenav.toggle()"></app-header>
        
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
        
        <app-footer></app-footer>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .sidenav {
      width: 280px;
      border-right: 1px solid rgba(85, 107, 47, 0.12);
    }

    .sidenav-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      height: 70px;
    }

    .sidenav-title {
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .nav-list {
      padding-top: 8px;

      mat-nav-list h3 {
        padding-left: 16px;
        font-size: 11px;
        letter-spacing: 1px;
        text-transform: uppercase;
        font-weight: 700;
      }
    }

    .active-item {
      background-color: rgba(85, 107, 47, 0.08) !important;
      color: #556B2F !important;
      font-weight: 600;
      
      mat-icon {
        color: #556B2F !important;
      }
    }

    .sidenav-content {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      overflow-x: hidden;
    }

    .main-content {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px 16px;
    }

    @media (max-width: 600px) {
      .main-content {
        padding: 16px 8px;
      }
    }
  `]
})
export class MainLayoutComponent {
  authService = inject(AuthService);
}
