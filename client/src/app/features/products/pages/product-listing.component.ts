import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { ProductCardComponent } from '../../../shared/components/product-card.component';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/cart.model';

@Component({
  selector: 'app-product-listing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    ProductCardComponent
  ],
  template: `
    <div class="products-container">
      <div class="hero-section">
        <h1>Our Products</h1>
        <p>Discover our wide range of quality products</p>
      </div>

      <div class="products-section">
        <div class="filter-sidebar">
          <div class="filter-group">
            <h3>Categories</h3>
            <div class="category-list">
              <button 
                *ngFor="let category of productService.categories()"
                (click)="filterByCategory(category.id)"
                [class.active]="selectedCategory() === category.id"
                class="category-btn">
                {{ category.name }}
              </button>
            </div>
          </div>
        </div>

        <div class="products-grid">
          @if (productService.loading()) {
            <div class="loader">
              <mat-spinner></mat-spinner>
            </div>
          } @else if (filteredProducts().length > 0) {
            <mat-grid-list [cols]="cols()" gutterSize="24px">
              @for (product of filteredProducts(); track product.id) {
                <mat-grid-tile>
                  <app-product-card [product]="product"></app-product-card>
                </mat-grid-tile>
              }
            </mat-grid-list>
          } @else {
            <div class="no-products">
              <p>No products found. Try a different filter.</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .products-container {
      min-height: calc(100vh - 300px);
    }

    .hero-section {
      background: linear-gradient(135deg, #556B2F 0%, #3d4d1f 100%);
      color: white;
      padding: 60px 20px;
      text-align: center;
      margin-bottom: 40px;
    }

    .hero-section h1 {
      font-size: 42px;
      font-weight: 700;
      margin: 0 0 10px 0;
    }

    .hero-section p {
      font-size: 18px;
      margin: 0;
      color: rgba(255, 255, 255, 0.9);
    }

    .products-section {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 30px;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 20px 60px;
    }

    .filter-sidebar {
      position: sticky;
      top: 100px;
      height: fit-content;
    }

    .filter-group h3 {
      color: #556B2F;
      font-size: 18px;
      margin: 0 0 15px 0;
      font-weight: 600;
    }

    .category-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .category-btn {
      background: white;
      border: 2px solid #ddd;
      color: #333;
      padding: 10px 15px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: left;
      font-weight: 500;
    }

    .category-btn:hover {
      border-color: #556B2F;
      color: #556B2F;
    }

    .category-btn.active {
      background: #556B2F;
      color: white;
      border-color: #556B2F;
    }

    .products-grid {
      display: flex;
      flex-direction: column;
    }

    .loader {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 400px;
    }

    .no-products {
      text-align: center;
      padding: 60px 20px;
      color: #999;
      font-size: 18px;
    }

    @media (max-width: 768px) {
      .products-section {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .filter-sidebar {
        display: none;
      }

      .hero-section h1 {
        font-size: 32px;
      }
    }
  `]
})
export class ProductListingComponent implements OnInit {
  selectedCategory = signal<string | null>(null);
  cols = signal(4);

  constructor(
    public productService: ProductService,
    public cartService: CartService,
    private route: ActivatedRoute
  ) {
    this.updateGridCols();
  }

  ngOnInit(): void {
    this.productService.loadProducts();
  }

  get filteredProducts(): () => Product[] {
    return () => {
      if (!this.selectedCategory()) {
        return this.productService.products();
      }
      return this.productService.products().filter(p => p.categoryId === this.selectedCategory());
    };
  }

  filterByCategory(categoryId: string): void {
    if (this.selectedCategory() === categoryId) {
      this.selectedCategory.set(null);
    } else {
      this.selectedCategory.set(categoryId);
    }
  }

  private updateGridCols(): void {
    const width = window.innerWidth;
    if (width < 600) {
      this.cols.set(1);
    } else if (width < 1200) {
      this.cols.set(2);
    } else if (width < 1600) {
      this.cols.set(3);
    } else {
      this.cols.set(4);
    }
  }
}
