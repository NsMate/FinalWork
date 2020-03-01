import { Injectable } from '@angular/core';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Warehouse } from 'src/app/models/Warehousing/Warehouse/warehouse';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  private warehouseURL:string = "http://localhost:8080/warehouses";

  constructor(
    private http: HttpClient
  ) { }

  getWarehouses(): Promise<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${this.warehouseURL}`, httpOptions).toPromise();
  }

  getWarehouse(id: number): Promise<Warehouse> {
    return this.http.get<Warehouse>(`${this.warehouseURL}/${id}`, httpOptions).toPromise();
  }
  
  createWarehouse(warehouse: Warehouse): Promise<Warehouse> {
    return this.http.post<Warehouse>(`${this.warehouseURL}`, warehouse, httpOptions).toPromise();
  }
  
  updateWarehouse(warehouse: Warehouse): Promise<Warehouse> {
    return this.http.put<Warehouse>(`${this.warehouseURL}/${warehouse.id}`, warehouse, httpOptions).toPromise();
  }
  
  deleteWarehouse(id): Promise<Warehouse> {
    return this.http.delete<Warehouse>(`${this.warehouseURL}/${id}`, httpOptions).toPromise();
  }
}
