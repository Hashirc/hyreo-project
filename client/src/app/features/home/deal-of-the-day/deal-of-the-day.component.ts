import { Component, OnInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/types';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-deal-of-the-day',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule],
  template: `
    <section class="deal-of-the-day-section" id="deals">
      <div class="container">
        <div class="deal-card-container">
          <div class="deal-slides-frame">
            @for (deal of deals; let i = $index; track deal.id) {
              <div 
                class="deal-slide" 
                [class.active]="i === activeSlide"
              >
                <!-- Left Details Area -->
                <div class="details-area">
                  <div class="deal-badge">
                    <mat-icon class="badge-icon">local_offer</mat-icon>
                    <span>DEAL OF THE DAY</span>
                  </div>
                  
                  <h2 class="product-title" [routerLink]="['/products', deal.id]">{{ deal.name }}</h2>
                  <p class="product-description" [routerLink]="['/products', deal.id]">{{ deal.description }}</p>
                  
                  <!-- Countdown Timer -->
                  <div class="countdown-timer">
                    <div class="time-block">
                      <span class="time-num">{{ pad(countdownHours) }}</span>
                      <span class="time-label">HOURS</span>
                    </div>
                    <span class="time-divider">:</span>
                    <div class="time-block">
                      <span class="time-num">{{ pad(countdownMinutes) }}</span>
                      <span class="time-label">MINS</span>
                    </div>
                    <span class="time-divider">:</span>
                    <div class="time-block">
                      <span class="time-num">{{ pad(countdownSeconds) }}</span>
                      <span class="time-label">SECS</span>
                    </div>
                  </div>

                  <div class="deal-actions">
                    <button class="buy-now-btn" (click)="buyNow($event, deal)">
                      Shop Now for \${{ deal.offerPrice | number:'1.2-2' }}
                    </button>
                    <button class="add-to-cart-btn" [routerLink]="['/products', deal.id]">
                      Details
                    </button>
                  </div>
                </div>

                <!-- Right Image Area -->
                <div class="image-area">
                  <div class="image-gradient-card" [routerLink]="['/products', deal.id]">
                    <img [src]="deal.image" [alt]="deal.name" class="deal-img" />
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Navigation Arrows -->
          <button class="nav-btn prev-btn" (click)="prevSlide()" aria-label="Previous Deal">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          
          <button class="nav-btn next-btn" (click)="nextSlide()" aria-label="Next Deal">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>

          <!-- Bottom navigation dots -->
          <div class="dots-container">
            @for (deal of deals; let i = $index; track deal.id) {
              <button 
                class="dot-btn" 
                [class.active]="i === activeSlide"
                (click)="goToSlide(i)"
                [attr.aria-label]="'Go to slide ' + (i + 1)"
              ></button>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .deal-of-the-day-section {
      padding: 24px 0;
      background-color: #F7F9ED;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .deal-card-container {
      background-color: #E2ECB8;
      border-radius: 32px;
      overflow: hidden;
      position: relative;
    }

    .deal-slides-frame {
      position: relative;
      min-height: 480px;
    }

    .deal-slide {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
      transform: scale(0.98);
    }

    .deal-slide.active {
      opacity: 1;
      visibility: visible;
      transform: scale(1);
      position: relative;
    }

    .details-area {
      flex: 1.1;
      padding: 48px 48px 48px 64px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 16px;
    }

    .deal-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background-color: #FAF9F5;
      color: #2D3A1B;
      font-weight: 700;
      font-size: 11px;
      padding: 6px 14px;
      border-radius: 20px;
      width: fit-content;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 4px rgba(45, 58, 27, 0.03);

      .badge-icon {
        font-size: 14px;
        height: 14px;
        width: 14px;
      }
    }

    .product-title {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 36px;
      color: #2D3A1B;
      line-height: 1.2;
      margin: 0;
      cursor: pointer;
      text-decoration: none;

      &:hover {
        opacity: 0.95;
      }
    }

    .product-description {
      font-size: 15px;
      color: #5A664A;
      line-height: 1.5;
      margin: 0;
      max-width: 450px;
      cursor: pointer;
    }

    .countdown-timer {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 8px 0;
    }

    .time-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #FAF9F5;
      border-radius: 12px;
      min-width: 64px;
      padding: 8px;
      box-shadow: 0 4px 10px rgba(45, 58, 27, 0.04);
    }

    .time-num {
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: #2D3A1B;
      line-height: 1;
    }

    .time-label {
      font-size: 9px;
      font-weight: 700;
      color: #5A664A;
      margin-top: 4px;
    }

    .time-divider {
      font-size: 20px;
      font-weight: 800;
      color: #2D3A1B;
      margin-top: -12px;
    }

    .deal-actions {
      display: flex;
      gap: 12px;
      margin-top: 12px;
    }

    .buy-now-btn {
      background-color: #2D3A1B !important;
      color: #ffffff !important;
      border-radius: 20px !important;
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 13px;
      padding: 12px 28px !important;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(45, 58, 27, 0.15);
      transition: all 0.2s ease;

      &:hover {
        background-color: #43542B !important;
        transform: scale(1.02);
        box-shadow: 0 6px 16px rgba(45, 58, 27, 0.2);
      }
    }

    .add-to-cart-btn {
      background-color: #ffffff !important;
      color: #2D3A1B !important;
      border-radius: 20px !important;
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 13px;
      padding: 12px 28px !important;
      border: 1px solid #FAF9F5;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;

      &:hover {
        background-color: rgba(255, 255, 255, 0.85) !important;
        transform: scale(1.02);
      }
    }

    .image-area {
      flex: 0.9;
      padding: 48px 48px 48px 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .image-gradient-card {
      width: 100%;
      height: 350px;
      background: linear-gradient(135deg, #1E2712 0%, #2D3A1B 100%);
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(30, 39, 18, 0.15);
      transition: transform 0.4s ease;

      &:hover {
        transform: scale(1.01);
      }
    }

    .deal-img {
      max-width: 90%;
      max-height: 90%;
      width: auto;
      height: auto;
      object-fit: contain;
      transition: transform 0.4s ease;
    }

    .deal-slide.active .deal-img {
      transform: scale(1.02);
    }

    /* Arrow navigation */
    .nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #FAF9F5;
      border: 1px solid rgba(45, 58, 27, 0.1);
      box-shadow: 0 4px 10px rgba(45, 58, 27, 0.08);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #2D3A1B;
      transition: all 0.25s ease;
      outline: none;

      &:hover {
        background: #2D3A1B;
        color: #FAF9F5;
        box-shadow: 0 6px 14px rgba(45, 58, 27, 0.25);
      }
    }

    .prev-btn {
      left: 16px;
    }

    .next-btn {
      right: 16px;
    }

    /* Dots */
    .dots-container {
      display: flex;
      justify-content: center;
      gap: 8px;
      padding: 12px 0 20px;
      background: transparent;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }

    .dot-btn {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #FAF9F5;
      opacity: 0.6;
      border: none;
      padding: 0;
      cursor: pointer;
      transition: all 0.3s ease;

      &.active {
        background-color: #2D3A1B;
        opacity: 1;
        width: 18px;
        border-radius: 4px;
      }
    }

    /* Responsive */
    @media (max-width: 900px) {
      .deal-slides-frame {
        height: auto;
      }
      
      .deal-slide {
        position: relative;
        flex-direction: column;
        height: auto;
      }

      .image-area {
        height: 280px;
        width: 100%;
        padding: 24px;
      }

      .image-gradient-card {
        height: 100%;
      }

      .details-area {
        padding: 40px 32px 16px;
      }

      .product-title {
        font-size: 26px;
      }

      .nav-btn {
        width: 36px;
        height: 36px;
      }

      .prev-btn {
        left: 8px;
      }

      .next-btn {
        right: 8px;
      }
    }
  `]
})
export class DealOfTheDayComponent implements OnInit, OnDestroy {
  private cartService = inject(CartService);
  private router = inject(Router);

