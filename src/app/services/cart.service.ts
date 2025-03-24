import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/cart';

  constructor(private http: HttpClient, private router: Router) {
    console.log(localStorage.getItem('userToken'));
    if (localStorage.getItem('userToken')) {
      this.saveUserData();
    }
  }

  userData: any = new BehaviorSubject(null);

  saveUserData() {
    let encodedToken = localStorage.getItem('userToken'); // No need to use JSON.stringify
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

  /** ✅ FIX: Attach the token to the request */
  getCart(): Observable<any> {
    const token = localStorage.getItem('userToken'); // Ensure token retrieval
    if (!token) {
      console.error("No token found in localStorage!");
      return new Observable(); // Return an empty observable to avoid errors
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
}
