import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-deal-of-the-day',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="deal-of-the-day">
      <h2 class="section-title">Deal of the Day</h2>
      <div class="scroll-container">
        <div class="scroll-content">
          <img *ngFor="let img of images" [src]="img" alt="Deal" class="deal-img" />
          <!-- duplicate for seamless loop -->
          <img *ngFor="let img of images" [src]="img" alt="Deal" class="deal-img" />
        </div>
      </div>
    </section>
  `,
  styles: [`
    .deal-of-the-day { text-align: center; margin: 48px 0; }
    .section-title { font-size: 28px; color: #1e2610; margin-bottom: 24px; }
    .scroll-container { overflow: hidden; }
    .scroll-content { display: flex; gap: 16px; animation: scroll 20s linear infinite; }
    .deal-img { height: 180px; border-radius: 8px; object-fit: cover; }
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `]
})
export class DealOfTheDayComponent {
  images = [
    'assets/deal-of-the-day/earpod_deal.jpg',
    'assets/deal-of-the-day/shoe_deal.jpg',
    'assets/deal-of-the-day/trimmer_deal.jpg',
    'assets/deal-of-the-day/tv_deal.jpg',
    'assets/deal-of-the-day/whey_deal.jpg'
  ];
}
