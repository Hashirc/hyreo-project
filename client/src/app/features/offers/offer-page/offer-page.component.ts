import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { RealtimeService } from '../../../core/services/realtime.service';
import { Product } from '../../../core/models/types';
import { handleImageFallback } from '../../../core/utils/image-fallback';

@Component({
  selector: 'app-offer-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="offer-page-container">
      <div class="navigation-row">
        <button mat-button routerLink="/products" class="back-btn">
          <mat-icon>keyboard_backspace</mat-icon> Back to All Products
        </button>
      </div>

      <!-- Modern Premium Offer Banner -->
      <div class="offer-banner" [class.dark-banner]="discount() === 50" [class.light-banner]="discount() === 25">
        <div class="banner-content">
          <span class="banner-badge">EXCLUSIVE DEALS</span>
          <h1 class="banner-title">Flat {{ discount() }}% Off</h1>
          <p class="banner-desc">
            @if (discount() === 50) {
              Experience premium sound and audio performance with our half-price studio and accessories collection.
            } @else {
              Upgrade your lifestyle with special handpicked essentials and fitness collections at a flat quarter-price off.
            }
          </p>
        </div>
        <div class="banner-visual" [class.visual-headphone]="discount() === 50" [class.visual-book]="discount() === 25"></div>
      </div>

      <!-- Subtitle and Count -->
      <div class="collection-bar">
        <span class="count-label">Displaying {{ filteredProducts().length }} product{{ filteredProducts().length === 1 ? '' : 's' }}</span>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="loading-wrapper">
          <div class="spinner"></div>
        </div>
      } @else {
        <!-- Products Grid -->
        @if (filteredProducts().length > 0) {
          <div class="deals-grid">
            @for (prod of filteredProducts(); track prod.id) {
              <div class="deal-card">
                <div class="image-section" [routerLink]="['/products', prod.id]">
                  <img [src]="prod.imageUrl" [alt]="prod.name" class="deal-img" (error)="handleImageError($event, prod)">
                  <span class="discount-tag">{{ discount() }}% OFF</span>
                </div>
                
                <div class="info-section">
                  <h3 class="deal-title" [routerLink]="['/products', prod.id]">{{ prod.name }}</h3>
                  
                  <div class="price-row">
                    <span class="current-price">\${{ prod.price | number:'1.2-2' }}</span>
                    <span class="original-price">\${{ getOriginalPrice(prod.price) | number:'1.2-2' }}</span>
                  </div>
                  
                  <div class="action-row">
                    <button class="add-btn" (click)="addToCart(prod)">
                      <mat-icon>shopping_cart</mat-icon> Add To Cart
                    </button>
                    <button class="view-btn" [routerLink]="['/products', prod.id]">
                      View Product
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="empty-state">
            <mat-icon>sentiment_dissatisfied</mat-icon>
            <h2>No deals found</h2>
            <p>We couldn't find any products assigned to this offer level. Please check back later!</p>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .offer-page-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px 60px;
      animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    @keyframes fadeUp {
      0% {
        opacity: 0;
        transform: translateY(16px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .navigation-row {
      margin-bottom: 24px;
    }

    .back-btn {
      color: #2D3A1B !important;
      font-weight: 600;
      font-size: 14px;
      padding-left: 0 !important;
      
      mat-icon {
        margin-right: 6px;
        transition: transform 0.2s ease;
      }

      &:hover mat-icon {
        transform: translateX(-4px);
      }
    }

    /* Modern Banner */
    .offer-banner {
      border-radius: 28px;
      padding: 48px;
      min-height: 280px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(45, 58, 27, 0.04);
      margin-bottom: 32px;
      border: 1px solid rgba(45, 58, 27, 0.06);
    }

    .dark-banner {
      background: linear-gradient(135deg, #2D3A1B 0%, #1E2712 100%);
      color: #ffffff;
      .banner-badge {
        background-color: rgba(255, 255, 255, 0.12);
        color: #D8E5BE;
      }
      .banner-title {
        color: #ffffff;
      }
      .banner-desc {
        color: rgba(255, 255, 255, 0.8);
      }
    }

    .light-banner {
      background-color: #E2ECB8;
      color: #2D3A1B;
      .banner-badge {
        background-color: #FAF9F5;
        color: #2D3A1B;
      }
      .banner-title {
        color: #2D3A1B;
      }
      .banner-desc {
        color: #5A664A;
      }
    }

    .banner-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 60%;
      z-index: 2;
    }

    .banner-badge {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      padding: 6px 14px;
      border-radius: 20px;
      width: fit-content;
    }

    .banner-title {
      font-family: 'Outfit', sans-serif;
      font-size: 40px;
      font-weight: 800;
      margin: 0;
      line-height: 1.15;
    }

    .banner-desc {
      font-size: 15px;
      line-height: 1.5;
      margin: 0;
    }

    .banner-visual {
      width: 160px;
      height: 160px;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      z-index: 1;
      opacity: 0.95;
    }

    .visual-headphone {
      background-image: url('/assets/flat_50/headphone.webp');
    }

    .visual-book {
      background-image: url('/assets/flat_25/book.webp');
    }

    /* Collection Bar */
    .collection-bar {
      margin-bottom: 24px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(45, 58, 27, 0.08);
    }

    .count-label {
      font-size: 14px;
      font-weight: 700;
      color: #5A664A;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Grid Layout */
    .deals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 28px;
    }

    .deal-card {
      display: flex;
      flex-direction: column;
      background-color: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid rgba(45, 58, 27, 0.05);
      transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease;
      box-shadow: 0 4px 15px rgba(45, 58, 27, 0.01);
      height: 100%;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 24px rgba(45, 58, 27, 0.05);
        
        .deal-img {
          transform: scale(1.03);
        }
      }
    }

    .image-section {
      position: relative;
      height: 240px;
      background-color: #FAFBF7;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      overflow: hidden;
      cursor: pointer;
    }

    .deal-img {
      max-width: 90%;
      max-height: 90%;
      width: auto;
      height: auto;
      object-fit: contain;
      transition: transform 0.4s ease;
    }

    .discount-tag {
      position: absolute;
      top: 16px;
      left: 16px;
      background-color: #2D3A1B;
      color: #ffffff;
      font-size: 10px;
      font-weight: 800;
      padding: 5px 10px;
      border-radius: 20px;
      letter-spacing: 0.5px;
      z-index: 10;
    }

    .info-section {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex-grow: 1;
    }

    .deal-title {
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 17px;
      color: #2D3A1B;
      margin: 0;
      line-height: 1.35;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      height: 46px;
      cursor: pointer;

      &:hover {
        color: #5A703F;
      }
    }

    .price-row {
      display: flex;
      align-items: baseline;
      gap: 10px;
      margin-top: auto;
    }

    .current-price {
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: #2D3A1B;
    }

    .original-price {
      font-size: 14px;
      font-weight: 500;
      color: #a0a0a0;
      text-decoration: line-through;
    }

    .action-row {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 8px;
    }

    .add-btn {
      background-color: #2D3A1B;
      color: #ffffff;
      border: none;
      height: 40px;
      border-radius: 20px;
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: #1E2712;
      }

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    }

    .view-btn {
      background-color: transparent;
      color: #2D3A1B;
      border: 1px solid rgba(45, 58, 27, 0.2);
      height: 40px;
      border-radius: 20px;
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background-color: rgba(45, 58, 27, 0.04);
        border-color: #2D3A1B;
      }
    }

    /* Loading / Empty */
    .loading-wrapper {
      display: flex;
      justify-content: center;
      padding: 100px 0;
    }

    .spinner {
      width: 44px;
      height: 44px;
      border: 3px solid rgba(45, 58, 27, 0.08);
      border-top-color: #2D3A1B;
      border-radius: 50%;
      animation: spin 0.8s infinite linear;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 64px 24px;
      gap: 16px;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #5A664A;
      }

      h2 {
        font-size: 20px;
        color: #2D3A1B;
        margin: 0;
      }

      p {
        font-size: 14px;
        color: #5A664A;
        max-width: 400px;
        margin: 0;
      }
    }

    /* Responsive */
    @media (max-width: 900px) {
      .offer-banner {
        padding: 36px;
      }
      .banner-title {
        font-size: 32px;
      }
    }

    @media (max-width: 600px) {
      .offer-banner {
        flex-direction: column;
        align-items: flex-start;
        gap: 24px;
        padding: 30px;
      }
      .banner-content {
        max-width: 100%;
      }
    }
  `]
})
export class OfferPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private realtimeService = inject(RealtimeService);

  readonly discount = signal<number>(25);
  readonly filteredProducts = signal<Product[]>([]);
  readonly isLoading = signal(true);

  ngOnInit() {
    this.realtimeService.init();

    this.realtimeService.productChanged$.subscribe(() => {
      this.loadDeals(this.discount());
    });

    this.route.data.subscribe(data => {
      const discountVal = data['discount'] || 25;
      this.discount.set(discountVal);
      this.loadDeals(discountVal);
    });
  }

  loadDeals(discountVal: number) {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (prods) => {
        const prefix = `flat${discountVal}_`;
        const matched = prods.filter(p => p.id.startsWith(prefix) || p.discount === discountVal);
        this.filteredProducts.set(matched);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load products for offer page', err);
        this.isLoading.set(false);
      }
    });
  }

  getOriginalPrice(price: number): number {
    const factor = this.discount() === 50 ? 0.5 : 0.75;
    return parseFloat((price / factor).toFixed(2));
  }

  addToCart(prod: Product) {
    this.cartService.addToCart(prod, 1);
    alert(`${prod.name} added to cart!`);
  }

  handleImageError(event: any, prod: Product) {
    handleImageFallback(event, prod);
  }
}
