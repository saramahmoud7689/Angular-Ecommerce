import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs'; // Import 'of'
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/cart';

  constructor(private http: HttpClient, private router: Router) {
    if (localStorage.getItem('userToken')) {
      this.saveUserData();
    }
  }

  userData: any = new BehaviorSubject(null);

  saveUserData() {
    let encodedToken = localStorage.getItem('userToken');
    if (!encodedToken) return;

    console.log("Encoded Token:", encodedToken);
    try {
      let decodedToken: any = jwtDecode(encodedToken);
      console.log("Decoded Token:", decodedToken);
      this.userData.next(decodedToken);
    } catch (error) {
      console.error("Invalid Token:", error);
    }
  }

  getCart(): Observable<any> {
    const token = localStorage.getItem('userToken');
    if (!token) {
      console.error("No token found in localStorage!");
      return of(null); // Return an empty observable
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/get-cart`, { headers });
  }

  removeFromCart(productId: string) {
    const token = localStorage.getItem('userToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${this.apiUrl}/remove-from-cart`, { productId }, { headers });
  }

  addToCart() {
    const token = localStorage.getItem('userToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/add-to-cart`, {}, { headers });
  }

  syncLocalCart(localCart: any[]): Observable<any> {
    const token = localStorage.getItem('userToken');
    if (!token) {
      return of(null); // Return an observable even if no token
    }

    if (localCart.length > 0) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post(`${this.apiUrl}/add-to-cart`, { products: localCart }, { headers });
    }
    return of(null); // Return an observable if no items to sync
  }

  clearLocalCart() {
    localStorage.removeItem('cart');
  }
}