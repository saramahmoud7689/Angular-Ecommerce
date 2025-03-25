// login.component.ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service'; // Add this import
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
    private cartService: CartService, // Add this
    private router: Router
  ) {}

  submitLoginForm() {
    if (this.LoginForm.valid) {
      this.emailError = '';
      this.passwordError = '';

      this.authService.signin(this.LoginForm.value).subscribe({
        next: (response) => {
          if (response.message === 'success') {
            localStorage.setItem("userToken", response.token);
            this.authService.savUserData();
            
            // Sync local cart with backend after successful login
            this.cartService.syncLocalCart()?.subscribe({
              next: () => {
                this.cartService.clearLocalCart(); // Clear local cart after successful sync
                this.router.navigate(['/home']);
              },
              error: (err) => {
                console.error('Error syncing cart:', err);
                this.router.navigate(['/home']); // Navigate even if sync fails
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