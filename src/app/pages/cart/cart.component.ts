import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe(data => {
      this.cartItems = data.user_Cart;
      this.calculateTotal();
    });
  }

  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId).subscribe(() => this.loadCart());
  }

  checkout() {
    this.cartService.checkout().subscribe(() => {
      alert('Order placed successfully!');
      this.loadCart();
    });
  }
}
