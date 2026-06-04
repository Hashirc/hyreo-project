import { Component, inject, OnInit, signal, effect, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../../../core/services/product.service';
import { Product, Category } from '../../../core/models/types';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    ProductCardComponent
  ],
  template: `
    <div class="shop-container">
      <!-- Sidebar Filters (Desktop) -->
      <aside class="shop-sidebar">
        <h3 class="sidebar-title">Categories</h3>
        <mat-nav-list class="category-list">
          <a mat-list-item [class.active-cat]="!selectedCategory()" (click)="filterByCategory(undefined)">
            <span matListItemTitle>All Products</span>
          </a>
          @for (cat of categories(); track cat.id) {
            <a mat-list-item [class.active-cat]="selectedCategory() === cat.id" (click)="filterByCategory(cat.id)">
              <span matListItemTitle>{{ cat.name }}</span>
            </a>
          }
        </mat-nav-list>
      </aside>

      <!-- Main Shop Content -->
      <div class="shop-main">
        <!-- Search and Category filters (Mobile) -->
        <div class="search-filter-bar">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search products...</mat-label>
            <input matInput type="text" [(ngModel)]="searchQuery" (input)="onSearchChange()" placeholder="e.g. Olive oil">
            <mat-icon matPrefix>search</mat-icon>
            @if (searchQuery()) {
              <button mat-icon-button matSuffix (click)="clearSearch()">
                <mat-icon>close</mat-icon>
              </button>
            }
          </mat-form-field>
        </div>

        <div class="mobile-categories">
          <button mat-stroked-button [class.mobile-active]="!selectedCategory()" (click)="filterByCategory(undefined)">All</button>
          @for (cat of categories(); track cat.id) {
            <button mat-stroked-button [class.mobile-active]="selectedCategory() === cat.id" (click)="filterByCategory(cat.id)">
              {{ cat.name }}
            </button>
          }
        </div>

        <!-- Selected category summary -->
        <div class="results-header">
          <h2 class="results-title">{{ currentCategoryName() }}</h2>
          <p class="results-count">{{ products().length }} products found</p>
        </div>

        <!-- Product Grid -->
        @if (isLoading()) {
          <div class="spinner-container">
            <mat-progress-spinner mode="indeterminate" diameter="60" color="primary"></mat-progress-spinner>
          </div>
        } @else {
          @if (products().length > 0) {
            <div class="product-grid">
              @for (prod of products(); track prod.id) {
                <app-product-card [product]="prod"></app-product-card>
              }
            </div>
          } @else {
            <div class="empty-shop">
              <mat-icon class="text-olive">shopping_bag</mat-icon>
              <h3>No Products Found</h3>
              <p>We couldn't find any products matching your selection. Try clearing your filters or search keywords.</p>
              <button mat-raised-button color="primary" (click)="resetFilters()">Clear Filters</button>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .shop-container {
      display: flex;
      gap: 32px;
      margin-top: 16px;
    }

    // Sidebar styling
    .shop-sidebar {
      width: 250px;
      flex-shrink: 0;
      background-color: #ffffff;
      border: 1px solid rgba(85, 107, 47, 0.08);
      border-radius: 12px;
      padding: 16px;
      height: fit-content;
    }

    .sidebar-title {
      font-size: 18px;
      font-weight: 700;
      color: #1e2610;
      margin-bottom: 12px;
      padding-left: 8px;
    }

    .category-list {
      a {
        border-radius: 8px;
        margin-bottom: 4px;
        cursor: pointer;
        
        &:hover {
          background-color: rgba(85, 107, 47, 0.04);
        }
      }

      .active-cat {
        background-color: rgba(85, 107, 47, 0.08) !important;
        color: #556B2F !important;
        font-weight: 600;
      }
    }

    // Main shop area
    .shop-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .search-filter-bar {
      width: 100%;
    }

    .search-field {
      width: 100%;
      --mdc-outlined-text-field-container-shape: 28px; // Rounded search bar
      margin-bottom: 0;
    }

    .mobile-categories {
      display: none;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 8px;
      scrollbar-width: none; // hide scrollbar in firefox
      
      &::-webkit-scrollbar {
        display: none; // hide scrollbar in chrome/safari
      }

      button {
        flex-shrink: 0;
        border-radius: 20px;
        border-color: rgba(85, 107, 47, 0.2);
        color: #556B2F;
        font-size: 13px;
        height: 32px;
        line-height: 32px;
      }

      .mobile-active {
        background-color: #556B2F !important;
        color: #ffffff !important;
      }
    }

    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 1px solid rgba(85, 107, 47, 0.08);
      padding-bottom: 8px;

      .results-title {
        font-size: 24px;
        font-weight: 700;
        color: #1e2610;
        line-height: 1;
      }

      .results-count {
        font-size: 14px;
        color: #63791d;
      }
    }

    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
    }

    .empty-shop {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 64px 24px;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid rgba(85, 107, 47, 0.08);
      gap: 16px;

      mat-icon {
        font-size: 64px;
        height: 64px;
        width: 64px;
      }

      h3 {
        font-size: 20px;
        color: #1e2610;
        margin-bottom: 0;
      }

      p {
        font-size: 14px;
        color: #666;
        max-width: 400px;
      }

      button {
        border-radius: 20px;
      }
    }

    @media (max-width: 800px) {
      .shop-container {
        flex-direction: column;
        gap: 16px;
      }

      .shop-sidebar {
        display: none;
      }

      .mobile-categories {
        display: flex;
      }

      .results-header {
        .results-title {
          font-size: 20px;
        }
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // States
  readonly categories = signal<Category[]>([]);
  readonly products = signal<Product[]>([]);
  readonly selectedCategory = signal<string | undefined>(undefined);
  readonly searchQuery = signal<string>('');
  readonly isLoading = signal(true);

  readonly currentCategoryName = computed(() => {
    const activeId = this.selectedCategory();
    if (!activeId) return 'All Products';
    const match = this.categories().find(c => c.id === activeId);
    return match ? match.name : 'All Products';
  });

  constructor() {
    // Listen to query parameters
    this.route.queryParams.subscribe(params => {
      this.selectedCategory.set(params['category'] || undefined);
      this.searchQuery.set(params['search'] || '');
      this.loadProducts();
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  loadProducts() {
    this.isLoading.set(true);
    this.productService.getProducts(this.selectedCategory(), this.searchQuery()).subscribe({
      next: (prods) => {
        this.products.set(prods);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.isLoading.set(false);
      }
    });
  }

  filterByCategory(catId?: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: catId },
      queryParamsHandling: 'merge'
    });
  }

  onSearchChange() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: this.searchQuery() || null },
      queryParamsHandling: 'merge'
    });
  }

  clearSearch() {
    this.searchQuery.set('');
    this.onSearchChange();
  }

  resetFilters() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
  }
}
