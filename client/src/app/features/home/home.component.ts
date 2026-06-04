import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../core/services/product.service';
import { Product, Category } from '../../core/models/types';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { DealOfTheDayComponent } from './deal-of-the-day/deal-of-the-day.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, ProductCardComponent, DealOfTheDayComponent],
  template: `
    <div class="home-page">
      <!-- Hero Banner -->
      <section class="hero bg-light-olive">
        <div class="hero-content">
          <span class="hero-tag">100% Organic & Sustainable</span>
          <h1 class="hero-title">Experience the Purity of Olive Living</h1>
          <p class="hero-description">
            Explore our curated collections of cold-pressed extra virgin olive oils, botanical body care infused with olive leaf extracts, and handcrafted olive wood essentials.
          </p>
          <div class="hero-actions">
            <button mat-raised-button color="primary" routerLink="/products" class="cta-btn font-outfit">
              Shop Collections <mat-icon>trending_flat</mat-icon>
            </button>
            <button mat-outlined-button routerLink="/products" class="sec-btn font-outfit">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <!-- Categories Section -->
      <section class="categories-section">
        <div class="section-header">
          <h2>Shop by Category</h2>
          <p>Carefully selected items grouped for easy discovery</p>
        </div>
        <div class="categories-grid">
          @for (cat of categories(); track cat.id) {
            <div class="category-card" [routerLink]="['/products']" [queryParams]="{category: cat.id}">
              <img [src]="cat.imageUrl" [alt]="cat.name" class="cat-img">
              <div class="cat-overlay">
                <h3>{{ cat.name }}</h3>
                <span class="explore-btn">Explore <mat-icon>arrow_forward</mat-icon></span>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Deal of the Day Section -->
      <app-deal-of-the-day></app-deal-of-the-day>

      <!-- Featured Products Section -->
      <section class="featured-section">
        <div class="section-header">
          <h2>Featured Products</h2>
          <p>Our top-rated products loved by customers</p>
        </div>
        <div class="product-grid">
          @for (prod of featuredProducts(); track prod.id) {
            <app-product-card [product]="prod"></app-product-card>
          }
        </div>
      </section>

      <div class="view-all-row">
        <button mat-outlined-button color="primary" routerLink="/products" class="view-all-btn">
          View All Products
        </button>
      </div>
    </div>
  `,
  styles: [`
    .home-page {
      display: flex;
      flex-direction: column;
      gap: 56px;
    }

    // Hero Section
    .hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 20px;
      padding: 56px;
      min-height: 480px;
      gap: 32px;
      overflow: hidden;
    }

    .hero-content {
      flex: 1;
      max-width: 550px;
    }

    .hero-tag {
      font-size: 12px;
      text-transform: uppercase;
      font-weight: 700;
      color: #708623;
      letter-spacing: 1.5px;
      margin-bottom: 12px;
      display: inline-block;
    }

    .hero-title {
      font-size: 44px;
      line-height: 1.15;
      margin-bottom: 16px;
      color: #1e2610;
    }

    .hero-description {
      font-size: 16px;
      line-height: 1.6;
      color: #4a5435;
      margin-bottom: 32px;
    }

    .hero-actions {
      display: flex;
      gap: 16px;
    }

    .cta-btn {
      padding: 0 24px !important;
      height: 48px !important;
      font-size: 15px !important;

      mat-icon {
        margin-left: 8px;
        font-size: 20px;
        height: 20px;
        width: 20px;
      }
    }

    .sec-btn {
      height: 48px !important;
      padding: 0 24px !important;
      font-size: 15px !important;
    }

    .hero-image-wrapper {
      flex: 1;
      display: flex;
      justify-content: center;
      max-width: 450px;
      height: 380px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 12px 30px rgba(85, 107, 47, 0.15);
    }

    .hero-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 8s ease;

      &:hover {
        transform: scale(1.05);
      }
    }

    // Section Header
    .section-header {
      text-align: center;
      margin-bottom: 32px;

      h2 {
        font-size: 32px;
        color: #1e2610;
        margin-bottom: 8px;
      }

      p {
        font-size: 15px;
        color: #63791d;
      }
    }

    // Categories Section
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
    }

    .category-card {
      position: relative;
      height: 280px;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

      .cat-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }

      .cat-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to top, rgba(85, 107, 47, 0.8) 10%, rgba(0, 0, 0, 0.2) 100%);
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 24px;
        color: #ffffff;
        transition: background-color 0.3s ease;

        h3 {
          color: #ffffff;
          font-size: 20px;
          margin-bottom: 6px;
        }

        .explore-btn {
          font-size: 13px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          opacity: 0.8;
          transition: transform 0.2s ease, opacity 0.2s ease;

          mat-icon {
            font-size: 16px;
            height: 16px;
            width: 16px;
          }
        }
      }

      &:hover {
        .cat-img {
          transform: scale(1.05);
        }

        .cat-overlay {
          background-color: rgba(85, 107, 47, 0.4);
        }

        .explore-btn {
          opacity: 1;
          transform: translateX(4px);
        }
      }
    }

    // View All button
    .view-all-row {
      .hero-content {
        max-width: 100%;
      }

      .hero-title {
        font-size: 32px;
      }

      .hero-actions {
        justify-content: center;
      }

      .hero-image-wrapper {
        max-width: 100%;
        width: 100%;
        height: 280px;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);

  readonly categories = signal<Category[]>([]);
  readonly featuredProducts = signal<Product[]>([]);
  readonly dealImages = signal<string[]>([]);

  ngOnInit() {
    this.productService.getCategories().subscribe(cats => {
      this.categories.set(cats);
    });

    this.productService.getProducts().subscribe(prods => {
      const sorted = [...prods].sort((a, b) => b.rating - a.rating);
      this.featuredProducts.set(sorted.slice(0, 4));
      this.dealImages.set([
        'assets/deal-of-the-day/earpod_deal.jpg',
        'assets/deal-of-the-day/shoe_deal.jpg',
        'assets/deal-of-the-day/trimmer_deal.jpg',
        'assets/deal-of-the-day/tv_deal.jpg',
        'assets/deal-of-the-day/whey_deal.jpg'
      ]);
    });
  }
}
