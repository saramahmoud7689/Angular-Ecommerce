import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs'; // Import throwError from RxJS

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000/api/cart/checkout';

  constructor(private http: HttpClient) {}

  processPayment(paymentMethod: string) {
    const token = localStorage.getItem('userToken');

    if (!token) {
      console.error("No token found in localStorage!");
      return throwError(() => new Error('No authentication token found')); // Return an Observable error
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(this.apiUrl, { paymentMethod }, { headers });
  }
}