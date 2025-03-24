import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  imports:[NgIf,RouterLink,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  errorMessage: string = '';

  firstNameError = '';
  lastNameError = '';
  emailError = '';
  phoneError = '';
  passwordError = '';
  ageError = '';

  registerForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^\\+?[0-9]{10,15}$')]),
    password: new FormControl('', [Validators.required, Validators.pattern('^[A-Z][a-z]{6,9}$')]),
    age: new FormControl('', [Validators.required, Validators.min(15), Validators.max(60)])
  });

  constructor(private authService: AuthService, private router: Router) {}

  submitRegisterForm() {
    if (this.registerForm.valid) {
      this.authService.signup(this.registerForm.value).subscribe({
        next: (response) => {
          if (response.message === 'success') {
            this.router.navigate(['/login']);
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Something went wrong!';
        }
      });
    }
  }

  validateField(field: string) {
    const control = this.registerForm.get(field);
    if (control?.invalid && control?.touched) {
      if (field === 'firstName') this.firstNameError = control.hasError('required') ? 'First name is required' : 'Must be 3-15 characters';
      if (field === 'lastName') this.lastNameError = control.hasError('required') ? 'Last name is required' : 'Must be 3-15 characters';
      if (field === 'email') this.emailError = control.hasError('required') ? 'Email is required' : 'Enter a valid email';
      if (field === 'phone') this.phoneError = control.hasError('required') ? 'Phone number is required' : 'Enter a valid phone number';
      if (field === 'password') this.passwordError = control.hasError('required') ? 'Password is required' : 'Must start with uppercase & be 4-9 characters';
      if (field === 'age') this.ageError = control.hasError('required') ? 'Age is required' : 'Must be between 15-60';
    }
  }

  clearError(field: string) {
    if (field === 'firstName') this.firstNameError = '';
    if (field === 'lastName') this.lastNameError = '';
    if (field === 'email') this.emailError = '';
    if (field === 'phone') this.phoneError = '';
    if (field === 'password') this.passwordError = '';
    if (field === 'age') this.ageError = '';
  }
}
