import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/cart';

  constructor(private http: HttpClient) {}

  getCart() {
    return this.http.get<any>(`${this.apiUrl}/get-cart`);
  }

  removeFromCart(productId: string) {
    return this.http.patch(`${this.apiUrl}/remove-from-cart`, { productId });
  }

  checkout() {
    return this.http.post(`${this.apiUrl}/checkout`, {});
  }
}
