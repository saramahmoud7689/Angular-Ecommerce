import { Component } from '@angular/core';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  paymentMethod = 'credit_card';

  constructor(private paymentService: PaymentService) {}

  makePayment() {
    this.paymentService.processPayment(this.paymentMethod).subscribe(response => {
      alert('Payment successful!');
    });
  }
}
