import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000/api/cart/checkout';

  constructor(private http: HttpClient) {}

  processPayment(paymentMethod: string, promoCode?: string) {
    const token = localStorage.getItem('userToken');

    if (!token) {
      console.error("No token found in localStorage!");
      return throwError(() => new Error('No authentication token found'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const payload = { paymentMethod, promoCode }; // Include promoCode if provided

    return this.http.post(this.apiUrl, payload, { headers });
  }
}