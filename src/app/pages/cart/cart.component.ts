import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
// import { PromoService } from '../../services/promo.service';
import { NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [NgFor, NgIf],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  subtotal: number = 0;
  totalPrice: number = 0;
  promoCode: string = '';
  discountAmount: number = 0;
  discountApplied: boolean = false;

  //private promoService: PromoService,
  constructor(private cartService: CartService, private router: Router) {}

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
    this.subtotal = this.cartItems.reduce((sum, item) => {
      const price = item.productId.priceAfterDiscount ?? item.productId.price;
      return sum + price * item.quantity;
    }, 0);
    this.totalPrice = this.subtotal - this.discountAmount;
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId).subscribe(() => this.loadCart());
  }

  applyPromoCode() {
    if (!this.promoCode.trim()) return;

    // this.promoService.validatePromoCode(this.promoCode).subscribe(
    //   (promo) => {
    //     if (promo.isActive) {
    //       this.discountAmount = (this.subtotal * promo.discount) / 100;
    //       this.discountApplied = true;
    //       this.calculateTotal();
    //     }
    //   },
    //   (error) => {
    //     alert('Invalid or expired promo code');
    //   }
    // );
  }

  checkout() {
    this.router.navigate(['/payment']);
  }
}