import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer bg-olive text-white">
      <div class="footer-container">
        <div class="footer-section">
          <h3>Olive & Co.</h3>
          <p>Premium, organic products crafted from sustainable olive groves. Bringing nature's best to your kitchen, body, and home.</p>
        </div>
        <div class="footer-section">
          <h3>Customer Service</h3>
          <ul>
            <li><a>Contact Us</a></li>
            <li><a>Shipping & Returns</a></li>
            <li><a>FAQs</a></li>
            <li><a>Privacy Policy</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>Store Roles</h3>
          <p>Log in as <strong>customer&#64;olive.com</strong> to buy products, or <strong>admin&#64;olive.com</strong> to view dashboard analytics and manage orders.</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Olive & Co. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      padding: 40px 24px 20px;
      margin-top: auto;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 32px;
    }

    .footer-section {
      h3 {
        color: #ffffff;
        font-family: 'Outfit', sans-serif;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 16px;
      }

      p {
        font-size: 14px;
        line-height: 1.6;
        color: rgba(255, 255, 255, 0.8);
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          margin-bottom: 8px;
          
          a {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
            
            &:hover {
              color: #ffffff;
              text-decoration: underline;
            }
          }
        }
      }
    }

    .footer-bottom {
      max-width: 1200px;
      margin: 32px auto 0;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
      
      p {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
