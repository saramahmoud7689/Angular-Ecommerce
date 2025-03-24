import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private HttpClient: HttpClient, private Router: Router) {
    if (localStorage.getItem('userToken')) {
      this.savUserData();
    }
  }

  userData: any = new BehaviorSubject(null);

  savUserData() {
    let encodedToken = JSON.stringify(localStorage.getItem('userToken'));
    let decodedToken: any = jwtDecode(encodedToken);
    this.userData.next(decodedToken);
  }

  signup(formData: object): Observable<any> {
    return this.HttpClient.post('http://localhost:3000/api/users/register', formData);
  }

  signin(formData: object): Observable<any> {
    return this.HttpClient.post('http://localhost:3000/api/users/login', formData);
  }

  signOut() {
    localStorage.removeItem('userToken');
    this.userData.next(null);
    this.Router.navigate(['/login']);
  }
}
