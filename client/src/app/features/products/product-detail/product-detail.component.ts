import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/types';
import { handleImageFallback } from '../../../core/utils/image-fallback';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    ProductCardComponent
  ],
  template: `
    <div class="detail-container">
      <div class="back-link-row">
        <button mat-button routerLink="/products" class="back-btn">
          <mat-icon>keyboard_backspace</mat-icon> Back to shop
        </button>
      </div>

      @if (isLoading()) {
        <div class="spinner-container">
          <mat-progress-spinner mode="indeterminate" diameter="60" color="primary"></mat-progress-spinner>
        </div>
      } @else {
        @if (product(); as prod) {
          <div class="detail-layout">
            <!-- Main section: image gallery + product info -->
            <div class="main-product-section">
              <!-- Left: Image Gallery -->
              <div class="gallery-column">
                <div class="main-image-wrapper">
                  <img [src]="galleryImages()[activeImageIndex()]" [alt]="prod.name" class="detail-img"
                       (error)="handleImageError($event, prod)">
                </div>
                
                @if (galleryImages().length > 1) {
                  <div class="thumbnail-strip">
                    @for (img of galleryImages(); track $index) {
                      <div class="thumb-wrapper" 
                           [class.active]="$index === activeImageIndex()"
                           (click)="activeImageIndex.set($index)">
                        <img [src]="img" [alt]="prod.name" class="thumb-img" (error)="handleImageError($event, prod)">
                      </div>
                    }
                  </div>
                }
              </div>

              <!-- Right: Product Info -->
              <div class="product-info-panel">
                <span class="category-badge">{{ getCategoryName(prod.categoryId) }}</span>
                <h1 class="product-name">{{ prod.name }}</h1>
                
                <div class="rating-row">
                  <span class="stars">
                    @for (star of [1, 2, 3, 4, 5]; track star) {
                      <mat-icon>{{ star <= prod.rating ? 'star' : (star - 0.5 <= prod.rating ? 'star_half' : 'star_border') }}</mat-icon>
                    }
                  </span>
                  <span class="rating-val">{{ prod.rating | number:'1.1-1' }} Rating</span>
                </div>

                <div class="price-section">
                  <div class="price-row">
                    <span class="current-price">\${{ prod.price | number:'1.2-2' }}</span>
                    <span class="original-price">\${{ getOriginalPrice(prod.price) | number:'1.2-2' }}</span>
                    <span class="discount-badge">25% OFF</span>
                  </div>
                </div>

                <mat-divider></mat-divider>

                <div class="stock-status-section">
                  @if (prod.stock > 10) {
                    <span class="stock-indicator in-stock">
                      <mat-icon>check_circle</mat-icon> In Stock ({{ prod.stock }} units available)
                    </span>
                  } @else if (prod.stock > 0) {
                    <span class="stock-indicator low-stock">
                      <mat-icon>warning_amber</mat-icon> Low Stock (Only {{ prod.stock }} units available)
                    </span>
                  } @else {
                    <span class="stock-indicator out-of-stock">
                      <mat-icon>error_outline</mat-icon> Out of Stock
                    </span>
                  }
                </div>

                <!-- Quantity and Add Actions -->
                @if (prod.stock > 0) {
                  <div class="add-action-box">
                    <div class="quantity-picker-wrapper">
                      <span class="qty-label">Quantity:</span>
                      <div class="quantity-picker">
                        <button mat-icon-button (click)="decreaseQty()" [disabled]="quantity() <= 1" class="qty-btn">
                          <mat-icon>remove</mat-icon>
                        </button>
                        <span class="qty-value">{{ quantity() }}</span>
                        <button mat-icon-button (click)="increaseQty(prod.stock)" [disabled]="quantity() >= prod.stock" class="qty-btn">
                          <mat-icon>add</mat-icon>
                        </button>
                      </div>
                    </div>

                    <div class="action-buttons">
                      <button mat-raised-button color="primary" class="add-to-cart-btn" (click)="addToCart(prod)">
                        <mat-icon>shopping_cart</mat-icon> Add To Cart
                      </button>
                      <button mat-raised-button color="accent" class="buy-now-btn" (click)="buyNow(prod)">
                        <mat-icon>bolt</mat-icon> Buy Now
                      </button>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Full-width Description -->
            <div class="full-width-section description-box">
              <h2 class="section-title">Product Description</h2>
              <div class="description-text">
                <p>{{ prod.description }}</p>
              </div>
            </div>

            <!-- Specifications Section -->
            <div class="full-width-section specifications-box">
              <h2 class="section-title">Product Specifications</h2>
              <div class="specs-grid">
                @for (spec of getSpecifications(prod); track spec.key) {
                  <div class="spec-item">
                    <span class="spec-key">{{ spec.key }}</span>
                    <span class="spec-value">{{ spec.value }}</span>
                  </div>
                }
              </div>
            </div>

            <!-- Similar Products Section -->
            @if (similarProducts().length > 0) {
              <div class="similar-products-section">
                <h2 class="section-title">Similar Products</h2>
                <div class="similar-grid">
                  @for (similar of similarProducts(); track similar.id) {
                    <app-product-card [product]="similar" class="similar-item"></app-product-card>
                  }
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="error-panel">
            <mat-icon>warning</mat-icon>
            <h2>Product Not Found</h2>
            <p>The product you are looking for does not exist or has been removed.</p>
            <button mat-raised-button color="primary" routerLink="/products">Back to Shop</button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px;
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

    .back-link-row {
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

    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    // Main section
    .detail-layout {
      display: flex;
      flex-direction: column;
      gap: 48px;
    }

    .main-product-section {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 56px;
      align-items: start;
    }

    // Gallery Column
    .gallery-column {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .main-image-wrapper {
      width: 100%;
      height: 480px;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(45, 58, 27, 0.04);
      background-color: #ffffff;
      border: 1px solid rgba(45, 58, 27, 0.06);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    .detail-img {
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      object-fit: contain;
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);

      &:hover {
        transform: scale(1.04);
      }
    }

    .thumbnail-strip {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      padding-bottom: 8px;
      scrollbar-width: thin;
      scrollbar-color: rgba(45, 58, 27, 0.2) transparent;

      &::-webkit-scrollbar {
        height: 4px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: rgba(45, 58, 27, 0.2);
        border-radius: 4px;
      }
    }

    .thumb-wrapper {
      width: 80px;
      height: 80px;
      border-radius: 12px;
      border: 2px solid transparent;
      overflow: hidden;
      cursor: pointer;
      background-color: #ffffff;
      box-shadow: 0 4px 10px rgba(45, 58, 27, 0.02);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      flex-shrink: 0;

      &.active {
        border-color: #2D3A1B;
        transform: scale(1.05);
        box-shadow: 0 6px 14px rgba(45, 58, 27, 0.1);
      }

      &:hover:not(.active) {
        transform: scale(1.02);
        border-color: rgba(45, 58, 27, 0.2);
      }
    }

    .thumb-img {
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      object-fit: contain;
    }

    // Info Panel
    .product-info-panel {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .category-badge {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: #5A664A;
      background-color: #EBF0E1;
      padding: 6px 12px;
      border-radius: 20px;
      width: fit-content;
    }

    .product-name {
      font-size: 34px;
      color: #1E2712;
      line-height: 1.25;
      font-weight: 700;
    }

    .rating-row {
      display: flex;
      align-items: center;
      gap: 8px;

      .stars {
        display: inline-flex;
        color: #ffb300;
        
        mat-icon {
          font-size: 20px;
          height: 20px;
          width: 20px;
        }
      }

      .rating-val {
        font-size: 14px;
        color: #5A664A;
        font-weight: 600;
      }
    }

    .price-section {
      background-color: #ffffff;
      padding: 16px 20px;
      border-radius: 16px;
      border: 1px solid rgba(45, 58, 27, 0.05);
      box-shadow: 0 4px 12px rgba(45, 58, 27, 0.01);
    }

    .price-row {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;

      .current-price {
        font-family: 'Outfit', sans-serif;
        font-size: 32px;
        font-weight: 800;
        color: #2D3A1B;
      }

      .original-price {
        font-size: 18px;
        font-weight: 500;
        color: #a0a0a0;
        text-decoration: line-through;
      }

      .discount-badge {
        font-size: 12px;
        font-weight: 700;
        color: #ffffff;
        background-color: #5A703F;
        padding: 4px 10px;
        border-radius: 20px;
        letter-spacing: 0.5px;
      }
    }

    .stock-status-section {
      display: flex;
      align-items: center;
    }

    .stock-indicator {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 20px;

      &.in-stock {
        color: #2e7d32;
        background-color: rgba(46, 125, 50, 0.08);
        mat-icon { color: #2e7d32; }
      }

      &.low-stock {
        color: #e65100;
        background-color: rgba(230, 81, 0, 0.08);
        mat-icon { color: #e65100; }
      }

      &.out-of-stock {
        color: #c62828;
        background-color: rgba(198, 40, 40, 0.08);
        mat-icon { color: #c62828; }
      }

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    // Quantity & actions
    .add-action-box {
      display: flex;
      flex-direction: column;
      gap: 20px;
      background-color: #ffffff;
      padding: 24px;
      border-radius: 20px;
      border: 1px solid rgba(45, 58, 27, 0.05);
      box-shadow: 0 4px 12px rgba(45, 58, 27, 0.01);
    }

    .quantity-picker-wrapper {
      display: flex;
      align-items: center;
      gap: 16px;

      .qty-label {
        font-size: 14px;
        font-weight: 700;
        color: #1E2712;
      }
    }

    .quantity-picker {
      display: flex;
      align-items: center;
      border: 1px solid rgba(45, 58, 27, 0.15);
      border-radius: 25px;
      height: 44px;
      padding: 0 4px;
      background-color: #ffffff;

      .qty-btn {
        color: #2D3A1B;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .qty-value {
        width: 36px;
        text-align: center;
        font-weight: 700;
        color: #1E2712;
        font-size: 15px;
      }
    }

    .action-buttons {
      display: flex;
      gap: 12px;

      button {
        flex: 1;
        height: 48px !important;
        border-radius: 25px !important;
        font-weight: 600;
        font-size: 14px;
        
        mat-icon {
          margin-right: 6px;
        }
      }

      .add-to-cart-btn {
        background-color: #2D3A1B !important;
        color: #ffffff !important;

        &:hover {
          background-color: #1E2712 !important;
        }
      }

      .buy-now-btn {
        background-color: #D8E5BE !important;
        color: #2D3A1B !important;

        &:hover {
          background-color: #c9d8ab !important;
        }
      }
    }

    // Sections
    .full-width-section {
      width: 100%;
      background-color: #ffffff;
      padding: 32px;
      border-radius: 24px;
      border: 1px solid rgba(45, 58, 27, 0.05);
      box-shadow: 0 4px 20px rgba(45, 58, 27, 0.02);
    }

    .section-title {
      font-size: 20px;
      color: #1E2712;
      margin-bottom: 20px;
      position: relative;
      padding-bottom: 8px;
      border-bottom: 2px solid rgba(45, 58, 27, 0.06);
      width: fit-content;
      font-weight: 700;
    }

    .description-text {
      font-size: 15px;
      line-height: 1.8;
      color: #5A664A;
      font-weight: 500;
    }

    // Specs Grid
    .specs-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .spec-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 20px;
      background-color: #EBF0E1;
      border-radius: 12px;
      border: 1px solid rgba(45, 58, 27, 0.04);
      transition: transform 0.2s ease;

      &:hover {
        transform: translateY(-2px);
      }

      .spec-key {
        font-weight: 700;
        color: #5A664A;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .spec-value {
        font-weight: 600;
        color: #1E2712;
        font-size: 14px;
      }
    }

    // Similar products
    .similar-products-section {
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .similar-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }

    // Error Panel
    .error-panel {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 64px 24px;
      gap: 16px;

      mat-icon {
        font-size: 64px;
        height: 64px;
        width: 64px;
        color: #ffb300;
      }

      button {
        border-radius: 20px;
      }
    }

    // Responsive design
    @media (max-width: 992px) {
      .main-product-section {
        grid-template-columns: 1fr;
        gap: 36px;
      }

      .main-image-wrapper {
        height: 380px;
      }

      .similar-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
    }

    @media (max-width: 768px) {
      .detail-container {
        padding: 20px 16px;
      }

      .product-name {
        font-size: 28px;
      }

      .specs-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }
    }

    @media (max-width: 480px) {
      .main-image-wrapper {
        height: 280px;
        padding: 16px;
      }

      .thumb-wrapper {
        width: 64px;
        height: 64px;
      }

      .action-buttons {
        flex-direction: column;
        
        button {
          width: 100%;
        }
      }

      .similar-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly product = signal<Product | null>(null);
  readonly quantity = signal<number>(1);
  readonly isLoading = signal(true);
  readonly activeImageIndex = signal<number>(0);
  readonly similarProducts = signal<Product[]>([]);

  readonly galleryImages = computed(() => {
    const prod = this.product();
    if (!prod) return [];
    return this.getExtraCategoryImages(prod);
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isLoading.set(true);
        this.activeImageIndex.set(0);
        this.quantity.set(1);
        
        this.productService.getProductById(id).subscribe({
          next: (prod) => {
            this.product.set(prod);
            this.isLoading.set(false);
            
            // Load similar products
            this.productService.getProducts(prod.categoryId).subscribe({
              next: (allProds) => {
                const filtered = allProds.filter(p => p.id !== prod.id);
                this.similarProducts.set(filtered.slice(0, 4));
              },
              error: (err) => {
                console.error('Failed to load similar products', err);
              }
            });
          },
          error: (err) => {
            console.error('Failed to load product', err);
            this.isLoading.set(false);
          }
        });
      } else {
        this.isLoading.set(false);
      }
    });
  }

  decreaseQty() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  increaseQty(stock: number) {
    if (this.quantity() < stock) {
      this.quantity.update(q => q + 1);
    }
  }

  handleImageError(event: any, prod: Product): void {
    handleImageFallback(event, prod);
  }

  addToCart(prod: Product) {
    this.cartService.addToCart(prod, this.quantity());
    alert(`${this.quantity()} x ${prod.name} added to cart!`);
    this.quantity.set(1);
  }

  buyNow(prod: Product) {
    this.cartService.addToCart(prod, this.quantity());
    this.router.navigate(['/checkout']);
  }

  getOriginalPrice(price: number): number {
    return parseFloat((price * 1.33).toFixed(2));
  }

  getCategoryName(id: string): string {
    const maps: { [key: string]: string } = {
      'gourmet-food': 'Gourmet Food',
      'body-care': 'Body Care',
      'home-kitchen': 'Home & Kitchen',
      'wellness': 'Wellness & Teas',
      'mobile-computers': 'Mobile & Computers',
      'household-appliances': 'Household Appliances',
      'mens-fashion': "Men's Fashion",
      'womens-fashion': "Women's Fashion",
      'sports-fitness': 'Sports & Fitness',
      'books': 'Books'
    };
    return maps[id] || 'Product';
  }

  getExtraCategoryImages(prod: Product): string[] {
    const categoryImages: Record<string, string[]> = {
      'mobile-computers': [
        '/assets/mobiles and laptops/17pro.webp',
        '/assets/mobiles and laptops/mac1lap.webp',
        '/assets/mobiles and laptops/phone.webp'
      ],
      'household-appliances': [
        '/assets/household/AC.webp',
        '/assets/household/fridge.webp',
        '/assets/household/oven.webp'
      ],
      'mens-fashion': [
        '/assets/mens fashion/adidas_shoe.webp',
        '/assets/mens fashion/shirt1.webp',
        '/assets/mens fashion/watch.webp'
      ],
      'womens-fashion': [
        '/assets/womens fashion/bag1.webp',
        '/assets/womens fashion/dress.webp',
        '/assets/womens fashion/watch1.webp'
      ],
      'sports-fitness': [
        '/assets/sports and fitness/boot.webp',
        '/assets/sports and fitness/dembell.webp',
        '/assets/sports and fitness/arm holder.webp'
      ],
      'books': [
        '/assets/books/book1.webp',
        '/assets/books/book2.webp',
        '/assets/books/book3.webp'
      ]
    };
    
    const list = categoryImages[prod.categoryId] || [];
    const filtered = list.filter(img => img !== prod.imageUrl);
    const result = [prod.imageUrl];
    
    filtered.forEach(img => {
      if (result.length < 4) result.push(img);
    });
    
    while (result.length < 3) {
      result.push(prod.imageUrl);
    }
    return result;
  }

  getSpecifications(prod: Product): { key: string, value: string }[] {
    const sub = prod.subCategory || '';
    const name = prod.name.toLowerCase();
    
    if (prod.categoryId === 'mobile-computers') {
      return [
        { key: 'Brand', value: name.includes('apple') ? 'Apple' : name.includes('samsung') ? 'Samsung' : name.includes('oneplus') ? 'OnePlus' : 'Premium Brand' },
        { key: 'Category', value: sub || 'Electronics' },
        { key: 'Connectivity', value: '5G, Wi-Fi 6E, Bluetooth 5.3' },
        { key: 'Battery Life', value: name.includes('macbook') ? 'Up to 18 hours' : 'Up to 24 hours' },
        { key: 'Warranty', value: '1 Year Manufacturer Warranty' }
      ];
    } else if (prod.categoryId === 'household-appliances') {
      return [
        { key: 'Type', value: sub || 'Home Appliance' },
        { key: 'Power Rating', value: '220-240V ~ 50Hz' },
        { key: 'Material', value: 'Premium Stainless Steel & ABS' },
        { key: 'Energy Efficiency', value: '5-Star Rated' },
        { key: 'Warranty', value: '2 Years Comprehensive Warranty' }
      ];
    } else if (prod.categoryId === 'mens-fashion' || prod.categoryId === 'womens-fashion') {
      return [
        { key: 'Material', value: '100% Organic Cotton / Premium Leather' },
        { key: 'Fit', value: 'Regular / Comfort Fit' },
        { key: 'Style', value: sub || 'Contemporary Classic' },
        { key: 'Care Instructions', value: 'Dry Clean Recommended or Gentle Machine Wash' },
        { key: 'Country of Origin', value: 'Sustainably Sourced' }
      ];
    } else if (prod.categoryId === 'sports-fitness') {
      return [
        { key: 'Equipment Type', value: sub || 'Fitness Gear' },
        { key: 'Material', value: 'Heavy-duty steel & high-density foam' },
        { key: 'Adjustability', value: 'Multi-level customizable setting' },
        { key: 'Suitability', value: 'Beginners to Professional Athletes' },
        { key: 'Warranty', value: '1 Year Frame Warranty' }
      ];
    } else {
      return [
        { key: 'Category', value: 'General Merchandise' },
        { key: 'Quality Standard', value: 'Premium Grade A+' },
        { key: 'Availability', value: 'In Stock' },
        { key: 'Packaging', value: 'Eco-friendly Recyclable Box' },
        { key: 'Warranty', value: '30-Day Money Back Guarantee' }
      ];
    }
  }
}

