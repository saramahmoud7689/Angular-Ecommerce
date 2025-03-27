import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
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
      this.emailError = '';
      this.passwordError = '';

      this.authService.signin(this.LoginForm.value).subscribe({
        next: (response) => {
          if (response.message === 'success') {
            localStorage.setItem("userToken", response.token);
            this.authService.savUserData();

            const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
            if (localCart.length > 0) {
              this.cartService.syncLocalCart(localCart).subscribe({
                next: () => {
                  this.cartService.clearLocalCart();
                  this.router.navigate(['/home']);
                },
                error: (err) => {
                  console.error('Cart sync error:', err);
                  this.router.navigate(['/home']);
                }
              });
            } else {
              this.router.navigate(['/home']);
            }
          }
        },
        error: (err) => {
          this.handleLoginError(err);
        }
      });
    }
  }

  private handleLoginError(err: any) {
    console.log('Login error:', err);
    const errorMessage = err.error?.message;

    switch(errorMessage) {
      case 'User not found':
        this.emailError = 'This email does not exist. Please register first.';
        break;
      case 'user not confirmed yet!':
        this.emailError = 'Your account is not confirmed. Please check your email.';
        break;
      case 'Invalid credentials':
        this.passwordError = 'Incorrect password. Please try again.';
        break;
      default:
        this.emailError = 'Login failed. Please try again.';
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