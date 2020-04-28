import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Product } from 'src/app/models/BusinessModels/Product/product';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProudctService {

  private productUrl:string = "http://localhost:8081/products";

  constructor(
    private http: HttpClient
  ) { }

  getProductsWhichNameMatchInput(input: string): Promise<Product[]> {
    return this.http.get<Product[]>(`${this.productUrl}/${input}`, httpOptions).toPromise();
  }

  getProducts(): Promise<Product[]>{
    return this.http.get<Product[]>(`${this.productUrl}`, httpOptions).toPromise();
  }

  getProduct(id: number): Promise<Product>{
    return this.http.get<Product>(`${this.productUrl}/${id}`, httpOptions).toPromise();
  }

  getProductByName(name: string): Promise<Product>{
    return this.http.get<Product>(`${this.productUrl}/byname/${name}`, httpOptions).toPromise();
  }

  updateProduct(product: Product): Promise<Product>{
    return this.http.put<Product>(`${this.productUrl}/${product.id}`, product,  httpOptions).toPromise();
  }

  createProduct(product: Product): Promise<Product>{
    return this.http.post<Product>(`${this.productUrl}`, product,  httpOptions).toPromise();
  }

  deleteProduct(id: number): Promise<Product>{
    return this.http.delete<Product>(`${this.productUrl}/${id}`, httpOptions).toPromise();
  }

  getProductByCode(code: number): Promise<Product>{
    return this.http.get<Product>(`${this.productUrl}/byCode/${code}`, httpOptions).toPromise();
  }

  getProductsByInput(input: string): Promise<Product[]>{
    return this.http.get<Product[]>(`${this.productUrl}/input/${input}`, httpOptions).toPromise();
  }
}
