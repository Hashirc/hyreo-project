import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer-container">
      <div class="footer-grid">
        <div class="footer-column">
          <h3 class="footer-brand">QUICK KART</h3>
          <p class="footer-text">Elevating your shopping experience with curated, high-quality products. Dedicated to offering precision-engineered electronics, custom fashion styles, and premium home goods.</p>
        </div>
        <div class="footer-column">
          <h3 class="column-title">Customer Service</h3>
          <ul class="footer-links">
            <li><a href="javascript:void(0)">Contact Us</a></li>
            <li><a href="javascript:void(0)">Shipping & Returns</a></li>
            <li><a href="javascript:void(0)">FAQs</a></li>
            <li><a href="javascript:void(0)">Privacy Policy</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h3 class="column-title">Account Roles</h3>
          <p class="footer-text">Sign in as <strong>customer&#64;olive.com</strong> to checkout products, or <strong>admin&#64;olive.com</strong> to view dashboard metrics and fulfill orders.</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} QUICK KART. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer-container {
      background-color: #F4F6EC;
      color: #2D3A1B;
      padding: 56px 24px 24px;
      margin-top: auto;
      border-top: 1px solid rgba(45, 58, 27, 0.06);
    }

    .footer-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 40px;
    }

    .footer-column {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .footer-brand {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 20px;
      color: #2D3A1B;
      letter-spacing: 0.5px;
      margin: 0;
    }

    .column-title {
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 16px;
      color: #2D3A1B;
      margin: 0;
    }

    .footer-text {
      font-size: 14px;
      line-height: 1.6;
      color: #5A664A;
      margin: 0;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;

      li a {
        font-size: 14px;
        color: #5A664A;
        text-decoration: none;
        transition: color 0.2s ease;

        &:hover {
          color: #2D3A1B;
          text-decoration: underline;
        }
      }
    }

    .footer-bottom {
      max-width: 1200px;
      margin: 40px auto 0;
      padding-top: 24px;
      border-top: 1px solid rgba(45, 58, 27, 0.06);
      text-align: center;
      
      p {
        font-size: 12px;
        color: #5A664A;
        margin: 0;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
