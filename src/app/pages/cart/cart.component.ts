import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { NgIf , NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [NgFor,NgIf],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe(data => {
      this.cartItems = data.user_Cart;
      console.log(data.user_Cart);
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
    this.router.navigate(['/payment']);
  }
}
