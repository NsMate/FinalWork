import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ProductGroup } from 'src/app/models/BusinessModels/ProductGroup/product-group';
import { Product } from 'src/app/models/BusinessModels/Product/product';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
  })
};


@Injectable({
  providedIn: 'root'
})
export class ProductGroupService {

  private groupUrl:string = "http://localhost:8080/product_groups";

  constructor(
    private http: HttpClient
  ) { }

  getProductGroups(): Promise<ProductGroup[]> {
    return this.http.get<ProductGroup[]>(`${this.groupUrl}`, httpOptions).toPromise();
  }

  getProductGroup(id: number): Promise<ProductGroup> {
    return this.http.get<ProductGroup>(`${this.groupUrl}/${id}`, httpOptions).toPromise();
  }
  
  createProductGroup(productGroup: ProductGroup): Promise<ProductGroup> {
    return this.http.post<ProductGroup>(`${this.groupUrl}`, productGroup, httpOptions).toPromise();
  }
  
  updateProductGroup(productGroup: ProductGroup): Promise<ProductGroup> {
    return this.http.put<ProductGroup>(`${this.groupUrl}/${productGroup.id}`, productGroup, httpOptions).toPromise();
  }
  
  deleteProductGroup(id): Promise<ProductGroup> {
    return this.http.delete<ProductGroup>(`${this.groupUrl}/${id}`, httpOptions).toPromise();
  }

  getProductGroupProducts(productGroup: ProductGroup): Promise<Product[]>{
    return this.http.get<Product[]>(`${this.groupUrl}/${productGroup.id}/products`, httpOptions).toPromise();
  }

  modifyOrAddProductToProductGroup(productGroup: ProductGroup, products: Product[]): Promise<Product[]>{
    return this.http.put<Product[]>(`${this.groupUrl}/${productGroup.id}/products`, products, httpOptions).toPromise();
  }

  insertProductIntoProductGroup(productGroup: ProductGroup, product: Product): Promise<Product>{
    return this.http.post<Product>(`${this.groupUrl}/${productGroup.id}/products`, product, httpOptions).toPromise();
  }
}
