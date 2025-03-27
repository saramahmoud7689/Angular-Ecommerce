import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  standalone: true,
  imports: [CommonModule, HttpClientModule], // ✅ Add RouterModule
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  product: any;
  quantity: number = 1; // Default quantity
  private baseUrl = 'http://localhost:3000/api/cart/add-to-cart'; // API URL

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    if (productId) {
      this.http.get<any>(`http://localhost:3000/api/product/${productId}`).subscribe(
        (data) => {
          this.product = data.proudct;
          console.log('success fetching product' , productId);
          console.log('success fetching product' , this.product);
        },
        (error) => {
          console.error('Error fetching product:', error);
        }
      );
    }
  }

  increaseQuantity() {
      this.quantity++;
    
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }


  addToCart() {
    const _id = this.product._id;
    const token = localStorage.getItem('userToken');

    // Check if quantity exceeds available stock
    if (this.quantity > this.product.quantity) {
      alert(`not enough stock available`);
      return;
    }

    if (token) {
      // User is logged in, send API request
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.post(this.baseUrl, { _id, quantity: this.quantity }, { headers }).subscribe({
        next: () => alert('Product added to cart successfully!'),
        error: (err) => {
          alert(err.error.message || 'Failed to add product to cart.');
        }
      });
    } else {
      // User is not logged in, store in local storage
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');

      // Check if product is already in cart
      const existingProduct = cart.find((p: any) => p._id === _id);
      if (existingProduct) {
        if (existingProduct.quantity + this.quantity > this.product.quantity) {
          alert(`Only ${this.product.quantity} items are available in stock.`);
          return;
        }
        existingProduct.quantity += this.quantity;
      } else {
        cart.push({ _id, quantity: this.quantity ,productId:{imageCover: this.product.imageCover, name: this.product.name, price: this.product.price, priceAfterDiscount: this.product.priceAfterDiscount} });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Product added to cart (saved locally). Log in to save it online.');
    }
}


}
