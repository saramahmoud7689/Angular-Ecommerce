import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, from } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { concatMap, last, map, catchError } from 'rxjs/operators';

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

    try {
      let decodedToken: any = jwtDecode(encodedToken);
      this.userData.next(decodedToken);
    } catch (error) {
      console.error("Invalid Token:", error);
    }
  }

  addToCart(product: any): Observable<any> {
    const token = localStorage.getItem('userToken');
    if (!token) {
      let localCart = JSON.parse(`localStorage.getItem('cart')  '[]'`);
      const existingItem = localCart.find((item: any) => item.productId === product._id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        localCart.push({
          productId: product._id,
          quantity: 1,
          productDetails: product
        });
      }

      localStorage.setItem('cart', JSON.stringify(localCart));
      return of(localCart);
    } else {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post(`${this.apiUrl}/add-to-cart`, {
        productId: product._id,
        quantity: 1
      }, { headers });
    }
  }

  getCart(): Observable<any> {
    const token = localStorage.getItem('userToken');
    if (!token) {
      const localCart = JSON.parse(`localStorage.getItem('cart')  '[]'`);
      return of(localCart);
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/get-cart`, { headers });
  }

  removeFromCart(productId: string): Observable<any> {
    const token = localStorage.getItem('userToken');
    if (!token) {
      let localCart = JSON.parse(`localStorage.getItem('cart')  '[]'`);
      localCart = localCart.filter((item: any) => item.productId !== productId);
      localStorage.setItem('cart', JSON.stringify(localCart));
      return of(localCart);
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${this.apiUrl}/remove-from-cart`, { productId }, { headers });
  }

  syncLocalCart(localCart: any[]): Observable<any> {
    const token = localStorage.getItem('userToken');
    if (!token) {
      return of(null);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Process items sequentially
    return from(localCart).pipe(
      concatMap((item: any) =>
        this.http.post(`${this.apiUrl}/add-to-cart`, {
          productId: item._id,
          quantity: item.quantity || 1
        }, { headers }).pipe(
          catchError((err: any) => {
            console.error('Error syncing item:', item, err);
            return of(null);
          })
        )
      ),
      last(),
      map(() => {
        this.clearLocalCart();
        return true;
      }),
      catchError((err: any) => {
        console.error('Final sync error:', err);
        return of(false);
      })
    );
  }

  clearLocalCart() {
    localStorage.removeItem('cart');
  }
}