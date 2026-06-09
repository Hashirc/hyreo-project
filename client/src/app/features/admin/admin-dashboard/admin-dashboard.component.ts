import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderService } from '../../../core/services/order.service';
import { ProductService } from '../../../core/services/product.service';
import { Order, DashboardMetrics, OrderStatus, Category } from '../../../core/models/types';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    DecimalPipe,
    MatTabsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="admin-dashboard">
      <h1 class="page-title">Admin Dashboard</h1>

      <!-- KPI Summary Cards -->
      <div class="kpi-grid">
        <div class="kpi-card bg-light-olive mat-elevation-z1">
          <div class="kpi-icon-wrapper">
            <mat-icon class="text-olive">shopping_bag</mat-icon>
          </div>
          <div class="kpi-info">
            <span class="kpi-label">Total Products</span>
            <h2 class="kpi-value">{{ metrics()?.totalProducts || 0 }}</h2>
          </div>
        </div>

        <div class="kpi-card bg-light-olive mat-elevation-z1">
          <div class="kpi-icon-wrapper">
            <mat-icon class="text-olive">shopping_cart</mat-icon>
          </div>
          <div class="kpi-info">
            <span class="kpi-label">Total Orders</span>
            <h2 class="kpi-value">{{ metrics()?.totalOrders || 0 }}</h2>
          </div>
        </div>

        <div class="kpi-card bg-light-olive mat-elevation-z1">
          <div class="kpi-icon-wrapper">
            <mat-icon class="text-olive">people</mat-icon>
          </div>
          <div class="kpi-info">
            <span class="kpi-label">Total Users</span>
            <h2 class="kpi-value">{{ metrics()?.totalUsers || 0 }}</h2>
          </div>
        </div>
      </div>

      <!-- Tabbed admin layout -->
      <div class="dashboard-tabs-container">
        <mat-tab-group color="primary" class="custom-tab-group">
          <!-- Orders Management Tab -->
          <mat-tab label="Manage Orders">
            <div class="tab-content">
              @if (isOrdersLoading()) {
                <div class="spinner-wrapper">
                  <mat-progress-spinner mode="indeterminate" diameter="40"></mat-progress-spinner>
                </div>
              } @else {
                <div class="table-container">
                  <table mat-table [dataSource]="orders()" class="orders-table mat-elevation-z1">
                    <!-- ID Column -->
                    <ng-container matColumnDef="id">
                      <th mat-header-cell *matHeaderCellDef>Order ID</th>
                      <td mat-cell *matCellDef="let ord" class="font-outfit font-weight-600 text-olive">#{{ ord.id }}</td>
                    </ng-container>

                    <!-- Date Column -->
                    <ng-container matColumnDef="date">
                      <th mat-header-cell *matHeaderCellDef>Date</th>
                      <td mat-cell *matCellDef="let ord">{{ ord.createdAt | date:'mediumDate' }}</td>
                    </ng-container>

                    <!-- Items Column -->
                    <ng-container matColumnDef="items">
                      <th mat-header-cell *matHeaderCellDef>Items</th>
                      <td mat-cell *matCellDef="let ord">
                        <div class="items-cell">
                          @for (item of ord.items; track item.productId) {
                            <div class="item-summary">{{ item.quantity }}x {{ item.name }}</div>
                          }
                        </div>
                      </td>
                    </ng-container>

                    <!-- Total Column -->
                    <ng-container matColumnDef="total">
                      <th mat-header-cell *matHeaderCellDef>Total</th>
                      <td mat-cell *matCellDef="let ord" class="font-weight-600">\${{ ord.total | number:'1.2-2' }}</td>
                    </ng-container>

                    <!-- Status Column -->
                    <ng-container matColumnDef="status">
                      <th mat-header-cell *matHeaderCellDef>Status</th>
                      <td mat-cell *matCellDef="let ord">
                        <mat-form-field appearance="outline" class="status-select-field">
                          <mat-select [value]="ord.status" (selectionChange)="onStatusChange(ord.id, $event.value)">
                            @for (st of statuses; track st) {
                              <mat-option [value]="st">{{ st }}</mat-option>
                            }
                          </mat-select>
                        </mat-form-field>
                      </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                  </table>
                </div>
              }
            </div>
          </mat-tab>

          <!-- Create Product Tab -->
          <mat-tab label="Create New Product">
            <div class="tab-content flex-center">
              <div class="form-card mat-elevation-z1">
                <h3 class="form-title">Product Details</h3>
                <form [formGroup]="productForm" (ngSubmit)="onCreateProduct()" class="product-form">
                  <div class="form-row-2">
                    <mat-form-field appearance="outline">
                      <mat-label>Product Name</mat-label>
                      <input matInput type="text" formControlName="name" placeholder="e.g. Lavender Olive Soap">
                      @if (productForm.get('name')?.hasError('required') && productForm.get('name')?.touched) {
                        <mat-error>Product name is required</mat-error>
                      }
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Category</mat-label>
                      <mat-select formControlName="categoryId">
                        @for (cat of categories(); track cat.id) {
                          <mat-option [value]="cat.id">{{ cat.name }}</mat-option>
                        }
                      </mat-select>
                    </mat-form-field>
                  </div>

                  <mat-form-field appearance="outline">
                    <mat-label>Description</mat-label>
                    <textarea matInput formControlName="description" rows="3" placeholder="Describe the product details and benefits..."></textarea>
                  </mat-form-field>

                  <div class="form-row-3">
                    <mat-form-field appearance="outline">
                      <mat-label>Price ($)</mat-label>
                      <input matInput type="number" formControlName="price" placeholder="15.00">
                      @if (productForm.get('price')?.hasError('required') && productForm.get('price')?.touched) {
                        <mat-error>Required</mat-error>
                      }
                      @if (productForm.get('price')?.hasError('min') && productForm.get('price')?.touched) {
                        <mat-error>Must be > 0</mat-error>
                      }
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Stock Level</mat-label>
                      <input matInput type="number" formControlName="stock" placeholder="50">
                      @if (productForm.get('stock')?.hasError('required') && productForm.get('stock')?.touched) {
                        <mat-error>Required</mat-error>
                      }
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Rating (Default)</mat-label>
                      <input matInput type="number" formControlName="rating" step="0.1" placeholder="4.5">
                    </mat-form-field>
                  </div>

                  <mat-form-field appearance="outline">
                    <mat-label>Image URL</mat-label>
                    <input matInput type="url" formControlName="imageUrl" placeholder="https://images.unsplash.com/... (optional)">
                  </mat-form-field>

                  <div class="form-actions">
                    <button mat-raised-button color="primary" type="submit" [disabled]="productForm.invalid || isFormSubmitting()">
                      @if (isFormSubmitting()) {
                        <mat-progress-spinner diameter="24"></mat-progress-spinner>
                      } @else {
                        <ng-container><mat-icon>add</mat-icon> Add Product</ng-container>
                      }
                    </button>
                    <button mat-button type="button" (click)="productForm.reset({categoryId: 'gourmet-food', rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60'})">
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </mat-tab>
          
          <!-- Manage Users Tab -->
          <mat-tab label="Manage Users">
            <div class="tab-content flex-center">
              <div class="form-card mat-elevation-z1">
                <h3 class="form-title">User Management</h3>
                <p>User management table goes here. (Admin can block/delete users).</p>
              </div>
            </div>
          </mat-tab>

          <!-- Manage Categories Tab -->
          <mat-tab label="Manage Categories">
            <div class="tab-content flex-center">
              <div class="form-card mat-elevation-z1">
                <h3 class="form-title">Category Management</h3>
                <p>Category list and creation form goes here.</p>
              </div>
            </div>
          </mat-tab>

          <!-- Manage Coupons Tab -->
          <mat-tab label="Manage Coupons">
            <div class="tab-content flex-center">
              <div class="form-card mat-elevation-z1">
                <h3 class="form-title">Coupon & Offer Management</h3>
                <p>Discount code creation and management goes here.</p>
              </div>
            </div>
          </mat-tab>

          <!-- Manage Reviews Tab -->
          <mat-tab label="Manage Reviews">
            <div class="tab-content flex-center">
              <div class="form-card mat-elevation-z1">
                <h3 class="form-title">Review Management</h3>
                <p>Customer review moderation list goes here.</p>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .page-title {
      font-size: 32px;
      font-weight: 700;
      color: #1e2610;
    }

    // KPI layout
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .kpi-card {
      display: flex;
      align-items: center;
      padding: 24px;
      border-radius: 16px;
      gap: 20px;
      border: 1px solid rgba(85, 107, 47, 0.05);
    }

    .kpi-icon-wrapper {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      background-color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 4px 10px rgba(85, 107, 47, 0.08);

      mat-icon {
        font-size: 28px;
        height: 28px;
        width: 28px;
      }
    }

    .kpi-info {
      display: flex;
      flex-direction: column;

      .kpi-label {
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #708623;
      }

      .kpi-value {
        font-size: 28px;
        font-weight: 700;
        color: #1e2610;
        margin-bottom: 0;
      }
    }

    // Tabs Area
    .dashboard-tabs-container {
      margin-top: 12px;
    }

    .tab-content {
      padding: 24px 0;
    }

    .spinner-wrapper {
      display: flex;
      justify-content: center;
      padding: 48px;
    }

    // Table view
    .table-container {
      width: 100%;
      overflow-x: auto;
    }

    .orders-table {
      width: 100%;
      background-color: #ffffff;
      border-radius: 12px;
      border: 1px solid rgba(85, 107, 47, 0.08);
      
      th {
        font-family: 'Outfit', sans-serif;
        font-weight: 600;
        color: #556B2F;
        font-size: 14px;
        padding: 16px !important;
      }

      td {
        padding: 16px !important;
        font-size: 14px;
        color: #4a5435;
      }
    }

    .items-cell {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .item-summary {
      font-size: 13px;
    }

    .status-select-field {
      width: 140px;
      margin-bottom: 0;
      --mdc-outlined-text-field-container-shape: 8px;
      
      ::ng-deep .mat-mdc-form-field-infix {
        padding-top: 8px !important;
        padding-bottom: 8px !important;
        min-height: 40px !important;
      }
    }

    // Product creation form
    .flex-center {
      display: flex;
      justify-content: center;
    }

    .form-card {
      width: 100%;
      max-width: 600px;
      background-color: #ffffff;
      border-radius: 16px;
      border: 1px solid rgba(85, 107, 47, 0.08);
      padding: 24px;
    }

    .form-title {
      font-size: 20px;
      font-weight: 700;
      color: #1e2610;
      margin-bottom: 20px;
      border-bottom: 1px solid rgba(85, 107, 47, 0.08);
      padding-bottom: 8px;
    }

    .product-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-row-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      margin-top: 16px;

      button {
        height: 44px !important;
        border-radius: 22px !important;
        padding: 0 24px !important;
      }
    }

    @media (max-width: 600px) {
      .form-row-2, .form-row-3 {
        grid-template-columns: 1fr;
        gap: 0;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);

  // States
  readonly metrics = signal<DashboardMetrics | null>(null);
  readonly orders = signal<Order[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly isOrdersLoading = signal(true);
  readonly isFormSubmitting = signal(false);

  readonly displayedColumns = ['id', 'date', 'items', 'total', 'status'];
  readonly statuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  productForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    categoryId: ['gourmet-food', Validators.required],
    description: [''],
    price: [null, [Validators.required, Validators.min(0.01)]],
    stock: [null, [Validators.required, Validators.min(0)]],
    rating: [4.5],
    imageUrl: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60']
  });

  ngOnInit() {
    this.loadMetrics();
    this.loadOrders();
    this.loadCategories();
  }

  loadMetrics() {
    this.orderService.getDashboardMetrics().subscribe({
      next: (m) => this.metrics.set(m),
      error: (err) => console.error('Failed to load dashboard metrics', err)
    });
  }

  loadOrders() {
    this.isOrdersLoading.set(true);
    this.orderService.getOrders(true).subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.isOrdersLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.isOrdersLoading.set(false);
      }
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe(cats => {
      this.categories.set(cats);
    });
  }

  onStatusChange(orderId: string, newStatus: string) {
    this.orderService.updateOrderStatus(orderId, newStatus as OrderStatus).subscribe({
      next: () => {
        alert(`Order #${orderId} status updated to ${newStatus}`);
        this.loadOrders();
        this.loadMetrics();
      },
      error: (err) => {
        console.error(`Failed to update order ${orderId} status`, err);
        alert('Failed to update status.');
      }
    });
  }

  onCreateProduct() {
    if (this.productForm.invalid) return;

    this.isFormSubmitting.set(true);
    const productData = this.productForm.value;

    this.productService.createProduct(productData).subscribe({
      next: () => {
        alert('Product created successfully!');
        this.productForm.reset({
          categoryId: 'gourmet-food',
          rating: 4.5,
          imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60'
        });
        this.loadMetrics();
        this.isFormSubmitting.set(false);
      },
      error: (err) => {
        console.error('Failed to create product', err);
        alert('Error creating product. Try again.');
        this.isFormSubmitting.set(false);
      }
    });
  }
}
