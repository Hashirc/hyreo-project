import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatCardModule, MatDividerModule],
  template: `
    <div class="settings-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <button mat-icon-button class="back-btn" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div>
            <h1 class="page-title">Account Settings</h1>
            <p class="page-subtitle">Configure your preferences and account options</p>
          </div>
        </div>
      </div>

      <div class="settings-container">
        <div class="settings-grid">
          <!-- Account Section -->
          <div class="settings-section">
            <h2 class="section-title">General Preferences</h2>
            
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-icon bg-light-olive">
                  <mat-icon>language</mat-icon>
                </div>
                <div>
                  <h3>Language</h3>
                  <p>Choose your default display language</p>
                </div>
              </div>
              <div class="setting-action">
                <select class="custom-select">
                  <option selected>English (US)</option>
                  <option>Español</option>
                  <option>Français</option>
                </select>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-icon bg-light-olive">
                  <mat-icon>monetization_on</mat-icon>
                </div>
                <div>
                  <h3>Currency</h3>
                  <p>Select your default shop currency</p>
                </div>
              </div>
              <div class="setting-action">
                <select class="custom-select">
                  <option selected>INR (₹)</option>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Security Section -->
          <div class="settings-section">
            <h2 class="section-title">Security & Safety</h2>

            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-icon bg-light-olive">
                  <mat-icon>lock</mat-icon>
                </div>
                <div>
                  <h3>Two-Factor Authentication</h3>
                  <p>Secure your account with an extra verification layer</p>
                </div>
              </div>
              <div class="setting-action">
                <div class="toggle-btn inactive" (click)="toggleTfa()">
                  <div class="toggle-knob"></div>
                </div>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-icon bg-light-olive">
                  <mat-icon>devices</mat-icon>
                </div>
                <div>
                  <h3>Authorized Devices</h3>
                  <p>Review and manage devices signed into your account</p>
                </div>
              </div>
              <div class="setting-action">
                <button mat-stroked-button class="action-btn">Manage</button>
              </div>
            </div>
          </div>

          <!-- Account Actions -->
          <div class="settings-section delete-section">
            <h2 class="section-title text-danger">Danger Zone</h2>
            
            <div class="setting-item border-danger">
              <div class="setting-info">
                <div class="setting-icon bg-light-danger">
                  <mat-icon class="text-danger">delete_forever</mat-icon>
                </div>
                <div>
                  <h3 class="text-danger">Deactivate Account</h3>
                  <p>Permanently remove your account and all associated data</p>
                </div>
              </div>
              <div class="setting-action">
                <button mat-flat-button color="warn" class="delete-btn">Deactivate</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

    .settings-page {
      min-height: 100vh;
      background: #F7F8F3;
      font-family: 'Inter', sans-serif;
    }

    .page-header {
      background: white;
      border-bottom: 1px solid #e8ecd8;
      padding: 20px 0;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 12px rgba(45,58,27,0.06);
    }

    .header-content {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .back-btn {
      color: #556B2F;
      background: #EBF0D8;
      border-radius: 50%;
      transition: all 0.2s ease;

      &:hover {
        background: #d4e09a;
        transform: translateX(-2px);
      }
    }

    .page-title {
      font-family: 'Outfit', sans-serif;
      font-size: 26px;
      font-weight: 800;
      color: #2D3A1B;
      margin: 0;
    }

    .page-subtitle {
      font-size: 13px;
      color: #7a8a5c;
      margin: 2px 0 0 0;
    }

    .settings-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    .settings-grid {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .settings-section {
      background: white;
      border-radius: 24px;
      padding: 32px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
      border: 1px solid rgba(85,107,47,0.05);
    }

    .section-title {
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: #2D3A1B;
      margin: 0 0 24px 0;
      border-bottom: 1px solid #f0f3eb;
      padding-bottom: 12px;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #f4f6f1;

      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      &:first-child {
        padding-top: 0;
      }
    }

    .setting-info {
      display: flex;
      align-items: center;
      gap: 16px;

      h3 {
        font-family: 'Outfit', sans-serif;
        font-size: 16px;
        font-weight: 600;
        color: #2D3A1B;
        margin: 0 0 4px 0;
      }

      p {
        font-size: 13px;
        color: #777;
        margin: 0;
      }
    }

    .setting-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;

      mat-icon {
        color: #2D3A1B;
      }
    }

    .bg-light-olive {
      background-color: #EBF0D8;
    }

    .bg-light-danger {
      background-color: #ffebee;
    }

    .text-danger {
      color: #d32f2f !important;
    }

    .custom-select {
      background-color: #f7f9ed;
      border: 1px solid #d8e5be;
      border-radius: 12px;
      padding: 8px 16px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      color: #2D3A1B;
      outline: none;
      cursor: pointer;
      min-width: 140px;
      transition: all 0.2s;

      &:focus {
        border-color: #556B2F;
        box-shadow: 0 0 0 2px rgba(85,107,47,0.1);
      }
    }

    .action-btn {
      border: 1px solid #d8e5be !important;
      color: #2D3A1B !important;
      border-radius: 12px !important;
      font-family: 'Outfit', sans-serif !important;
      font-weight: 600 !important;
    }

    .delete-btn {
      background-color: #d32f2f !important;
      color: white !important;
      border-radius: 12px !important;
      font-family: 'Outfit', sans-serif !important;
      font-weight: 600 !important;
    }

    /* Toggle Switch */
    .toggle-btn {
      width: 44px;
      height: 24px;
      border-radius: 12px;
      position: relative;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &.active {
        background-color: #556B2F;
        .toggle-knob {
          transform: translateX(20px);
        }
      }

      &.inactive {
        background-color: #e0e0e0;
        .toggle-knob {
          transform: translateX(0);
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
      background-color: #ffffff;
      transition: transform 0.2s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    }

    @media (max-width: 600px) {
      .setting-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .setting-action {
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
    }
  `]
})
export class SettingsComponent {
  private router = inject(Router);

  isTfaEnabled = false;

  goBack() {
    this.router.navigate(['/account']);
  }

  toggleTfa() {
    this.isTfaEnabled = !this.isTfaEnabled;
    const btn = document.querySelector('.toggle-btn');
    if (btn) {
      if (this.isTfaEnabled) {
        btn.classList.remove('inactive');
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
        btn.classList.add('inactive');
      }
    }
  }
}
