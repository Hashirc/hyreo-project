import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  template: `
    <div class="categories-page">
      <section class="categories-section">

        <!-- Page Header -->
        <div class="page-header">
          <span class="section-tag">SHOP BY CATEGORY</span>
          <h1 class="page-title">Explore Essentials.</h1>
          <p class="page-subtitle">
            Discover our curated selection of high-end lifestyle categories,
            designed for those who appreciate quality and refined living.
          </p>
        </div>

        <!-- Bento Grid -->
        <div class="bento-grid">

          <!-- Mobile & Laptops — Large hero (2 cols × 2 rows) -->
          <a
            routerLink="/products"
            [queryParams]="{ category: 'mobile-computers' }"
            class="bento-card hero-card"
            style="background-image: url('https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&q=80&w=1200')">
            <div class="card-overlay"></div>
            <div class="card-content">
              <span class="new-badge">New Arrival</span>
              <h2>Mobile &amp; Laptops</h2>
              <p>Next-generation smartphones and laptops where high-tech performance meets sculpted design.</p>
              <span class="browse-btn">Browse Series <mat-icon>arrow_forward</mat-icon></span>
            </div>
          </a>

          <!-- Men's Fashion — 1 col × 1 row -->
          <a
            routerLink="/products"
            [queryParams]="{ category: 'mens-fashion' }"
            class="bento-card small-card"
            style="background-image: url('https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&q=80&w=800')">
            <div class="card-overlay"></div>
            <div class="card-content">
              <h3>Men's Fashion</h3>
              <p>Premium clothing &amp; accessories for the modern man.</p>
            </div>
          </a>

          <!-- Women's Fashion — 1 col × 1 row -->
          <a
            routerLink="/products"
            [queryParams]="{ category: 'womens-fashion' }"
            class="bento-card small-card"
            style="background-image: url('https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800')">
            <div class="card-overlay"></div>
            <div class="card-content">
              <h3>Women's Fashion</h3>
              <p>Timeless silhouettes crafted from premium sustainable fibers.</p>
            </div>
          </a>

          <!-- Home Appliances — 1 col × 1 row -->
          <a
            routerLink="/products"
            [queryParams]="{ category: 'home-lifestyle' }"
            class="bento-card small-card"
            style="background-image: url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800')">
            <div class="card-overlay"></div>
            <div class="card-content">
              <h3>Home Appliances</h3>
              <p>Refrigerators, washers &amp; kitchen essentials.</p>
            </div>
          </a>

          <!-- Sports & Fitness — 1 col × 1 row -->
          <a
            routerLink="/products"
            [queryParams]="{ category: 'sports-fitness' }"
            class="bento-card small-card"
            style="background-image: url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800')">
            <div class="card-overlay"></div>
            <div class="card-content">
              <h3>Sports &amp; Fitness</h3>
              <p>Gym equipment and fitness gear for every level.</p>
            </div>
          </a>

          <!-- Beauty — Wide card (2 cols × 1 row) -->
          <a
            routerLink="/products"
            [queryParams]="{ category: 'personal-care' }"
            class="bento-card wide-card"
            style="background-image: url('https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1200')">
            <div class="card-overlay"></div>
            <div class="card-content">
              <h3>Beauty &amp; Skincare</h3>
              <p>Premium skincare, cosmetics and self-care essentials curated for you.</p>
            </div>
          </a>

        </div>

        <!-- Concierge Banner -->
        <div class="concierge-banner">
          <div class="concierge-text">
            <h3>Can't find what you're looking for?</h3>
            <p>Our concierge team is available to help you source the finest items from our global network of luxury partners.</p>
          </div>
          <div class="concierge-actions">
            <button class="btn-primary">Contact Concierge</button>
            <a routerLink="/products" class="btn-outline">View All Collections</a>
          </div>
        </div>

      </section>
    </div>
  `,
  styles: [`
    /* ── Page Shell ── */
    .categories-page {
      background-color: #F7F9ED;
      min-height: calc(100vh - 72px);
      padding: 56px 60px 72px;
    }

    .categories-section {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 40px;
    }

    /* ── Page Header ── */
    .page-header {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .section-tag {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #5A664A;
      text-transform: uppercase;
    }

    .page-title {
      font-family: 'Outfit', sans-serif;
      font-size: 44px;
      font-weight: 800;
      color: #1e2610;
      margin: 0;
      line-height: 1.1;
    }

    .page-subtitle {
      font-size: 15px;
      color: #556B2F;
      margin: 0;
      line-height: 1.6;
      max-width: 560px;
    }

    /* ── Bento Grid ── */
    .bento-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: 300px 300px 220px;
      gap: 20px;
    }

    /* ── Card Base ── */
    .bento-card {
      position: relative;
      border-radius: 28px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      text-decoration: none;
      background-size: cover;
      background-position: center;
      background-color: #2D3A1B;
      color: #fff;
      cursor: pointer;
      transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                  box-shadow 0.35s ease;

      &:hover {
        transform: translateY(-6px) scale(1.01);
        box-shadow: 0 20px 48px rgba(45, 58, 27, 0.20);

        .card-overlay {
          opacity: 0.75;
        }

        .browse-btn mat-icon {
          transform: translateX(4px);
        }
      }
    }

    /* Overlay */
    .card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(10,16,6,0.88) 0%, rgba(10,16,6,0.35) 55%, transparent 100%);
      transition: opacity 0.35s ease;
      opacity: 0.65;
    }

    /* Content */
    .card-content {
      position: relative;
      z-index: 2;
      padding: 28px 32px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      h2 {
        font-family: 'Outfit', sans-serif;
        font-size: 32px;
        font-weight: 800;
        margin: 0;
        line-height: 1.15;
        color: #fff;
      }

      h3 {
        font-family: 'Outfit', sans-serif;
        font-size: 22px;
        font-weight: 700;
        margin: 0;
        color: #fff;
      }

      p {
        font-size: 13px;
        line-height: 1.45;
        color: rgba(255, 255, 255, 0.82);
        margin: 0;
        max-width: 360px;
      }
    }

    .new-badge {
      background-color: #6B8E23;
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.8px;
      padding: 5px 12px;
      border-radius: 20px;
      width: fit-content;
      text-transform: uppercase;
    }

    .browse-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background-color: #ffffff;
      color: #1e2610;
      border-radius: 24px;
      padding: 10px 20px;
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      font-weight: 700;
      width: fit-content;
      margin-top: 6px;

      mat-icon {
        font-size: 17px;
        height: 17px;
        width: 17px;
        transition: transform 0.25s ease;
      }
    }

    /* ── Layout Variants ── */
    .hero-card {
      grid-column: span 2;
      grid-row: span 2;
    }

    .small-card {
      grid-column: span 1;
      grid-row: span 1;

      .card-content {
        padding: 22px 24px;
        p { font-size: 12px; }
      }
    }

    .wide-card {
      grid-column: span 2;
      grid-row: span 1;
    }

    /* ── Concierge Banner ── */
    .concierge-banner {
      background-color: #EDEEE4;
      border: 1px solid rgba(85, 107, 47, 0.10);
      border-radius: 28px;
      padding: 40px 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 32px;
    }

    .concierge-text {
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
        line-height: 1.55;
        max-width: 480px;
      }
    }

    .concierge-actions {
      display: flex;
      gap: 14px;
      flex-shrink: 0;
    }

    .btn-primary {
      background-color: #4a5435;
      color: #fff;
      border: none;
      padding: 12px 28px;
      border-radius: 24px;
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover { background-color: #384028; }
    }

    .btn-outline {
      background-color: transparent;
      color: #4a5435;
      border: 2px solid #4a5435;
      padding: 10px 28px;
      border-radius: 24px;
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      transition: background-color 0.2s ease;

      &:hover { background-color: rgba(74, 84, 53, 0.06); }
    }

    /* ── Responsive ── */
    @media (max-width: 1024px) {
      .categories-page { padding: 40px 32px 56px; }
      .page-title { font-size: 36px; }
    }

    @media (max-width: 768px) {
      .categories-page { padding: 32px 20px 48px; }
      .page-title { font-size: 30px; }

      .bento-grid {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto;
      }

      .hero-card {
        grid-column: span 2;
        grid-row: span 1;
        min-height: 260px;
      }

      .small-card {
        grid-column: span 1;
        min-height: 200px;
      }

      .wide-card {
        grid-column: span 2;
        min-height: 200px;
      }

      .concierge-banner {
        flex-direction: column;
        align-items: flex-start;
        padding: 32px 28px;
        gap: 24px;
      }

      .concierge-actions { flex-wrap: wrap; }
    }

    @media (max-width: 480px) {
      .bento-grid {
        grid-template-columns: 1fr;
      }

      .hero-card,
      .small-card,
      .wide-card {
        grid-column: span 1;
        min-height: 220px;
      }
    }
  `]
})
export class CategoriesComponent {}
