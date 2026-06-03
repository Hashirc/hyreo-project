import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule
  ],
  template: `
    <div class="admin-dashboard">
      <div class="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage products, orders, and users</p>
      </div>

      <div class="dashboard-stats">
        <mat-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon products-icon">
              <mat-icon>inventory_2</mat-icon>
            </div>
            <div class="stat-info">
              <h3>Total Products</h3>
              <p class="stat-value">{{ productService.products().length }}</p>
            </div>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon orders-icon">
              <mat-icon>shopping_cart</mat-icon>
            </div>
            <div class="stat-info">
              <h3>Total Orders</h3>
              <p class="stat-value">{{ totalOrders() }}</p>
            </div>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon users-icon">
              <mat-icon>people</mat-icon>
            </div>
            <div class="stat-info">
              <h3>Total Users</h3>
              <p class="stat-value">{{ totalUsers() }}</p>
            </div>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon revenue-icon">
              <mat-icon>attach_money</mat-icon>
            </div>
            <div class="stat-info">
              <h3>Total Revenue</h3>
              <p class="stat-value">\${{ totalRevenue().toFixed(2) }}</p>
            </div>
          </div>
        </mat-card>
      </div>

      <div class="dashboard-sections">
        <mat-card class="section-card">
          <div class="section-header">
            <h2>Recent Orders</h2>
            <button mat-raised-button color="primary">View All Orders</button>
          </div>

          <table mat-table [dataSource]="recentOrders()">
            <ng-container matColumnDef="orderId">
              <th mat-header-cell>Order ID</th>
              <td mat-cell>{{ element.id.substring(0, 8) }}</td>
            </ng-container>

            <ng-container matColumnDef="total">
              <th mat-header-cell>Total</th>
              <td mat-cell>\${{ element.total.toFixed(2) }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell>Status</th>
              <td mat-cell>
                <span [class]="'status-' + element.status">
                  {{ element.status }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="date">
              <th mat-header-cell>Date</th>
              <td mat-cell>{{ formatDate(element.createdAt) }}</td>
            </ng-container>

            <tr mat-header-row></tr>
            <tr mat-row *matRowDef="let row; columns: ['orderId', 'total', 'status', 'date'];"></tr>
          </table>
        </mat-card>

        <mat-card class="section-card">
          <div class="section-header">
            <h2>Top Products</h2>
            <button mat-raised-button color="primary">View All Products</button>
          </div>

          <div class="products-list">
            @for (product of topProducts(); track product.id) {
              <div class="product-row">
                <img [src]="product.imageUrl" [alt]="product.name" class="product-image">
                <div class="product-details">
                  <h4>{{ product.name }}</h4>
                  <p>{{ product.stock }} in stock</p>
                </div>
                <div class="product-price">
                  \${{ product.price }}
                </div>
              </div>
            }
          </div>
        </mat-card>
      </div>

      <div class="admin-actions">
        <mat-card>
          <h3>Admin Actions</h3>
          <div class="actions-grid">
            <button mat-raised-button color="primary">
              <mat-icon>add</mat-icon>
              Add New Product
            </button>
            <button mat-raised-button color="primary">
              <mat-icon>edit</mat-icon>
              Manage Products
            </button>
            <button mat-raised-button color="primary">
              <mat-icon>shopping_cart</mat-icon>
              Manage Orders
            </button>
            <button mat-raised-button color="primary">
              <mat-icon>people</mat-icon>
              Manage Users
            </button>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      padding: 40px 20px;
      background: #f5f5f5;
      min-height: calc(100vh - 200px);
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 40px;
      max-width: 1400px;
      margin-left: auto;
      margin-right: auto;
    }

    .dashboard-header h1 {
      color: #556B2F;
      font-size: 36px;
      margin: 0 0 10px 0;
      font-weight: 700;
    }

    .dashboard-header p {
      color: #999;
      margin: 0;
      font-size: 16px;
    }

    .dashboard-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      max-width: 1400px;
      margin: 0 auto 40px;
    }

    .stat-card {
      padding: 24px;
      border-radius: 12px;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .stat-content {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      color: white;
    }

    .stat-icon.products-icon {
      background: linear-gradient(135deg, #556B2F 0%, #3d4d1f 100%);
    }

    .stat-icon.orders-icon {
      background: linear-gradient(135deg, #2196f3 0%, #1565c0 100%);
    }

    .stat-icon.users-icon {
      background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
    }

    .stat-icon.revenue-icon {
      background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
    }

    .stat-info h3 {
      margin: 0 0 4px 0;
      color: #666;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .stat-value {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      color: #333;
    }

    .dashboard-sections {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 24px;
      max-width: 1400px;
      margin: 0 auto 40px;
    }

    .section-card {
      padding: 24px;
      border-radius: 12px;
      background: white;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .section-header h2 {
      margin: 0;
      color: #556B2F;
      font-size: 20px;
      font-weight: 600;
    }

    table {
      width: 100%;
    }

    .status-pending {
      background: #fff3cd;
      color: #856404;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-paid {
      background: #d4edda;
      color: #155724;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-shipped {
      background: #d1ecf1;
      color: #0c5460;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-delivered {
      background: #d4edda;
      color: #155724;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    .products-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .product-row {
      display: flex;
      gap: 12px;
      padding: 12px;
      border: 1px solid #eee;
      border-radius: 8px;
      align-items: center;
    }

    .product-image {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 6px;
    }

    .product-details {
      flex: 1;
    }

    .product-details h4 {
      margin: 0 0 4px 0;
      font-size: 14px;
      font-weight: 600;
    }

    .product-details p {
      margin: 0;
      font-size: 12px;
      color: #999;
    }

    .product-price {
      font-weight: 700;
      color: #556B2F;
    }

    .admin-actions {
      max-width: 1400px;
      margin: 0 auto;
    }

    .admin-actions mat-card {
      padding: 24px;
    }

    .admin-actions h3 {
      margin: 0 0 20px 0;
      color: #556B2F;
      font-size: 20px;
      font-weight: 600;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
    }

    .actions-grid button {
      background: #556B2F !important;
      color: white !important;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .dashboard-stats {
        grid-template-columns: 1fr;
      }

      .dashboard-sections {
        grid-template-columns: 1fr;
      }

      .section-header {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  orders = signal<Order[]>([]);
  totalOrders = signal(0);
  totalUsers = signal(250);
  totalRevenue = signal(45680.50);

  constructor(
    public productService: ProductService,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (response) => {
        this.orders.set(response.orders);
        this.totalOrders.set(response.total);
        this.calculateTotalRevenue();
      },
      error: (error) => {
        console.error('Failed to load orders:', error);
      }
    });
  }

  get recentOrders(): () => Order[] {
    return () => this.orders().slice(0, 5);
  }

  get topProducts() {
    return () => this.productService.products().slice(0, 5);
  }

  calculateTotalRevenue(): void {
    const revenue = this.orders().reduce((sum, order) => sum + order.total, 0);
    this.totalRevenue.set(revenue);
  }

  formatDate(date: any): string {
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  }
}
