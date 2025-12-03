import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { environment } from '../../enviorements/enviorements';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.API; // http://localhost:3002

  constructor(private http: HttpClient) { }

  // GET PRODUCTOS
  getProducts(): Observable<{ data: Product[] }> {
    return this.http.get<{ data: Product[] }>(`${this.baseUrl}/bp/products`);
  }

  addProduct(body: any) {
    return this.http.post(`${environment.API}/bp/products`, body);
  }

  getProductById(id: string) {
    return this.http.get(`${environment.API}/bp/products/${id}`);
  }

  updateProduct(id: string, body: any) {
    return this.http.put(`${environment.API}/bp/products/${id}`, body);
  }

  deleteProduct(id: string) {
    return this.http.delete(`${environment.API}/bp/products/${id}`);
  }


}

