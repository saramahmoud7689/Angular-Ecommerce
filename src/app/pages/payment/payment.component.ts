import { Component } from '@angular/core';
import { PaymentService } from '../../services/payment.service'; // Adjust path if needed
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule for ngModel

@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  imports: [FormsModule],
})
export class PaymentComponent {
  paymentMethod: string = 'credit_card'; 

  constructor(private paymentService: PaymentService) {}

  makePayment() {
    if (!this.paymentMethod) {
      console.error('Error: Payment method is undefined!');
      return;
    }

    this.paymentService.processPayment(this.paymentMethod).subscribe({
      next: (response) => {
        alert('✅ Payment successful: '+ response);
      },
      error: (error) => {
        alert('❌ Payment failed: '+ error);
      },
    });
  }
}