  deals = [
    {
      id: 'deal_1',
      name: 'Precision Audio Sonic 5.0 Pro',
      description: 'Organic sound, precise engineering. Our limited edition wireless studio headphones offer pure clarity in every note.',
      originalPrice: 399,
      offerPrice: 299,
      stock: 50,
      image: '/assets/flat_50/headphone.webp'
    },
    {
      id: 'deal_2',
      name: 'Classic Aura Gold Shades',
      description: 'Handcrafted titanium frames offering superior UV protection and timeless aesthetic design.',
      originalPrice: 160,
      offerPrice: 120,
      stock: 35,
      image: '/assets/flat_25/book.webp'
    },
    {
      id: 'deal_3',
      name: 'Minimalist Studio Mic Pro',
      description: 'Crystal clear studio recording microphone. Ideal for podcasting, streaming, and premium vocals.',
      originalPrice: 250,
      offerPrice: 187.5,
      stock: 15,
      image: '/assets/flat_50/mixie.webp'
    }
  ];

  activeSlide = 0;
  countdownHours = 8;
  countdownMinutes = 39;
  countdownSeconds = 14;
  private intervalId: any;
  private countdownIntervalId: any;
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    this.startAutoPlay();
    this.startCountdown();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
    this.stopCountdown();
  }

  startAutoPlay() {
    if (isPlatformBrowser(this.platformId)) {
      this.stopAutoPlay();
      this.intervalId = setInterval(() => {
        this.nextSlide();
      }, 6000);
    }
  }

  stopAutoPlay() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startCountdown() {
    if (isPlatformBrowser(this.platformId)) {
      this.stopCountdown();
      this.countdownIntervalId = setInterval(() => {
        if (this.countdownSeconds > 0) {
          this.countdownSeconds--;
        } else {
          this.countdownSeconds = 59;
          if (this.countdownMinutes > 0) {
            this.countdownMinutes--;
          } else {
            this.countdownMinutes = 59;
            if (this.countdownHours > 0) {
              this.countdownHours--;
            } else {
              this.countdownHours = 8;
              this.countdownMinutes = 39;
              this.countdownSeconds = 14;
            }
          }
        }
      }, 1000);
    }
  }

  stopCountdown() {
    if (this.countdownIntervalId) {
      clearInterval(this.countdownIntervalId);
    }
  }

  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }

  prevSlide() {
    this.activeSlide = (this.activeSlide - 1 + this.deals.length) % this.deals.length;
    this.startAutoPlay();
  }

  nextSlide() {
    this.activeSlide = (this.activeSlide + 1) % this.deals.length;
    this.startAutoPlay();
  }

  goToSlide(index: number) {
    this.activeSlide = index;
    this.startAutoPlay();
  }

  getDiscountPercentage(original: number, offer: number): number {
    return Math.round(((original - offer) / original) * 100);
  }

  addToCart(event: Event, deal: any) {
    event.stopPropagation();
    const product: Product = {
      id: deal.id,
      name: deal.name,
      description: deal.description || '',
      price: deal.offerPrice,
      categoryId: 'mobile-computers',
      stock: deal.stock || 10,
      imageUrl: deal.image,
      rating: 4.8
    };
    this.cartService.addToCart(product, 1);
    alert(`${deal.name} added to cart!`);
  }

  buyNow(event: Event, deal: any) {
    event.stopPropagation();
    const product: Product = {
      id: deal.id,
      name: deal.name,
      description: deal.description || '',
      price: deal.offerPrice,
      categoryId: 'mobile-computers',
      stock: deal.stock || 10,
      imageUrl: deal.image,
      rating: 4.8
    };
    this.cartService.addToCart(product, 1);
    this.router.navigate(['/checkout']);
  }
}
