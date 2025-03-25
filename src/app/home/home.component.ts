import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // ✅ Import FormsModule for ngModel

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule], // ✅ Include FormsModule
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchQuery: string = '';

  constructor(private http: HttpClient, private router: Router, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts() {
    this.http.get<any>('http://localhost:3000/api/product')
      .subscribe({
        next: (data) => {
          this.products = data?.allproudct || [];
          this.filteredProducts = this.products;  // ✅ Initialize filteredProducts with all products
          this.cdRef.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching products:', error);
        }
      });
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  viewProduct(productId: string) {
    console.log('Product clicked:', productId);
    this.router.navigate(['/product', productId]); 
  }
}
