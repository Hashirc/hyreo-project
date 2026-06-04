import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-deal-of-the-day',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="deal-of-the-day-section">
      <div class="container">
        <h2 class="section-title">Deal of the Day</h2>
        <p class="section-subtitle">Grab these exclusive discounts before time runs out!</p>
        
        <div class="deal-card-container">
          <div class="deal-slides-frame">
            <div 
              *ngFor="let deal of deals; let i = index" 
              class="deal-slide" 
              [class.active]="i === activeSlide"
            >
              <div class="image-area">
                <img [src]="deal.image" [alt]="deal.name" class="deal-img" />
              </div>
              
              <div class="details-area">
                <div class="deal-badge-row">
                  <span class="limited-tag">Limited Time Deal</span>
                  <span class="discount-badge">Save {{ getDiscountPercentage(deal.originalPrice, deal.offerPrice) }}%</span>
                </div>
                
                <h3 class="product-title">{{ deal.name }}</h3>
                
                <div class="price-box">
                  <div class="original-price-label">Regular Price</div>
                  <span class="original-price">₹{{ deal.originalPrice }}</span>
                  <div class="offer-price-label">Deal Price</div>
                  <span class="offer-price">₹{{ deal.offerPrice }}</span>
                </div>

                <div class="deal-countdown">
                  <span class="ends-in">Offers end soon!</span>
                </div>
                
                <button class="claim-btn" [routerLink]="['/products']">
                  Claim This Deal <span class="arrow">→</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Bottom navigation dots -->
          <div class="dots-container">
            <button 
              *ngFor="let deal of deals; let i = index" 
              class="dot-btn" 
              [class.active]="i === activeSlide"
              (click)="goToSlide(i)"
              [attr.aria-label]="'Go to slide ' + (i + 1)"
            ></button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .deal-of-the-day-section {
      padding: 60px 0;
      background: linear-gradient(to bottom, #fafbfa 0%, #f4f6f1 100%);
      border-radius: 24px;
      margin: 40px 0;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.02);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .section-title {
      font-size: 36px;
      font-weight: 700;
      color: #1e2610;
      text-align: center;
      margin-bottom: 8px;
      font-family: 'Outfit', sans-serif;
    }

    .section-subtitle {
      font-size: 16px;
      color: #63791d;
      text-align: center;
      margin-bottom: 40px;
      font-weight: 500;
    }

    .deal-card-container {
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 15px 35px rgba(85, 107, 47, 0.08), 0 5px 15px rgba(0, 0, 0, 0.02);
      border: 1px solid rgba(112, 134, 35, 0.1);
      overflow: hidden;
      position: relative;
    }

    .deal-slides-frame {
      position: relative;
      height: 480px; /* Takes up middle half of screen nicely */
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
      transition: opacity 0.6s ease-in-out, transform 0.6s ease-in-out;
      transform: scale(0.98);
    }

    .deal-slide.active {
      opacity: 1;
      visibility: visible;
      transform: scale(1);
      position: relative; /* Keep height dynamic/fixed */
    }

    .image-area {
      flex: 1.2;
      height: 100%;
      overflow: hidden;
      position: relative;
      background-color: #f7f9f6;
    }

    .deal-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 6s ease-in-out;
    }

    .deal-slide.active .deal-img {
      transform: scale(1.04);
    }

    .details-area {
      flex: 1;
      padding: 48px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: #ffffff;
      border-left: 1px solid rgba(112, 134, 35, 0.08);
    }

    .deal-badge-row {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
      align-items: center;
    }

    .limited-tag {
      background-color: #fce8e6;
      color: #c53929;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .discount-badge {
      background-color: #eaf1dc;
      color: #556b2f;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 12px;
    }

    .product-title {
      font-size: 32px;
      font-weight: 700;
      color: #1e2610;
      margin-bottom: 24px;
      line-height: 1.2;
      font-family: 'Outfit', sans-serif;
    }

    .price-box {
      background: #f8faf6;
      padding: 20px;
      border-radius: 16px;
      border: 1px dashed rgba(112, 134, 35, 0.2);
      margin-bottom: 24px;
      display: grid;
      grid-template-columns: auto auto;
      align-items: center;
      row-gap: 8px;
      column-gap: 16px;
      width: fit-content;
    }

    .original-price-label, .offer-price-label {
      font-size: 13px;
      color: #666;
      font-weight: 500;
    }

    .original-price {
      font-size: 20px;
      text-decoration: line-through;
      color: #a0a0a0;
      font-weight: 600;
    }

    .offer-price {
      font-size: 28px;
      color: #e65c00;
      font-weight: 800;
    }

    .deal-countdown {
      margin-bottom: 30px;
      font-size: 14px;
      color: #63791d;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .claim-btn {
      background-color: #708623;
      color: #ffffff;
      border: none;
      padding: 16px 32px;
      border-radius: 30px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: fit-content;
      font-family: 'Outfit', sans-serif;
      box-shadow: 0 4px 12px rgba(112, 134, 35, 0.2);
    }

    .claim-btn:hover {
      background-color: #556b2f;
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(112, 134, 35, 0.3);
    }

    .arrow {
      transition: transform 0.2s ease;
    }

    .claim-btn:hover .arrow {
      transform: translateX(4px);
    }

    /* Dots Navigation */
    .dots-container {
      display: flex;
      justify-content: center;
      gap: 8px;
      padding: 16px 0;
      background: #ffffff;
      border-top: 1px solid rgba(112, 134, 35, 0.05);
    }

    .dot-btn {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #d1d9bf;
      border: none;
      padding: 0;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .dot-btn.active {
      background-color: #708623;
      transform: scale(1.3);
      width: 20px;
      border-radius: 5px;
    }

    /* Responsive style */
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
        height: 300px;
        width: 100%;
      }

      .details-area {
        padding: 32px 24px;
        border-left: none;
        border-top: 1px solid rgba(112, 134, 35, 0.08);
      }
      
      .product-title {
        font-size: 24px;
      }
    }
  `]
})
export class DealOfTheDayComponent implements OnInit, OnDestroy {
  deals = [
    {
      name: 'Dynamic Sports Running Shoes',
      originalPrice: 1999,
      offerPrice: 1599,
      image: 'assets/deal-of-the-day/shoe_deal.jpg'
    },
    {
      name: 'Precision Waterproof Beard Trimmer',
      originalPrice: 2599,
      offerPrice: 2199,
      image: 'assets/deal-of-the-day/trimmer_deal.jpg'
    },
    {
      name: '4K Ultra HD Smart LED Android TV',
      originalPrice: 53599,
      offerPrice: 50099,
      image: 'assets/deal-of-the-day/tv_deal.jpg'
    },
    {
      name: 'Premium Ultra Whey Protein Isolate',
      originalPrice: 6599,
      offerPrice: 6099,
      image: 'assets/deal-of-the-day/whey_deal.jpg'
    },
    {
      name: 'Noise Cancelling Wireless Earpods',
      originalPrice: 2099,
      offerPrice: 1799,
      image: 'assets/deal-of-the-day/earpod_deal.jpg'
    }
  ];

  activeSlide = 0;
  private intervalId: any;

  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  startAutoPlay() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 2000);
  }

  stopAutoPlay() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide() {
    this.activeSlide = (this.activeSlide + 1) % this.deals.length;
  }

  goToSlide(index: number) {
    this.activeSlide = index;
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  getDiscountPercentage(original: number, offer: number): number {
    return Math.round(((original - offer) / original) * 100);
  }
}
