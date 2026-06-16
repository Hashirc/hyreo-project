import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, DashboardMetrics, OrderStatus } from '../models/types';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`;
  private adminUrl = `${environment.apiUrl}/admin/dashboard`;

  private authService = inject(AuthService);

  createOrder(orderData: {
    items: any[];
    total: number;
    shippingAddress: any;
    paymentRef: string;
  }): Observable<any> {
    const token = this.authService.token() || localStorage.getItem('auth_token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.post<any>(this.apiUrl, orderData, { headers });
  }

  getOrders(all = false): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}?all=${all}`);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${orderId}/status`, { status });
  }

  getDashboardMetrics(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(this.adminUrl);
  }
}
