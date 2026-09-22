import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe, TitleCasePipe, CommonModule } from '@angular/common';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { ProductService } from '../../../core/services/product.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { RealtimeService } from '../../../core/services/realtime.service';
import { CouponService } from '../../../core/services/coupon.service';
import { Order, DashboardMetrics, OrderStatus, Category, Product, Coupon } from '../../../core/models/types';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe,
    DecimalPipe,
    TitleCasePipe,
    MatTabsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatCardModule
  ],
  template: `
    <div class="admin-dashboard">
      <div class="dashboard-header-container">
        <div class="header-title-section">
          <span class="live-pulse-badge">
            <span class="pulse-dot"></span> LIVE OVERVIEW
          </span>
          <h1 class="page-title">Quick Kart Administration</h1>
        </div>
        <button mat-flat-button color="warn" class="logout-btn" (click)="logout()">
          <mat-icon>logout</mat-icon> Logout
        </button>
      </div>

      <!-- Live Header KPI cards (Key Metrics) -->
      <div class="kpi-grid">
        <div class="kpi-card bg-kpi-1">
          <div class="kpi-icon-wrapper">
            <mat-icon>trending_up</mat-icon>
          </div>
          <div class="kpi-info">
            <span class="kpi-label">Today's Revenue</span>
            <h2 class="kpi-value">₹{{ (metrics()?.revenueToday || 0) | number:'1.2-2' }}</h2>
          </div>
        </div>

        <div class="kpi-card bg-kpi-2">
          <div class="kpi-icon-wrapper">
            <mat-icon>local_mall</mat-icon>
          </div>
          <div class="kpi-info">
            <span class="kpi-label">Today's Orders</span>
            <h2 class="kpi-value">{{ metrics()?.ordersToday || 0 }}</h2>
          </div>
        </div>

        <div class="kpi-card bg-kpi-3">
          <div class="kpi-icon-wrapper">
            <mat-icon>online_prediction</mat-icon>
          </div>
          <div class="kpi-info">
            <span class="kpi-label">Active Customers</span>
            <h2 class="kpi-value">{{ metrics()?.activeUsersToday || 0 }}</h2>
          </div>
        </div>

        <div class="kpi-card bg-kpi-4">
          <div class="kpi-icon-wrapper">
            <mat-icon>hourglass_empty</mat-icon>
          </div>
          <div class="kpi-info">
            <span class="kpi-label">Pending Orders</span>
            <h2 class="kpi-value">{{ metrics()?.pendingOrdersCount || 0 }}</h2>
          </div>
        </div>
      </div>

      <!-- Tabbed admin layout -->
      <div class="dashboard-tabs-container">
        <mat-tab-group color="primary" class="custom-tab-group">
          
          <!-- Dashboard Overview Tab -->
          <mat-tab label="Overview">
            <div class="tab-content">
              <!-- Sub-Grid for remaining 10 KPIs -->
              <div class="stats-subgrid">
                <div class="sub-stat-card">
                  <span class="sub-label">Total Sales Revenue</span>
                  <span class="sub-value">₹{{ (metrics()?.totalRevenue || 0) | number:'1.0-0' }}</span>
                </div>
                <div class="sub-stat-card">
                  <span class="sub-label">Total Orders Processed</span>
                  <span class="sub-value">{{ metrics()?.totalOrders || 0 }}</span>
                </div>
                <div class="sub-stat-card">
                  <span class="sub-label">Conversion Rate</span>
                  <span class="sub-value">{{ (metrics()?.conversionRate || 0) | number:'1.1-1' }}%</span>
                </div>
                <div class="sub-stat-card">
                  <span class="sub-label">Avg. Order Value</span>
                  <span class="sub-value">₹{{ (metrics()?.averageOrderValue || 0) | number:'1.0-0' }}</span>
                </div>
                <div class="sub-stat-card">
                  <span class="sub-label">Active Products</span>
                  <span class="sub-value">{{ metrics()?.totalProducts || 0 }}</span>
                </div>
                <div class="sub-stat-card">
                  <span class="sub-label">Registered Customers</span>
                  <span class="sub-value">{{ metrics()?.totalUsers || 0 }}</span>
                </div>
                <div class="sub-stat-card">
                  <span class="sub-label">Total Categories</span>
                  <span class="sub-value">{{ metrics()?.totalCategories || 0 }}</span>
                </div>
                <div class="sub-stat-card">
                  <span class="sub-label">Wishlisted Items</span>
                  <span class="sub-value">{{ metrics()?.totalWishlistItems || 0 }}</span>
                </div>
                <div class="sub-stat-card">
                  <span class="sub-label">Customer Reviews</span>
                  <span class="sub-value">{{ metrics()?.totalReviews || 0 }}</span>
                </div>
                <div class="sub-stat-card">
                  <span class="sub-label">Average Rating</span>
                  <span class="sub-value">★ {{ (metrics()?.averageRating || 0) | number:'1.1-1' }}</span>
                </div>
              </div>

              <!-- Main Overview Dashboard Row -->
              <div class="overview-dashboard-row">
                <!-- Monthly Revenue Chart -->
                <div class="dashboard-block charts-block">
                  <h3 class="block-title"><mat-icon>bar_chart</mat-icon> Monthly Revenue Trend</h3>
                  <div class="chart-bars-container">
                    @for (item of metrics()?.charts?.monthlyRevenue; track item.month) {
                      <div class="chart-bar-col">
                        <div class="bar-value-label">₹{{ item.revenue | number:'1.0-0' }}</div>
                        <div class="bar-fill-wrapper">
                          <div class="bar-fill" [style.height.%]="getRevenueBarHeight(item.revenue)"></div>
                        </div>
                        <span class="bar-label">{{ item.month }}</span>
                      </div>
                    }
                  </div>
                </div>

                <!-- Category Breakdown -->
                <div class="dashboard-block breakdown-block">
                  <h3 class="block-title"><mat-icon>pie_chart</mat-icon> Category Inventory Distribution</h3>
                  <div class="category-breakdown-list">
                    @for (item of metrics()?.charts?.categoryBreakdown; track item.category) {
                      <div class="category-progress-item">
                        <div class="progress-info">
                          <span class="category-name">{{ item.category | titlecase }}</span>
                          <span class="category-value">{{ item.count }} products</span>
                        </div>
                        <div class="progress-bar-bg">
                          <div class="progress-bar-fill" [style.width.%]="getCategoryWidth(item.count)"></div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>

              <!-- Lower Row: Top Selling & Most Viewed Tables -->
              <div class="overview-dashboard-row gap-24">
                <div class="dashboard-block flex-1">
                  <h3 class="block-title"><mat-icon>star</mat-icon> Top Selling Products</h3>
                  <div class="table-container mini-table">
                    <table class="styled-dashboard-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Units Sold</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (prod of metrics()?.charts?.topProducts; track prod.name) {
                          <tr>
                            <td class="font-weight-600">{{ prod.name }}</td>
                            <td>₹{{ prod.price | number:'1.0-0' }}</td>
                            <td class="text-olive font-weight-700">{{ prod.sales }} sales</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="dashboard-block flex-1">
                  <h3 class="block-title"><mat-icon>visibility</mat-icon> Most Viewed Products</h3>
                  <div class="table-container mini-table">
                    <table class="styled-dashboard-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Total Views</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (prod of metrics()?.charts?.viewedProducts; track prod.name) {
                          <tr>
                            <td class="font-weight-600">{{ prod.name }}</td>
                            <td>₹{{ prod.price | number:'1.0-0' }}</td>
                            <td class="text-olive font-weight-700">{{ prod.views }} views</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <!-- Recent Activity Logs section -->
              <div class="dashboard-block activity-log-block">
                <h3 class="block-title"><mat-icon>history</mat-icon> Real-Time Store Activity</h3>
                <div class="activity-timeline">
                  @for (log of metrics()?.activityLogs; track log.timestamp) {
                    <div class="timeline-item">
                      <div class="timeline-icon-dot" [ngClass]="'dot-' + log.type"></div>
                      <div class="timeline-content">
                        <p class="timeline-text">{{ log.text }}</p>
                        <span class="timeline-time">{{ log.timestamp | date:'shortTime' }}</span>
                      </div>
                    </div>
                  } @empty {
                    <div class="empty-state">No recent activity detected.</div>
                  }
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- Product Management Tab -->
          <mat-tab label="Product Management">
            <div class="tab-content">
              <div *ngIf="!isEditingProduct(); else editProductView">
                <div class="table-container">
                  <table mat-table [dataSource]="products()" class="orders-table mat-elevation-z1">
                    <ng-container matColumnDef="image">
                      <th mat-header-cell *matHeaderCellDef>Image</th>
                      <td mat-cell *matCellDef="let prod">
                        <img [src]="prod.imageUrl" [alt]="prod.name" class="table-prod-img" />
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="id">
                      <th mat-header-cell *matHeaderCellDef>ID</th>
                      <td mat-cell *matCellDef="let prod" class="font-outfit font-weight-600 text-olive">{{ prod.id }}</td>
                    </ng-container>

                    <ng-container matColumnDef="name">
                      <th mat-header-cell *matHeaderCellDef>Name</th>
                      <td mat-cell *matCellDef="let prod" class="font-weight-600">{{ prod.name }}</td>
                    </ng-container>

                    <ng-container matColumnDef="category">
                      <th mat-header-cell *matHeaderCellDef>Category</th>
                      <td mat-cell *matCellDef="let prod">{{ prod.categoryId }}</td>
                    </ng-container>

                    <ng-container matColumnDef="price">
                      <th mat-header-cell *matHeaderCellDef>Price</th>
                      <td mat-cell *matCellDef="let prod" class="font-weight-600">₹{{ prod.price | number:'1.0-0' }}</td>
                    </ng-container>

                    <ng-container matColumnDef="stock">
                      <th mat-header-cell *matHeaderCellDef>Stock</th>
                      <td mat-cell *matCellDef="let prod">
                        <span [class.text-danger]="prod.stock <= 0">{{ prod.stock }} items</span>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Actions</th>
                      <td mat-cell *matCellDef="let prod">
                        <div class="action-buttons">
                          <button mat-icon-button color="primary" (click)="startEditProduct(prod)" matTooltip="Edit Product">
                            <mat-icon>edit</mat-icon>
                          </button>
                          <button mat-icon-button color="warn" (click)="onDeleteProduct(prod)" matTooltip="Delete Product">
                            <mat-icon>delete</mat-icon>
                          </button>
                        </div>
                      </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="productDisplayedColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: productDisplayedColumns;"></tr>
                  </table>
                </div>
              </div>

              <!-- Product Edit Form View -->
              <ng-template #editProductView>
                <div class="flex-center">
                  <div class="form-card mat-elevation-z1">
                    <h3 class="form-title">Edit Product: {{ editProductForm.get('name')?.value }}</h3>
                    <form [formGroup]="editProductForm" (ngSubmit)="onSaveProduct()" class="product-form">
                      <div class="form-row-2">
                        <mat-form-field appearance="outline">
                          <mat-label>Product Name</mat-label>
                          <input matInput type="text" formControlName="name">
                          <mat-error *ngIf="editProductForm.get('name')?.hasError('required')">Name is required</mat-error>
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
                        <textarea matInput formControlName="description" rows="3" placeholder="Describe the product details..."></textarea>
                      </mat-form-field>

                      <div class="form-row-3">
                        <mat-form-field appearance="outline">
                          <mat-label>Price (₹)</mat-label>
                          <input matInput type="number" formControlName="price">
                          <mat-error *ngIf="editProductForm.get('price')?.hasError('required')">Required</mat-error>
                          <mat-error *ngIf="editProductForm.get('price')?.hasError('min')">Must be > 0</mat-error>
                        </mat-form-field>

                        <mat-form-field appearance="outline">
                          <mat-label>Stock Level</mat-label>
                          <input matInput type="number" formControlName="stock">
                          <mat-error *ngIf="editProductForm.get('stock')?.hasError('required')">Required</mat-error>
                        </mat-form-field>

                        <mat-form-field appearance="outline">
                          <mat-label>Rating</mat-label>
                          <input matInput type="number" formControlName="rating" step="0.1">
                        </mat-form-field>
                      </div>

                      <mat-form-field appearance="outline">
                        <mat-label>Image URL</mat-label>
                        <input matInput type="url" formControlName="imageUrl">
                      </mat-form-field>

                      <div class="form-actions">
                        <button mat-raised-button color="primary" type="submit" [disabled]="editProductForm.invalid">
                          Save Product
                        </button>
                        <button mat-button type="button" (click)="cancelEdit()">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </ng-template>
            </div>
          </mat-tab>

          <!-- Add Product Tab -->
          <mat-tab label="Add Products">
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
                    <textarea matInput formControlName="description" rows="3" placeholder="Describe the product details..."></textarea>
                  </mat-form-field>

                  <div class="form-row-3">
                    <mat-form-field appearance="outline">
                      <mat-label>Price (₹)</mat-label>
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

          <!-- Category Management Tab -->
          <mat-tab label="Category Management">
            <div class="tab-content">
              <!-- Split Screen for Category Forms and List -->
              <div class="split-management-layout">
                <div class="management-form-container">
                  <div class="form-card mat-elevation-z1">
                    <h3 class="form-title">{{ isEditingCategory() ? 'Edit Category' : 'Create Category' }}</h3>
                    <form [formGroup]="categoryForm" (ngSubmit)="onSaveCategory()" class="product-form">
                      <mat-form-field appearance="outline">
                        <mat-label>Category Name</mat-label>
                        <input matInput type="text" formControlName="name" placeholder="e.g. Health & Wellness" />
                        <mat-error *ngIf="categoryForm.get('name')?.hasError('required')">Name is required</mat-error>
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Image URL</mat-label>
                        <input matInput type="url" formControlName="imageUrl" placeholder="Image URL (optional)" />
                      </mat-form-field>

                      <div class="form-actions">
                        <button mat-raised-button color="primary" type="submit" [disabled]="categoryForm.invalid">
                          {{ isEditingCategory() ? 'Update' : 'Create' }}
                        </button>
                        <button mat-button type="button" *ngIf="isEditingCategory()" (click)="cancelEditCategory()">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                <div class="management-list-container">
                  <div class="form-card mat-elevation-z1 max-w-full">
                    <h3 class="form-title">Existing Categories</h3>
                    <div class="categories-list">
                      @for (cat of categories(); track cat.id) {
                        <div class="category-item-tile">
                          <div class="cat-details">
                            <span class="cat-name-badge">{{ cat.name }}</span>
                            <span class="cat-slug">ID/Slug: {{ cat.id }}</span>
                          </div>
                          <div class="action-buttons">
                            <button mat-icon-button color="primary" (click)="startEditCategory(cat)">
                              <mat-icon>edit</mat-icon>
                            </button>
                            <button mat-icon-button color="warn" (click)="onDeleteCategory(cat)">
                              <mat-icon>delete</mat-icon>
                            </button>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- Order Management Tab -->
          <mat-tab label="Order Management">
            <div class="tab-content">
              @if (isOrdersLoading()) {
                <div class="spinner-wrapper">
                  <mat-progress-spinner mode="indeterminate" diameter="40"></mat-progress-spinner>
                </div>
              } @else {
                <div class="table-container">
                  <table mat-table [dataSource]="orders()" class="orders-table mat-elevation-z1">
                    <ng-container matColumnDef="id">
                      <th mat-header-cell *matHeaderCellDef>Order ID</th>
                      <td mat-cell *matCellDef="let ord" class="font-outfit font-weight-600 text-olive">#{{ ord.id }}</td>
                    </ng-container>

                    <ng-container matColumnDef="customer">
                      <th mat-header-cell *matHeaderCellDef>Customer</th>
                      <td mat-cell *matCellDef="let ord">
                        <div class="customer-cell">
                          <span class="customer-name">{{ ord.shippingAddress?.fullName || 'N/A' }}</span>
                          <span class="customer-email">{{ ord.shippingAddress?.email || 'N/A' }}</span>
                        </div>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="date">
                      <th mat-header-cell *matHeaderCellDef>Date</th>
                      <td mat-cell *matCellDef="let ord">{{ ord.createdAt | date:'mediumDate' }}</td>
                    </ng-container>

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

                    <ng-container matColumnDef="total">
                      <th mat-header-cell *matHeaderCellDef>Total</th>
                      <td mat-cell *matCellDef="let ord" class="font-weight-600">₹{{ ord.total | number:'1.0-0' }}</td>
                    </ng-container>

                    <ng-container matColumnDef="payment">
                      <th mat-header-cell *matHeaderCellDef>Payment</th>
                      <td mat-cell *matCellDef="let ord">
                        <div class="payment-cell">
                          <span class="payment-method">Online Payment</span>
                          <span class="payment-ref">Ref: {{ ord.paymentRef || 'N/A' }}</span>
                        </div>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="status">
                      <th mat-header-cell *matHeaderCellDef>Status</th>
                      <td mat-cell *matCellDef="let ord">
                        <mat-form-field appearance="outline" class="status-select-field">
                          <mat-select [value]="ord.status" (selectionChange)="onStatusChange(ord.id, $event.value)">
                            @for (st of statuses; track st) {
                              <mat-option [value]="st">{{ st | titlecase }}</mat-option>
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

          <!-- Customer Management Tab -->
          <mat-tab label="Customer Management">
            <div class="tab-content">
              @if (isUsersLoading()) {
                <div class="spinner-wrapper">
                  <mat-progress-spinner mode="indeterminate" diameter="40"></mat-progress-spinner>
                </div>
              } @else {
                <div class="table-container">
                  <table mat-table [dataSource]="users()" class="orders-table mat-elevation-z1">
                    <ng-container matColumnDef="uid">
                      <th mat-header-cell *matHeaderCellDef>User ID</th>
                      <td mat-cell *matCellDef="let u" class="font-outfit font-weight-600 text-olive uid-cell">{{ u.uid }}</td>
                    </ng-container>

                    <ng-container matColumnDef="displayName">
                      <th mat-header-cell *matHeaderCellDef>Name</th>
                      <td mat-cell *matCellDef="let u" class="font-weight-600">{{ u.displayName }}</td>
                    </ng-container>

                    <ng-container matColumnDef="email">
                      <th mat-header-cell *matHeaderCellDef>Email</th>
                      <td mat-cell *matCellDef="let u">{{ u.email }}</td>
                    </ng-container>

                    <ng-container matColumnDef="role">
                      <th mat-header-cell *matHeaderCellDef>Role</th>
                      <td mat-cell *matCellDef="let u">
                        <span class="role-chip" [class.role-admin]="u.role === 'admin'" [class.role-customer]="u.role === 'customer'">{{ u.role | titlecase }}</span>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Actions</th>
                      <td mat-cell *matCellDef="let u">
                        <div class="action-buttons" *ngIf="u.role !== 'admin'">
                          <button mat-icon-button [color]="u.blocked ? 'primary' : 'warn'" (click)="onToggleBlock(u)" [matTooltip]="u.blocked ? 'Unblock' : 'Block'">
                            <mat-icon>{{ u.blocked ? 'lock_open' : 'block' }}</mat-icon>
                          </button>
                          <button mat-icon-button color="warn" (click)="onDeleteUser(u)" matTooltip="Delete User">
                            <mat-icon>delete</mat-icon>
                          </button>
                        </div>
                      </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="userDisplayedColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: userDisplayedColumns;"></tr>
                  </table>
                </div>
              }
            </div>
          </mat-tab>

          <!-- Offers & Coupons Tab -->
          <mat-tab label="Offers & Discounts">
            <div class="tab-content">
              <div class="split-management-layout">
                <div class="management-form-container">
                  <div class="form-card mat-elevation-z1">
                    <h3 class="form-title">{{ isEditingCoupon() ? 'Edit Coupon' : 'Create Coupon' }}</h3>
                    <form [formGroup]="couponForm" (ngSubmit)="onSaveCoupon()" class="product-form">
                      <mat-form-field appearance="outline">
                        <mat-label>Coupon Code</mat-label>
                        <input matInput type="text" formControlName="code" placeholder="e.g. FESTIVE20" />
                        <mat-error *ngIf="couponForm.get('code')?.hasError('required')">Code is required</mat-error>
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Discount Value (₹)</mat-label>
                        <input matInput type="number" formControlName="discountValue" />
                        <mat-error *ngIf="couponForm.get('discountValue')?.hasError('required')">Value is required</mat-error>
                        <mat-error *ngIf="couponForm.get('discountValue')?.hasError('min')">Value must be at least 1</mat-error>
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Description</mat-label>
                        <textarea matInput formControlName="description" rows="2" placeholder="Coupon description..."></textarea>
                      </mat-form-field>

                      <div class="form-actions">
                        <button mat-raised-button color="primary" type="submit" [disabled]="couponForm.invalid">
                          {{ isEditingCoupon() ? 'Update' : 'Create' }}
                        </button>
                        <button mat-button type="button" *ngIf="isEditingCoupon()" (click)="cancelEditCoupon()">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                <div class="management-list-container">
                  <div class="form-card mat-elevation-z1 max-w-full">
                    <h3 class="form-title">Existing Promotion Coupons</h3>
                    <div class="offers-list">
                      @for (c of coupons(); track c.id) {
                        <div class="offer-row">
                          <div class="offer-details">
                            <span class="offer-code">{{ c.code }}</span>
                            <span class="offer-desc">₹{{ c.discountValue }} off - {{ c.description || 'No description' }}</span>
                          </div>
                          <div class="action-buttons">
                            <button mat-icon-button color="primary" (click)="startEditCoupon(c)">
                              <mat-icon>edit</mat-icon>
                            </button>
                            <button mat-icon-button color="warn" (click)="onDeleteCoupon(c)">
                              <mat-icon>delete</mat-icon>
                            </button>
                          </div>
                        </div>
                      } @empty {
                        <div class="empty-state">No coupons registered in database.</div>
                      }
                    </div>
                  </div>
                </div>
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
      padding-bottom: 48px;
    }

    .dashboard-header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(85, 107, 47, 0.12);
      padding-bottom: 16px;
    }

    .header-title-section {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .live-pulse-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
      color: #708623;
      letter-spacing: 1px;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #708623;
      box-shadow: 0 0 0 0 rgba(112, 134, 35, 0.7);
      animation: pulse 1.6s infinite;
    }

    @keyframes pulse {
      0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(112, 134, 35, 0.7);
      }
      70% {
        transform: scale(1);
        box-shadow: 0 0 0 6px rgba(112, 134, 35, 0);
      }
      100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(112, 134, 35, 0);
      }
    }

    .page-title {
      font-size: 32px;
      font-weight: 800;
      color: #1e2610;
      margin: 0;
      font-family: 'Outfit', sans-serif;
    }

    .logout-btn {
      border-radius: 20px !important;
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    /* Key KPI grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
    }

    .kpi-card {
      display: flex;
      align-items: center;
      padding: 24px;
      border-radius: 16px;
      gap: 20px;
      border: 1px solid rgba(85, 107, 47, 0.08);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
      transition: transform 0.2s ease;

      &:hover {
        transform: translateY(-2px);
      }
    }

    .bg-kpi-1 { background: linear-gradient(135deg, #f5f8f0 0%, #eef3e4 100%); }
    .bg-kpi-2 { background: linear-gradient(135deg, #fcfef8 0%, #f6f9f0 100%); }
    .bg-kpi-3 { background: linear-gradient(135deg, #fafcf5 0%, #edf1e2 100%); }
    .bg-kpi-4 { background: linear-gradient(135deg, #fefbfa 0%, #f9f1ee 100%); }

    .kpi-icon-wrapper {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      background-color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 4px 12px rgba(85, 107, 47, 0.08);
      color: #556B2F;

      mat-icon {
        font-size: 26px;
        height: 26px;
        width: 26px;
      }
    }

    .kpi-info {
      display: flex;
      flex-direction: column;

      .kpi-label {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        color: #708623;
      }

      .kpi-value {
        font-size: 26px;
        font-weight: 800;
        color: #1e2610;
        margin: 4px 0 0;
        font-family: 'Outfit', sans-serif;
      }
    }

    /* Sub KPI grid */
    .stats-subgrid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    @media (max-width: 1100px) {
      .stats-subgrid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 700px) {
      .stats-subgrid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .sub-stat-card {
      background-color: white;
      border: 1px solid rgba(85, 107, 47, 0.06);
      padding: 16px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;

      .sub-label {
        font-size: 11px;
        font-weight: 600;
        color: #708623;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }

      .sub-value {
        font-size: 18px;
        font-weight: 700;
        color: #2c3a19;
      }
    }

    /* Dashboard block details */
    .overview-dashboard-row {
      display: flex;
      gap: 20px;
      margin-bottom: 24px;

      &.gap-24 { gap: 24px; }
    }

    @media (max-width: 900px) {
      .overview-dashboard-row {
        flex-direction: column;
      }
    }

    .dashboard-block {
      background-color: white;
      border: 1px solid rgba(85, 107, 47, 0.06);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 16px rgba(85, 107, 47, 0.02);

      .block-title {
        font-size: 16px;
        font-weight: 700;
        color: #1e2610;
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 20px 0;
        border-bottom: 1px solid rgba(85, 107, 47, 0.06);
        padding-bottom: 10px;

        mat-icon {
          color: #708623;
        }
      }
    }

    .charts-block {
      flex: 1.4;
    }

    .breakdown-block {
      flex: 1;
    }

    .flex-1 { flex: 1; }

    /* Custom CSS Chart Styles */
    .chart-bars-container {
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      height: 200px;
      padding-top: 20px;
      border-bottom: 2px solid rgba(85, 107, 47, 0.08);
      gap: 12px;
    }

    .chart-bar-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      height: 100%;
      justify-content: flex-end;
    }

    .bar-value-label {
      font-size: 10px;
      font-weight: 600;
      color: #708623;
      margin-bottom: 6px;
    }

    .bar-fill-wrapper {
      width: 32px;
      height: 140px;
      background-color: #f7f9f3;
      border-radius: 6px 6px 0 0;
      display: flex;
      align-items: flex-end;
      overflow: hidden;
    }

    .bar-fill {
      width: 100%;
      background: linear-gradient(to top, #556B2F, #708623);
      border-radius: 6px 6px 0 0;
      transition: height 0.6s ease;
    }

    .bar-label {
      font-size: 11px;
      font-weight: 700;
      color: #667055;
      margin-top: 8px;
      text-transform: uppercase;
    }

    /* Category progress bar items */
    .category-breakdown-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .category-progress-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
    }

    .category-name {
      font-weight: 700;
      color: #2c3a19;
    }

    .category-value {
      color: #708623;
      font-weight: 600;
    }

    .progress-bar-bg {
      height: 8px;
      background-color: #f0f4e8;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      background-color: #556B2F;
      border-radius: 4px;
      transition: width 0.6s ease;
    }

    /* Styled Tables */
    .styled-dashboard-table {
      width: 100%;
      border-collapse: collapse;
      
      th {
        text-align: left;
        font-size: 12px;
        color: #708623;
        font-weight: 700;
        text-transform: uppercase;
        padding: 8px 12px;
        border-bottom: 1px solid rgba(85, 107, 47, 0.08);
      }

      td {
        padding: 10px 12px;
        font-size: 13px;
        color: #3d4a25;
        border-bottom: 1px solid rgba(85, 107, 47, 0.04);
      }
    }

    /* Activity log timeline */
    .activity-log-block {
      margin-top: 12px;
    }

    .activity-timeline {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-left: 12px;
    }

    .timeline-item {
      display: flex;
      gap: 16px;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 5px;
        top: 12px;
        bottom: -20px;
        width: 2px;
        background-color: rgba(85, 107, 47, 0.08);
      }

      &:last-child::before {
        display: none;
      }
    }

    .timeline-icon-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-top: 4px;
      z-index: 2;
    }

    .dot-order { background-color: #708623; box-shadow: 0 0 0 3px rgba(112, 134, 35, 0.15); }
    .dot-product { background-color: #3f51b5; box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.15); }
    .dot-customer { background-color: #009688; box-shadow: 0 0 0 3px rgba(0, 150, 136, 0.15); }
    .dot-review { background-color: #ff9800; box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.15); }

    .timeline-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .timeline-text {
      margin: 0;
      font-size: 13.5px;
      font-weight: 500;
      color: #2c3a19;
    }

    .timeline-time {
      font-size: 11px;
      color: #889376;
    }

    .empty-state {
      padding: 24px;
      text-align: center;
      color: #999;
      font-size: 13px;
    }

    /* Split management CRUD screens */
    .split-management-layout {
      display: grid;
      grid-template-columns: 1.2fr 2fr;
      gap: 28px;
      align-items: flex-start;
    }

    @media(max-width: 950px) {
      .split-management-layout {
        grid-template-columns: 1fr;
      }
    }

    .management-form-container {
      position: sticky;
      top: 20px;
    }

    .max-w-full {
      max-width: 100% !important;
    }

    .cat-details, .offer-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .cat-slug {
      font-size: 11.5px;
      color: #8c9878;
    }

    .text-danger {
      color: #d32f2f;
      font-weight: 700;
    }

    .text-olive {
      color: #556B2F;
    }

    .font-weight-600 {
      font-weight: 600;
    }

    .font-weight-700 {
      font-weight: 700;
    }

    /* Tabs Styling */
    .custom-tab-group {
      ::ng-deep .mat-mdc-tab {
        font-family: 'Outfit', sans-serif !important;
        font-weight: 700 !important;
        letter-spacing: 0.3px;
      }
    }

    /* General Layout adjustments */
    .tab-content {
      padding: 24px 0;
    }

    .spinner-wrapper {
      display: flex;
      justify-content: center;
      padding: 48px;
    }

    .table-container {
      width: 100%;
      overflow-x: auto;
    }

    .orders-table {
      width: 100%;
      background-color: white;
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

    .table-prod-img {
      width: 44px;
      height: 44px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid rgba(85, 107, 47, 0.08);
    }

    .items-cell {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .item-summary {
      font-size: 13px;
    }

    .customer-cell, .payment-cell {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .customer-name, .payment-method {
      font-weight: 600;
      color: #1e2610;
    }

    .customer-email, .payment-ref {
      font-size: 12px;
      color: #666;
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

    .flex-center {
      display: flex;
      justify-content: center;
    }

    .form-card {
      width: 100%;
      max-width: 600px;
      background-color: white;
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

    .categories-list, .offers-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 16px;
    }

    .category-item-tile, .offer-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 20px;
      background-color: #FAFBF7;
      border-radius: 12px;
      border: 1px solid rgba(85, 107, 47, 0.08);
    }

    .cat-name-badge {
      font-weight: 700;
      color: #2D3A1B;
    }

    .offer-code {
      font-size: 13.5px;
      color: #708623;
      font-weight: 700;
    }

    .offer-desc {
      font-size: 13.5px;
      color: #5a664a;
    }

    .role-chip {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }

    .role-admin {
      background-color: #EBF0D8;
      color: #3D4D20;
    }

    .role-customer {
      background-color: #F0F4E8;
      color: #556B2F;
    }

    .uid-cell {
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px !important;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private realtimeService = inject(RealtimeService);
  private couponService = inject(CouponService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Signals
  readonly metrics = signal<DashboardMetrics | null>(null);
  readonly orders = signal<Order[]>([]);
  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly users = signal<any[]>([]);
  readonly coupons = signal<Coupon[]>([]);

  readonly todayDeliveries = computed(() => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    return this.orders().filter(o => {
      if (o.status !== 'delivered') return false;
      const dateVal = (o as any).updatedAt || o.createdAt;
      const dateMs = new Date(dateVal).getTime();
      return dateMs >= startOfToday;
    });
  });

  readonly pendingOrdersList = computed(() => {
    return this.orders().filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  });

  readonly activeOrdersList = computed(() => {
    return this.orders().filter(o => o.status === 'processing' || o.status === 'shipped' || o.status === 'out_for_delivery');
  });

  // Loading status signals
  readonly isOrdersLoading = signal(true);
  readonly isUsersLoading = signal(true);
  readonly isFormSubmitting = signal(false);
  readonly isEditingProduct = signal(false);
  readonly isEditingCategory = signal(false);
  readonly isEditingCoupon = signal(false);

  readonly displayedColumns = ['id', 'customer', 'date', 'items', 'total', 'payment', 'status'];
  readonly productDisplayedColumns = ['image', 'id', 'name', 'category', 'price', 'stock', 'actions'];
  readonly userDisplayedColumns = ['uid', 'displayName', 'email', 'role', 'actions'];
  readonly statuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];

  productForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    categoryId: ['gourmet-food', Validators.required],
    description: [''],
    price: [null, [Validators.required, Validators.min(0.01)]],
    stock: [null, [Validators.required, Validators.min(0)]],
    rating: [4.5],
    imageUrl: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60']
  });

  editProductForm: FormGroup = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    categoryId: ['gourmet-food', Validators.required],
    description: [''],
    price: [null, [Validators.required, Validators.min(0.01)]],
    stock: [null, [Validators.required, Validators.min(0)]],
    rating: [4.5],
    imageUrl: ['']
  });

  categoryForm: FormGroup = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    imageUrl: ['']
  });

  couponForm: FormGroup = this.fb.group({
    id: [''],
    code: ['', Validators.required],
    discountValue: [10, [Validators.required, Validators.min(1)]],
    description: [''],
    isActive: [true]
  });

  ngOnInit() {
    this.realtimeService.init();

    // Auto-refresh on SSE events
    this.realtimeService.productChanged$.subscribe(() => {
      this.loadProducts();
      this.loadMetrics();
    });
    this.realtimeService.categoryChanged$.subscribe(() => {
      this.loadCategories();
      this.loadMetrics();
    });
    this.realtimeService.offerChanged$.subscribe(() => {
      this.loadCoupons();
      this.loadMetrics();
    });
    this.realtimeService.orderChanged$.subscribe(() => {
      this.loadOrders();
      this.loadMetrics();
    });

    this.loadMetrics();
    this.loadOrders();
    this.loadProducts();
    this.loadCategories();
    this.loadUsers();
    this.loadCoupons();
  }

  getRevenueBarHeight(val: number): number {
    const list = this.metrics()?.charts?.monthlyRevenue || [];
    if (list.length === 0) return 0;
    const max = Math.max(...list.map((m: any) => m.revenue || 0));
    return max > 0 ? (val / max) * 100 : 0;
  }

  getCategoryWidth(count: number): number {
    const list = this.metrics()?.charts?.categoryBreakdown || [];
    if (list.length === 0) return 0;
    const max = Math.max(...list.map((c: any) => c.count || 0));
    return max > 0 ? (count / max) * 100 : 0;
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

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (prods) => this.products.set(prods),
      error: (err) => console.error('Failed to load products', err)
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe(cats => {
      this.categories.set(cats);
    });
  }

  onStatusChange(orderId: string, newStatus: string) {
    const updatedStatus = newStatus as OrderStatus;
    // Optimistic local signal update for instant UI responsiveness
    this.orders.update(list => list.map(o => o.id === orderId ? { ...o, status: updatedStatus, updatedAt: new Date() } : o));

    this.orderService.updateOrderStatus(orderId, updatedStatus).subscribe({
      next: () => {
        this.loadOrders();
        this.loadMetrics();
      },
      error: (err) => {
        console.error(`Failed to update order ${orderId} status`, err);
        this.loadOrders();
      }
    });
  }

  loadUsers() {
    this.isUsersLoading.set(true);
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.isUsersLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.isUsersLoading.set(false);
      }
    });
  }

  onToggleBlock(user: any) {
    const newState = !user.blocked;
    this.userService.blockUser(user.uid, newState).subscribe({
      next: () => {
        this.loadUsers();
        this.loadMetrics();
      },
      error: (err) => {
        console.error('Failed to update user block status', err);
        alert('Failed to update user status.');
      }
    });
  }

  onDeleteUser(user: any) {
    if (!confirm(`Are you sure you want to delete user "${user.displayName}" (${user.email})?`)) return;
    this.userService.deleteUser(user.uid).subscribe({
      next: () => {
        this.loadUsers();
        this.loadMetrics();
      },
      error: (err) => {
        console.error('Failed to delete user', err);
        alert('Failed to delete user.');
      }
    });
  }

  // Edit Product methods
  startEditProduct(prod: Product) {
    this.editProductForm.setValue({
      id: prod.id,
      name: prod.name,
      categoryId: prod.categoryId,
      description: prod.description || '',
      price: prod.price,
      stock: prod.stock,
      rating: prod.rating || 4.5,
      imageUrl: prod.imageUrl || ''
    });
    this.isEditingProduct.set(true);
  }

  cancelEdit() {
    this.isEditingProduct.set(false);
  }

  onSaveProduct() {
    if (this.editProductForm.invalid) return;
    const { id, name, categoryId, description, price, stock, rating, imageUrl } = this.editProductForm.value;
    
    this.productService.updateProduct(id, { name, categoryId, description, price, stock, rating, imageUrl }).subscribe({
      next: () => {
        alert('Product updated successfully!');
        this.isEditingProduct.set(false);
        this.loadProducts();
        this.loadMetrics();
      },
      error: (err) => {
        console.error('Failed to update product', err);
        alert('Failed to update product details.');
      }
    });
  }

  onDeleteProduct(prod: Product) {
    if (!confirm(`Are you sure you want to delete product "${prod.name}"?`)) return;
    this.productService.deleteProduct(prod.id).subscribe({
      next: () => {
        alert('Product deleted successfully!');
        this.loadProducts();
        this.loadMetrics();
      },
      error: (err) => {
        console.error('Failed to delete product', err);
        alert('Failed to delete product.');
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
        this.loadProducts();
        this.isFormSubmitting.set(false);
      },
      error: (err) => {
        console.error('Failed to create product', err);
        alert('Error creating product. Try again.');
        this.isFormSubmitting.set(false);
      }
    });
  }

  loadCoupons() {
    this.couponService.getCoupons().subscribe({
      next: (c) => this.coupons.set(c),
      error: (err) => console.error('Failed to load coupons', err)
    });
  }

  // Category CRUD Operations
  startEditCategory(cat: Category) {
    this.categoryForm.setValue({
      id: cat.id,
      name: cat.name,
      imageUrl: cat.imageUrl || ''
    });
    this.isEditingCategory.set(true);
  }

  cancelEditCategory() {
    this.categoryForm.reset();
    this.isEditingCategory.set(false);
  }

  onSaveCategory() {
    if (this.categoryForm.invalid) return;
    const { id, name, imageUrl } = this.categoryForm.value;
    
    if (this.isEditingCategory()) {
      this.productService.updateCategory(id, { name, imageUrl }).subscribe({
        next: () => {
          alert('Category updated successfully!');
          this.cancelEditCategory();
          this.loadCategories();
          this.loadMetrics();
        },
        error: (err) => {
          console.error('Failed to update category', err);
          alert('Failed to update category.');
        }
      });
    } else {
      // Create new category
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
      this.productService.createCategory({ id: slug, name, imageUrl }).subscribe({
        next: () => {
          alert('Category created successfully!');
          this.categoryForm.reset();
          this.loadCategories();
          this.loadMetrics();
        },
        error: (err) => {
          console.error('Failed to create category', err);
          alert('Failed to create category.');
        }
      });
    }
  }

  onDeleteCategory(cat: Category) {
    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;
    this.productService.deleteCategory(cat.id).subscribe({
      next: () => {
        alert('Category deleted successfully!');
        this.loadCategories();
        this.loadMetrics();
      },
      error: (err) => {
        console.error('Failed to delete category', err);
        alert('Failed to delete category.');
      }
    });
  }

  // Coupon CRUD Operations
  startEditCoupon(coupon: Coupon) {
    this.couponForm.setValue({
      id: coupon.id || '',
      code: coupon.code,
      discountValue: coupon.discountValue,
      description: coupon.description || '',
      isActive: coupon.isActive ?? true
    });
    this.isEditingCoupon.set(true);
  }

  cancelEditCoupon() {
    this.couponForm.reset({ isActive: true, discountValue: 10 });
    this.isEditingCoupon.set(false);
  }

  onSaveCoupon() {
    if (this.couponForm.invalid) return;
    const { id, code, discountValue, description, isActive } = this.couponForm.value;
    
    if (this.isEditingCoupon()) {
      this.couponService.updateCoupon(id, { code, discountValue, description, isActive }).subscribe({
        next: () => {
          alert('Coupon updated successfully!');
          this.cancelEditCoupon();
          this.loadCoupons();
          this.loadMetrics();
        },
        error: (err) => {
          console.error('Failed to update coupon', err);
          alert('Failed to update coupon.');
        }
      });
    } else {
      this.couponService.createCoupon({ code, discountValue, description, isActive }).subscribe({
        next: () => {
          alert('Coupon created successfully!');
          this.couponForm.reset({ isActive: true, discountValue: 10 });
          this.loadCoupons();
          this.loadMetrics();
        },
        error: (err) => {
          console.error('Failed to create coupon', err);
          alert('Failed to create coupon.');
        }
      });
    }
  }

  onDeleteCoupon(coupon: Coupon) {
    if (!confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) return;
    this.couponService.deleteCoupon(coupon.id || '').subscribe({
      next: () => {
        alert('Coupon deleted successfully!');
        this.loadCoupons();
        this.loadMetrics();
      },
      error: (err) => {
        console.error('Failed to delete coupon', err);
        alert('Failed to delete coupon.');
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
