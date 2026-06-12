import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DealOfTheDayComponent } from './deal-of-the-day/deal-of-the-day.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, DealOfTheDayComponent],
  template: `
    <div class="home-page">
      <!-- Deal of the Day Section -->
      <app-deal-of-the-day></app-deal-of-the-day>

      <!-- Flat 50% Off Section -->
      <section class="promo-section">
        <div class="section-header">
          <span class="promo-badge badge-50">MEGA DEALS</span>
          <h2>Flat 50% Off</h2>
          <p>Unbeatable half-price discounts on daily essentials and tech</p>
        </div>
        <div class="promo-grid">
          @for (prod of flat50Products; track prod.name) {
            <div class="promo-card" [routerLink]="['/products', prod.id]">
              <div class="promo-image-wrapper">
                <img [src]="prod.image" [alt]="prod.name" class="promo-img">
                <span class="discount-tag">-50% OFF</span>
              </div>
              <div class="promo-info">
                <h3>{{ prod.name }}</h3>
                <span class="shop-now-text">Shop Now <mat-icon>arrow_right_alt</mat-icon></span>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Flat Above 25% Off Section -->
      <section class="promo-section">
        <div class="section-header">
          <span class="promo-badge badge-25">FESTIVE OFFERS</span>
          <h2>Flat Above 25% Off</h2>
          <p>Premium home appliance and lifestyle brands at best prices</p>
        </div>
        <div class="promo-grid">
          @for (prod of flat25Products; track prod.name) {
            <div class="promo-card" [routerLink]="['/products', prod.id]">
              <div class="promo-image-wrapper">
                <img [src]="prod.image" [alt]="prod.name" class="promo-img">
                <span class="discount-tag">Min 25% Off</span>
              </div>
              <div class="promo-info">
                <h3>{{ prod.name }}</h3>
                <span class="shop-now-text">Shop Now <mat-icon>arrow_right_alt</mat-icon></span>
              </div>
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
      gap: 40px;
      padding-bottom: 60px;
    }

    /* Promo Sections Layout */
    .promo-section {
      background: #ffffff;
      border-radius: 24px;
      padding: 40px 24px;
      border: 1px solid rgba(112, 134, 35, 0.08);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
    }

    .section-header {
      text-align: center;
      margin-bottom: 36px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .promo-badge {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        padding: 4px 12px;
        border-radius: 12px;
        margin-bottom: 12px;
      }

      .badge-50 {
        background-color: #fce8e6;
        color: #c53929;
      }

      .badge-25 {
        background-color: #eaf1dc;
        color: #556b2f;
      }

      h2 {
        font-size: 32px;
        color: #1e2610;
        margin-bottom: 8px;
        font-weight: 700;
        font-family: 'Outfit', sans-serif;
      }

      p {
        font-size: 15px;
        color: #63791d;
        margin: 0;
      }
    }

    /* 4x2 Grid Layout (4 columns on desktop) */
    .promo-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }

    .promo-card {
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
      border: 1px solid rgba(112, 134, 35, 0.06);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      position: relative;
    }

    .promo-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 24px rgba(85, 107, 47, 0.1);
      border-color: rgba(112, 134, 35, 0.2);
    }

    .promo-image-wrapper {
      height: 200px;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      position: relative;
      border-bottom: 1px solid rgba(0, 0, 0, 0.03);
    }

    .promo-img {
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      object-fit: contain;
      transition: transform 0.4s ease;
    }

    .promo-card:hover .promo-img {
      transform: scale(1.04);
    }

    .discount-tag {
      position: absolute;
      top: 12px;
      left: 12px;
      background: #e65c00;
      color: #ffffff;
      font-weight: 700;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 20px;
      box-shadow: 0 2px 6px rgba(230, 92, 0, 0.25);
    }

    .promo-info {
      padding: 16px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      justify-content: space-between;

      h3 {
        font-size: 15px;
        font-weight: 600;
        color: #1e2610;
        margin: 0 0 12px 0;
        font-family: 'Outfit', sans-serif;
        line-height: 1.3;
      }
    }

    .shop-now-text {
      font-size: 13px;
      font-weight: 600;
      color: #708623;
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: auto;
      transition: color 0.2s ease;

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        transition: transform 0.2s ease;
      }
    }

    .promo-card:hover .shop-now-text {
      color: #556b2f;
    }

    .promo-card:hover .shop-now-text mat-icon {
      transform: translateX(4px);
    }

    /* Responsive adjustments */
    @media (max-width: 1024px) {
      .promo-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 768px) {
      .promo-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .section-header h2 {
        font-size: 26px;
      }
    }

    @media (max-width: 480px) {
      .promo-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent {
  flat50Products = [
    { id: 'flat50_1', name: 'Adidas Running Shoe', image: '/assets/flat_50/adidas_shoe.webp' },
    { id: 'flat50_2', name: 'Comfort Bean Bag', image: '/assets/flat_50/bean_bag.webp' },
    { id: 'flat50_3', name: 'Wireless Headphone', image: '/assets/flat_50/headphone.webp' },
    { id: 'flat50_4', name: 'Kitchen Mixie', image: '/assets/flat_50/mixie.webp' },
    { id: 'flat50_5', name: 'Smartphone', image: '/assets/flat_50/phone.webp' },
    { id: 'flat50_6', name: 'Power Bank', image: '/assets/flat_50/power_bank.webp' },
    { id: 'flat50_7', name: 'Table with Chair', image: '/assets/flat_50/table_with_chair.webp' },
    { id: 'flat50_8', name: 'Smart TV', image: '/assets/flat_50/tv.webp' }
  ];

  flat25Products = [
    { id: 'flat25_1', name: 'Split AC', image: '/assets/flat_25/AC.webp' },
    { id: 'flat25_2', name: 'Books Collection', image: '/assets/flat_25/book.webp' },
    { id: 'flat25_3', name: 'Elegant Dress', image: '/assets/flat_25/dress.webp' },
    { id: 'flat25_4', name: 'Drying Stand', image: '/assets/flat_25/drying_stand.webp' },
    { id: 'flat25_5', name: 'Ceiling Fan', image: '/assets/flat_25/fan.webp' },
    { id: 'flat25_6', name: 'Premium Mixer', image: '/assets/flat_25/mixer.webp' },
    { id: 'flat25_7', name: 'Living Room Sofa', image: '/assets/flat_25/sofa.webp' },
    { id: 'flat25_8', name: 'Bluetooth Speaker', image: '/assets/flat_25/speaker.webp' }
  ];
}
