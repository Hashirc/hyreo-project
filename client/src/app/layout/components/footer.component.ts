import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-section">
          <h3>About HYREO</h3>
          <p>Your one-stop e-commerce platform for quality products delivered to your doorstep.</p>
        </div>

        <div class="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a routerLink="/">Home</a></li>
            <li><a routerLink="/products">Products</a></li>
            <li><a routerLink="/about">About Us</a></li>
            <li><a routerLink="/contact">Contact</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>Customer Service</h3>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>Legal</h3>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2024 HYREO E-Commerce. All rights reserved.</p>
        <div class="social-links">
          <a href="#">Facebook</a>
          <a href="#">Twitter</a>
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: linear-gradient(135deg, #556B2F 0%, #3d4d1f 100%);
      color: white;
      margin-top: 60px;
      padding-top: 40px;
    }

    .footer-container {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 40px;
      padding: 0 20px 40px;
    }

    .footer-section h3 {
      color: #9ACD32;
      margin-bottom: 15px;
      font-size: 18px;
      font-weight: 600;
    }

    .footer-section p {
      line-height: 1.6;
      margin: 0;
    }

    .footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-section li {
      margin-bottom: 10px;
    }

    .footer-section a {
      color: white;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-section a:hover {
      color: #9ACD32;
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding: 20px;
      text-align: center;
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
    }

    .footer-bottom p {
      margin: 0;
    }

    .social-links {
      display: flex;
      gap: 20px;
    }

    .social-links a {
      color: white;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .social-links a:hover {
      color: #9ACD32;
    }

    @media (max-width: 768px) {
      .footer-container {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .footer-bottom {
        flex-direction: column;
        gap: 15px;
      }

      .social-links {
        justify-content: center;
      }
    }
  `]
})
export class FooterComponent {}
