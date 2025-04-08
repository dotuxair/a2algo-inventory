import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../shared/environment';
import { AddPurchaseRequest, Purchase } from '../models/purchase.models';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private readonly apiUrl = `${environment.apiUrl}/purchase`;

  constructor(private http: HttpClient) {}

  addPurchase(purchaseRequest: AddPurchaseRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}`, purchaseRequest);
  }

  viewPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(this.apiUrl);
  }

  getProductsByPurchaseId(purchaseId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${purchaseId}/products`);
  }
}
