import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../shared/environment';
import { AddSaleRequest, Sale } from '../models/sale.models';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private readonly apiUrl = `${environment.apiUrl}/sales`; // API Endpoint for Sales

  constructor(private http: HttpClient) {}

  // Add a new sale
  addSale(saleRequest: AddSaleRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}`, saleRequest);
  }

  // Get all sales
  viewSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.apiUrl);
  }

  // Get products for a specific sale
  getProductsBySaleId(saleId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${saleId}/products`);
  }
}
