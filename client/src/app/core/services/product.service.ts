import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, Category } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;
  private catUrl = `${environment.apiUrl}/products/categories`;

  getProducts(categoryId?: string, search?: string, subCategory?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (categoryId) {
      params = params.set('category', categoryId);
    }
    if (search) {
      params = params.set('search', search);
    }
    if (subCategory) {
      params = params.set('subCategory', subCategory);
    }
    return this.http.get<Product[]>(this.apiUrl, { params });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.catUrl);
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(this.catUrl, category);
  }

  updateCategory(id: string, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.catUrl}/${id}`, category);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete<any>(`${this.catUrl}/${id}`);
  }

  createProduct(product: Partial<Product>): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
