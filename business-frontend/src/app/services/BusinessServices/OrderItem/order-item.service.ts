import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { OrderItem } from 'src/app/models/BusinessModels/OrderItem/order-item';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class OrderItemService {

  private orderItemUrl:string = "http://localhost:8081/order_items";

  constructor(
    private http: HttpClient
  ) { }

  getOrderItems(): Promise<OrderItem[]> {
    return this.http.get<OrderItem[]>(`${this.orderItemUrl}`, httpOptions).toPromise();
  }

  getOrderItem(id: number): Promise<OrderItem> {
    return this.http.get<OrderItem>(`${this.orderItemUrl}/${id}`, httpOptions).toPromise();
  }
  
  createOrderItem(orderItem: OrderItem): Promise<OrderItem> {
    return this.http.post<OrderItem>(`${this.orderItemUrl}`, orderItem, httpOptions).toPromise();
  }
  
  updateOrderItem(orderItem: OrderItem): Promise<OrderItem> {
    return this.http.put<OrderItem>(`${this.orderItemUrl}/${orderItem.id}`, orderItem, httpOptions).toPromise();
  }
  
  deleteOrderItem(id): Promise<OrderItem> {
    return this.http.delete<OrderItem>(`${this.orderItemUrl}/${id}`, httpOptions).toPromise();
  }
}
