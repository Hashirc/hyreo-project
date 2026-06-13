import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, DashboardMetrics, OrderStatus } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`;
  private adminUrl = `${environment.apiUrl}/admin/dashboard`;

  createOrder(orderData: {
    items: any[];
    total: number;
    shippingAddress: any;
    paymentRef: string;
  }): Observable<any> {
    return this.http.post<any>(this.apiUrl, orderData);
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
