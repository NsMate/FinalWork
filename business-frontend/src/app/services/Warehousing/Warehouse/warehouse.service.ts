import { Injectable } from '@angular/core';

import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Warehouse } from 'src/app/models/Warehousing/Warehouse/warehouse';
import { Stock } from 'src/app/models/Warehousing/Stock/stock';
import { Employee } from 'src/app/models/Employee/employee';
import { Vehicle } from 'src/app/models/Warehousing/Vehicle/vehicle';

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

  getWarehousesStocks(id: number): Promise<Stock[]> {
    return this.http.get<Stock[]>(`${this.warehouseURL}/${id}/stocks`, httpOptions).toPromise();
  }

  getWarehousesVehicles(id: number): Promise<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.warehouseURL}/${id}/vehicles`, httpOptions).toPromise();
  }

  insertStockIntoWarehouse(id: number,stock: Stock): Promise<Warehouse> {
    return this.http.post<Warehouse>(`${this.warehouseURL}/${id}/stocks`, stock, httpOptions).toPromise();
  }

  modifyStockInWarehouse(id: number,stocks: Stock[]): Promise<Warehouse> {
    return this.http.put<Warehouse>(`${this.warehouseURL}/${id}/stocks`, stocks, httpOptions).toPromise();
  }

  insertEmployeeIntoWarehouse(id: number,emp: Employee): Promise<Warehouse> {
    return this.http.post<Warehouse>(`${this.warehouseURL}/${id}/employees`, emp, httpOptions).toPromise();
  }

  insertVehicleIntoWarehouse(id: number,vehicle: Vehicle): Promise<Warehouse> {
    return this.http.post<Warehouse>(`${this.warehouseURL}/${id}/vehicles`, vehicle, httpOptions).toPromise();
  }
}
