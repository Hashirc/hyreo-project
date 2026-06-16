import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DealOfTheDayComponent } from './deal-of-the-day/deal-of-the-day.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/types';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, DealOfTheDayComponent, ProductCardComponent],
  template: `
    <div class="home-page">
      <!-- Top Deal of the Day Banner -->
      <app-deal-of-the-day></app-deal-of-the-day>

      <!-- Side-by-side Promo Cards -->
      <section class="promo-cards-section">
        <div class="promo-grid">
          <!-- Card 1: Dark Forest Green -->
          <div class="promo-card dark-card" (click)="filterOffer('50')">
            <div class="promo-card-content">
              <span class="promo-badge">LIMITED TIME OFFER</span>
              <h2>Flat 50% Off</h2>
              <p>On all premium audio accessories and studio equipment.</p>
              <button class="promo-btn-white">Shop Collection</button>
            </div>
            <div class="promo-card-visual bg-headphone"></div>
          </div>

          <!-- Card 2: Light Sage Green -->
          <div class="promo-card light-card" (click)="filterOffer('25')">
            <div class="promo-card-content">
              <span class="promo-badge">PERSONAL CARE</span>
              <h2>Flat 25% Off</h2>
              <p>Explore our curated selection of lifestyle essentials.</p>
              <button class="promo-btn-dark">View Deals</button>
            </div>
            <div class="promo-card-visual bg-sunglasses"></div>
          </div>
        </div>
      </section>

      <!-- Value Props Highlights Section -->
      <section class="value-props-section">
        <div class="value-prop-box">
          <div class="icon-circle">
            <mat-icon>local_shipping</mat-icon>
          </div>
          <div class="value-text">
            <h3>Global Shipping</h3>
            <p>FAST AND SECURE DELIVERY</p>
          </div>
        </div>
        <div class="value-prop-box">
          <div class="icon-circle">
            <mat-icon>security</mat-icon>
          </div>
          <div class="value-text">
            <h3>Secure Payments</h3>
            <p>SSL ENCRYPTED TRANSACTIONS</p>
          </div>
        </div>
        <div class="value-prop-box">
          <div class="icon-circle">
            <mat-icon>headset_mic</mat-icon>
          </div>
          <div class="value-text">
            <h3>Expert Concierge</h3>
            <p>24/7 PERSONAL SUPPORT</p>
          </div>
        </div>
      </section>

      <!-- Curated Collection Grid Section -->
      <section class="curated-section">
        <div class="curated-header">
          <div class="title-area">
            <span class="section-tag">CURATED COLLECTION</span>
            <h2 class="section-title">
              @if (currentOffer() === '50') { Flat 50% Off Collection }
              @else if (currentOffer() === '25') { Flat 25% Off Collection }
              @else { Seasonal Essentials }
            </h2>
          </div>
          <div style="display: flex; align-items: center; gap: 16px;">
            @if (currentOffer() !== 'all') {
              <button mat-button color="primary" (click)="filterOffer('all')">View All Products</button>
            }
            <a routerLink="/products" class="view-all-link">
              <span>Shop All</span>
              <mat-icon>arrow_forward</mat-icon>
            </a>
          </div>
        </div>

        <div class="product-grid-container">
          @if (isLoading()) {
            <div class="grid-loading">
              <div class="spinner"></div>
            </div>
          } @else {
            <div class="products-grid">
              @for (prod of curatedProducts(); track prod.id) {
                <app-product-card [product]="prod"></app-product-card>
              }
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      display: flex;
      flex-direction: column;
      gap: 48px;
      padding-bottom: 60px;
      background-color: #F7F9ED;
    }

    /* Promo Banners */
    .promo-cards-section {
      width: 100%;
    }

    .promo-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .promo-card {
      border-radius: 28px;
      padding: 40px;
      min-height: 280px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(45, 58, 27, 0.02);
      transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(45, 58, 27, 0.08);
      }
    }

    .dark-card {
      background: linear-gradient(135deg, #2D3A1B 0%, #1E2712 100%);
      color: #ffffff;

      .promo-badge {
        background-color: rgba(255, 255, 255, 0.12);
        color: #D8E5BE;
      }

      h2 {
        color: #ffffff;
      }

      p {
        color: rgba(255, 255, 255, 0.8);
      }
    }

    .light-card {
      background-color: #E2ECB8;
      color: #2D3A1B;

      .promo-badge {
        background-color: #FAF9F5;
        color: #2D3A1B;
      }

      h2 {
        color: #2D3A1B;
      }

      p {
        color: #5A664A;
      }
    }

    .promo-card-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 60%;
      z-index: 2;

      .promo-badge {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 1.2px;
        padding: 6px 14px;
        border-radius: 20px;
        width: fit-content;
      }

      h2 {
        font-family: 'Outfit', sans-serif;
        font-size: 32px;
        font-weight: 800;
        margin: 0;
        line-height: 1.15;
      }

      p {
        font-size: 14px;
        line-height: 1.4;
        margin: 0;
      }
    }

    .promo-btn-white {
      background-color: #ffffff;
      color: #2D3A1B;
      border: none;
      padding: 10px 24px;
      border-radius: 20px;
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 13px;
      width: fit-content;
      cursor: pointer;
      transition: background-color 0.2s ease;
      margin-top: 8px;

      &:hover {
        background-color: rgba(255, 255, 255, 0.9);
      }
    }

    .promo-btn-dark {
      background-color: #2D3A1B;
      color: #ffffff;
      border: none;
      padding: 10px 24px;
      border-radius: 20px;
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 13px;
      width: fit-content;
      cursor: pointer;
      transition: background-color 0.2s ease;
      margin-top: 8px;

      &:hover {
        background-color: #1E2712;
      }
    }

    .promo-card-visual {
      width: 150px;
      height: 150px;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      z-index: 1;
      opacity: 0.95;
    }

    .bg-headphone {
      background-image: url('/assets/flat_50/headphone.webp');
    }

    .bg-sunglasses {
      background-image: url('/assets/flat_25/book.webp'); /* fallback */
    }

    /* Value Props Highlights */
    .value-props-section {
      background-color: #F4F6EC;
      border-radius: 24px;
      padding: 24px 40px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      gap: 20px;
      border: 1px solid rgba(45, 58, 27, 0.05);
    }

    .value-prop-box {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .icon-circle {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: #D8E5BE;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #2D3A1B;

      mat-icon {
        font-size: 24px;
        height: 24px;
        width: 24px;
      }
    }

    .value-text {
      display: flex;
      flex-direction: column;
      
      h3 {
        font-family: 'Outfit', sans-serif;
        font-size: 16px;
        font-weight: 700;
        color: #2D3A1B;
        margin: 0;
      }

      p {
        font-size: 10px;
        font-weight: 700;
        color: #5A664A;
        letter-spacing: 0.5px;
        margin: 2px 0 0 0;
      }
    }

    /* Curated Section */
    .curated-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .curated-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 1px solid rgba(45, 58, 27, 0.08);
      padding-bottom: 12px;
    }

    .title-area {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .section-tag {
        font-size: 11px;
        font-weight: 700;
        color: #5A664A;
        letter-spacing: 1.5px;
        text-transform: uppercase;
      }

      .section-title {
        font-family: 'Outfit', sans-serif;
        font-size: 28px;
        font-weight: 800;
        color: #2D3A1B;
        margin: 0;
      }
    }

    .view-all-link {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #5A664A;
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: #2D3A1B;

        mat-icon {
          transform: translateX(4px);
        }
      }

      mat-icon {
        font-size: 16px;
        height: 16px;
        width: 16px;
        transition: transform 0.2s ease;
      }
    }

    /* Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 24px;
    }

    .grid-loading {
      display: flex;
      justify-content: center;
      padding: 80px 0;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(45, 58, 27, 0.08);
      border-top-color: #2D3A1B;
      border-radius: 50%;
      animation: spin 0.8s infinite linear;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Responsive */
    @media (max-width: 900px) {
      .promo-grid {
        grid-template-columns: 1fr;
      }

      .value-props-section {
        flex-direction: column;
        align-items: flex-start;
        padding: 30px;
      }

      .section-title {
        font-size: 22px !important;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);

  allProducts: Product[] = [];
  curatedProducts = signal<Product[]>([]);
  isLoading = signal(true);
  currentOffer = signal<string>('all');

  ngOnInit() {
    this.loadCuratedProducts();
  }

  loadCuratedProducts() {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (prods) => {
        this.allProducts = prods;
        this.filterOffer('all');
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load curated products', err);
        this.isLoading.set(false);
      }
    });
  }

  filterOffer(offer: string) {
    this.currentOffer.set(offer);
    if (offer === '50') {
      this.curatedProducts.set(this.allProducts.filter(p => p.categoryId === 'mobile-computers').slice(0, 12));
    } else if (offer === '25') {
      this.curatedProducts.set(this.allProducts.filter(p => p.categoryId === 'sports-fitness').slice(0, 12));
    } else {
      this.curatedProducts.set(this.allProducts.slice(0, 12));
    }
  }
}
