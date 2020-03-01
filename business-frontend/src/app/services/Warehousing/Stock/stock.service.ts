import { Injectable } from '@angular/core';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Stock } from 'src/app/models/Warehousing/Stock/stock';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private stockURL: string = "http://localhost:8080/stocks";

  constructor(
    private http: HttpClient
  ) { }

  getStocks(): Promise<Stock[]>{
    return this.http.get<Stock[]>(`${this.stockURL}`,httpOptions).toPromise();
  }

  getStock(id: number): Promise<Stock>{
    return this.http.get<Stock>(`${this.stockURL}`,httpOptions).toPromise();
  }

  createStock(stock: Stock): Promise<Stock> {
    return this.http.post<Stock>(`${this.stockURL}`, stock, httpOptions).toPromise();
  }
  
  updateStock(stock: Stock): Promise<Stock> {
    return this.http.put<Stock>(`${this.stockURL}/${stock.id}`, stock, httpOptions).toPromise();
  }
  
  deleteStock(id): Promise<Stock> {
    return this.http.delete<Stock>(`${this.stockURL}/${id}`, httpOptions).toPromise();
  }
}
