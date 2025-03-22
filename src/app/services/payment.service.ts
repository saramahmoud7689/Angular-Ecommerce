import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000/api/cart/payments';

  constructor(private http: HttpClient) {}

  processPayment(paymentMethod: string) {
    return this.http.post(this.apiUrl, { paymentMethod });
  }
}
