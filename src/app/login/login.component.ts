import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  emailError: string = '';
  passwordError: string = '';

  LoginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  submitLoginForm() {
    if (this.LoginForm.valid) {
      // ... authentication logic ...
      
      this.authService.signin(this.LoginForm.value).subscribe({
        next: (response) => {
              if (response.message === 'success') {
                  localStorage.setItem("userToken", response.token);
                  this.authService.savUserData();

                  // Get cart from local storage
                  const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
                  
                  // Sync with server
                  this.cartService.syncLocalCart(localCart).subscribe({
                      next: (result) => {
                          if (result) { // Check if sync actually happened
                              this.cartService.clearLocalCart();
                          }
                          this.router.navigate(['/home']);
                      },
                      error: (err: any) => {
                          console.error('Error syncing cart:', err);
                          this.router.navigate(['/home']);
                      }
                  });
              }
          },
        error: (err) => {
          console.log('API Error:', err);
          if (err.error.message === 'User not found') {
            this.emailError = 'This email does not exist. Please register first.';
          } else if (err.error.message === 'user not confirmed yet!') {
            this.emailError = 'Your account is not confirmed. Please check your email.';
          } else if (err.error.message === 'Invalid credentials') {
            this.passwordError = 'Incorrect password. Please try again.';
          } else {
            this.emailError = 'Something went wrong. Please try again.';
          }
        }
      });
    }
  }

  validateField(field: string) {
    const control = this.LoginForm.get(field);
    if (control?.invalid && control?.touched) {
      if (field === 'email') {
        this.emailError = control.hasError('required') ? 'Email is required' : 'Enter a valid email';
      }
      if (field === 'password') {
        this.passwordError = 'Password is required';
      }
    }
  }

  clearError(field: string) {
    if (field === 'email') this.emailError = '';
    if (field === 'password') this.passwordError = '';
  }
}