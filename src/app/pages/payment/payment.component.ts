import { Component, OnInit, ViewChild } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  imports: [FormsModule, NgIf],
})
export class PaymentComponent implements OnInit {
  @ViewChild('creditCardForm') creditCardForm!: NgForm;
  @ViewChild('paypalForm') paypalForm!: NgForm;

  paymentMethod: string = 'credit_card';
  promoCode: string = ''; // Optional promo code input

  // Data models for payment methods
  creditCardData = {
    cardNumber: '',
    expiry: '',
    cvv: '',
  };

  paypalData = {
    email: '',
  };

  constructor(private paymentService: PaymentService, private router: Router) {}

  ngOnInit(): void {}

  // Reset form data when payment method changes
  onPaymentMethodChange() {
    this.creditCardData = { cardNumber: '', expiry: '', cvv: '' };
    this.paypalData = { email: '' };
  }

  // Validate and process payment
  makePayment() {
    if (!this.paymentMethod) {
      alert('Please select a payment method.');
      return;
    }

    let paymentData: any;

    // Validate form based on payment method
    if (this.paymentMethod === 'credit_card') {
      if (!this.creditCardForm?.valid) {
        alert('Please fill in all credit card details correctly.');
        return;
      }
      paymentData = this.creditCardData;

      // Optional: Test with fake data
      // paymentData = { cardNumber: '4111111111111111', expiry: '12/25', cvv: '123' };
    } else if (this.paymentMethod === 'paypal') {
      if (!this.paypalForm?.valid) {
        alert('Please enter a valid PayPal email.');
        return;
      }
      paymentData = this.paypalData;

      // Optional: Test with fake data
      // paymentData = { email: 'test@example.com' };
    }

    // Call the payment service with payment method, data, and promo code (if provided)
    this.paymentService
      .processPayment(this.paymentMethod, this.promoCode || undefined)
      .subscribe({
        next: (response: any) => {
          alert('✅ Checkout successful: ' + JSON.stringify(response.order));
          // Optionally reset forms or redirect user
          this.onPaymentMethodChange();
          this.promoCode = '';
          this.router.navigate(['/home']);
        },
        error: (error) => {
          alert('❌ Checkout failed: ' + error.error.message);
          this.router.navigate(['/login']);
        },
      });
  }
}