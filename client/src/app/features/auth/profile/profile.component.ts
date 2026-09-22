import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';
import { OrderService } from '../../../core/services/order.service';

interface Address {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule],
  template: `
    <div class="account-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header" (click)="toggleMobileMenu()">
          <div>
            <h1>Account Center</h1>
            <p>Manage your luxury experience</p>
          </div>
          <button class="mobile-menu-toggle" aria-label="Toggle navigation menu">
            <mat-icon>{{ isMobileMenuOpen() ? 'expand_less' : 'expand_more' }}</mat-icon>
          </button>
        </div>
        
        <nav class="sidebar-nav" [class.mobile-open]="isMobileMenuOpen()">
          <a class="nav-item active" (click)="closeMobileMenu()">
            <mat-icon>dashboard</mat-icon> Overview
          </a>
          <a class="nav-item" routerLink="/orders" (click)="closeMobileMenu()">
            <mat-icon>receipt_long</mat-icon> My Orders
          </a>
          <a class="nav-item" routerLink="/wishlist" (click)="closeMobileMenu()">
            <mat-icon>favorite_border</mat-icon> Wishlist
          </a>
          <a class="nav-item" routerLink="/settings" (click)="closeMobileMenu()">
            <mat-icon>settings</mat-icon> Settings
          </a>
          <a class="nav-item" (click)="closeMobileMenu()">
            <mat-icon>help_outline</mat-icon> Support
          </a>
          <a class="nav-item text-danger" style="margin-top: 16px;" (click)="authService.logout(); closeMobileMenu()">
            <mat-icon>exit_to_app</mat-icon> Logout
          </a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- User Profile Card -->
        <div class="profile-header-card">
          <div class="profile-info">
            <div class="avatar-container">
              <div class="avatar-placeholder" [style.background-image]="authService.currentUser()?.photoURL ? 'url(' + authService.currentUser()?.photoURL + ')' : 'none'">
                <mat-icon *ngIf="!authService.currentUser()?.photoURL">person</mat-icon>
              </div>
              <button class="edit-avatar-btn" aria-label="Edit Profile Picture" (click)="openPersonalModal()">
                <mat-icon>edit</mat-icon>
              </button>
            </div>
            <div class="user-details">
              <h2>{{ authService.currentUser()?.displayName || 'Julian Thorne' }}</h2>
              <p>{{ authService.currentUser()?.email || 'julian.thorne@luxe-style.com' }}</p>
              <p *ngIf="authService.currentUser()?.phone" class="user-phone">
                <mat-icon>phone</mat-icon> {{ authService.currentUser()?.phone }}
              </p>
              @if (authService.currentUser()?.uid) {
                <p class="uid-text">UID: {{ authService.currentUser()?.uid }}</p>
              }
            </div>
          </div>
          <button class="edit-profile-btn" (click)="openPersonalModal()">Edit Profile</button>
        </div>

        <!-- Membership Status & Personal Info Grid -->
        <div class="cards-grid">
          <!-- Membership Status Card -->
          <div class="info-card gold-membership-card">
            <div class="card-header">
              <div class="icon-wrapper gold-icon">
                <mat-icon>stars</mat-icon>
              </div>
              <span class="badge-gold">GOLD MEMBER</span>
            </div>
            <div class="card-body">
              <h3>Membership Status</h3>
              <p>You have access to priority delivery, exclusive sales, and a dedicated VIP support line.</p>
            </div>
          </div>

          <!-- Personal Information Card -->
          <div class="info-card interactive-card" (click)="openPersonalModal()">
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
        </div>

        <div class="divider-bar"></div>

        <!-- Shipping & Security Grid -->
        <div class="cards-grid">
          <!-- Shipping Address Card -->
          <div class="info-card">
            <div class="card-header">
              <div class="icon-wrapper">
                <mat-icon>location_on</mat-icon>
              </div>
              <a class="card-link" (click)="openAddressModal()">Edit</a>
            </div>
            <div class="card-body">
              <h3>Shipping Address</h3>
              <div class="address-details" *ngIf="getDefaultAddress(); else noAddress">
                <p class="address-title">
                  Default: {{ getDefaultAddress()?.fullName }} 
                  <span class="badge-primary">PRIMARY</span>
                </p>
                <p>
                  {{ getDefaultAddress()?.address }}<br>
                  {{ getDefaultAddress()?.city }}, {{ getDefaultAddress()?.state }} {{ getDefaultAddress()?.postalCode }}<br>
                  {{ getDefaultAddress()?.country }}
                </p>
              </div>
              <ng-template #noAddress>
                <p class="text-muted">No default shipping address set. Click Edit to manage your addresses.</p>
              </ng-template>
            </div>
          </div>

          <!-- Security & Login Card -->
          <div class="info-card interactive-card" (click)="openSecurityModal()">
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

        <!-- Notification Preferences -->
        <div class="info-card full-width-card">
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
      </main>
    </div>

    <!-- Toast Notification Banner -->
    <div class="toast-banner" *ngIf="toastMessage()" [class.error]="toastType() === 'error'">
      <mat-icon>{{ toastType() === 'error' ? 'error' : 'check_circle' }}</mat-icon>
      <span>{{ toastMessage() }}</span>
    </div>

    <!-- Modals -->

    <!-- Personal Information Modal -->
    <div class="modal-backdrop" *ngIf="isPersonalModalOpen()">
      <div class="modal-card">
        <div class="modal-header">
          <h2>Edit Personal Information</h2>
          <button class="close-btn" (click)="closePersonalModal()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <div class="modal-body">
          <form (ngSubmit)="savePersonalProfile()">
            <div class="form-group">
              <label for="fullName">Full Name *</label>
              <input type="text" id="fullName" name="fullName" [(ngModel)]="personalForm.displayName" required class="form-input" />
            </div>

            <div class="form-group">
              <label for="email">Email Address *</label>
              <input type="email" id="email" name="email" [(ngModel)]="personalForm.email" required class="form-input" />
            </div>

            <div class="form-group">
              <label for="phone">Phone Number *</label>
              <input type="tel" id="phone" name="phone" [(ngModel)]="personalForm.phone" required class="form-input" placeholder="+1 123 456 7890" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="dob">Date of Birth (Optional)</label>
                <input type="date" id="dob" name="dob" [(ngModel)]="personalForm.dob" class="form-input" />
              </div>

              <div class="form-group">
                <label for="gender">Gender (Optional)</label>
                <select id="gender" name="gender" [(ngModel)]="personalForm.gender" class="form-input">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="photoURL">Profile Picture URL</label>
              <input type="url" id="photoURL" name="photoURL" [(ngModel)]="personalForm.photoURL" class="form-input" placeholder="https://example.com/avatar.jpg" />
            </div>

            <!-- Password validation if email is modified -->
            <div class="form-group sensitive-confirm" *ngIf="isEmailModified()">
              <label for="sensitivePassword">Password Confirmation Required for Email Change *</label>
              <input type="password" id="sensitivePassword" name="sensitivePassword" [(ngModel)]="personalForm.confirmPassword" required class="form-input border-danger" placeholder="Enter your current password" />
              <p class="field-help-danger">Changing your email is a sensitive action. Please input your password.</p>
            </div>

            <div class="modal-footer">
              <button type="button" class="cancel-btn" (click)="closePersonalModal()">Cancel</button>
              <button type="submit" class="submit-btn" [disabled]="isSubmitting()">
                {{ isSubmitting() ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Security & Password Modal -->
    <div class="modal-backdrop" *ngIf="isSecurityModalOpen()">
      <div class="modal-card">
        <div class="modal-header">
          <h2>Security & Change Password</h2>
          <button class="close-btn" (click)="closeSecurityModal()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <div class="modal-body">
          <form (ngSubmit)="saveSecurityPassword()">
            <div class="form-group password-field-group">
              <label for="currentPassword">Current Password *</label>
              <div class="password-input-wrapper">
                <input [type]="showPasswords ? 'text' : 'password'" id="currentPassword" name="currentPassword" [(ngModel)]="securityForm.currentPassword" required class="form-input" />
              </div>
            </div>

            <div class="form-group password-field-group">
              <label for="newPassword">New Password *</label>
              <div class="password-input-wrapper">
                <input [type]="showPasswords ? 'text' : 'password'" id="newPassword" name="newPassword" [(ngModel)]="securityForm.newPassword" (ngModelChange)="checkPasswordStrength()" required class="form-input" />
              </div>
              
              <!-- Password Strength Indicator -->
              <div class="strength-meter-container" *ngIf="securityForm.newPassword">
                <div class="strength-bar" [class]="passwordStrength()"></div>
                <div class="strength-text">Password Strength: <span>{{ passwordStrength() | uppercase }}</span></div>
              </div>
            </div>

            <div class="form-group password-field-group">
              <label for="confirmPassword">Confirm New Password *</label>
              <div class="password-input-wrapper">
                <input [type]="showPasswords ? 'text' : 'password'" id="confirmPassword" name="confirmPassword" [(ngModel)]="securityForm.confirmPassword" required class="form-input" />
              </div>
            </div>

            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" name="showPasswords" [(ngModel)]="showPasswords" />
                Show Passwords
              </label>
            </div>

            <div class="modal-footer">
              <button type="button" class="cancel-btn" (click)="closeSecurityModal()">Cancel</button>
              <button type="submit" class="submit-btn" [disabled]="isSubmitting() || passwordStrength() === 'weak'">
                {{ isSubmitting() ? 'Changing...' : 'Change Password' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Address Management Modal -->
    <div class="modal-backdrop" *ngIf="isAddressModalOpen()">
      <div class="modal-card wide-modal-card">
        <div class="modal-header">
          <h2>Manage Shipping Addresses</h2>
          <button class="close-btn" (click)="closeAddressModal()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <div class="modal-body">
          <!-- Main view of address list -->
          <div *ngIf="!isEditingAddress(); else addressFormView">
            <div class="addresses-list-container">
              <div class="address-item-card" *ngFor="let addr of addresses()" [class.default-card]="addr.isDefault">
                <div class="address-item-details">
                  <h3>
                    {{ addr.fullName }}
                    <span class="default-badge" *ngIf="addr.isDefault">DEFAULT</span>
                  </h3>
                  <p class="address-phone"><mat-icon>phone</mat-icon> {{ addr.phone }}</p>
                  <p class="address-text">{{ addr.address }}, {{ addr.city }}, {{ addr.state }} {{ addr.postalCode }}, {{ addr.country }}</p>
                </div>
                <div class="address-item-actions">
                  <button mat-button class="set-default-btn" *ngIf="!addr.isDefault" (click)="setAsDefaultAddress(addr.id)">
                    Set Default
                  </button>
                  <button mat-icon-button color="primary" class="edit-icon-btn" aria-label="Edit address" (click)="startEditAddress(addr)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" class="delete-icon-btn" aria-label="Delete address" (click)="deleteAddressItem(addr.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>
              <div class="no-addresses-alert" *ngIf="addresses().length === 0">
                <p>No shipping addresses saved yet. Click below to add your first address.</p>
              </div>
            </div>
            
            <button mat-flat-button class="add-address-btn" (click)="startNewAddress()">
              <mat-icon>add</mat-icon> Add New Address
            </button>

            <div class="modal-footer list-footer">
              <button type="button" class="cancel-btn close-address-btn-footer" (click)="closeAddressModal()">Close</button>
            </div>
          </div>

          <!-- Address Add/Edit Form view -->
          <ng-template #addressFormView>
            <div class="address-form-container">
              <h3 class="form-title-text">{{ addressForm.id ? 'Edit Address' : 'Add New Address' }}</h3>
              <form (ngSubmit)="saveAddressForm()">
                <div class="form-group">
                  <label for="addrName">Full Name *</label>
                  <input type="text" id="addrName" name="addrName" [(ngModel)]="addressForm.fullName" required class="form-input" />
                </div>

                <div class="form-group">
                  <label for="addrPhone">Phone Number *</label>
                  <input type="tel" id="addrPhone" name="addrPhone" [(ngModel)]="addressForm.phone" required class="form-input" />
                </div>

                <div class="form-group">
                  <label for="addrStreet">House/Street Address *</label>
                  <input type="text" id="addrStreet" name="addrStreet" [(ngModel)]="addressForm.address" required class="form-input" />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="addrCity">City *</label>
                    <input type="text" id="addrCity" name="addrCity" [(ngModel)]="addressForm.city" required class="form-input" />
                  </div>
                  <div class="form-group">
                    <label for="addrState">State *</label>
                    <input type="text" id="addrState" name="addrState" [(ngModel)]="addressForm.state" required class="form-input" />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="addrZip">Postal/Zip Code *</label>
                    <input type="text" id="addrZip" name="addrZip" [(ngModel)]="addressForm.postalCode" required class="form-input" />
                  </div>
                  <div class="form-group">
                    <label for="addrCountry">Country *</label>
                    <input type="text" id="addrCountry" name="addrCountry" [(ngModel)]="addressForm.country" required class="form-input" />
                  </div>
                </div>

                <div class="form-group checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" name="addrDefault" [(ngModel)]="addressForm.isDefault" />
                    Set as default shipping address
                  </label>
                </div>

                <div class="modal-footer">
                  <button type="button" class="cancel-btn" (click)="cancelAddressForm()">Cancel</button>
                  <button type="submit" class="submit-btn">Save Address</button>
                </div>
              </form>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

    .account-layout {
      display: flex;
      gap: 40px;
      padding: 48px 60px;
      background-color: #F7F9ED;
      min-height: calc(100vh - 80px);
      font-family: 'Inter', sans-serif;
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
      display: flex;
      justify-content: space-between;
      align-items: center;

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

    .mobile-menu-toggle {
      display: none;
      background: none;
      border: none;
      color: #4a5435;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      
      &:hover {
        background-color: rgba(85, 107, 47, 0.08);
      }
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 4px;
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
      border: 1px solid rgba(85,107,47,0.05);
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
      background-size: cover;
      background-position: center;
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

      .user-phone {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        margin-top: 4px;
        color: #4a5435;
        font-weight: 500;
        mat-icon { font-size: 14px; width: 14px; height: 14px; }
      }

      .uid-text {
        font-size: 11px;
        opacity: 0.7;
        font-family: monospace;
        margin-top: 4px;
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
      border: 1px solid rgba(85,107,47,0.05);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
      }
    }

    .interactive-card {
      cursor: pointer;
    }

    .gold-membership-card {
      background: linear-gradient(135deg, #ffffff, #FAFBF7);
      border: 1px solid #d8e5be;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
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

    .gold-icon {
      background-color: #F9FBE7;
      mat-icon {
        color: #827717;
      }
    }

    .badge-gold {
      background-color: #827717;
      color: #ffffff;
      font-size: 10px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 12px;
      letter-spacing: 1px;
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
      height: 24px;
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

    /* Modals & Backdrops */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background-color: rgba(30, 38, 16, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
      padding: 20px;
      backdrop-filter: blur(4px);
    }

    .modal-card {
      background-color: #ffffff;
      border-radius: 24px;
      width: 100%;
      max-width: 540px;
      box-shadow: 0 20px 48px rgba(30, 38, 16, 0.15);
      border: 1px solid rgba(85, 107, 47, 0.1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: modalFadeIn 0.3s ease-out;
    }

    .wide-modal-card {
      max-width: 720px;
    }

    @keyframes modalFadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .modal-header {
      padding: 24px 32px;
      border-bottom: 1px solid #f0f3eb;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h2 {
        font-family: 'Outfit', sans-serif;
        font-size: 22px;
        font-weight: 700;
        color: #2D3A1B;
        margin: 0;
      }

      .close-btn {
        background: none;
        border: none;
        color: #666;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        border-radius: 50%;
        
        &:hover {
          background-color: #f0f3eb;
        }
      }
    }

    .modal-body {
      padding: 32px;
      overflow-y: auto;
      max-height: calc(85vh - 120px);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 20px;

      label {
        font-size: 13px;
        font-weight: 600;
        color: #4a5435;
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-input {
      border: 1px solid #d8e5be;
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 14px;
      font-family: 'Inter', sans-serif;
      outline: none;
      color: #2D3A1B;
      background-color: #FAFBF7;
      transition: all 0.2s;

      &:focus {
        border-color: #556B2F;
        background-color: #ffffff;
        box-shadow: 0 0 0 2px rgba(85, 107, 47, 0.08);
      }
    }

    .checkbox-group {
      flex-direction: row;
      align-items: center;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      font-size: 14px !important;
      color: #2D3A1B !important;
      user-select: none;
      
      input {
        width: 18px;
        height: 18px;
        accent-color: #556B2F;
        cursor: pointer;
      }
    }

    .sensitive-confirm {
      background-color: #ffebee;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #ffcdd2;
    }

    .field-help-danger {
      margin: 4px 0 0 0;
      font-size: 11px;
      color: #d32f2f;
      font-weight: 500;
    }

    /* Password strength */
    .strength-meter-container {
      margin-top: 8px;
      
      .strength-bar {
        height: 6px;
        border-radius: 3px;
        background-color: #e0e0e0;
        margin-bottom: 6px;
        transition: all 0.3s ease;
        
        &.weak {
          background-color: #d32f2f;
          width: 33%;
        }
        &.medium {
          background-color: #f57c00;
          width: 66%;
        }
        &.strong {
          background-color: #388e3c;
          width: 100%;
        }
      }
      
      .strength-text {
        font-size: 11px;
        color: #666;
        
        span {
          font-weight: 700;
        }
      }
    }

    /* Modal footers */
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 28px;
    }

    .cancel-btn {
      background: none;
      border: 1px solid #d8e5be;
      color: #4a5435;
      padding: 12px 24px;
      border-radius: 24px;
      font-weight: 600;
      cursor: pointer;
      font-family: 'Outfit', sans-serif;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f7f9ed;
      }
    }

    .submit-btn {
      background-color: #556B2F;
      color: #ffffff;
      border: none;
      padding: 12px 28px;
      border-radius: 24px;
      font-weight: 600;
      cursor: pointer;
      font-family: 'Outfit', sans-serif;
      transition: background-color 0.2s, opacity 0.2s;

      &:hover:not(:disabled) {
        background-color: #3d4d1f;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    /* Addresses list details */
    .addresses-list-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
    }

    .address-item-card {
      background-color: #FAFBF7;
      border: 1px solid #e8ecd8;
      border-radius: 16px;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.2s;

      &.default-card {
        border-color: #556B2F;
        background-color: #ffffff;
        box-shadow: 0 4px 12px rgba(85,107,47,0.04);
      }
    }

    .address-item-details {
      flex-grow: 1;

      h3 {
        font-family: 'Outfit', sans-serif;
        font-size: 16px;
        font-weight: 700;
        color: #2D3A1B;
        margin: 0 0 6px 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .default-badge {
        background-color: #556B2F;
        color: #ffffff;
        font-size: 9px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 8px;
        letter-spacing: 0.5px;
      }

      .address-phone {
        font-size: 13px;
        color: #5A664A;
        display: flex;
        align-items: center;
        gap: 6px;
        margin: 0 0 6px 0;
        mat-icon { font-size: 14px; width: 14px; height: 14px; }
      }

      .address-text {
        font-size: 14px;
        color: #666;
        margin: 0;
        line-height: 1.4;
      }
    }

    .address-item-actions {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .set-default-btn {
      font-size: 12px !important;
      color: #556B2F !important;
      font-family: 'Outfit', sans-serif !important;
      font-weight: 600 !important;
    }

    .add-address-btn {
      background-color: #4a5435 !important;
      color: #ffffff !important;
      border-radius: 20px !important;
      font-family: 'Outfit', sans-serif;
      font-weight: 600;
      margin-top: 8px;
    }

    .no-addresses-alert {
      text-align: center;
      padding: 32px;
      background-color: #f7f9ed;
      border-radius: 16px;
      border: 1px dashed #d8e5be;
      color: #5A664A;
      font-size: 14px;
      
      p { margin: 0; }
    }

    /* Toast Notification Banner */
    .toast-banner {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background-color: #2D3A1B;
      color: white;
      padding: 16px 24px;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(30, 38, 16, 0.25);
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 3000;
      animation: toastSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-weight: 500;
      font-size: 14px;

      mat-icon {
        color: #C5E1A5;
      }

      &.error {
        background-color: #d32f2f;
        mat-icon {
          color: #ffcdd2;
        }
      }
    }

    @keyframes toastSlideIn {
      from { transform: translateY(100px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @media (max-width: 900px) {
      .account-layout {
        flex-direction: column;
        padding: 24px;
        gap: 24px;
      }

      .sidebar {
        width: 100%;
        background-color: #ffffff;
        border-radius: 24px;
        padding: 20px 24px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        border: 1px solid rgba(85,107,47,0.05);
      }

      .sidebar-header {
        margin-bottom: 0;
        cursor: pointer;
        padding-left: 0;
        
        h1 {
          font-size: 22px;
        }
      }

      .mobile-menu-toggle {
        display: inline-flex;
      }

      .sidebar-nav {
        display: none;
        margin-top: 16px;
        border-top: 1px solid #f0f3eb;
        padding-top: 16px;
        
        &.mobile-open {
          display: flex;
        }
      }

      .cards-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .profile-header-card {
        padding: 24px;
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        
        .edit-profile-btn {
          width: 100%;
        }
      }
    }

    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
        gap: 0;
      }
      .modal-card {
        max-height: 90vh;
      }
      .modal-body {
        padding: 20px;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  private orderService = inject(OrderService);

  readonly orderCount = signal<number>(0);
  readonly isLoadingOrders = signal(true);
  
  isMobileMenuOpen = signal(false);

  // Modal display states
  isPersonalModalOpen = signal(false);
  isSecurityModalOpen = signal(false);
  isAddressModalOpen = signal(false);

  isSubmitting = signal(false);

  // Toast status states
  toastMessage = signal<string | null>(null);
  toastType = signal<'success' | 'error'>('success');

  // Personal Info Form Model
  personalForm = {
    displayName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    photoURL: '',
    confirmPassword: ''
  };

  // Security Form Model
  securityForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  showPasswords = false;
  passwordStrength = signal<'weak' | 'medium' | 'strong'>('weak');

  // Address List and Form states
  addresses = signal<Address[]>([]);
  isEditingAddress = signal(false);
  addressForm: Partial<Address> = {};

  // Seed default address if empty
  private readonly defaultMockAddress: Address = {
    id: 'addr-seed-001',
    fullName: 'Julian Thorne',
    phone: '+1 415 555 2671',
    address: '128 Organic Precision Way, Floor 4, Suite 800',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94103',
    country: 'United States',
    isDefault: true
  };

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

    // Populate addresses from user data or fallback to defaultMockAddress
    const user = this.authService.currentUser();
    if (user) {
      if (user.addresses && Array.isArray(user.addresses)) {
        this.addresses.set(user.addresses);
      } else {
        this.addresses.set([this.defaultMockAddress]);
      }
    }
  }

  toggleMobileMenu() {
    if (window.innerWidth <= 900) {
      this.isMobileMenuOpen.update(v => !v);
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  // Toast Helper
  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage.set(message);
    this.toastType.set(type);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 4000);
  }

  // Personal Info Methods
  openPersonalModal() {
    const user = this.authService.currentUser();
    if (user) {
      this.personalForm = {
        displayName: user.displayName || '',
        email: user.email || '',
        phone: user.phone || '',
        dob: user.dob || '',
        gender: user.gender || '',
        photoURL: user.photoURL || '',
        confirmPassword: ''
      };
    }
    this.isPersonalModalOpen.set(true);
  }

  closePersonalModal() {
    this.isPersonalModalOpen.set(false);
  }

  isEmailModified(): boolean {
    return this.personalForm.email !== this.authService.currentUser()?.email;
  }

  savePersonalProfile() {
    // Basic validation
    if (!this.personalForm.displayName || !this.personalForm.email || !this.personalForm.phone) {
      this.showToast('Please fill out all required fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.personalForm.email)) {
      this.showToast('Invalid email address format.', 'error');
      return;
    }

    const phoneRegex = /^[+]?[0-9\s-]{10,15}$/;
    if (!phoneRegex.test(this.personalForm.phone)) {
      this.showToast('Invalid phone number format. Must be 10-15 digits.', 'error');
      return;
    }

    this.isSubmitting.set(true);

    const updatePayload: any = {
      displayName: this.personalForm.displayName,
      email: this.personalForm.email,
      phone: this.personalForm.phone,
      dob: this.personalForm.dob,
      gender: this.personalForm.gender,
      photoURL: this.personalForm.photoURL
    };

    // Sensitive change check
    if (this.isEmailModified()) {
      if (!this.personalForm.confirmPassword) {
        this.showToast('Password confirmation is required to change email.', 'error');
        this.isSubmitting.set(false);
        return;
      }
      // Verify login using current password to check if password is correct
      this.authService.login(this.authService.currentUser()?.email || '', this.personalForm.confirmPassword)
        .then(() => {
          this.executeProfileUpdate(updatePayload);
        })
        .catch(err => {
          this.showToast(err.error || 'Password verification failed. Incorrect password.', 'error');
          this.isSubmitting.set(false);
        });
    } else {
      this.executeProfileUpdate(updatePayload);
    }
  }

  private executeProfileUpdate(payload: any) {
    this.authService.updateProfile(payload).subscribe({
      next: () => {
        this.showToast('Personal information updated successfully!');
        this.closePersonalModal();
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.showToast(err.error?.error || 'Failed to update profile info.', 'error');
        this.isSubmitting.set(false);
      }
    });
  }

  // Security Methods
  openSecurityModal() {
    this.securityForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.passwordStrength.set('weak');
    this.showPasswords = false;
    this.isSecurityModalOpen.set(true);
  }

  closeSecurityModal() {
    this.isSecurityModalOpen.set(false);
  }

  checkPasswordStrength() {
    const pwd = this.securityForm.newPassword;
    if (!pwd) {
      this.passwordStrength.set('weak');
      return;
    }
    
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) {
      this.passwordStrength.set('weak');
    } else if (score <= 3) {
      this.passwordStrength.set('medium');
    } else {
      this.passwordStrength.set('strong');
    }
  }

  saveSecurityPassword() {
    if (!this.securityForm.currentPassword || !this.securityForm.newPassword) {
      this.showToast('Please fill out all fields.', 'error');
      return;
    }

    if (this.securityForm.newPassword !== this.securityForm.confirmPassword) {
      this.showToast('New passwords do not match.', 'error');
      return;
    }

    if (this.passwordStrength() === 'weak') {
      this.showToast('New password is too weak. Must be at least 8 characters with numbers and letters.', 'error');
      return;
    }

    this.isSubmitting.set(true);
    this.authService.changePassword({
      currentPassword: this.securityForm.currentPassword,
      newPassword: this.securityForm.newPassword
    }).subscribe({
      next: () => {
        this.showToast('Password changed successfully!');
        this.closeSecurityModal();
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.showToast(err.error?.error || 'Failed to change password. Please verify current password.', 'error');
        this.isSubmitting.set(false);
      }
    });
  }

  // Address Management Methods
  openAddressModal() {
    this.isEditingAddress.set(false);
    this.isAddressModalOpen.set(true);
  }

  closeAddressModal() {
    this.isAddressModalOpen.set(false);
  }

  getDefaultAddress(): Address | null {
    const list = this.addresses();
    return list.find(a => a.isDefault) || list[0] || null;
  }

  startNewAddress() {
    this.addressForm = {
      fullName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      isDefault: this.addresses().length === 0
    };
    this.isEditingAddress.set(true);
  }

  startEditAddress(address: Address) {
    this.addressForm = { ...address };
    this.isEditingAddress.set(true);
  }

  cancelAddressForm() {
    this.isEditingAddress.set(false);
  }

  saveAddressForm() {
    const form = this.addressForm;
    if (!form.fullName || !form.phone || !form.address || !form.city || !form.state || !form.postalCode || !form.country) {
      this.showToast('Please fill out all address fields.', 'error');
      return;
    }

    const currentList = [...this.addresses()];

    // If new address is marked as default, turn off default for all others
    if (form.isDefault) {
      currentList.forEach(a => a.isDefault = false);
    }

    if (form.id) {
      // Edit existing
      const index = currentList.findIndex(a => a.id === form.id);
      if (index !== -1) {
        currentList[index] = form as Address;
      }
    } else {
      // Add new
      form.id = 'addr-' + Date.now();
      currentList.push(form as Address);
    }

    // Ensure at least one address is default
    if (currentList.length > 0 && !currentList.some(a => a.isDefault)) {
      currentList[0].isDefault = true;
    }

    this.submitUpdatedAddresses(currentList);
  }

  deleteAddressItem(id: string) {
    const currentList = this.addresses().filter(a => a.id !== id);
    
    // If we deleted the default, set default to the first remaining one
    if (currentList.length > 0 && !currentList.some(a => a.isDefault)) {
      currentList[0].isDefault = true;
    }

    this.submitUpdatedAddresses(currentList);
  }

  setAsDefaultAddress(id: string) {
    const currentList = [...this.addresses()];
    currentList.forEach(a => a.isDefault = a.id === id);
    this.submitUpdatedAddresses(currentList);
  }

  private submitUpdatedAddresses(updatedList: Address[]) {
    this.authService.updateAddresses(updatedList).subscribe({
      next: () => {
        this.addresses.set(updatedList);
        this.showToast('Addresses updated successfully!');
        this.isEditingAddress.set(false);
      },
      error: () => {
        this.showToast('Failed to update address entries.', 'error');
      }
    });
  }
}
