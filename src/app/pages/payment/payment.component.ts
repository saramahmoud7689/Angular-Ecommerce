import { Component, OnInit, ViewChild } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';


// import { Component, OnInit, ViewChild } from '@angular/core';
// ``````typescript
// export class PaymentComponent implements OnInit {
//   @ViewChild('creditCardForm') creditCardForm: any;
//   @ViewChild('paypalForm') paypalForm: any;


@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  imports: [FormsModule, NgIf], // Added NgIf for conditional rendering
})
export class PaymentComponent implements OnInit {
  ngOnInit(): void {
    // Initialization logic here
  }
  @ViewChild('creditCardForm') creditCardForm: any;
  @ViewChild('paypalForm') paypalForm: any;
  paymentMethod: string = 'credit_card';

  // Data models for payment methods
  creditCardData = {
    cardNumber: '',
    expiry: '',
    cvv: '',
  };

  paypalData = {
    email: '',
  };

  constructor(private paymentService: PaymentService) {}

  // Reset form data when payment method changes
  onPaymentMethodChange() {
    this.creditCardData = { cardNumber: '', expiry: '', cvv: '' };
    this.paypalData = { email: '' };
  }

  makePayment() {
    if (!this.paymentMethod) {
      console.error('Error: Payment method is undefined!');
      alert('Please select a payment method.');
      return;
    }

    let paymentData: any;
    if (this.paymentMethod === 'credit_card') {
      paymentData = { paymentMethod: this.paymentMethod, ...this.creditCardData };
    } else if (this.paymentMethod === 'paypal') {
      paymentData = { paymentMethod: this.paymentMethod, ...this.paypalData };
    }

    this.paymentService.processPayment(paymentData).subscribe({
      next: (response) => {
        alert('✅ Payment successful: ' + JSON.stringify(response));
      },
      error: (error) => {
        alert('❌ Payment failed: ' + error.message);
      },
    });
  }

  // Simulate guard logic (conceptual - full guard needs routing)
  canMakePayment(): boolean {
    const isAuthenticated = !!localStorage.getItem('userToken');
    if (!isAuthenticated) {
      alert('You must be logged in to make a payment.');
    }
    return isAuthenticated;
  }
}