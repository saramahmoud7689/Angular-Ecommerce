import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule , CommonModule],  // ✅ Include HttpClientModule for standalone components
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: any[] = [];

  constructor(private http: HttpClient, private router: Router ,  private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchProducts();
  }


  fetchProducts() {
    this.http.get<any>('http://localhost:3000/api/product')
      .subscribe({
        next: (data) => {
          this.products = data?.allproudct || [];
          this.cdRef.detectChanges();  // 🔄 Force UI update
        },
        error: (error) => {
          console.error('Error fetching products:', error);
        }
      });
  }

  
  viewProduct(productId: string) {
    console.log('Product clicked:', productId);
    this.router.navigate(['/product', productId]);  // ✅ Navigates to product details page
  }
  
}
