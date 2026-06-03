import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1>Welcome to HYREO</h1>
          <p>Your Ultimate E-Commerce Destination</p>
          <p class="subtitle">Shop the finest selection of products at unbeatable prices</p>
          <button mat-raised-button color="primary" routerLink="/products" class="cta-button">
            <mat-icon>shopping_cart</mat-icon>
            Start Shopping
          </button>
        </div>
        <div class="hero-image">
          <img src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=500&fit=crop" alt="Shopping">
        </div>
      </section>

      <!-- Featured Products Section -->
      <section class="featured-section">
        <div class="section-header">
          <h2>Featured Products</h2>
          <p>Discover our hand-picked selection</p>
        </div>
        <button mat-raised-button routerLink="/products" class="view-all-btn">
          View All Products
        </button>
      </section>

      <!-- Categories Section -->
      <section class="categories-section">
        <div class="section-header">
          <h2>Shop by Category</h2>
          <p>Find what you're looking for</p>
        </div>
        <div class="categories-grid">
          <div class="category-card">
            <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop" alt="Electronics">
            <h3>Electronics</h3>
            <button mat-stroked-button>Browse</button>
          </div>
          <div class="category-card">
            <img src="https://images.unsplash.com/photo-1505250967868-ba7dbc5438a1?w=300&h=300&fit=crop" alt="Fashion">
            <h3>Fashion</h3>
            <button mat-stroked-button>Browse</button>
          </div>
          <div class="category-card">
            <img src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop" alt="Home & Living">
            <h3>Home & Living</h3>
            <button mat-stroked-button>Browse</button>
          </div>
          <div class="category-card">
            <img src="https://images.unsplash.com/photo-1550258987-920a2eae7d59?w=300&h=300&fit=crop" alt="Sports">
            <h3>Sports</h3>
            <button mat-stroked-button>Browse</button>
          </div>
        </div>
      </section>

      <!-- Why Choose Us Section -->
      <section class="why-us-section">
        <div class="section-header">
          <h2>Why Choose HYREO?</h2>
          <p>We offer more than just products</p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <mat-icon>local_shipping</mat-icon>
            <h3>Free Shipping</h3>
            <p>On all orders over \$100</p>
          </div>
          <div class="feature-card">
            <mat-icon>assignment_return</mat-icon>
            <h3>Easy Returns</h3>
            <p>30-day return guarantee</p>
          </div>
          <div class="feature-card">
            <mat-icon>security</mat-icon>
            <h3>Secure Payments</h3>
            <p>100% secure transactions</p>
          </div>
          <div class="feature-card">
            <mat-icon>support_agent</mat-icon>
            <h3>24/7 Support</h3>
            <p>Dedicated customer service</p>
          </div>
        </div>
      </section>

      <!-- Newsletter Section -->
      <section class="newsletter-section">
        <div class="newsletter-content">
          <h2>Subscribe to Our Newsletter</h2>
          <p>Get updates on new products and exclusive offers</p>
          <div class="newsletter-form">
            <input type="email" placeholder="Enter your email">
            <button mat-raised-button color="primary">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      width: 100%;
    }

    .hero {
      background: linear-gradient(135deg, #556B2F 0%, #3d4d1f 100%);
      color: white;
      padding: 80px 40px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
    }

    .hero-content h1 {
      font-size: 48px;
      margin: 0 0 20px 0;
      font-weight: 700;
    }

    .hero-content > p:nth-child(2) {
      font-size: 24px;
      margin: 0 0 10px 0;
      color: rgba(255, 255, 255, 0.9);
    }

    .subtitle {
      font-size: 16px;
      margin: 0 0 30px 0;
      color: rgba(255, 255, 255, 0.8);
    }

    .cta-button {
      background: white !important;
      color: #556B2F !important;
      font-size: 16px !important;
      padding: 12px 40px !important;
      font-weight: 600 !important;
      display: flex !important;
      gap: 8px;
    }

    .hero-image {
      display: flex;
      justify-content: center;
    }

    .hero-image img {
      width: 100%;
      max-width: 500px;
      border-radius: 12px;
    }

    .featured-section,
    .categories-section,
    .why-us-section,
    .newsletter-section {
      max-width: 1400px;
      margin: 0 auto;
      padding: 80px 40px;
    }

    .section-header {
      text-align: center;
      margin-bottom: 50px;
    }

    .section-header h2 {
      color: #556B2F;
      font-size: 36px;
      margin: 0 0 10px 0;
      font-weight: 700;
    }

    .section-header p {
      color: #999;
      font-size: 16px;
      margin: 0;
    }

    .view-all-btn {
      display: block;
      margin: 40px auto 0;
      background: #556B2F !important;
      color: white !important;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      margin-bottom: 40px;
    }

    .category-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .category-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 8px 24px rgba(85, 107, 47, 0.15);
    }

    .category-card img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .category-card h3 {
      padding: 20px 20px 10px;
      margin: 0;
      color: #333;
      font-size: 18px;
      font-weight: 600;
    }

    .category-card button {
      margin: auto 20px 20px;
      border-color: #556B2F !important;
      color: #556B2F !important;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
    }

    .feature-card {
      background: white;
      padding: 40px 20px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .feature-card:hover {
      box-shadow: 0 8px 24px rgba(85, 107, 47, 0.15);
      transform: translateY(-4px);
    }

    .feature-card mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #556B2F;
      margin: 0 auto 20px;
    }

    .feature-card h3 {
      color: #333;
      margin: 0 0 10px 0;
      font-size: 18px;
      font-weight: 600;
    }

    .feature-card p {
      color: #999;
      margin: 0;
    }

    .newsletter-section {
      background: linear-gradient(135deg, #556B2F 0%, #3d4d1f 100%);
      color: white;
      text-align: center;
    }

    .newsletter-content h2 {
      font-size: 32px;
      margin: 0 0 10px 0;
      font-weight: 700;
    }

    .newsletter-content p {
      font-size: 16px;
      margin: 0 0 30px 0;
      color: rgba(255, 255, 255, 0.9);
    }

    .newsletter-form {
      display: flex;
      gap: 10px;
      max-width: 400px;
      margin: 0 auto;
      flex-direction: column;
    }

    .newsletter-form input {
      padding: 12px 16px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
    }

    .newsletter-form button {
      background: white !important;
      color: #556B2F !important;
      font-weight: 600 !important;
    }

    @media (max-width: 968px) {
      .hero {
        grid-template-columns: 1fr;
        padding: 60px 30px;
      }

      .hero-content h1 {
        font-size: 36px;
      }

      .featured-section,
      .categories-section,
      .why-us-section,
      .newsletter-section {
        padding: 60px 30px;
      }

      .section-header h2 {
        font-size: 28px;
      }

      .newsletter-form {
        flex-direction: row;
      }
    }

    @media (max-width: 600px) {
      .hero {
        padding: 40px 20px;
      }

      .hero-content h1 {
        font-size: 28px;
      }

      .hero-content > p:nth-child(2) {
        font-size: 18px;
      }

      .featured-section,
      .categories-section,
      .why-us-section,
      .newsletter-section {
        padding: 40px 20px;
      }

      .section-header h2 {
        font-size: 24px;
      }

      .newsletter-form {
        flex-direction: column;
      }
    }
  `]
})
export class HomeComponent {}
