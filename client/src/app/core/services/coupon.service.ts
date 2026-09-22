import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Coupon } from '../models/types';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/coupons`;

  private getHeaders(): HttpHeaders {
    const token = this.authService.token() || localStorage.getItem('auth_token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createCoupon(coupon: Partial<Coupon>): Observable<Coupon> {
    return this.http.post<Coupon>(this.apiUrl, coupon, { headers: this.getHeaders() });
  }

  updateCoupon(id: string, coupon: Partial<Coupon>): Observable<Coupon> {
    return this.http.put<Coupon>(`${this.apiUrl}/${id}`, coupon, { headers: this.getHeaders() });
  }

  deleteCoupon(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  validateCoupon(code: string): Observable<Coupon> {
    return this.http.post<Coupon>(`${this.apiUrl}/validate`, { code }, { headers: this.getHeaders() });
  }
}
