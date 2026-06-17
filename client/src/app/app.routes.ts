import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { adminGuard } from './core/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/product-list/product-list.component').then(c => c.ProductListComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./features/products/product-detail/product-detail.component').then(c => c.ProductDetailComponent)
  },
  {
    path: 'categories',
    loadComponent: () => import('./features/categories/categories.component').then(c => c.CategoriesComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then(c => c.CartComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout.component').then(c => c.CheckoutComponent)
  },
  {
    path: 'orders/success/:orderId',
    loadComponent: () => import('./features/orders/order-success/order-success.component').then(c => c.OrderSuccessComponent)
  },
  {
    path: 'orders/track/:orderId',
    loadComponent: () => import('./features/orders/order-tracking/order-tracking.component').then(c => c.OrderTrackingComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./features/orders/order-history/order-history.component').then(c => c.OrderHistoryComponent)
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register/register.component').then(c => c.RegisterComponent)
  },
  {
    path: 'auth/profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/auth/profile/profile.component').then(c => c.ProfileComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(c => c.AdminDashboardComponent)
  },
  {
    path: 'category/:cat',
    loadComponent: () => import('./features/products/product-list/product-list.component').then(c => c.ProductListComponent)
  },
];
