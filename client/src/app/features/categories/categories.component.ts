import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="categories-page">
      <section class="explore-section">
        <div class="explore-header">
          <h2 class="explore-title">Explore Essentials.</h2>
          <p class="explore-subtitle">Discover our curated selection of high-end lifestyle categories,<br>designed for those who appreciate organic precision and refined living.</p>
        </div>

        <div class="explore-grid">
          <a routerLink="/products" [queryParams]="{ category: 'mobile-computers' }" class="bento-card bento-large bg-electronics">
            <div class="bento-content">
              <span class="new-arrival-badge">New Arrival</span>
              <h3>Electronics</h3>
              <p>Next-generation devices where high-tech<br>performance meets sculptural form.</p>
              <button class="browse-btn" tabindex="-1">Browse Series <mat-icon>arrow_forward</mat-icon></button>
            </div>
          </a>
          
          <a routerLink="/products" [queryParams]="{ category: 'fashion' }" class="bento-card bento-tall bg-fashion">
            <div class="bento-content">
              <h3>Fashion</h3>
              <p>Timeless silhouettes crafted from<br>premium sustainable fibers.</p>
            </div>
          </a>

          <a routerLink="/products" [queryParams]="{ category: 'home-lifestyle' }" class="bento-card bento-small bg-home">
            <div class="bento-content">
              <h3>Home & Living</h3>
            </div>
          </a>

          <a routerLink="/products" [queryParams]="{ category: 'sports-fitness' }" class="bento-card bento-small bg-sports">
            <div class="bento-content">
              <h3>Sports</h3>
            </div>
          </a>

          <a routerLink="/products" [queryParams]="{ category: 'personal-care' }" class="bento-card bento-small bg-beauty">
            <div class="bento-content">
              <h3>Beauty</h3>
            </div>
          </a>
        </div>

        <div class="concierge-card">
          <div class="concierge-info">
            <h3>Can't find what you're looking for?</h3>
            <p>Our concierge team is available to help you source the<br>finest items from our global network of luxury partners.</p>
          </div>
          <div class="concierge-actions">
            <button class="btn-primary-dark">Contact Concierge</button>
            <button class="btn-outline-dark" routerLink="/products">View All Collections</button>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .categories-page {
      display: flex;
      flex-direction: column;
      padding: 48px 60px;
      background-color: #F7F9ED;
      min-height: calc(100vh - 80px);
    }

    .explore-section {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .explore-header {
      margin-bottom: 8px;
    }

    .explore-title {
      font-family: 'Outfit', sans-serif;
      font-size: 40px;
      font-weight: 800;
      color: #1e2610;
      margin: 0 0 12px 0;
    }

    .explore-subtitle {
      font-size: 15px;
      color: #4a5435;
      margin: 0;
      line-height: 1.5;
    }

    .explore-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: 280px;
      gap: 24px;
    }

    .bento-card {
      border-radius: 28px;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 32px;
      background-size: cover;
      background-position: center;
      background-color: #4a5435;
      color: #ffffff;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      text-decoration: none;
      transition: transform 0.3s ease, box-shadow 0.3s ease;

      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60%;
        background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
        z-index: 1;
      }

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
      }
    }

    .bento-content {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      h3 {
        font-family: 'Outfit', sans-serif;
        font-size: 28px;
        font-weight: 700;
        margin: 0 0 8px 0;
      }

      p {
        font-size: 14px;
        line-height: 1.4;
        color: rgba(255,255,255,0.85);
        margin: 0;
      }
    }

    .bento-large {
      grid-column: span 2;
      grid-row: span 2;
    }

    .bento-tall {
      grid-column: span 1;
      grid-row: span 2;
    }

    .bento-small {
      grid-column: span 1;
      grid-row: span 1;
      padding: 24px;

      .bento-content {
        h3 {
          font-size: 20px;
          margin: 0;
        }
      }
    }

    .new-arrival-badge {
      background-color: #556B2F;
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      padding: 6px 12px;
      border-radius: 16px;
      margin-bottom: 12px;
      letter-spacing: 0.5px;
    }

    .browse-btn {
      background-color: #ffffff;
      color: #1e2610;
      border: none;
      padding: 10px 20px;
      border-radius: 24px;
      font-weight: 600;
      font-size: 14px;
      margin-top: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: background-color 0.2s ease;

      mat-icon {
        font-size: 18px;
        height: 18px;
        width: 18px;
      }

      &:hover {
        background-color: #f0f0f0;
      }
    }

    /* Backgrounds */
    .bg-electronics {
      background-color: #2D3A1B;
      background-image: url('https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800');
    }

    .bg-fashion {
      background-color: #4a5435;
      background-image: url('https://images.unsplash.com/photo-1434389678240-619da01c3df6?auto=format&fit=crop&q=80&w=600');
    }

    .bg-home {
      background-color: #8c9c71;
      background-image: url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400');
    }

    .bg-sports {
      background-color: #6a7c50;
      background-image: url('https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=400');
    }

    .bg-beauty {
      background-color: #3b4528;
      background-image: url('https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400');
    }

    .concierge-card {
      background-color: #f4f6ec;
      border: 1px solid rgba(85, 107, 47, 0.1);
      border-radius: 24px;
      padding: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
    }

    .concierge-info {
      h3 {
        font-family: 'Outfit', sans-serif;
        font-size: 24px;
        font-weight: 700;
        color: #1e2610;
        margin: 0 0 8px 0;
      }

      p {
        font-size: 14px;
        color: #556B2F;
        margin: 0;
        line-height: 1.5;
      }
    }

    .concierge-actions {
      display: flex;
      gap: 16px;
    }

    .btn-primary-dark {
      background-color: #4a5435;
      color: #ffffff;
      border: none;
      padding: 12px 24px;
      border-radius: 24px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: #384028;
      }
    }

    .btn-outline-dark {
      background-color: transparent;
      color: #4a5435;
      border: 1px solid #4a5435;
      padding: 12px 24px;
      border-radius: 24px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background-color: rgba(74, 84, 53, 0.05);
      }
    }

    @media (max-width: 900px) {
      .categories-page {
        padding: 24px;
      }
      .explore-grid {
        grid-template-columns: 1fr;
        grid-auto-rows: minmax(200px, auto);
      }
      .bento-large, .bento-tall, .bento-small {
        grid-column: span 1;
        grid-row: span 1;
      }
      .concierge-card {
        flex-direction: column;
        gap: 24px;
        align-items: flex-start;
      }
    }
  `]
})
export class CategoriesComponent {
}
