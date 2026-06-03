import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.model';
import { CartItem } from '../../../core/models/cart.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="product-detail-container">
      @if (product()) {
        <button mat-icon-button (click)="goBack()" class="back-btn">
          <mat-icon>arrow_back</mat-icon>
          Back to Products
        </button>

        <div class="product-detail">
          <div class="product-image-section">
            <img [src]="product()!.imageUrl" [alt]="product()!.name" class="main-image">
            <div class="image-gallery">
              @for (image of getProductImages(); track image) {
                <img [src]="image" [alt]="product()!.name" class="thumbnail">
              }
            </div>
          </div>

          <div class="product-info-section">
            <div class="product-header">
              <h1>{{ product()!.name }}</h1>
              <div class="rating">
                <mat-icon>star</mat-icon>
                <span>{{ product()!.rating }}</span>
                <span class="reviews">({{ product()!.reviews }} reviews)</span>
              </div>
            </div>

            <div class="price-section">
              <span class="price">${{ product()!.price }}</span>
              <span class="currency">USD</span>
            </div>

            <div class="stock-status">
              @if (product()!.stock > 0) {
                <span class="in-stock">
                  <mat-icon>check_circle</mat-icon>
                  In Stock ({{ product()!.stock }} available)
                </span>
              } @else {
                <span class="out-of-stock">Out of Stock</span>
              }
            </div>

            <div class="description">
              <h3>Description</h3>
              <p>{{ product()!.description }}</p>
            </div>

            <div class="quantity-section">
              <label>Quantity:</label>
              <div class="quantity-control">
                <button (click)="decreaseQuantity()" class="qty-btn">-</button>
                <input type="number" [(ngModel)]="quantity" readonly class="qty-input">
                <button (click)="increaseQuantity()" class="qty-btn">+</button>
              </div>
            </div>

            <div class="action-buttons">
              <button 
                mat-raised-button 
                color="primary"
                (click)="addToCart()"
                [disabled]="product()!.stock === 0"
                class="add-to-cart-btn">
                <mat-icon>shopping_cart</mat-icon>
                Add to Cart
              </button>
              <button mat-stroked-button class="wishlist-btn">
                <mat-icon>favorite_border</mat-icon>
                Add to Wishlist
              </button>
            </div>

            <div class="product-meta">
              <div class="meta-item">
                <mat-icon>local_shipping</mat-icon>
                <div>
                  <h4>Free Shipping</h4>
                  <p>On orders over $100</p>
                </div>
              </div>
              <div class="meta-item">
                <mat-icon>assignment_return</mat-icon>
                <div>
                  <h4>Easy Returns</h4>
                  <p>30-day return policy</p>
                </div>
              </div>
              <div class="meta-item">
                <mat-icon>verified</mat-icon>
                <div>
                  <h4>Authentic</h4>
                  <p>100% authentic guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="related-products-section">
          <h2>Related Products</h2>
          <p>You might also like these products</p>
        </div>
      } @else {
        <div class="loading">
          <p>Loading product details...</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .product-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px 20px 60px;
    }

    .back-btn {
      margin-bottom: 20px;
      color: #556B2F !important;
    }

    .product-detail {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 60px;
    }

    .product-image-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .main-image {
      width: 100%;
      height: 400px;
      object-fit: cover;
      border-radius: 12px;
      background: #f5f5f5;
    }

    .image-gallery {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }

    .thumbnail {
      width: 100%;
      height: 80px;
      object-fit: cover;
      border-radius: 8px;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.3s ease;
    }

    .thumbnail:hover {
      border-color: #556B2F;
    }

    .product-info-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .product-header h1 {
      font-size: 32px;
      margin: 0 0 10px 0;
      color: #333;
      font-weight: 700;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #666;
    }

    .rating mat-icon {
      color: #ffc107;
    }

    .reviews {
      color: #999;
    }

    .price-section {
      display: flex;
      align-items: baseline;
      gap: 10px;
    }

    .price {
      font-size: 36px;
      font-weight: 700;
      color: #556B2F;
    }

    .currency {
      font-size: 14px;
      color: #999;
    }

    .stock-status {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
    }

    .in-stock {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #4caf50;
    }

    .in-stock mat-icon {
      font-size: 20px;
    }

    .out-of-stock {
      color: #f44336;
    }

    .description h3 {
      color: #333;
      margin: 0 0 10px 0;
      font-size: 18px;
    }

    .description p {
      color: #666;
      line-height: 1.8;
      margin: 0;
    }

    .quantity-section {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .quantity-section label {
      font-weight: 600;
      color: #333;
    }

    .quantity-control {
      display: flex;
      align-items: center;
      border: 1px solid #ddd;
      border-radius: 6px;
      overflow: hidden;
    }

    .qty-btn {
      background: #f5f5f5;
      border: none;
      padding: 8px 12px;
      cursor: pointer;
      font-size: 16px;
      transition: background 0.3s ease;
    }

    .qty-btn:hover {
      background: #556B2F;
      color: white;
    }

    .qty-input {
      border: none;
      width: 60px;
      text-align: center;
      font-size: 16px;
      font-weight: 600;
    }

    .action-buttons {
      display: flex;
      gap: 15px;
    }

    .add-to-cart-btn {
      flex: 1;
      background: #556B2F !important;
      color: white !important;
      height: 50px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .add-to-cart-btn:hover:not(:disabled) {
      background: #3d4d1f !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(85, 107, 47, 0.3) !important;
    }

    .wishlist-btn {
      border-color: #556B2F !important;
      color: #556B2F !important;
    }

    .product-meta {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }

    .meta-item {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }

    .meta-item mat-icon {
      color: #556B2F;
      font-size: 28px;
      width: 28px;
      height: 28px;
      margin-top: 2px;
    }

    .meta-item h4 {
      margin: 0 0 4px 0;
      color: #333;
      font-weight: 600;
    }

    .meta-item p {
      margin: 0;
      color: #666;
      font-size: 13px;
    }

    .related-products-section {
      text-align: center;
    }

    .related-products-section h2 {
      color: #556B2F;
      font-size: 28px;
      margin: 0 0 10px 0;
    }

    .related-products-section p {
      color: #666;
      margin: 0;
    }

    .loading {
      text-align: center;
      padding: 60px 20px;
      color: #999;
    }

    @media (max-width: 768px) {
      .product-detail {
        grid-template-columns: 1fr;
        gap: 30px;
      }

      .product-header h1 {
        font-size: 24px;
      }

      .price {
        font-size: 28px;
      }

      .action-buttons {
        flex-direction: column;
      }

      .product-meta {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | undefined>(undefined);
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.productService.getProductById(productId).subscribe(product => {
        this.product.set(product);
      });
    });
  }

  getProductImages(): string[] {
    const product = this.product();
    if (!product) return [];
    return product.images || [product.imageUrl];
  }

  increaseQuantity(): void {
    if (this.product() && this.quantity < this.product()!.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    const product = this.product();
    if (!product) return;

    const cartItem: CartItem = {
      productId: product.id,
      quantity: this.quantity,
      price: product.price,
      name: product.name,
      imageUrl: product.imageUrl
    };
    this.cartService.addToCart(cartItem);
  }

  goBack(): void {
    window.history.back();
  }
}
