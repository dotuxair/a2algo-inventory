import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/products`; 
  constructor(private http: HttpClient) {}

  createProduct(product: Product): Observable<any> {
    return this.http.post(this.apiUrl, product);
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${productId}`);
  }

  updateProduct(productId: number, product: Product): Observable<any> {
    return this.http.put(`${this.apiUrl}/${productId}`, product);
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${productId}`);
  }

  getProductsForSalePurchase(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products-track`);
  }
}
