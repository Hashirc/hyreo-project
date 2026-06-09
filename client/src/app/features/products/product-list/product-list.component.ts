import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { ProductService } from '../../../core/services/product.service';
import { Product, Category } from '../../../core/models/types';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { combineLatest } from 'rxjs';

// Sub-category definitions per main category slug
const SUB_CATEGORIES: { [slug: string]: string[] } = {
  'mens-fashion': ['Shirts', 'Pants', 'Belts', 'Watches', 'Wallets', 'Shoes', 'Glasses'],
  'womens-fashion': ['Dresses', 'Tops', 'Sarees', 'Handbags', 'Jewellery', 'Shoes', 'Cosmetics'],
  'mobile-computers': ['Mobiles', 'Laptops', 'Tablets', 'Accessories', 'Headphones'],
  'household-appliances': ['Kitchen', 'Laundry', 'Cooling', 'Cleaning', 'Lighting'],
  'sports-fitness': ['Gym Equipment', 'Sportswear', 'Footwear', 'Accessories', 'Supplements'],
  'books': ['Fiction', 'Non-Fiction', 'Academic', 'Comics', 'Self-Help'],
};

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
    MatChipsModule,
    ProductCardComponent
  ],
  template: `
    <div class="shop-container">
      <!-- Sidebar Filters (Desktop) -->
      <aside class="shop-sidebar">
        <h3 class="sidebar-title">Categories</h3>
        <mat-nav-list class="category-list">
          <a mat-list-item [class.active-cat]="!selectedCategory()" (click)="filterByCategory(undefined)">
            <mat-icon matListItemIcon>apps</mat-icon>
            <span matListItemTitle>All Products</span>
          </a>
          @for (cat of categories(); track cat.id) {
            <a mat-list-item [class.active-cat]="selectedCategory() === cat.id" (click)="filterByCategory(cat.id)">
              <mat-icon matListItemIcon>{{ getCategoryIcon(cat.id) }}</mat-icon>
              <span matListItemTitle>{{ cat.name }}</span>
            </a>
          }
        </mat-nav-list>

        <!-- Sub-categories section (shown when a category with sub-cats is selected) -->
        @if (availableSubCategories().length > 0) {
          <mat-divider style="margin: 12px 0;"></mat-divider>
          <h4 class="sub-sidebar-title">Filter by Type</h4>
          <div class="sub-sidebar-list">
            <button
              class="sub-sidebar-item"
              [class.sub-sidebar-active]="!selectedSubCategory()"
              (click)="filterBySubCategory(undefined)">
              <mat-icon class="sub-sidebar-icon">apps</mat-icon>
              <span>All</span>
            </button>
            @for (sub of availableSubCategories(); track sub) {
              <button
                class="sub-sidebar-item"
                [class.sub-sidebar-active]="selectedSubCategory() === sub"
                (click)="filterBySubCategory(sub)">
                <mat-icon class="sub-sidebar-icon">{{ getSubCategoryIcon(sub) }}</mat-icon>
                <span>{{ sub }}</span>
              </button>
            }
          </div>
        }
      </aside>

      <!-- Main Shop Content -->
      <div class="shop-main">
        <!-- Search Bar -->
        <div class="search-filter-bar">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search products...</mat-label>
            <input matInput type="text" [(ngModel)]="searchQuery" (input)="onSearchChange()" placeholder="e.g. Shirts, Watches...">
            <mat-icon matPrefix>search</mat-icon>
            @if (searchQuery()) {
              <button mat-icon-button matSuffix (click)="clearSearch()">
                <mat-icon>close</mat-icon>
              </button>
            }
          </mat-form-field>
        </div>

        <!-- Mobile category chips -->
        <div class="mobile-categories">
          <button mat-stroked-button [class.mobile-active]="!selectedCategory()" (click)="filterByCategory(undefined)">All</button>
          @for (cat of categories(); track cat.id) {
            <button mat-stroked-button [class.mobile-active]="selectedCategory() === cat.id" (click)="filterByCategory(cat.id)">
              {{ cat.name }}
            </button>
          }
        </div>

        <!-- Category Header -->
        <div class="results-header">
          <div>
            <h2 class="results-title">
              {{ currentCategoryName() }}
              @if (selectedSubCategory()) {
                <span class="sub-cat-breadcrumb"> › {{ selectedSubCategory() }}</span>
              }
            </h2>
          </div>
          <p class="results-count">{{ filteredProducts().length }} products found</p>
        </div>

        <!-- Sub-category chip bar (visible on all screen sizes) -->
        @if (availableSubCategories().length > 0) {
          <div class="sub-category-bar">
            <button
              class="sub-chip"
              [class.sub-chip-active]="!selectedSubCategory()"
              (click)="filterBySubCategory(undefined)">
              <mat-icon class="sub-chip-icon">apps</mat-icon>
              All
            </button>
            @for (sub of availableSubCategories(); track sub) {
              <button
                class="sub-chip"
                [class.sub-chip-active]="selectedSubCategory() === sub"
                (click)="filterBySubCategory(sub)">
                <mat-icon class="sub-chip-icon">{{ getSubCategoryIcon(sub) }}</mat-icon>
                {{ sub }}
              </button>
            }
          </div>
        }

        <!-- Product Grid -->
        @if (isLoading()) {
          <div class="spinner-container">
            <mat-progress-spinner mode="indeterminate" diameter="60" color="primary"></mat-progress-spinner>
          </div>
        } @else {
          @if (filteredProducts().length > 0) {
            <div class="product-grid">
              @for (prod of filteredProducts(); track prod.id) {
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

    // Sub-category sidebar section
    .sub-sidebar-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #708623;
      margin: 0 0 10px 4px;
    }

    .sub-sidebar-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .sub-sidebar-item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 9px 12px;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: #4a5435;
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s ease;

      &:hover {
        background-color: rgba(85, 107, 47, 0.05);
        color: #556B2F;
      }

      .sub-sidebar-icon {
        font-size: 18px;
        height: 18px;
        width: 18px;
        color: #708623;
        flex-shrink: 0;
      }

      span {
        flex: 1;
      }
    }

    .sub-sidebar-active {
      background: linear-gradient(135deg, rgba(85,107,47,0.12), rgba(107,142,35,0.08)) !important;
      color: #556B2F !important;
      font-weight: 700 !important;

      .sub-sidebar-icon {
        color: #556B2F !important;
      }
    }

    .sub-cat-breadcrumb {
      font-size: 18px;
      font-weight: 400;
      color: #708623;
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
      --mdc-outlined-text-field-container-shape: 28px;
      margin-bottom: 0;
    }

    .mobile-categories {
      display: none;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 8px;
      scrollbar-width: none;
      
      &::-webkit-scrollbar {
        display: none;
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

    // Sub-category chip bar
    .sub-category-bar {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding: 4px 0 12px;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .sub-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 18px;
      border-radius: 25px;
      border: 1.5px solid rgba(85, 107, 47, 0.18);
      background-color: #ffffff;
      color: #4a5435;
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      flex-shrink: 0;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

      &:hover {
        border-color: #556B2F;
        background-color: rgba(85, 107, 47, 0.04);
        box-shadow: 0 3px 8px rgba(85, 107, 47, 0.10);
        transform: translateY(-1px);
      }

      .sub-chip-icon {
        font-size: 16px;
        height: 16px;
        width: 16px;
        color: #708623;
      }
    }

    .sub-chip-active {
      background: linear-gradient(135deg, #556B2F, #6B8E23) !important;
      color: #ffffff !important;
      border-color: transparent !important;
      box-shadow: 0 4px 12px rgba(85, 107, 47, 0.25) !important;
      font-weight: 600;

      .sub-chip-icon {
        color: #ffffff !important;
      }
    }

    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 24px;
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

      .sub-category-bar {
        padding: 2px 0 8px;
      }

      .sub-chip {
        padding: 6px 14px;
        font-size: 12px;
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
  readonly selectedSubCategory = signal<string | undefined>(undefined);
  readonly searchQuery = signal<string>('');
  readonly isLoading = signal(true);

  readonly currentCategoryName = computed(() => {
    const activeId = this.selectedCategory();
    if (!activeId) return 'All Products';
    const match = this.categories().find(c => c.id === activeId);
    return match ? match.name : activeId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  });

  // Get sub-categories for current main category
  readonly availableSubCategories = computed(() => {
    const catSlug = this.selectedCategory();
    if (!catSlug) return [];
    return SUB_CATEGORIES[catSlug] || [];
  });

  // Client-side sub-category filtering (fallback when products don't have subCategory field)
  readonly filteredProducts = computed(() => {
    const subCat = this.selectedSubCategory();
    const allProds = this.products();
    if (!subCat) return allProds;
    // Filter by subCategory field; if product has no subCategory, include it only when "All" is selected
    return allProds.filter(p =>
      p.subCategory?.toLowerCase() === subCat.toLowerCase()
    );
  });

  constructor() {
    // Listen to route parameters AND query parameters
    combineLatest([this.route.params, this.route.queryParams]).subscribe(([params, queryParams]) => {
      const routeCat = params['cat'];
      const queryCat = queryParams['category'];
      const subCat = queryParams['sub'];
      
      this.selectedCategory.set(routeCat || queryCat || undefined);
      this.selectedSubCategory.set(subCat || undefined);
      this.searchQuery.set(queryParams['search'] || '');
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
    this.productService.getProducts(this.selectedCategory(), this.searchQuery(), this.selectedSubCategory()).subscribe({
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
    // Reset sub-category when changing main category
    this.selectedSubCategory.set(undefined);
    if (catId) {
      this.router.navigate(['/category', catId], {
        queryParams: { search: this.searchQuery() || null, sub: null },
        queryParamsHandling: 'merge'
      });
    } else {
      this.router.navigate(['/products'], {
        queryParams: { search: this.searchQuery() || null, sub: null },
        queryParamsHandling: 'merge'
      });
    }
  }

  filterBySubCategory(subCat?: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sub: subCat || null },
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
    this.selectedSubCategory.set(undefined);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
  }

  getCategoryIcon(catId: string): string {
    const iconMap: { [key: string]: string } = {
      'mens-fashion': 'checkroom',
      'womens-fashion': 'dry_cleaning',
      'mobile-computers': 'smartphone',
      'household-appliances': 'kitchen',
      'sports-fitness': 'fitness_center',
      'books': 'menu_book',
    };
    return iconMap[catId] || 'category';
  }

  getSubCategoryIcon(sub: string): string {
    const iconMap: { [key: string]: string } = {
      // Men's Fashion
      'Shirts': 'checkroom',
      'Pants': 'straighten',
      'Belts': 'toll',
      'Watches': 'watch',
      'Wallets': 'account_balance_wallet',
      'Shoes': 'ice_skating',
      'Glasses': 'visibility',
      // Women's Fashion
      'Dresses': 'checkroom',
      'Tops': 'dry_cleaning',
      'Sarees': 'style',
      'Handbags': 'shopping_bag',
      'Jewellery': 'diamond',
      'Cosmetics': 'palette',
      // Mobile & Computers
      'Mobiles': 'smartphone',
      'Laptops': 'laptop',
      'Tablets': 'tablet',
      'Accessories': 'cable',
      'Headphones': 'headphones',
      // Household
      'Kitchen': 'kitchen',
      'Laundry': 'local_laundry_service',
      'Cooling': 'ac_unit',
      'Cleaning': 'cleaning_services',
      'Lighting': 'lightbulb',
      // Sports
      'Gym Equipment': 'fitness_center',
      'Sportswear': 'sports_tennis',
      'Footwear': 'ice_skating',
      'Supplements': 'medication',
      // Books
      'Fiction': 'auto_stories',
      'Non-Fiction': 'menu_book',
      'Academic': 'school',
      'Comics': 'image',
      'Self-Help': 'psychology',
    };
    return iconMap[sub] || 'category';
  }
}
