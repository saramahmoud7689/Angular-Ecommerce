import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
}
